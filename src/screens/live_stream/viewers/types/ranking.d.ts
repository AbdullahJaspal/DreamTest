export interface RankingModelProps {
  show_model: {rankings: boolean};
  setShow_model: Dispatch<React.SetStateAction<{rankings: boolean}>>;
  playVideo: () => void;
}
export interface DurationSelectionTabProps {
  id: number;
  name: string;
  time_frame: string;
  onPress: () => void;
}

export interface UserDetails {
  id: number;
  nickname: string;
  username: string;
  profile_pic: string;
  gift_wallet?: number;
  rank?: number;
}

export interface UserRankData {
  id: number;
  user_id: number;
  diamonds: number;
  timeRange: string;
  createdAt: string;
  updatedAt: string;
  user: UserDetails;
}
