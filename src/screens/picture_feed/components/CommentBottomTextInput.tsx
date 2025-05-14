import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  LayoutAnimation,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import * as imagePostApi from '../../../apis/imagePost';
import * as userapi from '../../../apis/userApi';

import {COLOR, SPACING} from '../../../configs/styles';
import Icon from '../../../components/Icon';

import CommentHeader from './CommentHeader';

import {
  setEnableEdit,
  setPostComment,
} from '../../../store/slices/content/pictureSlice';

import {useSocket} from '../../../socket/SocketProvider';
import {COMMENT_EVENTS} from '../../../socket/events';

import {
  selectEnableEditComment,
  selectMyProfileData,
  selectSelectedCommentData,
} from '../../../store/selectors';
import {icons} from '../../../assets/icons';

interface CommentBottomTextInputProps {
  root_post_id: number;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const {width} = Dimensions.get('screen');
const CommentBottomTextInput: React.FC<CommentBottomTextInputProps> = ({
  root_post_id,
}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const txtInputRef = useRef<TextInput>(null);
  const my_data = useAppSelector(selectMyProfileData);
  const postComment = useAppSelector(selectSelectedCommentData);
  const isEditEnabled = useAppSelector(selectEnableEditComment);

  // Use our centralized socket hook
  const {isConnected, emit, on} = useSocket();

  const [txtComment, setTxtComment] = useState<string>('');
  const commentDisplay = useRef<boolean>(false);
  const [heightKeyboardStatus, setHeightKeyboardStatus] = useState(25);
  const [isMuted, setIsMuted] = useState(false);

  // KeyBoard display handler
  const handleKeyboardShow = useCallback(
    (e: {endCoordinates: {height: number}}) => {
      LayoutAnimation.easeInEaseOut();
      setHeightKeyboardStatus(p => p + e.endCoordinates.height);
    },
    [],
  );

  const handleKeyboardHide = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setHeightKeyboardStatus(25);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  // Send comment via socket
  const handleSendComment = useCallback(async () => {
    if (!txtComment.trim() || !isConnected || commentDisplay.current) return;

    try {
      commentDisplay.current = true;

      // Create comment data object
      const commentData = {
        root_post_id: root_post_id,
        parent_id: postComment ? postComment.id : null,
        text: txtComment,
        user_id: my_data?.id,
      };

      // Emit event through the socket
      emit(COMMENT_EVENTS.ADD_COMMENT, commentData);

      // Also call the API for redundancy/backup
      await imagePostApi.sendPicturePostComment(my_data?.auth_token, {
        root_picture_post_id: root_post_id,
        parent_id: postComment ? postComment.id : undefined,
        comment_data: txtComment,
      });
    } catch (error) {
      console.log('Error sending picture post comment', error);
    } finally {
      setTxtComment('');
      commentDisplay.current = false;
      handleReplyCrossClick();
    }
  }, [
    my_data?.auth_token,
    my_data?.id,
    root_post_id,
    txtComment,
    postComment,
    isConnected,
    emit,
  ]);

  const handleEditCommentSend = useCallback(async () => {
    if (!txtComment.trim() || !isConnected || commentDisplay.current) return;

    try {
      commentDisplay.current = true;

      // Create the update data
      const updateData = {
        commentId: postComment.id,
        text: txtComment,
        root_post_id: root_post_id,
      };

      // Emit event through the socket
      emit(COMMENT_EVENTS.UPDATE_COMMENT, updateData);

      // Also call the API for redundancy/backup
      await imagePostApi.editCommentOrCommentReply(my_data?.auth_token, {
        comment_id: postComment.id,
        updated_txt: txtComment,
      });
    } catch (error) {
      console.log('Error generated while editing comment', error);
    } finally {
      setTxtComment('');
      commentDisplay.current = false;
      handleReplyCrossClick();
    }
  }, [
    txtComment,
    postComment,
    isConnected,
    emit,
    root_post_id,
    my_data?.auth_token,
  ]);

  // Animation styles
  const inputWidthStyle = useAnimatedStyle(() => {
    return {
      width: txtComment ? withTiming(width - 50) : withTiming(width),
      marginRight: txtComment ? withTiming(5) : withTiming(0),
    };
  }, [txtComment]);

  const bottomHeight = useCallback(() => {
    return {bottom: heightKeyboardStatus};
  }, [heightKeyboardStatus]);

  function handleReplyCrossClick(): void {
    dispatch(setPostComment(null));
    dispatch(setEnableEdit(false));
  }

  const handleAutoFocus = useCallback(() => {
    if (txtInputRef.current) {
      txtInputRef.current.focus();
    }
  }, [postComment]);

  useEffect(() => {
    handleAutoFocus();
  }, [handleAutoFocus]);

  // Handle mute status with socket implementation
  useEffect(() => {
    if (!isConnected) return;

    // Setup listener for comment mute status updates
    const muteStatusUnsubscribe = on(
      'mute-comment-status-update',
      (data: {is_muted: boolean; user_id: string}) => {
        if (data.user_id === my_data?.id) {
          setIsMuted(data.is_muted);
        }
      },
    );

    // Join the mute comment room
    emit('mute-comment-join', {user_id: my_data?.id});

    // Fetch initial mute status
    IsMuteUserComment();

    // Cleanup function
    return () => {
      emit('mute-comment-leave', {user_id: my_data?.id});
      muteStatusUnsubscribe();
    };
  }, [isConnected, my_data?.id, emit, on]);

  // Check if user is muted for comments
  const IsMuteUserComment = useCallback(async () => {
    try {
      const mute_for = 'feed';
      const result = await userapi.IsUserCommentMute(
        my_data?.auth_token,
        mute_for,
      );

      if (result && result.is_active) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    } catch (error) {
      console.error('Error checking mute status:', error);
      setIsMuted(false);
    }
  }, [my_data?.auth_token]);

  return (
    <View style={[styles.main_container, bottomHeight()]}>
      <Animated.View style={[inputWidthStyle]}>
        {postComment && (
          <View style={styles.reply_view}>
            <CommentHeader
              item={postComment}
              index={0}
              showCrossIcon={true}
              handleCrossIconPress={handleReplyCrossClick}
            />
          </View>
        )}
        <AnimatedTextInput
          placeholder={
            isMuted
              ? t('You are muted and cannot comment')
              : t('Type Comment...')
          }
          placeholderTextColor={'#020202'}
          value={txtComment}
          onChangeText={text => setTxtComment(text)}
          style={[styles.input, inputWidthStyle]}
          multiline={true}
          maxLength={500}
          ref={txtInputRef}
          editable={!isMuted}
        />
      </Animated.View>

      {txtComment ? (
        <Icon
          onPress={isEditEnabled ? handleEditCommentSend : handleSendComment}
          source={icons.sendButton}
          width={40}
          height={40}
        />
      ) : null}
    </View>
  );
};

export default React.memo(CommentBottomTextInput);

const styles = StyleSheet.create({
  main_container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: '#fff',
  },
  inputComment: {
    flexGrow: 1,
    paddingLeft: SPACING.S1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  input: {
    paddingHorizontal: 20,
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLOR.setOpacity(COLOR.GRAY, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    textAlignVertical: 'center',
    paddingVertical: 15,
  },
  button_view: {
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  reply_view: {
    paddingTop: 15,
    backgroundColor: COLOR.setOpacity(COLOR.GRAY, 0.2),
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});
