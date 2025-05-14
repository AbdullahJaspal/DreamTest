import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {messageType} from '../../../../utils/chatUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Text from '../../../../components/Text';

const ReplyBar = ({replyToMessage, onCancelReply, userName}) => {
  const {t} = useTranslation();

  if (!replyToMessage) return null;

  const type = messageType(replyToMessage);

  const renderTypeIcon = () => {
    switch (type) {
      case 'image':
        return <MaterialIcons name="photo" size={20} color="#ccc" />;
      case 'video':
        return <Ionicons name="videocam" size={20} color="#ccc" />;
      case 'file':
        return <FontAwesome name="file-text-o" size={20} color="#ccc" />;
      case 'audio':
        return <MaterialIcons name="mic" size={20} color="#ccc" />;
      case 'location':
        return <MaterialIcons name="place" size={20} color="#ccc" />;
      case 'contact':
        return <MaterialIcons name="person" size={20} color="#ccc" />;
      default:
        return null;
    }
  };

  // Determine the preview text based on message type
  const getPreviewText = () => {
    switch (type) {
      case 'text':
        return replyToMessage.text || '';
      case 'image':
        return t('Photo');
      case 'video':
        return t('Video');
      case 'file':
        return replyToMessage.fileName || t('Document');
      case 'audio':
        return t('Audio message');
      case 'location':
        return t('Location');
      case 'contact':
        return replyToMessage.contactName || t('Contact');
      default:
        return t('Message');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.replyContent}>
        <View style={styles.leftBar} />
        <View style={styles.messageInfo}>
          <Text style={styles.senderName}>{userName || t('You')}</Text>
          <View style={styles.previewContainer}>
            {renderTypeIcon()}
            <Text style={styles.messagePreview} numberOfLines={1}>
              {getPreviewText()}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onCancelReply}>
        <MaterialIcons name="close" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  replyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftBar: {
    width: 4,
    height: '80%',
    backgroundColor: '#54AD7A',
    borderRadius: 2,
    marginRight: 8,
  },
  messageInfo: {
    flex: 1,
  },
  senderName: {
    color: '#54AD7A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    color: '#000',
    fontSize: 14,
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
  },
});

export default ReplyBar;
