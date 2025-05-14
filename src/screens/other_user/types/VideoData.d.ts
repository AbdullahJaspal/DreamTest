export interface CountryData {
  country_name: string;
  flagurl: string;
  hide_location_in_profile: boolean;
}

export interface UserRelationship {
  createdAt: string;
  id: number;
  receiver_id: number;
  sender_id: number;
  updatedAt: string;
  way_of_following: string | null;
}

export interface User {
  UserRelationship?: UserRelationship;
  id: number;
  nickname: string | null;
  profile_pic: string;
  username: string;
}

export interface UserFollowers extends User {}

export interface VideoData {
  allow_comments: boolean;
  allow_duet: number;
  allow_stitch: boolean;
  block: boolean;
  comment: number;
  created: string;
  description: string;
  diamond_value: number | null;
  duet_video_id: string | null;
  duration: number | null;
  gif: string | null;
  id: number;
  like: number;
  old_video_id: string | null;
  privacy_type: 'public' | 'private';
  profile_pic: string;
  promote: boolean;
  remix_video_id: string | null;
  section: string | null;
  shared: number;
  sound_id: string | null;
  thum: string;
  title: string;
  user_id: number;
  video: string;
  video_durations: number | null;
  video_topic: string | null;
  view: number;
}

export interface StarIconProps {
  no_of_star: number;
  show_yellow_icon: boolean;
}
