interface User {
  id: number;
  nickname: string;
  profile_pic: string;
  username: string;
}

interface Video {
  duration: number | null;
  id: number;
}

export interface AudioItem {
  audio_url: string;
  createdAt: string;
  id: number;
  isFavourited: boolean;
  updatedAt: string;
  user: User;
  user_id: number;
  video: Video;
  video_id: number;
}

export interface TaggedDataProps {
  user_id: number;
  username: string;
}
