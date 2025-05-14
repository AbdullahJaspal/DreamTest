import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Keyboard,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
import Rose from './Rose';
import ReplyBar from './ReplyBar';
import FontPicker from './FontPicker';
import ColorPicker from './ColorPicker';
import MediaViewer from './MediaViewer';
import {useTranslation} from 'react-i18next';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-simple-toast';
import {icons} from '../../../../assets/icons';
import styles from '../styles/inputToolbarStyles';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  generateUniqueId,
  requestMicrophonePermission,
  pickMediaFromGallery,
  takeMediaWithCamera,
  pickDocument,
  requestContactPermission,
} from '../../../../utils/chatUtils';
import Text from '../../../../components/Text';

interface RenderInputToolbarProps {
  text: string;
  setText: (text: string) => void;
  onSend: (messages: any[]) => void;
  setInputControl?: any;
  userData: any;
  onVideoSelect: (uri: string, replyToMessage?: any) => void;
  onImageSelect?: (uri: string, replyToMessage?: any) => void;
  isConnected: boolean;
  isRecording?: boolean;
  setIsRecording?: (isRecording: boolean) => void;
  recordingTime?: number;
  onAttachmentToggle?: () => void;
  onRoseToggle?: () => void;
  replyToMessage?: any;
  onCancelReply?: () => void;
  themeColor: string;
  setThemeColor?: (color: string) => void;
  navigation?: any;
  onDocumentSelect?: (uri: string, name: string, type: string) => void;
  onAudioSelect?: () => void;
}

