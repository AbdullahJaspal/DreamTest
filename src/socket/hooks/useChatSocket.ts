import {useState, useEffect, useCallback} from 'react';
import {useSocket} from '../SocketProvider';
import {socketLogger} from '../utils/socketLogger';
import {generateRoomId} from '../utils/socketUtils';
import {CHAT_EVENTS} from '../events';

interface ChatMessage {
  _id: string;
  senderId: string | number;
  receiverId: string | number;
  text: string;
  type: string;
  image?: string;
  video?: string;
  document?: string;
  audio?: string;
  parentMessageId?: string;
  parentMessage?: any;
  createdAt: Date;
  status: string;
  user: {
    _id: string | number;
    name: string;
    avatar?: string;
  };
  roomId: string;
  [key: string]: any;
}

interface UseChatSocketOptions {
  userId: string | number;
  recipientId: string | number;
}

export const useChatSocket = ({userId, recipientId}: UseChatSocketOptions) => {
  const {isConnected, emit, on, joinRoom, leaveRoom, reconnect} = useSocket();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  const roomId = generateRoomId(userId, recipientId);

  useEffect(() => {
    if (isConnected) {
      joinRoom(roomId);
      socketLogger.log(`Joined chat room: ${roomId}`);

      return () => {
        leaveRoom(roomId);
        socketLogger.log(`Left chat room: ${roomId}`);
      };
    }
  }, [isConnected, roomId, joinRoom, leaveRoom]);

  useEffect(() => {
    if (!isConnected) return;

    // Only listening for typing status here since message handling is managed in useMessageHandlers
    const typingUnsubscribe = on(CHAT_EVENTS.TYPING, (data: any) => {
      if (data.senderId !== userId && data.roomId === roomId) {
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    const onlineUsersUnsubscribe = on(
      'online-people-list',
      (onlinePeopleList: any[]) => {
        const onlineUsersMap: Record<string, boolean> = {};
        onlinePeopleList.forEach(userId => {
          onlineUsersMap[userId] = true;
        });
        setOnlineUsers(onlineUsersMap);
      },
    );

    return () => {
      typingUnsubscribe();
      onlineUsersUnsubscribe();
    };
  }, [isConnected, userId, roomId, on]);

  const sendTypingStatus = useCallback(() => {
    if (isConnected) {
      emit(CHAT_EVENTS.TYPING, {
        senderId: userId,
        receiverId: recipientId,
        roomId: roomId,
      });
    }
  }, [isConnected, userId, recipientId, roomId, emit]);

  const isUserOnline = useCallback(
    (targetUserId: string | number) => {
      return !!onlineUsers[targetUserId];
    },
    [onlineUsers],
  );

  return {
    isTyping,
    isConnected,
    isUserOnline,
    sendTypingStatus,
    reconnect,
    onlineUsers,
  };
};

export default useChatSocket;
