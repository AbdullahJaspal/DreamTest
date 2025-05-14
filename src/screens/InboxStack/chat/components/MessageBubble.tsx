import React, {memo, useMemo, useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import styles from '../styles/messageBubbleStyles';
import {useAppSelector} from '../../../../store/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ExpandableMessageText from './ExpandableMessageText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  MessageStatus,
  URL_REGEX,
  detectContentType,
  formatDuration,
  formatMessageTime,
  messageType,
  getDomainFromUrl,
  fetchLinkPreviewMetadata,
  getVideoPlatformInfo,
} from '../../../../utils/chatUtils';
import {
  selectChatThemeColor,
  selectMyProfileData,
} from '../../../../store/selectors';
import Text from '../../../../components/Text';

interface MessageBubbleProps {
  currentMessage: any;
  onRetry?: (messageId: string) => void;
  onOpenMedia?: (uri: string, type: string, message: any) => void;
  onLongPress?: (message: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  currentMessage,
  onRetry,
  onOpenMedia,
  onLongPress,
}) => {
  const {t} = useTranslation();
  const myData = useAppSelector(selectMyProfileData);
  const chatThemeColor = useAppSelector(selectChatThemeColor);
  const [linkPreview, setLinkPreview] = useState(null);
  const [videoThumbnails, setVideoThumbnails] = useState({});

  const [linkMetadata, setLinkMetadata] = useState({
    title: '',
    description: '',
    image: '',
    favicon: '',
    siteName: '',
  });

  if (!currentMessage || !currentMessage.user) return null;

  const isCurrentUser = myData.id == currentMessage?.user?._id;
  useEffect(() => {
    if (currentMessage.text && typeof currentMessage.text === 'string') {
      const urls = currentMessage.text.match(URL_REGEX);
      if (urls && urls.length > 0) {
        let previewUrl = null;
        let previewType = null;

        for (const url of urls) {
          const contentType = detectContentType(url);
          if (contentType === 'image' || contentType === 'video') {
            previewUrl = url;
            previewType = contentType;
            break;
          }
        }

        if (previewUrl) {
          setLinkPreview({
            url: previewUrl,
            type: previewType,
          });
        } else {
          console.log(`Found website URL: ${urls[0]}`);
          setLinkPreview({
            url: urls[0],
            type: 'website',
          });
        }
      }
    }
  }, [currentMessage.text]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (linkPreview && linkPreview.url && linkPreview.type === 'website') {
        try {
          const metadata = await fetchLinkPreviewMetadata(linkPreview.url);

          setLinkMetadata(metadata);
        } catch (error) {
          console.error('Error fetching link preview metadata:', error);
        }
      }
    };

    fetchMetadata();
  }, [linkPreview]);

  useEffect(() => {
    if (!linkPreview) return;

    if (linkPreview.type === 'video') {
      const linkId = `link_${linkPreview.url.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (videoThumbnails[linkId]) return;

      const platformInfo = getVideoPlatformInfo(linkPreview.url);

      setVideoThumbnails(prev => ({
        ...prev,
        [linkId]: {
          path: platformInfo.logo,
          type: 'platform',
          name: platformInfo.name,
          color: platformInfo.color,
        },
      }));
    }
  }, [linkPreview]);

  const formattedTime = useMemo(() => {
    return formatMessageTime(currentMessage.createdAt);
  }, [currentMessage.createdAt]);

  const handleRetry = () => {
    if (onRetry && currentMessage._id) {
      onRetry(currentMessage._id);
    }
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('An error occurred opening the URL:', err),
    );
  };

  const handleMediaPress = (uri: string, type: string, message: string) => {
    if (onOpenMedia) {
      onOpenMedia(uri, type, message);
    }
  };

  const renderTimestamp = () => (
    <Text
      style={[
        styles.timestamp,
        isCurrentUser ? styles.timestampSent : styles.timestampReceived,
      ]}>
      {formattedTime}
    </Text>
  );

  const renderMessageStatus = () => {
    if (!isCurrentUser) return null;

    const statusValue = currentMessage.status?.toUpperCase?.() || 'SENT';

    if (statusValue === 'SENDING') {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size={'small'} color="#ffffff" />
        </View>
      );
    } else if (statusValue === 'FAILED') {
      return (
        <TouchableOpacity
          style={styles.statusContainer}
          onPress={handleRetry}
          activeOpacity={0.7}>
          <MaterialIcons name="error-outline" size={14} color="#FF3B30" />
        </TouchableOpacity>
      );
    } else if (statusValue === 'SENT') {
      return (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check" size={14} color="#ffffff" />
        </View>
      );
    } else if (statusValue === 'DELIVERED') {
      return (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check-all" size={14} color="#ffffff" />
        </View>
      );
    } else if (statusValue === 'READ') {
      return (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check-all" size={14} color="#53bdeb" />
        </View>
      );
    } else {
      console.log('Status not matching any case:', statusValue);
      // Default fallback to show check mark
      return (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check" size={14} color="#ffffff" />
        </View>
      );
    }
  };

  const renderMessageFooter = () => (
    <View
      style={[
        styles.footerContainer,
        {
          justifyContent:
            currentMessage.type === 'video' ? 'space-between' : 'flex-end',
        },
      ]}>
      {currentMessage.type === 'video' && (
        <Text
          style={[
            styles.timestamp,
            isCurrentUser ? styles.timestampSent : styles.timestampReceived,
          ]}>
          {formatDuration(currentMessage.duration)}
        </Text>
      )}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {renderTimestamp()}
        {renderMessageStatus()}
      </View>
    </View>
  );

  const renderUploadProgress = () => {
    if (!isCurrentUser || !currentMessage.uploadProgress) return null;

    return (
      <View style={styles.uploadProgressContainer}>
        <View
          style={[
            styles.uploadProgressBar,
            {width: `${currentMessage.uploadProgress}%`},
          ]}
        />
      </View>
    );
  };

  const renderLinkPreview = () => {
    if (!linkPreview) return null;

    switch (linkPreview.type) {
      case 'image':
        return (
          <TouchableOpacity
            style={styles.linkPreviewContainer}
            onPress={() => handleLinkPress(linkPreview.url)}
            activeOpacity={0.9}>
            <Image
              source={{uri: linkPreview?.url}}
              style={styles.linkPreviewImage}
              resizeMode="cover"
            />
            <Text
              style={[
                styles.linkText,
                isCurrentUser ? styles.sentText : styles.receivedText,
              ]}
              numberOfLines={1}>
              {linkPreview.url}
            </Text>
          </TouchableOpacity>
        );

      case 'video':
        // Generate a unique ID for this link preview
        const linkId = `link_${linkPreview.url.replace(/[^a-zA-Z0-9]/g, '_')}`;

        // Get the thumbnail data for this link
        const thumbnailData = videoThumbnails[linkId];

        return (
          <TouchableOpacity
            style={styles.linkPreviewContainer}
            onPress={() => handleLinkPress(linkPreview.url)}
            activeOpacity={0.9}>
            {thumbnailData ? (
              <View
                style={[
                  styles.videoPlatformPreview,
                  {backgroundColor: thumbnailData.color || '#3d3d3d'},
                ]}>
                {thumbnailData.path ? (
                  <Image
                    source={{uri: thumbnailData.path}}
                    style={styles.platformLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <MaterialIcons name="movie" size={40} color="#ffffff" />
                )}
                <Text style={styles.platformText}>
                  {thumbnailData.name || 'Video'}
                </Text>
              </View>
            ) : (
              <View style={styles.videoThumbnailPlaceholder}></View>
            )}

            <Text
              style={[
                styles.linkText,
                isCurrentUser ? styles.sentText : styles.receivedText,
              ]}
              numberOfLines={1}>
              {linkPreview.url}
            </Text>
          </TouchableOpacity>
        );

      case 'website':
        return (
          <TouchableOpacity
            style={styles.LinkPreview}
            onPress={() => handleLinkPress(linkPreview.url)}
            activeOpacity={0.9}>
            {/* Logo/Image section */}
            {linkMetadata.image ? (
              <Image
                source={{uri: linkMetadata.image}}
                style={styles.PreviewImage}
                resizeMode="cover"
              />
            ) : linkMetadata.favicon ? (
              <View style={styles.LogoContainer}>
                <Image
                  source={{uri: linkMetadata.favicon}}
                  style={styles.LogoImage}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={styles.LogoContainer}>
                <MaterialIcons name="public" size={40} color="#fff" />
              </View>
            )}

            {/* Text content section */}
            <View style={styles.PreviewTextContainer}>
              {/* Title */}
              <Text style={styles.PreviewTitle} numberOfLines={1}>
                {linkMetadata.title || 'Visit Link'}
              </Text>

              {/* Description */}
              <Text style={styles.PreviewDescription} numberOfLines={2}>
                {linkMetadata.description ||
                  linkMetadata.siteName ||
                  getDomainFromUrl(linkPreview.url)}
              </Text>

              {/* URL text */}
              <Text style={styles.PreviewUrl} numberOfLines={1}>
                {linkMetadata.siteName || getDomainFromUrl(linkPreview.url)}
              </Text>
            </View>

            {/* Link highlight at the bottom */}
            <View style={styles.LinkHighlight}>
              <Text
                style={styles.LinkText}
                numberOfLines={1}
                ellipsizeMode="middle">
                {linkPreview.url}
              </Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  const renderReplyContent = () => {
    if (!currentMessage.parentMessage) return null;

    const replyMessage = currentMessage.parentMessage;
    const replyType = messageType(replyMessage);
    const isReplyFromCurrentUser = replyMessage?.user?._id === myData?.id;

    let previewText = '';
    switch (replyType) {
      case 'text':
        previewText = replyMessage?.text || '';
        break;
      case 'image':
        previewText = 'Photo';
        break;
      case 'video':
        previewText = 'Video';
        break;
      case 'file':
        previewText = replyMessage?.fileName || 'Document';
        break;
      case 'audio':
        previewText = 'Audio message';
        break;
      case 'location':
        previewText = 'Location';
        break;
      case 'contact':
        previewText = replyMessage?.contactName || 'Contact';
        break;
      default:
        previewText = 'Message';
    }

    return (
      <View style={styles.replyContainer}>
        <View style={styles.replyBar} />
        <View style={styles.replyContent}>
          <Text style={styles.replySenderName} numberOfLines={1}>
            {isReplyFromCurrentUser
              ? 'You'
              : replyMessage?.user?.name || 'User'}
          </Text>
          <Text
            style={[
              styles.replyPreview,
              {
                color: isCurrentUser
                  ? 'rgba(255, 255, 255, 0.8)'
                  : 'rgba(0, 0, 0, 0.8)',
              },
            ]}
            numberOfLines={1}>
            {previewText}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessageContent = () => {
    const type = messageType(currentMessage);

    switch (type) {
      case 'system':
        return (
          <View style={styles.systemMessageContainer}>
            <Text style={styles.systemMessageText}>{currentMessage.text}</Text>
          </View>
        );

      case 'text':
        return (
          <View
            style={[
              styles.bubbleContainer,
              isCurrentUser
                ? [styles.sentBubble, {backgroundColor: chatThemeColor}]
                : styles.receivedBubble,
            ]}>
            {currentMessage.parentMessage && renderReplyContent()}
            {linkPreview && renderLinkPreview()}
            {currentMessage.text && (
              <ExpandableMessageText
                text={currentMessage.text}
                textStyle={
                  isCurrentUser ? styles.sentText : styles.receivedText
                }
                initialDisplayAmount={5} // Start with 5 lines
                incrementAmount={20} // Add 20 more lines each time
                readMoreText="Read more"
                readLessText="Show less"
                readMoreStyle={{
                  color: '#e7e7e7',
                  fontSize: 14,
                  textDecorationLine: 'underline',
                }}
                truncateBy="lines" // Use line-based truncation
              />
            )}
            {renderMessageFooter()}
            {renderUploadProgress()}
          </View>
        );

      case 'image':
        return (
          <TouchableOpacity
            style={[
              styles.mediaBubbleContainer,
              isCurrentUser
                ? [styles.sentMediaBubble, {backgroundColor: chatThemeColor}]
                : styles.receivedMediaBubble,
            ]}
            onPress={() =>
              handleMediaPress(currentMessage.image, 'image', currentMessage)
            }
            activeOpacity={0.9}>
            {currentMessage.parentMessage && renderReplyContent()}
            <Image
              source={{uri: currentMessage.image}}
              style={styles.mediaImage}
              resizeMode="cover"
            />
            {currentMessage.text && (
              <View style={styles.mediaCaption}>
                <Text
                  style={isCurrentUser ? styles.sentText : styles.receivedText}>
                  {currentMessage.text}
                </Text>
              </View>
            )}
            <View style={styles.mediaOverlay}>{renderMessageFooter()}</View>
            {renderUploadProgress()}
          </TouchableOpacity>
        );

      case 'video':
        return (
          <TouchableOpacity
            style={[
              styles.mediaBubbleContainer,
              isCurrentUser
                ? [styles.sentMediaBubble, {backgroundColor: chatThemeColor}]
                : styles.receivedMediaBubble,
            ]}
            onPress={() =>
              handleMediaPress(currentMessage.video, 'video', currentMessage)
            }
            activeOpacity={0.9}>
            {currentMessage.parentMessage && renderReplyContent()}
            <View style={styles.videoContainer}>
              <Video
                source={{uri: currentMessage.video}}
                style={styles.mediaImage}
                resizeMode="cover"
                paused
                muted
              />
              {/* <View style={styles.playButtonContainer}>
                <Ionicons name="play" size={40} color="white" />
              </View> */}
            </View>
            {currentMessage.text && (
              <View style={styles.mediaCaption}>
                <Text
                  style={isCurrentUser ? styles.sentText : styles.receivedText}>
                  {currentMessage.text}
                </Text>
              </View>
            )}
            <View style={styles.mediaOverlay}>{renderMessageFooter()}</View>
            {renderUploadProgress()}
          </TouchableOpacity>
        );

      case 'file':
        return (
          <View
            style={[
              styles.bubbleContainer,
              isCurrentUser ? styles.sentBubble : styles.receivedBubble,
            ]}>
            {currentMessage.parentMessage && renderReplyContent()}
            <View style={styles.fileContainer}>
              <View style={styles.fileIconContainer}>
                <FontAwesome
                  name="file-text-o"
                  size={24}
                  color={isCurrentUser ? '#fff' : '#54AD7A'}
                />
              </View>
              <View style={styles.fileDetails}>
                <Text
                  style={[
                    isCurrentUser ? styles.sentText : styles.receivedText,
                    styles.fileName,
                  ]}
                  numberOfLines={1}>
                  {currentMessage.fileName || t('Document')}
                </Text>
              </View>
            </View>
            {renderMessageFooter()}
            {renderUploadProgress()}
          </View>
        );

      case 'location':
        return (
          <View
            style={[
              styles.bubbleContainer,
              isCurrentUser ? styles.sentBubble : styles.receivedBubble,
            ]}>
            {currentMessage.parentMessage && renderReplyContent()}
            <View style={styles.locationContainer}>
              <View style={styles.locationPreview}>
                <MaterialIcons
                  name="place"
                  size={28}
                  color={isCurrentUser ? '#fff' : '#54AD7A'}
                />
                <Text
                  style={isCurrentUser ? styles.sentText : styles.receivedText}>
                  {t('Location')}
                </Text>
              </View>
              <Text
                style={isCurrentUser ? styles.sentText : styles.receivedText}
                numberOfLines={2}>
                {currentMessage.text || t('Shared location')}
              </Text>
            </View>
            {renderMessageFooter()}
            {renderUploadProgress()}
          </View>
        );

      case 'contact':
        return (
          <View
            style={[
              styles.bubbleContainer,
              isCurrentUser ? styles.sentBubble : styles.receivedBubble,
            ]}>
            {currentMessage.parentMessage && renderReplyContent()}
            <View style={styles.contactContainer}>
              <View style={styles.contactIconContainer}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color={isCurrentUser ? '#fff' : '#54AD7A'}
                />
              </View>
              <View style={styles.contactDetails}>
                <Text
                  style={[
                    isCurrentUser ? styles.sentText : styles.receivedText,
                    styles.contactName,
                  ]}
                  numberOfLines={1}>
                  {currentMessage.contactName || t('Contact')}
                </Text>
                <Text
                  style={[
                    isCurrentUser ? styles.sentText : styles.receivedText,
                    styles.contactPhone,
                  ]}>
                  {currentMessage.contactPhone || t('No phone number')}
                </Text>
              </View>
            </View>
            {renderMessageFooter()}
            {renderUploadProgress()}
          </View>
        );

      case 'audio':
        return (
          <View
            style={[
              styles.bubbleContainer,
              isCurrentUser ? styles.sentBubble : styles.receivedBubble,
            ]}>
            {currentMessage.parentMessage && renderReplyContent()}
            <View style={styles.audioContainer}>
              <TouchableOpacity style={styles.audioPlayButton}>
                <Ionicons
                  name="play"
                  size={22}
                  color={isCurrentUser ? '#fff' : '#54AD7A'}
                />
              </TouchableOpacity>
              <View style={styles.audioWaveform}>
                <Text
                  style={isCurrentUser ? styles.sentText : styles.receivedText}>
                  {t('Audio message')}
                </Text>
              </View>
            </View>
            {renderMessageFooter()}
            {renderUploadProgress()}
          </View>
        );

      default:
        return (
          <View
            style={[
              styles.bubbleContainer,
              isCurrentUser ? styles.sentBubble : styles.receivedBubble,
            ]}>
            <Text style={isCurrentUser ? styles.sentText : styles.receivedText}>
              {currentMessage.text || t('Unsupported message type')}
            </Text>
            {renderMessageFooter()}
            {renderUploadProgress()}
          </View>
        );
    }
  };

  return (
    <Pressable
      onLongPress={() => onLongPress && onLongPress(currentMessage)}
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentContainer : styles.receivedContainer,
      ]}
      delayLongPress={200}>
      {renderMessageContent()}
    </Pressable>
  );
};

export default memo(MessageBubble);
