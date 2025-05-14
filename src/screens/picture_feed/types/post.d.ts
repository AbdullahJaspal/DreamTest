export enum PrivacyType {
  public = 'public',
  private = 'private',
  friends = 'friends',
}

export enum PostType {
  RootPicturePost = 'root_picture_post',
  SinglePicturePost = 'nested_picture_post',
}

export enum SharingFrom {
  android = 'android',
  ios = 'ios',
  web = 'web',
}

export interface PostLocation {
  latitude: number;
  longitude: number;
}

// 1. Table Name = root_picture_post
export interface RootPicturePost {
  id: number;
  user_id: number;
  title: string;
  description: string;
  view: number;
  privacy_type: PrivacyType;
  allow_comments: boolean;
  block: boolean;
  like: number;
  comment: number;
  share: number;
  location: PostLocation;
  location_name: string;
}

// 2. Table Name = single_picture_post
export interface NestedPicturePost {
  id: number;
  root_picture_post_id: number;
  img_url: string;
  like: number;
}

// 3. Table Name = picture_post_comments
export interface PicturePostComment {
  id: number;
  root_picture_post_id: number;
  user_id: number;
  parent_id: number;
  comment_data: string;
  likes: number;
  dislike: number;
  rose: number;
}

// 4. Table Name = picture_post_comments_rose
export interface PicturePostCommentRose {
  comment_id: number;
  sender_id: number;
  diamond_value: number;
}

// 5. Table Name = picture_post_comments_like
export interface PicturePostCommentLike {
  comment_id: number;
  sender_id: number;
}

// 6. Table Name = picture_post_comments_dislike
export interface PicturePostCommentDisLike {
  comment_id: number;
  sender_id: number;
}

// 7. Table Name = picture_post_likes
export interface PicturePostLike {
  post_type: PostType;
  respected_post_id: number;
  sender_id: number;
}

// 8. Table Name = picture_post_views
export interface PicturePostViews {
  picture_post_id: number;
  sender_id: number;
}

// 9. Table Name = picture_post_views
export interface PicturePostFavourite {
  picture_post_id: number;
  sender_id: number;
}

// 10. Table Name = picture_post_report
export interface PicturePostReport {
  id: number;
  picture_post_id: number;
  reporter_id: number;
  reason: string;
  description: string;
  supportive_videos_url: string;
  supportive_image_url: string;
}

// 11. Table Name = picture_post_share
export interface PicturePostShare {
  id: number;
  picture_post_id: number;
  user_id: number;
  sharing_platform: string;
  sharing_from: SharingFrom;
  picture_token: string;
}
