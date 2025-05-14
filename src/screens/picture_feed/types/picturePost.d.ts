export interface PicturePost {
  id: number;
  description: string;
  like: number;
  share: number;
  comment: number;
  view: number;
  allow_comments: boolean;
  createdAt: string;
  updatedAt: string;
  location: Location;
  location_name: string;
  user_id: number;
  user: User;
  NestedPicturePosts: NestedPicturePost[];
  respectedRootPostLike: PostLike[];
  privacy_type?: string;
  post_topic?: string;
  tag_user_ids?: number[];
}

export interface PostLike {
  sender_id: number;
}
export interface Location {
  lat: number;
  long: number;
}

export interface User {
  id: number;
  username: string;
  profile_pic: string;
  bio: string | null;
  nickname: string;
  verified: boolean;
  badge?: {
    id: string;
    Badge_type: AccountType;
  };
}

export interface NestedPicturePost {
  id: number;
  img_url: string;
  like: number;
  root_picture_post_id: number;
  createdAt: string;
  updatedAt: string;
  respectedNestedPostLike: PostLike[];
}

interface ID {
  id: number;
}

export interface PicturePostComment {
  comment_data: string;
  createdAt: string;
  dislike: number;
  id: number;
  likes: number;
  parent_id: number | null;
  root_picture_post_id: number;
  rose: number;
  updatedAt: string;
  user_id: number;
  user: User;
  replies?: PicturePostComment[];
  hasMoreReplies?: boolean;
  PicturePostCommentDisLikes: ID[];
  PicturePostCommentLikes: ID[];
}
