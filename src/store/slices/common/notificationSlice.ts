import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface NotificationState {
  notification_data: string;
  unread_notification: number;
}

const initialState: NotificationState = {
  notification_data: 'null',
  unread_notification: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotificationData(state, action: PayloadAction<string>) {
      state.notification_data = action.payload;
    },
    addUnreadNotification(state, action: PayloadAction<number>) {
      state.unread_notification = action.payload;
    },
  },
});

export const {addNotificationData, addUnreadNotification} =
  notificationSlice.actions;

export default notificationSlice.reducer;
