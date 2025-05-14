export const CHAT_EVENTS = {
  MESSAGE_SENT: 'customEvent',
  MESSAGE_RECEIVED: 'customEventResponse',
  MESSAGE_DELIVERED: 'messageDelivered',
  MESSAGE_READ: 'messageRead',
  MESSAGE_DELETED: 'messageDeleted',
  TYPING: 'typing',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
};

export const USER_EVENTS = {
  ONLINE_STATUS: 'online-display',
  ONLINE_USERS_LIST: 'online-people-list',
  USER_BLOCKED: 'block_user_from_admin_panel',
  USER_UNBLOCKED: 'unblock_user_from_admin_panel',
};

export const POST_EVENTS = {
  LIKE_POST: 'like_picture_root_post',
  UNLIKE_POST: 'dislike_picture_root_post',
  ADD_TO_FAVORITES: 'make_post_favourite',
  REMOVE_FROM_FAVORITES: 'remove_post_favourite',
  GET_FAVORITE_POSTS: 'get_users_favourite_posts',
  SHARE_POST: 'share_picture_root_post',
  MARK_INTERESTING: 'make_post_interested',
  MARK_NOT_INTERESTING: 'make_post_not_interested',
  MUTE_USER: 'mute_user_for_post',
  NEW_POST_VIEW: 'picture_post_new_view',
};

export const COMMENT_EVENTS = {
  JOIN_COMMENT_ROOM: 'picture-post-comment-join',
  LEAVE_COMMENT_ROOM: 'picture-post-comment-leave',
  NEW_COMMENT: 'picture-new-comment',
  COMMENT_DELETED: 'picture-comment-deleted',
  ADD_COMMENT: 'add-picture-comment',
  DELETE_COMMENT: 'delete-picture-comment',
  UPDATE_COMMENT: 'update-picture-comment',
};

export const SOCKET_EVENTS = {
  ...CHAT_EVENTS,
  ...USER_EVENTS,
  ...POST_EVENTS,
  ...COMMENT_EVENTS,
};
