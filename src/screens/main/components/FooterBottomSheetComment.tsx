import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Pressable,
  TextInput,
  Dimensions,
  Text,
  Image,
} from 'react-native';
import Container from '../../../components/Container';
import {COLOR, SPACING} from '../../../configs/styles';
import Icon from '../../../components/Icon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as commentApi from '../../../apis/comment.api';
import {createComment} from '../../../apis/comment.api';
import {useDispatch} from 'react-redux';
import {setCommentId} from '../../../store/slices/ui/mainScreenSlice';
import {useTranslation} from 'react-i18next';
import * as userapi from '../../../apis/userApi';
import {
  selectCommentId,
  selectCommentPrivacy,
  selectMyProfileData,
  selectCommentEnabled,
  selectShowReply,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

const FooterBottomSheetComment = ({
  currentComment,
  setUpdate_comment,
  comment_data,
}) => {
  const {t, i18n} = useTranslation();

  const inputRef = useRef();
  const replyInputRef = useRef();
  const dispatch = useDispatch();
  const [txtComment, setTxtComment] = useState('');
  const marginRightInputValue = useSharedValue(0);
  // Changed initial value from 10 to 0 to prevent the large icon issue
  const scaleButtonValue = useSharedValue(0);
  const [isMuted, setIsMuted] = useState(false);

  const marginRightInputStyle = useAnimatedStyle(() => {
    return {marginRight: withTiming(marginRightInputValue.value)};
  }, []);
  const scaleButtonStyle = useAnimatedStyle(() => {
    return {transform: [{scale: withTiming(scaleButtonValue.value)}]};
  }, []);
  const [heightKeyboardStatus, setHeightKeyboardStatus] = useState(25);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setHeightKeyboardStatus(p => p + e.endCoordinates.height + 15);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', e => {
      setHeightKeyboardStatus(25);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [heightKeyboardStatus]);

  useEffect(() => {
    if (txtComment?.length > 0) {
      marginRightInputValue.value = SPACING.S6;
      scaleButtonValue.value = 1;
    } else {
      marginRightInputValue.value = 0;
      scaleButtonValue.value = 0;
    }
  }, [txtComment, marginRightInputValue, scaleButtonValue]);

  const my_data = useAppSelector(selectMyProfileData);
  const showReply = useAppSelector(selectShowReply);
  const comment_id = useAppSelector(selectCommentId);
  const commentPrivacy = useAppSelector(selectCommentEnabled);
  console.log(
    commentPrivacy,
    'commentPrivacycommentPrivacycommentPrivacycommentPrivacy',
  );
  const [show_rose_model, setShow_rose_model] = useState(true);

  const handleSendButtonPress = () => {
    const token = my_data?.auth_token;
    const comment_data = txtComment;
    const video_id = currentComment;
    if (txtComment) {
      let data = {
        video_id,
        comment_data,
      };
      createComment(data, token)
        .then(r => {
          setTxtComment('');
          setUpdate_comment(comment_data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleReplyComment = () => {
    const token = my_data?.auth_token;
    const reply_message = txtComment;
    const video_id = currentComment;
    const parent_comment_id = comment_id?.id;
    if (txtComment) {
      let data = {
        video_id,
        parent_comment_id,
        reply_message,
      };
      commentApi
        .replyComment(data, token)
        .then(r => {
          setUpdate_comment(comment_data);
          console.log(r);
          setTxtComment('');
          closeReplySection();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const likeComment = () => {
    const token = my_data?.auth_token;
    const video_id = 1,
      receiver_id = 12,
      comment_id = 1;
    let data = {video_id, receiver_id, comment_id};
    commentApi
      .likeComment(data, token)
      .then(r => {
        console.log(r.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [comment_id]);

  const closeReplySection = async () => {
    dispatch(setCommentId(''));
  };

  // **************************Mute Video Coomment*************

  const IsMuteUserComment = useCallback(async () => {
    try {
      const mute_for = 'video';
      const result = await userapi.IsUserCommentMute(
        my_data?.auth_token,
        mute_for,
      );
      console.log(result, 'result muted commentvideoo');
      if (result && result.is_active) {
        setIsMuted(true);
        // setMuteReason(result.mute_reason);
      } else {
        setIsMuted(false);
        // setMuteReason(null);
      }
    } catch (error) {
      console.error('Error checking mute status:', error);
      setIsMuted(false);
      // setMuteReason(null);
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    IsMuteUserComment();
  }, [IsMuteUserComment]);

  // **************************testing*************
  // console.log(isMuted, 'isMutedisMutedisMutedisMuted');
  return (
    <View style={[styles.main_container, {bottom: heightKeyboardStatus}]}>
      <Animated.View style={[styles.inputComment, marginRightInputStyle]}>
        <Container
          flexDirection="row"
          alignItems="center"
          // backgroundColor={COLOR.setOpacity(COLOR.GRAY, 0.15)}
          // borderRadius={BORDER.PILL}
        >
          <Container flexGrow={1} marginRight={SPACING.S2}>
            {!comment_id && (
              <TextInput
                placeholder={
                  isMuted && commentPrivacy
                    ? t('You are muted and comments are not allowed.')
                    : isMuted
                    ? t('You are muted and cannot comment.')
                    : commentPrivacy
                    ? t('Comments are not allowed.')
                    : t('Message...')
                }
                placeholderTextColor={'#020202'}
                value={txtComment}
                onChangeText={text => setTxtComment(text)}
                style={styles.input}
                ref={inputRef}
                multiline={false}
                editable={!commentPrivacy && !isMuted} // Disable input when commentPrivacy is false
              />
            )}
            {comment_id && (
              <View>
                <View style={styles.comment_reply_user}>
                  <Image
                    source={{uri: comment_id?.user?.profile_pic}}
                    style={{width: 40, height: 40, borderRadius: 20}}
                  />
                  <View style={styles.reply_text_view}>
                    <Text style={styles.username_text}>
                      @{comment_id?.user?.username}
                    </Text>
                    <Text style={styles.text}>{comment_id?.comment_data}</Text>
                  </View>
                  <Pressable
                    onPress={closeReplySection}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 6,
                    }}>
                    <Image
                      source={icons.close}
                      style={{width: 15, height: 15}}
                    />
                  </Pressable>
                </View>
                <TextInput
                  placeholder={
                    isMuted && commentPrivacy
                      ? t('You are muted and comments are not allowed.')
                      : isMuted
                      ? t('You are muted and cannot comment.')
                      : commentPrivacy
                      ? t('Comments are not allowed.')
                      : t('Message...')
                  }
                  value={txtComment}
                  onChangeText={text => setTxtComment(text)}
                  style={styles.input}
                  ref={inputRef}
                  multiline={false}
                  editable={!commentPrivacy && !isMuted} // Disable input when commentPrivacy is false
                />
              </View>
            )}
          </Container>
          <Container flexDirection="row" right={SPACING.S3}></Container>
        </Container>
      </Animated.View>
      <Container right={SPACING.S1} marginLeft={SPACING.S4} position="absolute">
        <Animated.View style={scaleButtonStyle}>
          <Icon
            source={icons.sendButton}
            width={40}
            height={40}
            onPress={comment_id ? handleReplyComment : handleSendButtonPress}
          />
        </Animated.View>
      </Container>
    </View>
  );
};

export default FooterBottomSheetComment;

const styles = StyleSheet.create({
  inputComment: {
    flexGrow: 1,
    paddingLeft: SPACING.S1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLOR.setOpacity(COLOR.GRAY, 0.2),
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 20,
  },
  main_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  comment_reply_user: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  reply_text_view: {
    marginLeft: 10,
  },
  username_text: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    fontWeight: '700',
  },
  text: {
    color: '#020202',
    fontSize: 15,
  },
});
