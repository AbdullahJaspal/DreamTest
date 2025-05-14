import {useCallback} from 'react';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {useSocket} from '../../../../socket/SocketProvider';

import {
  MessageStatus,
  ExtendedMessage,
  generateUniqueId,
  uploadMedia,
} from '../../../../utils/chatUtils';

// Redux imports
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import {
  appendMessage,
  updateMessageStatus,
  setUploading,
} from '../../../../store/slices/content/messageSlice';
import {makeSelectIsUploadingForRoom} from '../../../../store/selectors';

// Define proper interfaces for user data
interface UserData {
  id: string;
  nickname: string;
  profile_pic: string;
  auth_token?: string;
}

// Media data interface
interface MediaData {
  uri: string;
  caption?: string;
  duration?: string;
  fileName?: string;
  mimeType?: string;
}

export const useMediaHandlers = (
  roomId: string,
  myData: UserData,
  userData: UserData,
) => {
  const {t} = useTranslation();
  const {isConnected, emit} = useSocket();
  const dispatch = useAppDispatch();

  const selectIsUploadingForCurrentRoom = makeSelectIsUploadingForRoom();
  const isUploading = useAppSelector(state =>
    selectIsUploadingForCurrentRoom(state, roomId),
  );

  const prepareUserData = useCallback(
    () => ({
      _id: myData.id,
      name: myData.nickname,
      avatar: myData.profile_pic,
    }),
    [myData],
  );

  // Helper to update message status
  const updateMessageStatusWithProgress = useCallback(
    (messageId: string, status: MessageStatus, uploadProgress = 0) => {
      dispatch(
        updateMessageStatus({
          roomId,
          messageId,
          status,
          uploadProgress,
        }),
      );
    },
    [dispatch, roomId],
  );

  // Upload media file to server
  const uploadMediaToServer = useCallback(
    async (
      mediaUri: string,
      mediaType: string,
      fileName = null,
      mimeType = null,
    ) => {
      try {
        return await uploadMedia(
          mediaUri,
          mediaType,
          myData.auth_token,
          fileName,
          mimeType,
        );
      } catch (error) {
        console.error(`Error uploading ${mediaType}:`, error);
        throw error;
      }
    },
    [myData.auth_token],
  );

  // Generic function to handle all media types
  const uploadAndSendMedia = useCallback(
    async (
      mediaData: MediaData,
      mediaType: string,
      replyToMessage?: ExtendedMessage | null,
      existingId?: string,
    ) => {
      const messageId = existingId || generateUniqueId();

      // Create placeholder message to show in UI immediately
      const placeholderMessage: ExtendedMessage = {
        _id: messageId,
        senderId: myData.id,
        receiverId: userData.id,
        text: mediaData.caption || '',
        type: mediaType,
        image: mediaType === 'image' ? mediaData.uri : '',
        video: mediaType === 'video' ? mediaData.uri : '',
        audio: mediaType === 'audio' ? mediaData.uri : '',
        document: mediaType === 'document' ? mediaData.uri : '',
        parentMessageId: replyToMessage ? replyToMessage._id : '',
        replyToMessage: replyToMessage || '',
        duration: mediaData.duration,
        createdAt: new Date(),
        user: prepareUserData(),
        status: MessageStatus.SENDING,
        uploadProgress: 0,
        roomId: roomId,
      };

      // Add message to Redux
      if (existingId) {
        updateMessageStatusWithProgress(existingId, MessageStatus.SENDING, 0);
      } else {
        // We need to flag this as a local-only message before the upload is complete
        // This will help us identify it if we get a duplicate from the server
        const localMessage = {
          ...placeholderMessage,
          isLocalPlaceholder: true,
        };
        dispatch(appendMessage({roomId, message: localMessage}));
      }

      try {
        dispatch(setUploading({roomId, isUploading: true}));

        // Upload the media file
        const mediaUrl = await uploadMediaToServer(
          mediaData.uri,
          mediaType,
          mediaData.fileName,
          mediaData.mimeType,
        );

        if (!mediaUrl) {
          throw new Error('Upload failed');
        }

        // Create final message with remote media URL
        const finalMessage: ExtendedMessage = {
          ...placeholderMessage,
          image: mediaType === 'image' ? mediaUrl : '',
          video: mediaType === 'video' ? mediaUrl : '',
          audio: mediaType === 'audio' ? mediaUrl : '',
          document: mediaType === 'document' ? mediaUrl : '',
          status: MessageStatus.SENT,
          uploadProgress: 100,
          isLocalPlaceholder: false,
        };

        // Update message in Redux
        updateMessageStatusWithProgress(messageId, MessageStatus.SENT, 100);

        // Send message via socket
        if (isConnected) {
          emit('customEvent', [finalMessage]);
        } else {
          throw new Error('No connection');
        }

        return true;
      } catch (error) {
        console.error(`Error sending ${mediaType}:`, error);
        updateMessageStatusWithProgress(messageId, MessageStatus.FAILED);

        let errorMessage = `Failed to send ${mediaType}`;
        if (error instanceof Error) {
          if (error.message.includes('No connection')) {
            errorMessage = t('No internet connection. Please try again later.');
          }
        }

        Toast.show(errorMessage, Toast.SHORT);
        return false;
      } finally {
        dispatch(setUploading({roomId, isUploading: false}));
      }
    },
    [
      myData.id,
      userData.id,
      prepareUserData,
      uploadMediaToServer,
      isConnected,
      roomId,
      emit,
      updateMessageStatusWithProgress,
      dispatch,
      t,
    ],
  );

  // Generic handler for all media types
  const handleSendMedia = useCallback(
    async (
      mediaData: MediaData,
      mediaType: string,
      replyToMessage?: ExtendedMessage | null,
    ) => {
      return await uploadAndSendMedia(mediaData, mediaType, replyToMessage);
    },
    [uploadAndSendMedia],
  );

  // Simplified handlers for specific media types, using the generic handler
  const handleSendImage = useCallback(
    async (imageData: any, replyToMessage?: ExtendedMessage | null) => {
      return await handleSendMedia(
        {
          uri: imageData.uri,
          caption: imageData.caption,
          duration: imageData.duration,
        },
        'image',
        replyToMessage,
      );
    },
    [handleSendMedia],
  );

  const handleSendVideo = useCallback(
    async (videoData: any, replyToMessage?: ExtendedMessage | null) => {
      return await handleSendMedia(
        {
          uri: videoData.uri,
          caption: videoData.caption,
          duration: videoData.duration,
        },
        'video',
        replyToMessage,
      );
    },
    [handleSendMedia],
  );

  const handleSendDocument = useCallback(
    async (
      documentUri: string,
      documentName?: string,
      documentType?: string,
    ) => {
      return await handleSendMedia(
        {
          uri: documentUri,
          fileName: documentName,
          mimeType: documentType,
        },
        'document',
      );
    },
    [handleSendMedia],
  );

  const handleSendAudio = useCallback(
    async (audioUri: string, audioName?: string) => {
      return await handleSendMedia(
        {
          uri: audioUri,
          fileName: audioName,
        },
        'audio',
      );
    },
    [handleSendMedia],
  );

  // Handle sending contact information
  const handleSendContact = useCallback(
    (contact: any) => {
      if (!contact) return false;

      const contactData =
        typeof contact === 'object'
          ? contact
          : {displayName: 'Unknown', phoneNumbers: []};

      const phoneNumber =
        contactData.phoneNumbers && contactData.phoneNumbers.length > 0
          ? contactData.phoneNumbers[0].number
          : '';

      const contactMessage: ExtendedMessage = {
        _id: generateUniqueId(),
        senderId: myData.id,
        receiverId: userData.id,
        text: `Contact: ${contactData.displayName}\nPhone: ${phoneNumber}`,
        type: 'contact',
        contactName: contactData.displayName,
        contactPhone: phoneNumber,
        image: '',
        video: '',
        document: '',
        audio: '',
        roomId: roomId,
        createdAt: new Date(),
        user: prepareUserData(),
        status: isConnected ? MessageStatus.SENDING : MessageStatus.FAILED,
      };

      // Add to Redux
      dispatch(appendMessage({roomId, message: contactMessage}));

      // Send via socket
      if (isConnected) {
        emit('customEvent', [contactMessage]);

        // Update status to sent after a delay
        setTimeout(() => {
          updateMessageStatusWithProgress(
            contactMessage._id,
            MessageStatus.SENT,
          );
        }, 500);

        return true;
      } else {
        updateMessageStatusWithProgress(
          contactMessage._id,
          MessageStatus.FAILED,
        );
        return false;
      }
    },
    [
      myData.id,
      userData.id,
      roomId,
      prepareUserData,
      isConnected,
      emit,
      updateMessageStatusWithProgress,
      dispatch,
    ],
  );

  // Handle sending location
  const handleLocationSelect = useCallback(
    (location: any) => {
      if (!location) return;

      const locationMessage: ExtendedMessage = {
        _id: generateUniqueId(),
        senderId: myData.id,
        receiverId: userData.id,
        text: location.name || t('Shared location'),
        type: 'location',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          name: location.name || t('Shared location'),
        },
        image: '',
        video: '',
        document: '',
        audio: '',
        roomId: roomId,
        createdAt: new Date(),
        user: prepareUserData(),
        status: isConnected ? MessageStatus.SENDING : MessageStatus.FAILED,
      };

      // Add to Redux
      dispatch(appendMessage({roomId, message: locationMessage}));

      // Send via socket
      if (isConnected) {
        emit('customEvent', [locationMessage]);

        // Update status to sent after a delay
        setTimeout(() => {
          updateMessageStatusWithProgress(
            locationMessage._id,
            MessageStatus.SENT,
          );
        }, 500);
      } else {
        updateMessageStatusWithProgress(
          locationMessage._id,
          MessageStatus.FAILED,
        );
      }
    },
    [
      myData.id,
      userData.id,
      roomId,
      prepareUserData,
      isConnected,
      emit,
      updateMessageStatusWithProgress,
      dispatch,
      t,
    ],
  );

  return {
    isUploading,
    handleSendMedia,
    handleSendImage,
    handleSendVideo,
    handleSendAudio,
    handleSendDocument,
    handleSendContact,
    handleLocationSelect,
  };
};
