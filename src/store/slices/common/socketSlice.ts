import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../store';

interface OnlineUser {
  id: number | string;
  lastSeen: Date;
}

interface SocketState {
  isConnected: boolean;
  connectionError: string | null;
  onlineUsers: Record<string, OnlineUser>;
  lastConnected: Date | null;
  reconnectAttempts: number;
}

const initialState: SocketState = {
  isConnected: false,
  connectionError: null,
  onlineUsers: {},
  lastConnected: null,
  reconnectAttempts: 0,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.lastConnected = new Date();
        state.reconnectAttempts = 0;
        state.connectionError = null;
      }
    },

    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
    },

    incrementReconnectAttempts: state => {
      state.reconnectAttempts += 1;
    },

    updateOnlineUsers: (state, action: PayloadAction<number[] | string[]>) => {
      const newOnlineUsers: Record<string, OnlineUser> = {};

      action.payload.forEach(userId => {
        newOnlineUsers[userId.toString()] = {
          id: userId,
          lastSeen: new Date(),
        };
      });

      state.onlineUsers = newOnlineUsers;
    },

    updateUserLastSeen: (state, action: PayloadAction<number | string>) => {
      const userId = action.payload.toString();
      if (state.onlineUsers[userId]) {
        state.onlineUsers[userId].lastSeen = new Date();
      } else {
        state.onlineUsers[userId] = {
          id: action.payload,
          lastSeen: new Date(),
        };
      }
    },

    clearOnlineUsers: state => {
      state.onlineUsers = {};
    },

    resetConnectionState: state => {
      state.isConnected = false;
      state.connectionError = null;
      state.reconnectAttempts = 0;
    },
  },
});

export const {
  setConnectionStatus,
  setConnectionError,
  incrementReconnectAttempts,
  updateOnlineUsers,
  updateUserLastSeen,
  clearOnlineUsers,
  resetConnectionState,
} = socketSlice.actions;

export const selectIsConnected = (state: RootState) => state.socket.isConnected;
export const selectConnectionError = (state: RootState) =>
  state.socket.connectionError;
export const selectOnlineUsers = (state: RootState) => state.socket.onlineUsers;
export const selectReconnectAttempts = (state: RootState) =>
  state.socket.reconnectAttempts;

export const selectIsUserOnline =
  (userId: number | string) => (state: RootState) =>
    !!state.socket.onlineUsers[userId.toString()];

export default socketSlice.reducer;
