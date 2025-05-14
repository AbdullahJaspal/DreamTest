import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import * as imagePostApi from '../../../apis/imagePost';
import {useSocket} from '../../../socket/SocketProvider';
import {COMMENT_EVENTS} from '../../../socket/events';

import {
  descreaseTotalNoOfComment,
  increaseTotalNoOfComment,
} from '../../../store/slices/content/pictureSlice';
import {selectMyProfileData} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

import RenderComment from './RenderComment';
import {PicturePostComment} from '../types/picturePost';

const {width, height} = Dimensions.get('window');

interface CommentBodyProps {
  root_post_id: number;
}

const findAndRemove = (
  commentsList: PicturePostComment[],
  comment_id: number,
): PicturePostComment[] => {
  return commentsList
    .filter(comment => comment.id !== comment_id)
    .map(comment => {
      // Check for replies recursively
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: findAndRemove(comment.replies, comment_id),
        };
      }
      return comment;
    });
};

const findAndInsert = (
  commentsList: PicturePostComment[],
  parent_id: number,
  data: PicturePostComment,
): PicturePostComment[] => {
  return commentsList.map(comment => {
    if (comment.id === parent_id) {
      return {
        ...comment,
        replies: comment.replies ? [data, ...comment.replies] : [data],
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: findAndInsert(comment.replies, parent_id, data),
      };
    }

    return comment;
  });
};

const CommentBody: React.FC<CommentBodyProps> = ({root_post_id}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const pageSize = 10;
  const my_data = useAppSelector(selectMyProfileData);

  // Use our centralized socket hook
  const {isConnected, emit, on} = useSocket();

  const [commentData, setCommentData] = useState<PicturePostComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState<number>(1);

  // handle getting comments from the backend
  const handleGetAllComment = useCallback(async () => {
    try {
      const result = await imagePostApi.getPicturePostComment(
        my_data?.auth_token,
        root_post_id,
        pageNo,
        pageSize,
      );
      setCommentData(prev =>
        pageNo === 1 ? result?.payload : [...prev, ...result?.payload],
      );
    } catch (error) {
      console.log('Error getting all comment', error);
    } finally {
      setLoading(false);
    }
  }, [my_data?.auth_token, pageNo, root_post_id]);

  useEffect(() => {
    handleGetAllComment();
  }, [handleGetAllComment]);

  // handle when end reached
  function handleOnEndReached(_info: {distanceFromEnd: number}): void {
    setPageNo(p => p + 1);
  }

  // Setup socket event listeners for comments
  useEffect(() => {
    if (!isConnected) return;

    // Join the comment room for this post
    emit(COMMENT_EVENTS.JOIN_COMMENT_ROOM, {root_post_id});

    // Handle new comments
    const newCommentUnsubscribe = on(
      COMMENT_EVENTS.NEW_COMMENT,
      (data: PicturePostComment) => {
        try {
          const parentId = data?.parent_id;

          setCommentData(prev => {
            if (parentId === null) {
              // Add new top-level comment
              return [data, ...prev];
            } else {
              // Insert reply into the correct place
              return findAndInsert(prev, parentId, data);
            }
          });

          dispatch(increaseTotalNoOfComment());
        } catch (error) {
          console.log(
            'Error generated while inserting new comment to the list',
            error,
          );
        }
      },
    );

    // Handle deleted comments
    const commentDeletedUnsubscribe = on(
      COMMENT_EVENTS.COMMENT_DELETED,
      (data: {commentId: number}) => {
        setCommentData(prev => findAndRemove(prev, data?.commentId));
        dispatch(descreaseTotalNoOfComment());
      },
    );

    // Cleanup function - leave room and remove listeners
    return () => {
      emit(COMMENT_EVENTS.LEAVE_COMMENT_ROOM, {root_post_id});
      newCommentUnsubscribe();
      commentDeletedUnsubscribe();
    };
  }, [isConnected, emit, on, root_post_id, dispatch]);

  // Functions to add, edit, delete comments
  const handleAddComment = useCallback(
    (text: string, parentId: number | null = null) => {
      if (!isConnected) {
        console.log('Socket not connected, cannot add comment');
        return false;
      }

      const commentData = {
        root_post_id,
        parent_id: parentId,
        text,
        user_id: my_data?.id,
      };

      emit(COMMENT_EVENTS.ADD_COMMENT, commentData);
      return true;
    },
    [isConnected, emit, root_post_id, my_data?.id],
  );

  const handleDeleteComment = useCallback(
    (commentId: number) => {
      if (!isConnected) {
        console.log('Socket not connected, cannot delete comment');
        return false;
      }

      emit(COMMENT_EVENTS.DELETE_COMMENT, {
        commentId,
        root_post_id,
      });
      return true;
    },
    [isConnected, emit, root_post_id],
  );

  const handleUpdateComment = useCallback(
    (commentId: number, text: string) => {
      if (!isConnected) {
        console.log('Socket not connected, cannot update comment');
        return false;
      }

      emit(COMMENT_EVENTS.UPDATE_COMMENT, {
        commentId,
        text,
        root_post_id,
      });
      return true;
    },
    [isConnected, emit, root_post_id],
  );

  return (
    <View style={styles.main_container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      ) : commentData.length > 0 ? (
        <FlatList
          data={commentData}
          keyExtractor={item => item.id.toString()}
          onEndReached={handleOnEndReached}
          ListHeaderComponent={() => <View style={styles.header} />}
          ListFooterComponent={() => <View style={styles.footer} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReachedThreshold={0.2}
          snapToAlignment="start"
          decelerationRate={'normal'}
          windowSize={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          renderItem={({item, index}) => (
            <RenderComment
              item={item}
              index={index}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
              onReply={handleAddComment}
            />
          )}
        />
      ) : (
        <View style={styles.loading}>
          <Text style={styles.no_comment_txt}>
            {t('No comments yet')}. {'\n'}
            {t('Be the first to share your thoughts')}!
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(CommentBody);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
  },
  header: {
    height: 10,
  },
  footer: {
    height: 60,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  no_comment_txt: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
});
