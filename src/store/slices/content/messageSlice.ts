import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  MessageStatus,
  ExtendedMessage,
  generateUniqueId,
} from '../../../utils/chatUtils';

// Define the state interface
interface MessagesState {
  messages: Record<string, ExtendedMessage[]>;
  loadingEarlier: Record<string, boolean>;
  hasMoreMessages: Record<string, boolean>;
  page: Record<string, number>;
  isUploading: Record<string, boolean>;
}

// Initial state
const initialState: MessagesState = {
  messages: {},
  loadingEarlier: {},
  hasMoreMessages: {},
  page: {},
  isUploading: {},
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Initialize a room's message state
    initRoomMessages(state, action: PayloadAction<{roomId: string}>) {
      const {roomId} = action.payload;

      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      state.loadingEarlier[roomId] = false;
      state.hasMoreMessages[roomId] = true;
      state.page[roomId] = 1;
      state.isUploading[roomId] = false;
    },

    // Set all messages for a room (usually for initial load)
    setMessages(
      state,
      action: PayloadAction<{roomId: string; messages: ExtendedMessage[]}>,
    ) {
      const {roomId, messages} = action.payload;
      state.messages[roomId] = messages;
    },

    // Append a new message to the chat (for sending)
    appendMessage(
      state,
      action: PayloadAction<{roomId: string; message: ExtendedMessage}>,
    ) {
      const {roomId, message} = action.payload;

      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      state.messages[roomId] = GiftedChat.append(state.messages[roomId], [
        message,
      ]);
    },

    // Append multiple messages (for batch operations or pagination)
    appendMessages(
      state,
      action: PayloadAction<{roomId: string; messages: ExtendedMessage[]}>,
    ) {
      const {roomId, messages} = action.payload;

      if (!state.messages[roomId]) {
        state.messages[roomId] = [];
      }

      if (messages.length > 0) {
        state.messages[roomId] = GiftedChat.append(
          state.messages[roomId].filter(
            m => m._id !== 'loading' && m._id !== 'typing',
          ),
          messages,
        );
      }
    },

    // Update a specific message (for status updates)
    updateMessage(
      state,
      action: PayloadAction<{
        roomId: string;
        messageId: string;
        updates: Partial<ExtendedMessage>;
        uploadProgress?: number;
      }>,
    ) {
      const {roomId, messageId, updates, uploadProgress} = action.payload;

      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].map(msg =>
          msg._id === messageId
            ? {
                ...msg,
                ...updates,
                uploadProgress: uploadProgress ?? msg.uploadProgress,
              }
            : msg,
        );
      }
    },

    // Update message status
    updateMessageStatus(
      state,
      action: PayloadAction<{
        roomId: string;
        messageId: string;
        status: MessageStatus;
        uploadProgress?: number;
      }>,
    ) {
      const {roomId, messageId, status, uploadProgress} = action.payload;

      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].map(msg =>
          msg._id === messageId
            ? {
                ...msg,
                status,
                uploadProgress: uploadProgress ?? msg.uploadProgress,
              }
            : msg,
        );
      }
    },

    // Remove a message
    removeMessage(
      state,
      action: PayloadAction<{roomId: string; messageId: string}>,
    ) {
      const {roomId, messageId} = action.payload;

      if (state.messages[roomId]) {
        state.messages[roomId] = state.messages[roomId].filter(
          msg => msg._id !== messageId,
        );
      }
    },

    // Set loading earlier status
    setLoadingEarlier(
      state,
      action: PayloadAction<{roomId: string; loading: boolean}>,
    ) {
      const {roomId, loading} = action.payload;
      state.loadingEarlier[roomId] = loading;
    },

    // Set if there are more messages to load
    setHasMoreMessages(
      state,
      action: PayloadAction<{roomId: string; hasMore: boolean}>,
    ) {
      const {roomId, hasMore} = action.payload;
      state.hasMoreMessages[roomId] = hasMore;
    },

    // Increment the page number (for pagination)
    incrementPage(state, action: PayloadAction<{roomId: string}>) {
      const {roomId} = action.payload;
      state.page[roomId] = (state.page[roomId] || 1) + 1;
    },

    // Set upload status
    setUploading(
      state,
      action: PayloadAction<{roomId: string; isUploading: boolean}>,
    ) {
      const {roomId, isUploading} = action.payload;
      state.isUploading[roomId] = isUploading;
    },
  },
});

export const {
  initRoomMessages,
  setMessages,
  appendMessage,
  appendMessages,
  updateMessage,
  updateMessageStatus,
  removeMessage,
  setLoadingEarlier,
  setHasMoreMessages,
  incrementPage,
  setUploading,
} = messageSlice.actions;

export default messageSlice.reducer;
