import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {update_wallet_diamond} from '../../../store/slices/user/my_dataSlice';
import {setPostComment} from '../../../store/slices/content/pictureSlice';
import {formatDateAndTimeForVideo} from '../../../utils/customDate';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {selectMyProfileData} from '../../../store/selectors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';
import {PicturePostComment} from '../types/picturePost';
import * as imagePost from '../../../apis/imagePost';
import {useAppSelector} from '../../../store/hooks';
import CommentSendRose from './CommentSendRose';
import Toast from 'react-native-simple-toast';
import CommentHeader from './CommentHeader';
import {useDispatch} from 'react-redux';
import {icons} from '../../../assets/icons';
import {images} from '../../../assets/images';

interface CommentTemplateProps {
  item: PicturePostComment;
  index: number;
}

const {width} = Dimensions.get('screen');

const CommentTemplate: React.FC<CommentTemplateProps> = ({item, index}) => {
  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();
  const noOfLike = useRef<number>(item?.likes);
  const noOfDislike = useRef<number>(item?.dislike);
  const noOfRose = useRef<number>(item?.rose);
  const [isLike, setLike] = useState<boolean>(
    item?.PicturePostCommentLikes?.length ? true : false,
  );
  const [isDislike, setDislike] = useState<boolean>(
    item.PicturePostCommentDisLikes?.length ? true : false,
  );
  const [showCommentRoseModel, setshowCommentRoseModel] =
    useState<boolean>(false);

  function copyToClipboard(comment_data: string) {
    Clipboard.setString(comment_data);
    Toast.show('Copied to Clipboard', Toast.LONG);
  }

  function handleReply(_event: GestureResponderEvent): void {
    dispatch(setPostComment(item));
  }

  async function handleLike(event: GestureResponderEvent): Promise<void> {
    try {
      if (isLike) {
        noOfLike.current = noOfLike.current - 1;
        setLike(false);
      } else {
        noOfLike.current = noOfLike.current + 1;
        setLike(true);
      }
      await imagePost.likeCommentOrCommentReply(my_data?.auth_token, {
        comment_id: item.id,
      });
    } catch (error) {
      console.log('Error generated while sending post comment like', error);
    }
  }

  function handleSendRose(event: GestureResponderEvent): void {
    setshowCommentRoseModel(true);
  }

  async function handleDisLike(_event: GestureResponderEvent): Promise<void> {
    try {
      if (isDislike) {
        noOfDislike.current = noOfDislike.current - 1;
        setDislike(false);
      } else {
        noOfDislike.current = noOfDislike.current + 1;
        setDislike(true);
      }
      await imagePost.disLikeCommentOrCommentReply(my_data?.auth_token, {
        comment_id: item.id,
      });
    } catch (error) {
      console.log('Error generated while sending post comment dislike', error);
    }
  }

  const screenWidth = useCallback(() => {
    return {
      width: item.parent_id ? width * 0.96 : width * 0.99,
    };
  }, []);

  async function handleRoseSend(): Promise<void> {
    try {
      noOfRose.current = noOfRose.current + 1;
      handleCloseRoseModel();
      const result = await imagePost.sendRoseToPicturePostComment(
        my_data.auth_token,
        {
          comment_id: item.id,
          diamond_value: 10,
        },
      );
      dispatch(update_wallet_diamond(result?.updatedWallet));
      Toast.show('Successfully send', Toast.LONG);
    } catch (error) {
      console.log('Error generated while sending post comment rose', error);
      handleCloseRoseModel();
    }
  }

  function handleCloseRoseModel(): void {
    setshowCommentRoseModel(false);
  }

  return (
    <View style={[styles.main_container, screenWidth()]}>
      <CommentSendRose
        handleRoseSend={handleRoseSend}
        showCommentRoseModel={showCommentRoseModel}
        onCloseRoseModel={handleCloseRoseModel}
      />
      {/* Top container */}
      <CommentHeader item={item} index={index} />
      {/* Botttom container */}
      <View style={[styles.botton_container, screenWidth()]}>
        <View style={styles.bottom_nested_container}>
          <Pressable
            onPress={() => {
              copyToClipboard(item?.comment_data);
            }}>
            <FontAwesome5
              name="copy"
              color={'rgba(0, 0, 0, 0.7)'}
              size={13}
              style={{backfaceVisibility: 'visible'}}
            />
          </Pressable>
          <Text style={styles.date_text}>
            {formatDateAndTimeForVideo(item?.updatedAt)}
          </Text>
        </View>

        <View style={styles.reply_button}>
          <Pressable onPress={handleReply}>
            <MaterialCommunityIcons name="reply" size={20} />
          </Pressable>

          <View style={styles.like_info_side}>
            <Pressable onPress={handleLike} style={styles.likes}>
              <Image
                source={isLike ? icons.redHeart : icons.heartOutline}
                style={styles.heart_img}
              />
              <Text style={styles.text_of_no}>{noOfLike.current}</Text>
            </Pressable>

            <Pressable onPress={handleSendRose} style={styles.likes}>
              <Image source={images.rose} style={{width: 20, height: 20}} />
              <Text style={styles.text_of_no}>{noOfRose.current}</Text>
            </Pressable>

            <Pressable onPress={handleDisLike} style={styles.likes}>
              <AntDesign
                name={isDislike ? 'dislike1' : 'dislike2'}
                size={15}
                color={'#48a5f7'}
                style={{transform: [{scaleX: -1}]}}
              />
              <Text style={styles.text_of_no}>{noOfDislike.current}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(CommentTemplate);

const styles = StyleSheet.create({
  main_container: {
    width: width,
    alignItems: 'center',
  },
  top_container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  username_view: {
    marginLeft: 10,
    width: width * 0.6,
    marginRight: 20,
    textAlign: 'left',
    alignItems: 'flex-start',
  },
  botton_container: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    paddingLeft: 40,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  reply_button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 10,
  },
  heart_img: {
    width: 12,
    height: 12,
  },
  date_text: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    fontWeight: '600',
    marginLeft: 5,
  },
  username_text: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    fontWeight: '700',
  },
  likes: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  like_info_side: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text_of_no: {
    fontSize: 12,
    fontWeight: '900',
    color: '#020202',
  },
  text: {
    color: '#020202',
    fontSize: 15,
  },
  bottom_nested_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
