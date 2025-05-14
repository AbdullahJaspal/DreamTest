import {useState, useEffect, useCallback} from 'react';
import {useSocket} from '../SocketProvider';
import {socketLogger} from '../utils/socketLogger';

interface CommentData {
  id: number;
  text: string;
  parent_id: number | null;
  user: {
    id: number;
    nickname: string;
    profile_pic: string;
  };
  replies?: CommentData[];
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export const useCommentSocket = (rootPostId: number) => {
  const {isConnected, emit, on, joinRoom, leaveRoom} = useSocket();
  const [comments, setComments] = useState<CommentData[]>([]);

  const findAndRemove = useCallback(
    (commentsList: CommentData[], commentId: number) => {
      return commentsList
        .filter(comment => comment.id !== commentId)
        .map(comment => {
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: findAndRemove(comment.replies, commentId),
            };
          }
          return comment;
        });
    },
    [],
  );

  const findAndInsert = useCallback(
    (
      commentsList: CommentData[],
      parentId: number | null,
      data: CommentData,
    ) => {
      if (parentId === null) {
        // Top-level comment
        return [data, ...commentsList];
      }

      return commentsList.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies ? [data, ...comment.replies] : [data],
          };
        }

        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: findAndInsert(comment.replies, parentId, data),
          };
        }

        return comment;
      });
    },
    [],
  );

  // Join comment room on mount and leave on unmount
  useEffect(() => {
    if (isConnected && rootPostId) {
      const room = `picture-post-comments-${rootPostId}`;
      joinRoom(room);
      emit('picture-post-comment-join', {root_post_id: rootPostId});

      return () => {
        emit('picture-post-comment-leave', {root_post_id: rootPostId});
        leaveRoom(room);
      };
    }
  }, [isConnected, rootPostId, joinRoom, leaveRoom, emit]);

  // Listen for new comments
  useEffect(() => {
    if (!isConnected) return;

    const newCommentUnsubscribe = on(
      'picture-new-comment',
      (data: CommentData) => {
        setComments(prev => findAndInsert(prev, data.parent_id, data));
      },
    );

    const commentDeletedUnsubscribe = on(
      'picture-comment-deleted',
      (data: {commentId: number}) => {
        setComments(prev => findAndRemove(prev, data.commentId));
      },
    );

    return () => {
      newCommentUnsubscribe();
      commentDeletedUnsubscribe();
    };
  }, [isConnected, on, findAndInsert, findAndRemove]);

  // Add a comment
  const addComment = useCallback(
    (text: string, parentId: number | null = null) => {
      if (!isConnected) {
        socketLogger.warn('Cannot add comment: Socket not connected');
        return false;
      }

      emit('add-picture-comment', {
        root_post_id: rootPostId,
        parent_id: parentId,
        text: text,
      });

      return true;
    },
    [isConnected, rootPostId, emit],
  );

  // Delete a comment
  const deleteComment = useCallback(
    (commentId: number) => {
      if (!isConnected) {
        socketLogger.warn('Cannot delete comment: Socket not connected');
        return false;
      }

      emit('delete-picture-comment', {
        comment_id: commentId,
        root_post_id: rootPostId,
      });

      return true;
    },
    [isConnected, rootPostId, emit],
  );

  // Update a comment
  const updateComment = useCallback(
    (commentId: number, text: string) => {
      if (!isConnected) {
        socketLogger.warn('Cannot update comment: Socket not connected');
        return false;
      }

      emit('update-picture-comment', {
        comment_id: commentId,
        root_post_id: rootPostId,
        text: text,
      });

      return true;
    },
    [isConnected, rootPostId, emit],
  );

  // Set initial comments
  const setInitialComments = useCallback((initialComments: CommentData[]) => {
    setComments(initialComments);
  }, []);

  return {
    comments,
    addComment,
    deleteComment,
    updateComment,
    setInitialComments,
  };
};

export default useCommentSocket;
