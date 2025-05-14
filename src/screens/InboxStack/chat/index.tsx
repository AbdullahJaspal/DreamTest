import React, {useState, useCallback, useMemo, useRef} from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  BackHandler,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-clipboard/clipboard';

// Utils and types
import {ExtendedMessage, formatMessageTime} from '../../../utils/chatUtils';
import type {ChatScreenRouteProps} from '../../../types/screenNavigationAndRoute';

// Socket providers and hooks
import {useSocket} from '../../../socket/SocketProvider';
import {useChatSocket} from '../../../socket/hooks/useChatSocket';
import {generateRoomId} from '../../../socket/utils/socketUtils';

// Custom hooks
import {useMessageHandlers} from './hooks/useMessageHandlers';
import {useMediaHandlers} from './hooks/useMediaHandlers';

// Components
import ChatHeader from './components/ChatHeader';
import InputToolbar from './components/InputToolbar';
import MessageBubble from './components/MessageBubble';
import MediaViewer from './components/MediaViewer';
import BubbleMediaViewer from './components/BubbleMedia';
import MessageContextMenu from './components/MessageContextMenu';

// Redux
import {
  selectChatThemeColor,
  selectMyProfileData,
  makeSelectMessagesForRoom,
  makeSelectLoadingEarlierForRoom,
  makeSelectHasMoreMessagesForRoom,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

// Assets
import {images} from '../../../assets/images';

// Styles
import styles from './styles';

// Interface for media viewer props
interface MediaViewerProps {
  visible: boolean;
  uri: string;
  type: string;
}

// Interface for bubble media viewer props
interface BubbleMediaViewerProps extends MediaViewerProps {
  sender: string;
  timestamp: string;
  messageId: string | null;
}

// Interface for options modal props
interface OptionsModalProps {
  visible: boolean;
  options: any[];
  message: ExtendedMessage | null;
}

const ChatScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<ChatScreenRouteProps>();

  const myData = useAppSelector(selectMyProfileData);
  const userData = route?.params?.user_data;

  // Generate a consistent room ID for this chat
  const roomId = useMemo(
    () => generateRoomId(myData?.id, userData?.id),
    [userData?.id, myData?.id],
  );

  // State management
  const [text, setText] = useState('');
  const [mediaViewerProps, setMediaViewerProps] = useState<MediaViewerProps>({
    visible: false,
    uri: '',
    type: 'image',
  });
  const [bubbleMediaViewerProps, setBubbleMediaViewerProps] =
    useState<BubbleMediaViewerProps>({
      visible: false,
      uri: '',
      type: 'image',
      sender: '',
      timestamp: '',
      messageId: null,
    });
  const [optionsModalProps, setOptionsModalProps] = useState<OptionsModalProps>(
    {
      visible: false,
      options: [],
      message: null,
    },
  );
  const [replyToMessage, setReplyToMessage] = useState<ExtendedMessage | null>(
    null,
  );
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ExtendedMessage | {}>(
    {},
  );

  // Redux selectors for this chat room
  const selectMessagesForRoom = useMemo(() => makeSelectMessagesForRoom(), []);
  const selectLoadingEarlierForRoom = useMemo(
    () => makeSelectLoadingEarlierForRoom(),
    [],
  );
  const selectHasMoreMessagesForRoom = useMemo(
    () => makeSelectHasMoreMessagesForRoom(),
    [],
  );

  // Get chat data from Redux
  const messages = useAppSelector(state =>
    selectMessagesForRoom(state, roomId),
  );
  const loadingEarlier = useAppSelector(state =>
    selectLoadingEarlierForRoom(state, roomId),
  );
  const hasMoreMessages = useAppSelector(state =>
    selectHasMoreMessagesForRoom(state, roomId),
  );

  const chatThemeColor = useAppSelector(selectChatThemeColor);
  const isActiveRef = useRef<boolean>(true);

  const {isConnected, reconnect} = useSocket();

  const {isTyping, sendTypingStatus} = useChatSocket({
    userId: myData?.id,
    recipientId: userData?.id,
  });

  const {
    handleLoadEarlier,
    handleSendTextMessage,
    handleRetryMessage,
    handleDeleteMessage,
    handleMessageReply,
    handleMessageForward,
  } = useMessageHandlers(roomId, myData, userData);

  // Media handling hooks
  const {
    isUploading,
    handleSendImage,
    handleSendVideo,
    handleSendAudio,
    handleSendDocument,
    handleSendContact,
    handleLocationSelect,
  } = useMediaHandlers(roomId, myData, userData);

  // Handle back button press
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Close any open modals/viewers when back button is pressed
        if (
          mediaViewerProps.visible ||
          bubbleMediaViewerProps.visible ||
          optionsModalProps.visible ||
          showContextMenu
        ) {
          closeAllModals();
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [
      mediaViewerProps.visible,
      bubbleMediaViewerProps.visible,
      optionsModalProps.visible,
      showContextMenu,
    ]),
  );

  const closeAllModals = useCallback(() => {
    setMediaViewerProps(prev => ({...prev, visible: false}));
    setBubbleMediaViewerProps(prev => ({...prev, visible: false}));
    setOptionsModalProps(prev => ({...prev, visible: false}));
    setShowContextMenu(false);
  }, []);

  const handleReply = useCallback((message: ExtendedMessage) => {
    setReplyToMessage(message);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyToMessage(null);
  }, []);

  const handleInputTextChanged = useCallback(
    (text: string) => {
      setText(text);
      if (text.length > 0) {
        sendTypingStatus();
      }
    },
    [sendTypingStatus],
  );

  const handleLongPress = useCallback((message: ExtendedMessage) => {
    setCurrentMessage(message);
    setShowContextMenu(true);
  }, []);

  const handleOpenMedia = useCallback(
    (
      uri: string,
      type: string,
      message: {
        user: {_id: string; name: string};
        createdAt: string | Date;
        _id: string;
      },
    ) => {
      const isFromMe = message?.user?._id === myData?.id;
      const senderName = isFromMe
        ? t('You')
        : message?.user?.name || userData?.nickname || t('User');

      const timestamp = formatMessageTime(message?.createdAt);

      setBubbleMediaViewerProps({
        visible: true,
        uri: uri,
        type: type,
        sender: senderName,
        timestamp: timestamp,
        messageId: message?._id,
      });
    },
    [myData?.id, userData?.nickname, t],
  );

  const handleForwardMedia = useCallback(
    (uri: string) => {
      setBubbleMediaViewerProps(prev => ({...prev, visible: false}));

      const messageToForward = messages.find(
        msg =>
          (msg.image === uri || msg.video === uri) &&
          msg._id === bubbleMediaViewerProps.messageId,
      );

      if (messageToForward) {
        handleMessageForward(messageToForward);
      } else {
        Toast.show(t('Cannot forward this media'), Toast.SHORT);
      }
    },
    [messages, bubbleMediaViewerProps.messageId, handleMessageForward, t],
  );

  const handleDeleteMedia = useCallback(() => {
    setBubbleMediaViewerProps(prev => ({...prev, visible: false}));

    if (bubbleMediaViewerProps.messageId) {
      handleDeleteMessage(bubbleMediaViewerProps.messageId);
    }
  }, [bubbleMediaViewerProps.messageId, handleDeleteMessage]);

  const handleSendFromViewer = useCallback(
    (mediaData: {
      caption: string;
      uri: string;
      type: string;
      duration: string;
    }) => {
      if (mediaData.type === 'image') {
        handleSendImage({uri: mediaData.uri, caption: mediaData.caption});
      } else if (mediaData.type === 'video') {
        handleSendVideo({
          uri: mediaData.uri,
          duration: mediaData.duration,
          caption: mediaData.caption,
        });
      }

      setMediaViewerProps(prev => ({...prev, visible: false}));
    },
    [handleSendImage, handleSendVideo],
  );

  // Custom GiftedChat renderers
  const renderBubble = useCallback(
    props => (
      <MessageBubble
        {...props}
        onLongPress={handleLongPress}
        onOpenMedia={handleOpenMedia}
        themeColor={chatThemeColor}
      />
    ),
    [handleLongPress, handleOpenMedia, chatThemeColor],
  );

  const renderLoading = useCallback(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#54AD7A" />
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (isTyping) {
      return (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {userData?.nickname} {t('is typing')}...
          </Text>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, styles.typingDot1]} />
            <View style={[styles.typingDot, styles.typingDot2]} />
            <View style={[styles.typingDot, styles.typingDot3]} />
          </View>
        </View>
      );
    }

    if (!isConnected) {
      return (
        <View style={styles.offlineContainer}>
          <MaterialIcons name="cloud-off" size={16} color="#FF5252" />
          <Text style={styles.offlineText}>
            {t('Not connected to the server')}
          </Text>
        </View>
      );
    }

    return null;
  }, [isTyping, isConnected, userData?.nickname, t]);

  const renderInputToolbar = useCallback(
    props => (
      <InputToolbar
        {...props}
        setText={setText}
        userData={userData}
        isConnected={isConnected}
        onDocumentSelect={handleSendDocument}
        onAudioSelect={handleSendAudio}
        onImageSelect={media => handleSendImage(media, replyToMessage)}
        onVideoSelect={media => handleSendVideo(media, replyToMessage)}
        onLocationSelect={handleLocationSelect}
        onContactSelect={handleSendContact}
        navigation={navigation}
        replyToMessage={replyToMessage}
        onCancelReply={handleCancelReply}
        themeColor={chatThemeColor}
      />
    ),
    [
      setText,
      userData,
      isConnected,
      handleSendDocument,
      handleSendAudio,
      handleSendImage,
      handleSendVideo,
      handleLocationSelect,
      handleSendContact,
      navigation,
      replyToMessage,
      handleCancelReply,
      chatThemeColor,
    ],
  );

  const handleCopyText = useCallback(
    (message: ExtendedMessage) => {
      Clipboard.setString(message.text);
      Toast.show(t('Message copied to clipboard'), Toast.SHORT);
      setShowContextMenu(false);
    },
    [t],
  );

  return (
    <>
      <StatusBar hidden />
      <ChatHeader
        userData={userData}
        isOnline={isConnected}
        typing={isTyping}
        themeColor={chatThemeColor}
        onContactShare={() =>
          navigation.navigate('ContactList', {
            onContactSelect: handleSendContact,
          })
        }
      />
      <ImageBackground
        source={images.chatBackground}
        style={{flex: 1}}
        resizeMode="cover">
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
          <GiftedChat
            messages={messages}
            onSend={handleSendTextMessage}
            text={text}
            onInputTextChanged={handleInputTextChanged}
            placeholder={t('Type a message...')}
            user={{
              _id: myData?.id,
              name: myData?.nickname,
              avatar: myData?.profile_pic,
            }}
            renderInputToolbar={renderInputToolbar}
            renderBubble={renderBubble}
            renderLoading={renderLoading}
            showAvatarForEveryMessage={false}
            messagesContainerStyle={{
              paddingHorizontal: 5,
            }}
            renderFooter={renderFooter}
            loadEarlier={hasMoreMessages}
            onLoadEarlier={handleLoadEarlier}
            isLoadingEarlier={loadingEarlier}
            alwaysShowSend
            scrollToBottom
            showUserAvatar={false}
            isTyping={isTyping}
            renderAvatar={null}
          />

          <MediaViewer
            visible={mediaViewerProps.visible}
            media={{uri: mediaViewerProps.uri}}
            type={mediaViewerProps.type}
            onClose={() =>
              setMediaViewerProps(prev => ({...prev, visible: false}))
            }
            onSendMessage={handleSendFromViewer}
          />

          <BubbleMediaViewer
            visible={bubbleMediaViewerProps.visible}
            uri={bubbleMediaViewerProps.uri}
            type={bubbleMediaViewerProps.type}
            sender={bubbleMediaViewerProps.sender}
            timestamp={bubbleMediaViewerProps.timestamp}
            onClose={() =>
              setBubbleMediaViewerProps(prev => ({...prev, visible: false}))
            }
            onForward={handleForwardMedia}
            onDelete={handleDeleteMedia}
          />

          <MessageContextMenu
            isVisible={showContextMenu}
            onClose={() => setShowContextMenu(false)}
            message={currentMessage as ExtendedMessage}
            onRetry={handleRetryMessage}
            onReply={handleReply}
            onForward={handleMessageForward}
            onCopy={handleCopyText}
            onInfo={() => {}}
            onStar={() => {}}
            onPin={() => {}}
            onDelete={messageId => {
              handleDeleteMessage(messageId);
              setShowContextMenu(false);
            }}
          />
        </View>
      </ImageBackground>

      {!isConnected && (
        <TouchableOpacity
          style={[styles.reconnectButton, {backgroundColor: chatThemeColor}]}
          onPress={reconnect}
          activeOpacity={0.7}>
          <MaterialIcons name="refresh" size={16} color="#FFFFFF" />
          <Text style={styles.reconnectText}>{t('Reconnect')}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ChatScreen;
