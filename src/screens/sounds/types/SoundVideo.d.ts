import {Video} from '../../home/types/VideoData';

export interface SoundVideoData extends Video {
  user: User;
}

interface User {
  id: number;
  nickname: string;
  profile_pic: string;
  username: string;
}
