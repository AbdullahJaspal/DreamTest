import {useState, useEffect, useCallback} from 'react';
import {useSocket} from '../SocketProvider';
import {socketLogger} from '../utils/socketLogger';

export const usePostSocket = () => {
  const {isConnected, emit, on} = useSocket();
  const [onlinePeopleList, setOnlinePeopleList] = useState<any[]>([]);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = on('online-people-list', (data: any[]) => {
      setOnlinePeopleList(data);
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, on]);

  const likePost = useCallback(
    (postId: number, postUserId: number) => {
      if (!isConnected) {
        socketLogger.warn('Cannot like post: Socket not connected');
        return false;
      }

      emit('like_picture_root_post', {
        post_id: postId,
        post_user_id: postUserId,
      });

      return true;
    },
    [isConnected, emit],
  );

  const unlikePost = useCallback(
    (postId: number, postUserId: number) => {
      if (!isConnected) {
        socketLogger.warn('Cannot unlike post: Socket not connected');
        return false;
      }

      emit('dislike_picture_root_post', {
        post_id: postId,
        post_user_id: postUserId,
      });

      return true;
    },
    [isConnected, emit],
  );

  const addToFavorites = useCallback(
    (
      postId: number,
      postUserId: number,
      callback?: (response: any) => void,
    ) => {
      if (!isConnected) {
        socketLogger.warn('Cannot add to favorites: Socket not connected');
        return false;
      }

      emit(
        'make_post_favourite',
        {post_id: postId, post_user_id: postUserId},
        callback,
      );

      return true;
    },
    [isConnected, emit],
  );

  const removeFromFavorites = useCallback(
    (postId: number, callback?: (response: any) => void) => {
      if (!isConnected) {
        socketLogger.warn('Cannot remove from favorites: Socket not connected');
        return false;
      }

      emit('remove_post_favourite', {post_id: postId}, callback);

      return true;
    },
    [isConnected, emit],
  );

  const getFavoritePosts = useCallback(
    (callback?: (response: any) => void) => {
      if (!isConnected) {
        socketLogger.warn('Cannot get favorites: Socket not connected');
        return false;
      }

      emit('get_users_favourite_posts', {}, callback);

      return true;
    },
    [isConnected, emit],
  );

  const sharePost = useCallback(
    (
      postId: number,
      postUserId: number,
      callback?: (response: any) => void,
    ) => {
      if (!isConnected) {
        socketLogger.warn('Cannot share post: Socket not connected');
        return false;
      }

      emit(
        'share_picture_root_post',
        {post_id: postId, post_user_id: postUserId},
        callback,
      );

      return true;
    },
    [isConnected, emit],
  );

  const markPostInteresting = useCallback(
    (
      postId: number,
      postUserId: number,
      callback?: (response: any) => void,
    ) => {
      if (!isConnected) {
        socketLogger.warn(
          'Cannot mark post as interesting: Socket not connected',
        );
        return false;
      }

      emit(
        'make_post_interested',
        {post_id: postId, post_user_id: postUserId},
        callback,
      );

      return true;
    },
    [isConnected, emit],
  );

  const markPostNotInteresting = useCallback(
    (
      postId: number,
      postUserId: number,
      callback?: (response: any) => void,
    ) => {
      if (!isConnected) {
        socketLogger.warn(
          'Cannot mark post as not interesting: Socket not connected',
        );
        return false;
      }

      emit(
        'make_post_not_interested',
        {post_id: postId, post_user_id: postUserId},
        callback,
      );

      return true;
    },
    [isConnected, emit],
  );

  const muteUser = useCallback(
    (
      postId: number,
      postUserId: number,
      callback?: (response: any) => void,
    ) => {
      if (!isConnected) {
        socketLogger.warn('Cannot mute user: Socket not connected');
        return false;
      }

      emit(
        'mute_user_for_post',
        {post_id: postId, post_user_id: postUserId},
        callback,
      );

      return true;
    },
    [isConnected, emit],
  );

  return {
    onlinePeopleList,
    likePost,
    unlikePost,
    addToFavorites,
    removeFromFavorites,
    getFavoritePosts,
    sharePost,
    markPostInteresting,
    markPostNotInteresting,
    muteUser,
  };
};

export default usePostSocket;