const RenderInputToolbar: React.FC<RenderInputToolbarProps> = ({
  text,
  setText,
  onSend,
  setInputControl,
  userData,
  onVideoSelect,
  onImageSelect,
  isConnected,
  isRecording = false,
  setIsRecording,
  replyToMessage,
  onCancelReply,
  navigation,
  themeColor,
  setThemeColor,
  onDocumentSelect,
  onAudioSelect,
}) => {
  const {t} = useTranslation();

  const myData = useAppSelector(selectMyProfileData);

  // References and state
  const inputRef = useRef<TextInput>(null);
  const replyBarAnimation = useRef(new Animated.Value(0)).current;
  const recordingAnimation = useRef(new Animated.Value(0)).current;
  const [mediaUri, setMediaUri] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [showRose, setShowRose] = useState(false);
  const [mediaType, setMediaType] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState({
    id: 'default',
    name: 'Default',
    fontFamily: undefined,
  });

  // Calculate the appropriate input height based on content
  const updateInputHeight = height => {
    // Set a minimum height of 40 and max height equivalent to 4 lines (approx 120)
    const newHeight = Math.min(Math.max(40, height), 120);
    setInputHeight(newHeight);
  };

  // Handle content size change for TextInput
  const handleContentSizeChange = event => {
    const {height} = event.nativeEvent.contentSize;
    updateInputHeight(height);
  };

  // Animation for recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(recordingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      ).start();
    } else {
      recordingAnimation.setValue(0);
    }

    // Clean up animation on unmount
    return () => {
      recordingAnimation.stopAnimation();
    };
  }, [isRecording, recordingAnimation]);

  // Animation for reply bar
  useEffect(() => {
    if (replyToMessage) {
      Animated.timing(replyBarAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();

      // Focus the text input when replying
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      Animated.timing(replyBarAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
    }
  }, [replyToMessage, replyBarAnimation]);

  // Check mute status on mount
  useEffect(() => {
    checkMuteStatus();
  }, []);

  // Check if user is muted
  const checkMuteStatus = useCallback(async () => {
    try {
      // This would be replaced with an actual API call
      // Simplified for now
      // const result = await userApi.IsUserCommentMute(myData?.auth_token, 'privatechat');
      // setIsMuted(result && result.is_active);
      setIsMuted(false);
    } catch (error) {
      console.error('Error checking mute status:', error);
      setIsMuted(false);
    }
  }, [myData?.auth_token]);

  // Show muted toast message
  const showMutedToast = useCallback(() => {
    Toast.show(t('You are muted and cannot perform this action'), Toast.LONG);
  }, [t]);

  const handleMediaSelection = useCallback(async () => {
    if (isMuted) {
      showMutedToast();
      return;
    }

    try {
      Keyboard.dismiss();

      const result = await pickMediaFromGallery();

      if (!result.cancelled && !result.error && result.assets?.length > 0) {
        const asset = result.assets[0];

        if (asset.type?.startsWith('video/')) {
          const durationInSeconds = asset.duration ? asset.duration / 1000 : 0;

          if (durationInSeconds > 60) {
            Toast.show(t('Video must be 1 minute or less'), Toast.LONG);
            return;
          }

          onVideoSelect(asset.uri, replyToMessage);

          if (onCancelReply && replyToMessage) {
            onCancelReply();
          }
        } else if (asset.type?.startsWith('image/')) {
          if (onImageSelect && typeof onImageSelect === 'function') {
            onImageSelect(asset.uri, replyToMessage);

            if (onCancelReply && replyToMessage) {
              onCancelReply();
            }
          }
        }

        if (setInputControl) {
          setInputControl(prev => ({
            ...prev,
            attachment: false,
            rose: false,
          }));
        }
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      Toast.show(t('Failed to select media'), Toast.SHORT);
    }
  }, [
    isMuted,
    showMutedToast,
    onVideoSelect,
    onImageSelect,
    setInputControl,
    t,
    replyToMessage,
    onCancelReply,
  ]);

  const handleSendTextMessage = useCallback(() => {
    if (isMuted) {
      showMutedToast();
      return;
    }

    if (!text.trim()) {
      return;
    }

    const message = {
      _id: generateUniqueId(),
      senderId: myData?.id,
      receiverId: userData?.id,
      text: text,
      type: 'text',
      image: '',
      video: '',
      document: '',
      parentMessageId: replyToMessage ? replyToMessage._id : '',
      replyToMessage: replyToMessage,
      isRead: false,
      audio: '',
      color: '',
      roomId: `${userData?.id}${myData?.id}`,
      createdAt: new Date(),
      user: {
        _id: myData?.id,
        name: myData?.nickname,
        avatar: myData?.profile_pic,
      },
    };
    console.log('message[]', message);

    onSend([message]);
    setText('');

    if (onCancelReply && replyToMessage) {
      onCancelReply();
    }
  }, [
    isMuted,
    showMutedToast,
    text,
    generateUniqueId,
    myData,
    userData,
    onSend,
    setText,
    replyToMessage,
    onCancelReply,
  ]);

  const attachmentOptions = [
    {
      id: 'document',
      icon: icons.document,
      label: t('Document'),
      onPress: handleDocumentPress,
    },
    {
      id: 'camera',
      icon: icons.camera,
      label: t('Camera'),
      onPress: handleCameraPress,
    },
    {
      id: 'gallery',
      icon: icons.gallery,
      label: t('Gallery'),
      onPress: handleGalleryPress,
    },
    {
      id: 'audio',
      icon: icons.headphones,
      label: t('Audio'),
      onPress: handleAudioPress,
    },
    {
      id: 'location',
      icon: icons.location,
      label: t('Location'),
      onPress: handleLocationPress,
    },
    {
      id: 'contact',
      icon: icons.profile,
      label: t('Contact'),
      onPress: handleContactPress,
    },
    {
      id: 'fonts',
      icon: icons.fonts,
      label: t('Fonts'),
      onPress: handleFontsPress,
    },
    {
      id: 'colors',
      icon: icons.colorPicker,
      label: t('Colors'),
      onPress: handleColorsPress,
    },
  ];

  // Handle attachment button
  const handleAttachmentClick = useCallback(() => {
    if (isMuted) {
      showMutedToast();
      return;
    }
    Keyboard.dismiss();
    setShowRose(false);
    setShowAttachments(prev => !prev);
  }, [isMuted, showMutedToast, setShowAttachments]);

  // Handle rich text/emoji button
  const handleRoseClick = useCallback(() => {
    if (isMuted) {
      showMutedToast();
      return;
    }
    Keyboard.dismiss();
    setShowAttachments(false);
    setShowRose(prev => !prev);
  }, [isMuted, showMutedToast, setShowRose]);

  // Handle microphone button for voice recording
  const handleMicrophoneClick = useCallback(async () => {
    if (isMuted) {
      showMutedToast();
      return;
    }

    // Request microphone permission
    const permissionGranted = await requestMicrophonePermission();

    if (!permissionGranted) {
      Toast.show(t('Microphone permission is required'), Toast.SHORT);
      return;
    }

    // Toggle recording state
    if (setIsRecording) {
      setIsRecording(!isRecording);
    } else {
      // Fallback if recording isn't implemented yet
      Toast.show(t('Voice messages coming soon'), Toast.SHORT);
    }
  }, [isMuted, showMutedToast, isRecording, setIsRecording, t]);

  // Insert emoji into text input
  const handleEmojiSelected = useCallback(
    (emoji: string) => {
      setText(prev => prev + emoji);
    },
    [setText],
  );
  async function handleCameraPress() {
    try {
      setShowAttachments(false);
      const result = await takeMediaWithCamera({mediaType: 'mixed'});

      if (result.permissionDenied) {
        Toast.show(t('Camera permission is required'), Toast.SHORT);
        return;
      }

      if (!result.cancelled && result.uri) {
        setMediaUri({uri: result.uri, duration: result.duration});
        setMediaType(result.type);
        setShowMedia(true);
      }
    } catch (error) {
      console.error('Error using camera:', error);
      Toast.show(t('Failed to access camera'), Toast.SHORT);
    }
  }

  async function handleSendMedia(mediaData) {
    try {
      console.log('mediaData', mediaData);

      setShowMedia(false);
      if (mediaData.type === 'video') {
        if (onVideoSelect) {
          onVideoSelect({
            uri: mediaData.uri,
            caption: mediaData.caption,
            duration: mediaData.duration,
          });
        }
      } else if (mediaData.type === 'image') {
        if (onImageSelect) {
          onImageSelect({
            uri: mediaData.uri,
            caption: mediaData.caption,
            duration: mediaData.duration,
          });
        }
      }
    } catch (error) {
      setShowMedia(false);
      console.error('Error using camera:', error);
      Toast.show(t('Failed to access camera'), Toast.SHORT);
    }
  }

  async function handleVideoPress() {
    try {
      setShowAttachments(false);
      const result = await pickMediaFromGallery({
        mediaType: 'video',
        selectionLimit: 5,
      });

      if (!result.cancelled && !result.error && result.assets?.length > 0) {
        const selectedAsset = result.assets[0];
        console.log('results are here ', selectedAsset);
        setMediaUri({uri: selectedAsset.uri, duration: selectedAsset.duration});
        setMediaType('video');
        setShowMedia(true);
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Toast.show(t('Failed to access gallery'), Toast.SHORT);
    }
  }

  async function handleGalleryPress() {
    try {
      setShowAttachments(false);
      const result = await pickMediaFromGallery({
        mediaType: 'mixed',
        selectionLimit: 1,
      });

      if (!result.cancelled && !result.error && result.assets?.length > 0) {
        const selectedAsset = result.assets[0];

        if (selectedAsset.type?.startsWith('video/')) {
          setMediaUri({
            uri: selectedAsset.uri,
            duration: selectedAsset.duration,
          });
          setMediaType('video');
          setShowMedia(true);
        } else if (selectedAsset.type?.startsWith('image/')) {
          setMediaUri({
            uri: selectedAsset.uri,
            duration: null,
          });
          setMediaType('image');
          setShowMedia(true);
        }
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Toast.show(t('Failed to access gallery'), Toast.SHORT);
    }
  }

  async function handleDocumentPress() {
    try {
      setShowAttachments(false);
      const result = await pickDocument();

      if (!result.cancelled && !result.error) {
        if (onDocumentSelect) {
          onDocumentSelect(result.uri, result.name, result.type);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Toast.show(t('Failed to select document'), Toast.SHORT);
    }
  }

  async function handleContactPress() {
    try {
      setShowAttachments(false);
      const granted = await requestContactPermission();
      if (!granted) {
        Toast.show(t('Contact permission is required'), Toast.SHORT);
        return;
      }

      const contacts = await Contacts.getAll();
      navigation.navigate('ContactList', {
        data: contacts,
        onContactSelect: contactData => {
          // Create a message with the contact information
          const message = {
            _id: generateUniqueId(),
            senderId: myData?.id,
            receiverId: userData?.id,
            text: t('Contact: {{name}}', {name: contactData.displayName}),
            type: 'contact',
            image: '',
            video: '',
            document: '',
            contactInfo: contactData, // Store the contact data here
            parentMessageId: replyToMessage ? replyToMessage._id : '',
            replyToMessage: replyToMessage,
            isRead: false,
            audio: '',
            color: '',
            roomId: `${userData?.id}${myData?.id}`,
            createdAt: new Date(),
            user: {
              _id: myData?.id,
              name: myData?.nickname,
              avatar: myData?.profile_pic,
            },
          };

          // Send the message
          onSend([message]);

          // Clear reply after sending if there was one
          if (onCancelReply && replyToMessage) {
            onCancelReply();
          }
        },
      });
    } catch (error) {
      console.error('Error getting contacts:', error);
      Toast.show(t('Failed to access contacts'), Toast.SHORT);
    }
  }

  async function handleAudioPress() {
    setShowAttachments(false);
    if (onAudioSelect) {
      Toast.show(t('Audio selection coming soon'), Toast.SHORT);
    }
  }

  async function handleLocationPress() {
    setShowAttachments(false);
    // Navigate to location picker screen
    Toast.show(t('Location selection coming soon'), Toast.SHORT);
  }

  function handleFontsPress() {
    setShowAttachments(false);
    setShowFontPicker(true);
  }

  function handleColorsPress() {
    setShowAttachments(false);
    setShowColorPicker(true);
  }

  function handleSelectFont(font) {
    setSelectedFont(font);
    Toast.show(t('Font changed to {{name}}', {name: font.name}), Toast.SHORT);
  }

  function handleSelectColor(color) {
    if (setThemeColor) {
      setThemeColor(color);
    }
    Toast.show(t('Theme color changed'), Toast.SHORT);
  }

  const renderAttachmentOption = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.attachmentOption}
        onPress={item.onPress}
        activeOpacity={0.7}>
        <View style={styles.attachmentIconContainer}>
          <Image source={item?.icon} style={{height: 20, width: 20}} />
        </View>
        <Text style={styles.attachmentLabel}>{item.label}</Text>
      </TouchableOpacity>
    ),
    [],
  );
  const recordingOpacity = recordingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      {replyToMessage && (
        <ReplyBar
          replyToMessage={replyToMessage}
          onCancelReply={onCancelReply}
          userName={
            replyToMessage.user._id === myData?.id
              ? t('You')
              : replyToMessage.user.name
          }
        />
      )}
      <View style={styles.mainContainer}>
        <View
          style={[
            styles.inputContainer,
            {
              paddingRight: text.trim() ? 0 : 10,
            },
          ]}>
          <TextInput
            ref={inputRef}
            style={[
              styles.textInput,
              {
                height: inputHeight,
                fontFamily: selectedFont.fontFamily,
              },
            ]}
            value={text}
            onChangeText={setText}
            placeholder={t('Type a message...')}
            placeholderTextColor="#999"
            multiline
            onContentSizeChange={handleContentSizeChange}
            textAlignVertical="center"
          />

          {text.trim() ? (
            <TouchableOpacity
              style={[
                styles.sendButton,
                !isConnected && styles.disabledButton,
                {
                  alignSelf: 'flex-end',
                  backgroundColor: themeColor,
                },
              ]}
              disabled={!isConnected}
              onPress={handleSendTextMessage}
              activeOpacity={0.7}>
              <MaterialIcons name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightButtons}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleVideoPress}>
                <Image
                  source={icons.videoAttachment}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleRoseClick}>
                <Image
                  source={icons.rose}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachButton}
                onPress={handleAttachmentClick}
                activeOpacity={0.7}>
                <MaterialIcons name="attach-file" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.micButton}
                onPress={handleMicrophoneClick}>
                <MaterialIcons name="mic" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {showAttachments && (
          <View
            style={[
              styles.attachmentsContainer,
              {backgroundColor: themeColor},
            ]}>
            <View style={styles.attachmentsHeader}>
              <Text style={styles.attachmentsTitle}>{t('Attachments')}</Text>
              <TouchableOpacity
                onPress={() => setShowAttachments(false)}
                style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={attachmentOptions}
              renderItem={renderAttachmentOption}
              keyExtractor={item => item.id}
              numColumns={4}
              contentContainerStyle={styles.attachmentsList}
            />
          </View>
        )}

        {/* Font Picker Modal */}
        <FontPicker
          visible={showFontPicker}
          onClose={() => setShowFontPicker(false)}
          onSelectFont={handleSelectFont}
        />

        {/* Color Picker Modal */}
        <ColorPicker
          visible={showColorPicker}
          onClose={() => setShowColorPicker(false)}
          initialColor={themeColor}
          onSelectColor={handleSelectColor}
        />

        {showRose && (
          <Rose
            onClose={handleRoseClick}
            onEmojiSelected={handleEmojiSelected}
          />
        )}
        <MediaViewer
          visible={showMedia}
          media={mediaUri}
          type={mediaType}
          onClose={() => {
            setShowMedia(false);
            setMediaUri('');
            setMediaType(null);
          }}
          onSendMessage={handleSendMedia}
        />
      </View>
    </View>
  );
};

export default React.memo(RenderInputToolbar);
