import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Modal,
  Pressable,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import FastImage from '@d11/react-native-fast-image';

// Components
import HeaderBottomSheetComment from './HeaderBottomSheetComment';
import FooterBottomSheetComment from './FooterBottomSheetComment';
import CommentScreen from './CommentScreen';

// Redux
import {
  setIsShowComment,
  setCommentId,
} from '../../../store/slices/ui/mainScreenSlice';
import {
  selectCurrentComment,
  selectIsShowComment,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

// API & Assets
import * as commentApi from '../../../apis/comment.api';
import {gifs} from '../../../assets/gifs';

const {width, height} = Dimensions.get('window');

const BOTTOM_SHEET_HEIGHT_RATIO = 0.65;
const BORDER_RADIUS = 24;
const ANIMATION_TYPE = 'slide';
const LOADER_SIZE = 45;

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  [key: string]: any;
}

const BottomSheetComment: React.FC = () => {
  const dispatch = useDispatch();

  const [comments, setComments] = useState<Comment[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const isShowComment = useAppSelector(selectIsShowComment);
  const currentComment = useAppSelector(selectCurrentComment);

  const fetchCommentData = useCallback(() => {
    if (!currentComment) return;

    setLoading(true);

    commentApi
      .fetchComment(currentComment)
      .then(response => {
        if (response?.comments) {
          setComments(response.comments.reverse());
        } else {
          setComments([]);
          console.log('No comments found or invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
        setComments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentComment]);

  useEffect(() => {
    if (isShowComment && currentComment) {
      fetchCommentData();
    }
  }, [fetchCommentData, isShowComment, currentComment]);

  useEffect(() => {
    if (isShowComment && currentComment && updateTrigger) {
      fetchCommentData();
    }
  }, [updateTrigger, fetchCommentData, isShowComment, currentComment]);

  const handleClose = useCallback(() => {
    dispatch(setIsShowComment(false));
    setComments([]);
    dispatch(setCommentId(''));
  }, [dispatch]);

  if (!isShowComment) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoidingView}>
      <Modal
        visible={isShowComment}
        transparent={true}
        animationType={ANIMATION_TYPE}
        onRequestClose={handleClose}
        statusBarTranslucent={true}>
        <View style={styles.modalContainer}>
          <Pressable
            onPress={handleClose}
            style={styles.backdrop}
            android_ripple={{color: 'rgba(0,0,0,0.1)'}}
          />

          <View style={styles.commentsContainer}>
            <View style={styles.headerContainer}>
              <HeaderBottomSheetComment
                handleClickClose={handleClose}
                no_of_comment={comments.length}
              />
            </View>

            <View style={styles.contentContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <FastImage
                    source={gifs.tiktokLoader}
                    style={styles.loader}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              ) : (
                <CommentScreen data={comments} />
              )}
            </View>

            <View style={styles.footerContainer}>
              <FooterBottomSheetComment
                currentComment={currentComment}
                setUpdate_comment={setUpdateTrigger}
                comment_data={undefined}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  commentsContainer: {
    height: height * BOTTOM_SHEET_HEIGHT_RATIO,
    backgroundColor: '#fff',
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eaeaea',
  },
  contentContainer: {
    flex: 1,
  },
  footerContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eaeaea',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  loader: {
    width: LOADER_SIZE,
    height: LOADER_SIZE,
  },
});

export default React.memo(BottomSheetComment);
