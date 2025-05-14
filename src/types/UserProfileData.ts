import {AccountType} from '../enum/accountTypes';

export type UserProfile = {
  account_type?: 'basic' | 'premium';
  active?: 0 | 1;
  auth_token?: string | null;
  bio?: string | null;
  city?: string | null;
  city_id?: number | null;
  country?: string;
  country_id?: number | null;
  creationDate?: string;
  device?: string | null;
  device_token?: string | null;
  dob?: string | null;
  email?: string;
  emotion_state?:
    | 'Single'
    | 'In a Relationship'
    | 'Complicated'
    | 'Married'
    | 'Divorced'
    | string;
  facebook?: string | null;
  fb_id?: string | null;
  firebase_uid?: string;
  gender?: 'Male' | 'Female' | 'Other' | null;
  gift_wallet?: number;
  hobbies?: string | null;
  id?: number;
  instagram?: string | null;
  ip?: string;
  lang?: string | null;
  language?: string | null;
  lat?: number | null;
  making_friend_intention?: string[];
  nickname?: string;
  occupation?: string | null;
  online?: boolean | null;
  paypal?: string | null;
  person_height?: number | null;
  person_weight?: number | null;
  phone?: string | null;
  profile_pic?: string;
  profile_pic_small?: string | null;
  profile_video?: string | null;
  reset_wallet_datetime?: string | null;
  role?: 'user' | 'admin' | 'moderator' | string;
  social?: string | null;
  social_id?: string | null;
  state_id?: number | null;
  token?: string | null;
  twitter?: string | null;
  username?: string;
  verified?: boolean | null;
  version?: string | null;
  wallet: number;
  website?: string | null;
  you_tube?: string | null;
  badge?: {
    id: string;
    Badge_type: AccountType;
    verified: boolean;
  };
};
