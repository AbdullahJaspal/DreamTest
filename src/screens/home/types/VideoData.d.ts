// User details interface
export interface User {
  id: number;
  username: string;
  profile_pic: string;
  bio: string;
  nickname: string;
  instagram: string | null;
  you_tube: string | null;
  facebook: string | null;
}

// Likes interface
export interface Like {
  id: number;
  reciever_id: number;
  sender_id: number;
}

// Link with image interface
export interface LinkWithImage {
  Image: string;
  links: string;
}

// Video interface
export interface Video {
  id: number;
  user_id: number;
  profile_pic: string;
  description: string;
  video: string;
  thum: string;
  gif: string | null;
  view: number;
  section: string | null;
  sound_id: number | null;
  privacy_type: string;
  allow_comments: boolean;
  allow_duet: number;
  block: boolean;
  duet_video_id: number | null;
  old_video_id: number | null;
  duration: number | null;
  promote: boolean;
  allow_stitch: boolean;
  like: number;
  comment: number;
  shared: number;
  diamond_value: number;
  video_topic: string | null;
  video_durations: number | null;
  title: string;
  remix_video_id: number | null;
  created: string;
  user: User;
  likes: Like[];
  rank: number;
  addlink?: string;
  linktext?: string;
  linkwithimg?: LinkWithImage[];
  commentPrivacy?: boolean;
}
