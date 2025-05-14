export interface User {
  id: number;
  nickname: string;
  profile_pic: string;
  username: string;
}

export interface NotificationItem {
  createdAt: string;
  id: number;
  message: string;
  notification_for: string;
  read: boolean;
  receiver_id: number;
  respected_type_id: number | null;
  sender_id: number;
  type: string;
  updatedAt: string;
  user: User;
}
