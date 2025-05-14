import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {DateTime} from 'luxon';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {BORDER, SPACING} from '../../../configs/styles';

import {useDispatch} from 'react-redux';
import {
  setShowReply,
  setCommentId,
} from '../../../store/slices/ui/mainScreenSlice';
import {setRechargeSheet} from '../../../store/slices/ui/indexSlice';
import {update_wallet_diamond} from '../../../store/slices/user/my_dataSlice';

import * as commentApi from '../../../apis/comment.api';

import Icon from '../../../components/Icon';
import ProfileImage from '../../../components/ProfileImage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';
import {icons} from '../../../assets/icons';
import {images} from '../../../assets/images';

const {width} = Dimensions.get('screen');

// Component to render a reply item with its own state
const ReplyItem = ({reply, onReply, myData}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Check if the user has liked or disliked this specific reply
  const isReplyLiked = (id: any) => {
    return reply?.reply_likes?.some((like: any) => like.sender_id === id);
  };

  const isReplyDisliked = (id: any) => {
    return reply?.reply_dislikes?.some(
      (dislike: any) => dislike.sender_id === id,
    );
  };

  const [replyLike, setReplyLike] = useState(isReplyLiked(myData?.id));
  const [replyLikeCount, setReplyLikeCount] = useState(reply?.likes || 0);
  const [replyDislike, setReplyDislike] = useState(isReplyDisliked(myData?.id));
  const [replyDislikeCount, setReplyDislikeCount] = useState(
    reply?.dislikes || 0,
  );
  const [replyRose, setReplyRose] = useState(reply?.rose || 0);
  const [showRoseModel, setShowRoseModel] = useState(false);

  function formattedDate(dateString: any) {
    let dt = DateTime.fromISO(dateString, {zone: 'utc'});
    let localDt = dt.toLocal();
    return localDt.toFormat('dd.MM.yyyy hh:mm a');
  }

  const copyToClipboard = (text: any) => {
    Clipboard.setString(text);
    Toast.show('Copied to Clipboard', Toast.LONG);
  };

  const handleUserProfileClick = id => {
    navigation.navigate('UserProfileMainPage', {user_id: id});
  };

  const handleReplyLike = async () => {
    const token = myData?.auth_token;

    // Use the same API as comments but with reply_id instead of comment_id
    let video_id = reply?.video_id || reply?.comment?.video_id,
      reciever_id = null,
      comment_id = reply?.comment_id || reply?.comment?.id, // Parent comment ID
      reply_id = reply?.id;

    let data = {
      video_id,
      reciever_id,
      comment_id,
      reply_id, // Add reply_id to identify this is a reply like
    };

    if (!replyLike) {
      setReplyLike(true);
      setReplyLikeCount((p: number) => p + 1);
      try {
        // Use the same API endpoint as comment likes
        await commentApi.likeComment(data, token);
      } catch (err) {
        console.log('Error liking reply:', err);
        Toast.show('Error liking reply', Toast.LONG);
        setReplyLike(false);
        setReplyLikeCount((p: number) => p - 1);
      }
    } else {
      setReplyLike(false);
      setReplyLikeCount((p: number) => p - 1);
      try {
        await commentApi.unlikeComment(data, token);
      } catch (err) {
        console.log('Error unliking reply:', err);
        Toast.show('Error unliking reply', Toast.LONG);
        setReplyLike(true);
        setReplyLikeCount((p: number) => p + 1);
      }
    }
  };

  const handleReplyDislike = async () => {
    const token = myData?.auth_token;

    // Use the same API as comments but with reply_id instead of comment_id
    let video_id = reply?.video_id || reply?.comment?.video_id,
      reciever_id = null,
      comment_id = reply?.comment_id || reply?.comment?.id,
      reply_id = reply?.id;

    let data = {
      video_id,
      reciever_id,
      comment_id,
      reply_id,
    };

    if (!replyDislike) {
      setReplyDislike(true);
      setReplyDislikeCount((p: number) => p + 1);
      try {
        // Use the same API endpoint as comment dislikes
        await commentApi.dislikeComment(data, token);
      } catch (err) {
        console.log('Error disliking reply:', err);
        Toast.show('Error disliking reply', Toast.LONG);
        setReplyDislike(false);
        setReplyDislikeCount((p: number) => p - 1);
      }
    } else {
      setReplyDislike(false);
      setReplyDislikeCount((p: number) => p - 1);
      try {
        // Use the same API endpoint as comment undislikes
        await commentApi.undislikeComment(data, token);
      } catch (err) {
        console.log('Error undisliking reply:', err);
        Toast.show('Error undisliking reply', Toast.LONG);
        setReplyDislike(true);
        setReplyDislikeCount((p: number) => p + 1);
      }
    }
  };

  const handleReplyRose = () => {
    setShowRoseModel(true);
  };

  const handleRoseSend = async () => {
    if (myData?.wallet >= 10) {
      try {
        setReplyRose((p: number) => p + 1);
        setShowRoseModel(false);
        dispatch(update_wallet_diamond(myData?.wallet - 10));

        let diamonds = 10,
          video_id = reply?.video_id || reply?.comment?.video_id,
          reciever_id = reply.user?.id,
          comment_id = reply?.comment_id || reply?.comment?.id,
          reply_id = reply?.id;

        const data = {
          diamonds,
          video_id,
          reciever_id,
          comment_id,
          reply_id,
        };

        // Use the same API endpoint as comment roses
        await commentApi.sendRose(data, myData?.auth_token);
      } catch (error) {
        console.log('Error sending rose to reply', error);
        Toast.show('Error sending rose', Toast.LONG);
      }
    } else {
      dispatch(setRechargeSheet(true));
    }
  };

  return (
    <View>
      <View style={styles.nested_flatlist}>
        <View style={styles.top_container}>
          <Pressable onPress={() => handleUserProfileClick(reply?.user?.id)}>
            <Image
              source={{uri: reply?.user?.profile_pic}}
              style={styles.profile_image2}
            />
          </Pressable>
          <View style={styles.username_view}>
            <Text style={styles.username_text}>@{reply?.user?.username}</Text>
            <Text style={styles.text}>{reply?.reply_message}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.botton_container, {width: width * 0.9}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              copyToClipboard(reply?.reply_message);
            }}>
            <FontAwesome5
              name="copy"
              color={'rgba(0, 0, 0, 0.7)'}
              size={13}
              style={{backfaceVisibility: 'visible'}}
            />
          </Pressable>
          <Text style={styles.date_text}>
            {formattedDate(reply?.updatedAt)}
          </Text>
        </View>

        <View style={styles.reply_button}>
          <Pressable onPress={onReply}>
            <MaterialCommunityIcons name="reply" size={20} />
          </Pressable>

          <View style={styles.like_info_side}>
            <Pressable onPress={handleReplyLike} style={styles.likes}>
              <Image
                source={replyLike ? icons.redHeart : icons.heartOutline}
                style={styles.heart_img}
              />
              <Text style={styles.text_of_no}>{replyLikeCount}</Text>
            </Pressable>

            <Pressable onPress={handleReplyRose} style={styles.likes}>
              <Image source={images.rose} style={{width: 20, height: 20}} />
              <Text style={styles.text_of_no}>{replyRose}</Text>
            </Pressable>

            <Pressable onPress={handleReplyDislike} style={styles.likes}>
              <AntDesign
                name={replyDislike ? 'dislike1' : 'dislike2'}
                size={15}
                color={'#48a5f7'}
                style={{transform: [{scaleX: -1}]}}
              />
              <Text style={styles.text_of_no}>{replyDislikeCount}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Rose Modal for Reply */}
      <Modal
        visible={showRoseModel}
        transparent={true}
        onRequestClose={() => setShowRoseModel(false)}
        animationType="slide">
        <Pressable style={{flex: 1}} onPress={() => setShowRoseModel(false)}>
          <Pressable style={styles.rose_model}>
            <View style={styles.upper_view}>
              <View style={styles.balance_view}>
                <Text style={styles.text}>Cost</Text>
                <Icon
                  source={icons.coin}
                  borderRadius={BORDER.PILL}
                  width={10}
                  height={10}
                />
                <Text style={styles.text}>10</Text>
              </View>
              <Icon
                source={images.rose}
                borderRadius={BORDER.PILL}
                width={40}
                height={40}
                marginLeft={SPACING.S3}
              />
              <View style={styles.balance_view}>
                <Text style={styles.text}>Balance</Text>
                <Icon
                  source={icons.coin}
                  borderRadius={BORDER.PILL}
                  width={10}
                  height={10}
                />
                <Text style={styles.text}>{myData?.wallet}</Text>
              </View>
            </View>
            <Pressable style={styles.send_button} onPress={handleRoseSend}>
              <Text style={styles.button_text}>Send</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const RenderComment = ({item, index}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  function formattedDate(dateString: string) {
    let dt = DateTime.fromISO(dateString, {zone: 'utc'});
    let localDt = dt.toLocal();
    return localDt.toFormat('dd.MM.yyyy hh:mm a');
  }
  const my_data = useAppSelector(selectMyProfileData);

  const isIdAvailable = (id: any) => {
    return item?.comment_likes?.some((item: any) => item.sender_id === id);
  };
  const idDislikeIdAvailable = (id: any) => {
    return item?.comment_dislikes?.some((item: any) => item.sender_id == id);
  };

  const [like, setLike] = useState(isIdAvailable(my_data?.id));
  const [no_of_like, setNo_of_like] = useState(item?.likes);
  const [no_of_dislike, setNo_of_dislike] = useState(item?.dislike || 0);
  const [isDislike, setIsDislike] = useState(idDislikeIdAvailable(my_data?.id));
  const [show_rose_model, setShow_rose_model] = useState(false);
  const [rose, setRose] = useState(item?.rose || 0);
  const [last_index, setLast_index] = useState(2);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Toast.show('Copied to Clipboard', Toast.LONG);
  };

  const handleLike = () => {
    const token = my_data?.auth_token;
    let video_id = item?.video_id,
      reciever_id = null,
      comment_id = item?.id;
    let data = {
      video_id,
      reciever_id,
      comment_id,
    };
    if (!like) {
      setLike(true);
      setNo_of_like((p: number) => p + 1);
      commentApi
        .likeComment(data, token)
        .then(r => {})
        .catch(err => {
          Toast.show('Error', Toast.LONG);
          setLike(false);
          setNo_of_like((p: number) => p - 1);
        });
    } else {
      setLike(false);
      setNo_of_like((p: number) => p - 1);
      commentApi
        .unlikeComment(data, token)
        .then(r => {})
        .catch(err => {
          Toast.show('Error', Toast.LONG);
          setLike(true);
          setNo_of_like((p: number) => p + 1);
        });
    }
  };

  // function for dislike the comment
  const handleDisLike = () => {
    const token = my_data?.auth_token;
    let video_id = item?.video_id,
      reciever_id = null,
      comment_id = item?.id;
    let data = {
      video_id,
      reciever_id,
      comment_id,
    };
    if (!isDislike) {
      setIsDislike(true);
      setNo_of_dislike((p: number) => p + 1);
      commentApi
        .dislikeComment(data, token)
        .then(r => {})
        .catch(err => {
          Toast.show('Error', Toast.LONG);
          setIsDislike(false);
          setNo_of_dislike((p: number) => p - 1);
        });
    } else {
      setIsDislike(false);
      setNo_of_dislike((p: number) => p - 1);
      commentApi
        .undislikeComment(data, token)
        .then(r => {})
        .catch(err => {
          Toast.show('Error', Toast.LONG);
          setIsDislike(true);
          setNo_of_dislike((p: any) => p + 1);
        });
    }
  };

  const handleSendRose = () => {
    setShow_rose_model(true);
  };
  const handleRoseSend = async () => {
    if (my_data?.wallet >= 10) {
      try {
        setRose((p: number) => p + 1);
        setShow_rose_model(false);
        dispatch(update_wallet_diamond(my_data?.wallet - 10));
        let diamonds = 10,
          video_id = item?.video?.id,
          reciever_id = item.user?.id,
          comment_id = item?.id;
        const data = {diamonds, video_id, reciever_id, comment_id};
        const result = await commentApi.sendRose(data, my_data?.auth_token);
      } catch (error) {
        console.log(
          'error generating while sending the rose to commented user',
          error,
        );
      }
    } else {
      dispatch(setRechargeSheet(true));
    }
  };

  const handleReply = () => {
    dispatch(setShowReply(true));
    dispatch(setCommentId(item));
  };

  const handleUserProfileClick = async (id: number) => {
    navigation.navigate('UserProfileMainPage', {user_id: id});
  };

  const [numCommentsToShow, setNumCommentsToShow] = useState(2);

  const handlePagination = () => {
    setNumCommentsToShow(numCommentsToShow + 10);
  };

  const handleShowMore = async () => {
    setLast_index(p => Math.abs(p) + 10);
  };

  const handleShowLess = async () => {
    setLast_index(p => Math.abs(p) - 10);
  };

  // Prepare replies with additional data needed for proper API calls
  const prepareReplies = () => {
    if (!item?.replies) return [];

    return item.replies.map((reply: any) => ({
      ...reply,
      comment: {
        id: item.id,
        video_id: item.video_id,
      },
      comment_id: item.id,
    }));
  };

  return (
    <View style={styles.main_container}>
      <View style={styles.top_container}>
        <ProfileImage
          onPress={() => handleUserProfileClick(item?.user?.id)}
          uri={item?.user?.profile_pic}
        />
        <View style={styles.username_view}>
          <Text style={styles.username_text}>@{item?.user?.username}</Text>
          <Text style={styles.text}>{item?.comment_data}</Text>
        </View>
      </View>

      <View style={styles.botton_container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          <Text style={styles.date_text}>{formattedDate(item?.updatedAt)}</Text>
        </View>

        <View style={styles.reply_button}>
          <Pressable onPress={handleReply}>
            <MaterialCommunityIcons name="reply" size={20} />
          </Pressable>

          <View style={styles.like_info_side}>
            <Pressable onPress={handleLike} style={styles.likes}>
              <Image
                source={like ? icons.redHeart : icons.heartOutline}
                style={styles.heart_img}
              />
              <Text style={styles.text_of_no}>{no_of_like}</Text>
            </Pressable>

            <Pressable onPress={handleSendRose} style={styles.likes}>
              <Image source={images.rose} style={{width: 20, height: 20}} />
              <Text style={styles.text_of_no}>{rose}</Text>
            </Pressable>

            <Pressable onPress={handleDisLike} style={styles.likes}>
              <AntDesign
                name={isDislike ? 'dislike1' : 'dislike2'}
                size={15}
                color={'#48a5f7'}
                style={{transform: [{scaleX: -1}]}}
              />
              <Text style={styles.text_of_no}>{no_of_dislike || 0}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{flex: 1, marginTop: 10}}>
        <FlatList
          data={prepareReplies().slice(-last_index)?.reverse()}
          ListFooterComponent={() =>
            item?.replies?.length > 0 ? (
              <View
                style={[
                  styles.more_view,
                  {
                    alignItems:
                      item?.replies?.length > last_index
                        ? 'flex-end'
                        : 'flex-start',
                  },
                ]}>
                {item?.replies?.length > last_index ? (
                  <View style={styles.more_hide_view}>
                    <Text onPress={handleShowMore} style={styles.more_text}>
                      more...
                    </Text>
                    {last_index > 0 && (
                      <Text onPress={handleShowLess} style={styles.more_text}>
                        hide...
                      </Text>
                    )}
                  </View>
                ) : (
                  <Text onPress={handleShowLess} style={styles.more_text}>
                    hide...
                  </Text>
                )}
              </View>
            ) : (
              <View />
            )
          }
          renderItem={({item: reply}) => (
            <ReplyItem reply={reply} onReply={handleReply} myData={my_data} />
          )}
        />
      </View>

      <Modal
        visible={show_rose_model}
        transparent={true}
        onRequestClose={() => setShow_rose_model(false)}
        animationType="slide">
        <Pressable style={{flex: 1}} onPress={() => setShow_rose_model(false)}>
          <Pressable style={styles.rose_model}>
            <View style={styles.upper_view}>
              <View style={styles.balance_view}>
                <Text style={styles.text}>Cost</Text>
                <Icon
                  source={icons.coin}
                  borderRadius={BORDER.PILL}
                  width={10}
                  height={10}
                />
                <Text style={styles.text}>10</Text>
              </View>
              <Icon
                source={images.rose}
                borderRadius={BORDER.PILL}
                width={40}
                height={40}
                marginLeft={SPACING.S3}
              />
              <View style={styles.balance_view}>
                <Text style={styles.text}>Balance</Text>
                <Icon
                  source={icons.coin}
                  borderRadius={BORDER.PILL}
                  width={10}
                  height={10}
                />
                <Text style={styles.text}>{my_data?.wallet}</Text>
              </View>
            </View>
            <Pressable style={styles.send_button} onPress={handleRoseSend}>
              <Text style={styles.button_text}>Send</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default RenderComment;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    marginBottom: 30,
  },
  profile_image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profile_image2: {
    width: 30,
    height: 30,
    borderRadius: 20,
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
  nested_flatlist: {
    marginLeft: width * 0.1,
    marginTop: 15,
    marginRight: width * 0.1,
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
  rose_model: {
    width: width,
    // height: 120,
    backgroundColor: '#f1f1f1',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  send_button: {
    backgroundColor: 'red',
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  button_text: {
    color: '#fff',
    fontSize: 20,
    padding: 7,
  },
  upper_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  balance_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: width * 0.3,
  },
  text: {
    color: '#020202',
    fontSize: 15,
  },
  more_view: {
    width: width,
    paddingHorizontal: 10,
  },
  more_text: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  more_hide_view: {
    width: width * 0.955,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
});
