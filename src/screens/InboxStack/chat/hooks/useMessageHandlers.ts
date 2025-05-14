import {useEffect, useCallback} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {useSocket} from '../../../../socket/SocketProvider';
import {CHAT_EVENTS} from '../../../../socket/events';

import * as userApi from '../../../../apis/userApi';
import {
  MessageStatus,
  ExtendedMessage,
  generateUniqueId,
} from '../../../../utils/chatUtils';

import {useAppSelector, useAppDispatch} from '../../../../store/hooks';
import {
  initRoomMessages,
  setMessages,
  appendMessage,
  appendMessages,
  updateMessageStatus,
  removeMessage,
  setLoadingEarlier,
  setHasMoreMessages,
  incrementPage,
  updateMessage,
} from '../../../../store/slices/content/messageSlice';

import {
  makeSelectMessagesForRoom,
  makeSelectLoadingEarlierForRoom,
  makeSelectHasMoreMessagesForRoom,
  makeSelectPageForRoom,
} from '../../../../store/selectors';

interface UserData {
  id: string;
  nickname: string;
  profile_pic: string;
  auth_token?: string;
}

export const useMessageHandlers = (
  roomId: string,
  myData: UserData,
  userData: UserData,
) => {
  const {t} = useTranslation();
  const {isConnected, emit, on} = useSocket();
  const dispatch = useAppDispatch();

  const selectMessagesForRoom = makeSelectMessagesForRoom();
  const selectLoadingEarlierForRoom = makeSelectLoadingEarlierForRoom();
  const selectHasMoreMessagesForRoom = makeSelectHasMoreMessagesForRoom();
  const selectPageForRoom = makeSelectPageForRoom();

  const messages = useAppSelector(state =>
    selectMessagesForRoom(state, roomId),
  );
  const loadingEarlier = useAppSelector(state =>
    selectLoadingEarlierForRoom(state, roomId),
  );
  const hasMoreMessages = useAppSelector(state =>
    selectHasMoreMessagesForRoom(state, roomId),
  );
  const page = useAppSelector(state => selectPageForRoom(state, roomId));

  useEffect(() => {
    dispatch(initRoomMessages({roomId}));
  }, [dispatch, roomId]);

  const prepareUserData = useCallback(
    () => ({
      _id: myData.id,
      name: myData.nickname,
      avatar: myData.profile_pic,
    }),
    [myData],
  );

  useEffect(() => {
    if (!isConnected) return;

    const handleIncomingMessage = (data: any) => {
      try {
        const formattedMessage = {
          _id: data._id || generateUniqueId(),
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text || '',
          type: data.type || 'text',
          image: data.image === null ? '' : data.image || '',
          video: data.video === null ? '' : data.video || '',
          document: data.document === null ? '' : data.document || '',
          audio: data.audio === null ? '' : data.audio || '',
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          user: {
            _id: data.senderId,
            name:
              data.senderId === myData.id ? myData.nickname : userData.nickname,
            avatar:
              data.senderId === myData.id
                ? myData.profile_pic
                : userData.profile_pic,
          },
          roomId: roomId,
          status:
            data.senderId === myData.id
              ? MessageStatus.SENT
              : MessageStatus.RECEIVED,
        };

        console.log('My messages', messages);
        console.log('Sockets: Received message:', formattedMessage);
        console.log('Message status type:', typeof formattedMessage.status);

        const isDuplicate = messages.some(msg => msg._id === data._id);

        if (!isDuplicate) {
          console.log('Not a duplicate - appending new message');
          dispatch(appendMessage({roomId, message: formattedMessage}));
        } else {
          console.log("It's duplicated - replacing message entirely");

          // Create a completely new array with updated messages
          const updatedMessages = messages.map(msg => {
            if (msg._id === data._id) {
              return {
                ...msg,
                // Make sure to use the actual enum value
                status:
                  data.senderId === myData.id
                    ? MessageStatus.SENT
                    : MessageStatus.RECEIVED,
                image: formattedMessage.image,
                video: formattedMessage.video,
                audio: formattedMessage.audio,
                document: formattedMessage.document,
                uploadProgress: 100,
              };
            }
            return msg;
          });

          dispatch(setMessages({roomId, messages: updatedMessages}));
        }

        setTimeout(() => {
          refreshMessagesFromServer();
        }, 300);
      } catch (error) {
        console.error('Error handling incoming message:', error);
      }
    };

    // Create this as a separate function outside of the handler
    const refreshMessagesFromServer = async () => {
      try {
        console.log('Refreshing messages from server (silently)');
        const result = await userApi.getAllMessages(
          userData.id,
          myData.auth_token,
          1,
          20,
        );

        if (result?.messages?.length > 0) {
          const formattedMessages = result.messages.map(msg => ({
            ...msg,
            status: msg.isRead
              ? MessageStatus.READ
              : msg.isReceived
              ? MessageStatus.DELIVERED
              : MessageStatus.SENT,
          }));

          // Replace messages without showing loading indicator
          dispatch(setMessages({roomId, messages: formattedMessages}));

          // Update hasMoreMessages flag
          dispatch(
            setHasMoreMessages({
              roomId,
              hasMore: result.hasMore || result.messages.length >= 20,
            }),
          );
        }
      } catch (error) {
        console.error('Error silently refreshing messages:', error);
        // Don't show an error toast to avoid annoying the user
      }
    };
    const handleMessageDeleted = (data: any) => {
      dispatch(removeMessage({roomId, messageId: data.messageId}));
    };

    // Set up event listeners
    const unsubscribeMessageReceived = on(
      'customEventResponse',
      handleIncomingMessage,
    );
    const unsubscribeMessageDeleted = on(
      CHAT_EVENTS.MESSAGE_DELETED,
      handleMessageDeleted,
    );

    // Cleanup on unmount
    return () => {
      unsubscribeMessageReceived();
      unsubscribeMessageDeleted();
    };
  }, [isConnected, roomId, myData, userData, dispatch, on, messages]);

  // Fetch chat history
  const fetchChat = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (pageNum === 1 && !append) {
          // Show loading indicator
          dispatch(
            setMessages({
              roomId,
              messages: [
                {
                  _id: 'loading',
                  text: '',
                  createdAt: new Date(),
                  user: {_id: 'system'},
                  system: true,
                } as unknown as ExtendedMessage,
              ],
            }),
          );
        }

        if (pageNum > 1) {
          dispatch(setLoadingEarlier({roomId, loading: true}));
        }

        const result = await userApi.getAllMessages(
          userData.id,
          myData.auth_token,
          pageNum,
          20,
        );

        if (result?.messages?.length > 0) {
          const formattedMessages = result.messages.map(msg => ({
            ...msg,
            status: msg.isRead
              ? MessageStatus.READ
              : msg.isReceived
              ? MessageStatus.DELIVERED
              : MessageStatus.SENT,
          }));

          if (append) {
            // For pagination, append to existing messages
            dispatch(appendMessages({roomId, messages: formattedMessages}));
          } else {
            // Initial load
            dispatch(setMessages({roomId, messages: formattedMessages}));
          }

          // Check if there are more messages to load
          dispatch(
            setHasMoreMessages({
              roomId,
              hasMore: result.hasMore || result.messages.length >= 20,
            }),
          );
        } else {
          // No messages or empty chat
          if (pageNum === 1) {
            dispatch(setMessages({roomId, messages: []}));
          }
          dispatch(setHasMoreMessages({roomId, hasMore: false}));
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        Toast.show(t('Failed to load messages'), Toast.SHORT);
        if (pageNum === 1) {
          dispatch(setMessages({roomId, messages: []}));
        }
      } finally {
        dispatch(setLoadingEarlier({roomId, loading: false}));
      }
    },
    [userData.id, myData.auth_token, t, dispatch, roomId],
  );

  // Load initial messages
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  // Load more messages (pagination)
  const handleLoadEarlier = useCallback(async () => {
    if (loadingEarlier || !hasMoreMessages) return;

    dispatch(incrementPage({roomId}));
    const nextPage = page + 1;
    await fetchChat(nextPage, true);
  }, [fetchChat, page, loadingEarlier, hasMoreMessages, dispatch, roomId]);

  const sendMessage = useCallback(
    (message: ExtendedMessage): boolean => {
      if (!isConnected) {
        console.log('Cannot send message: Socket not connected');
        return false;
      }

      try {
        const enhancedMessage = {
          ...message,
          createdAt: message.createdAt || new Date(),
          status: MessageStatus.SENDING,
          user: {
            _id: message.senderId,
            name: message.user?.name || myData.nickname,
            avatar: message.user?.avatar || myData.profile_pic,
          },
        };

        emit('customEvent', [enhancedMessage]);

        setTimeout(() => {
          dispatch(
            updateMessageStatus({
              roomId,
              messageId: message._id,
              status: MessageStatus.SENT,
            }),
          );
        }, 500);

        return true;
      } catch (error) {
        console.error('Error sending message:', error);
        dispatch(
          updateMessageStatus({
            roomId,
            messageId: message._id,
            status: MessageStatus.FAILED,
          }),
        );
        return false;
      }
    },
    [isConnected, emit, myData, dispatch, roomId],
  );

  const handleSendTextMessage = useCallback(
    newMessages => {
      const messagesToSend = newMessages.map(msg => {
        const newId = msg._id;
        return {
          _id: newId,
          senderId: myData.id,
          receiverId: userData.id,
          text: msg.text || '',
          type: 'text',
          image: '',
          video: '',
          document: '',
          audio: '',
          parentMessageId: msg.replyToMessage?._id,
          parentMessage: msg.replyToMessage,
          roomId: roomId,
          createdAt: msg.createdAt || new Date(),
          user: prepareUserData(),
          status: isConnected ? MessageStatus.SENDING : MessageStatus.FAILED,
        };
      });

      messagesToSend.forEach(message => {
        dispatch(appendMessage({roomId, message}));
      });

      if (isConnected) {
        messagesToSend.forEach(message => {
          sendMessage(message);
        });
      }
    },
    [
      isConnected,
      myData.id,
      userData.id,
      roomId,
      prepareUserData,
      sendMessage,
      dispatch,
    ],
  );

  const handleRetryMessage = useCallback(
    async (messageId: string) => {
      const messageToRetry = messages.find(msg => msg._id === messageId);
      if (!messageToRetry) return;

      dispatch(
        updateMessageStatus({
          roomId,
          messageId,
          status: MessageStatus.SENDING,
        }),
      );

      try {
        if (!isConnected) {
          throw new Error('No connection');
        }

        const success = sendMessage(messageToRetry);

        if (!success) {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        dispatch(
          updateMessageStatus({
            roomId,
            messageId,
            status: MessageStatus.FAILED,
          }),
        );

        let errorMessage = t('Failed to send message. Please try again.');
        if (error instanceof Error) {
          if (error.message.includes('No connection')) {
            errorMessage = t('No internet connection. Please try again later.');
          }
        }

        Toast.show(errorMessage, Toast.SHORT);
      }
    },
    [messages, isConnected, sendMessage, dispatch, roomId, t],
  );

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      Alert.alert(
        t('Delete Message'),
        t('Are you sure you want to delete this message?'),
        [
          {text: t('Cancel'), style: 'cancel'},
          {
            text: t('Delete'),
            style: 'destructive',
            onPress: () => {
              dispatch(removeMessage({roomId, messageId}));

              if (isConnected) {
                emit(CHAT_EVENTS.MESSAGE_DELETED, {
                  messageId: messageId,
                  roomId: roomId,
                });
              }
            },
          },
        ],
      );
    },
    [isConnected, roomId, t, emit, dispatch],
  );

  const handleMessageReply = useCallback(
    (message: ExtendedMessage) => {
      Toast.show(t('Reply functionality coming soon'), Toast.SHORT);
    },
    [t],
  );

  const handleMessageForward = useCallback(
    (message: ExtendedMessage) => {
      Toast.show(t('Forward functionality coming soon'), Toast.SHORT);
    },
    [t],
  );

  return {
    messages,
    loadEarlier: loadingEarlier,
    loadingEarlier,
    hasMoreMessages,
    handleLoadEarlier,
    handleSendTextMessage,
    handleRetryMessage,
    handleDeleteMessage,
    handleMessageReply,
    handleMessageForward,
    sendMessage,
  };
};
