import {AccountType} from '../../enum/accountTypes';

export interface UserProfile {
  wallet: number;
  nickname?: string;
  username?: string;
  gender?: string;
  bio?: string;
  website?: string;
  dob?: string;
  profile_pic?: string;
  profile_video?: string;
  lat?: string;
  lang?: string;
  online?: boolean;
  verified?: boolean;
  city?: string;
  country?: string;
  fb_id?: string;
  emotion_state?: string;
  making_friend_intention?: string;
  hobbies?: string;
  person_height?: string;
  person_weight?: string;
  instagram?: string;
  you_tube?: string;
  facebook?: string;
  twitter?: string;
  occupation?: string;
  language?: string;
}

export interface PicturePost {
  id: number;
  user_id?: number;
  // Add more fields as needed
}

export interface PicturePostComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  // Add more fields as needed
}

export interface RechargeSheetProps {
  price: string;
  diamonds: number;
}

export interface SupervisorRole {
  he_can_mute_all_comment_in_the_live: boolean;
  he_can_temporarily_mute_user_comment_in_the_live: boolean;
}

export interface SecretarialRole extends SupervisorRole {
  he_can_delete_the_users_comment_in_the_live: boolean;
  he_can_temporarily_block_user_comment_in_the_live: boolean;
}

export interface AdministrationRole {
  he_can_mute_all_comment_in_the_live: boolean;
  he_can_delete_the_users_comment_in_the_live: boolean;
  he_can_temporarily_block_the_user_in_the_live: boolean;
  he_can_expel_users_in_the_live: boolean;
  he_can_turn_off_the_live_while: boolean;
  mute_voice_guests: boolean;
  kick_the_guest_out_of_the_live_post: boolean;
}

export interface GiftData {
  video_link: string;
  video_id: number;
}

export {AccountType};
