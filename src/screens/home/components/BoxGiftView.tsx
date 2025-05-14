import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Tooltip from 'react-native-walkthrough-tooltip';
import {setHidden} from 'react-native-system-navigation';

import * as userApi from '../../../apis/userApi';
import {truncateText} from '../../../utils/truncateText';
import {
  selectCurrentVideo,
  selectMyProfileData,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const chest_move: string =
  'https://dpcst9y3un003.cloudfront.net/video_gift/box_gift/chest_move.gif';
const chest_open: string =
  'https://dpcst9y3un003.cloudfront.net/video_gift/box_gift/chest_open.gif';

interface BoxGiftViewProps {
  timeLeft: number;
  formatDuration: (timeLeft: number) => string;
  setIs_congrats_visible: React.Dispatch<React.SetStateAction<boolean>>;
  setIs_timer_visible: React.Dispatch<React.SetStateAction<boolean>>;
  is_timer_view_visible: boolean;
  is_congrats_visible: boolean;
  following: any[];
  checkIsFollowing: () => boolean;
  checkIsLiked: () => boolean;
  checkIsVideoSharedByUser: () => Promise<boolean>;
  checkIsVideoCommentedByUser: () => Promise<boolean>;
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const BoxGiftView: React.FC<BoxGiftViewProps> = ({
  timeLeft,
  formatDuration,
  setIs_congrats_visible,
  setIs_timer_visible,
  is_timer_view_visible,
  is_congrats_visible,
  following,
  // checkIsFollowing,
  checkIsLiked,
  checkIsVideoSharedByUser,
  checkIsVideoCommentedByUser,
  isFollowing,
  setIsFollowing,
}) => {
  const my_data = useAppSelector(selectMyProfileData);
  const video_data = useAppSelector(selectCurrentVideo);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [is_check_wallet_visible, setIs_check_wallet_visible] =
    useState<boolean>(false);
  const [showCongratsToolTip, setShowCongratsToolTip] =
    useState<boolean>(false);
  const [showTimerToolTip, setShowTimerToolTip] = useState<boolean>(false);
  const [showWalletToolTip, setShowWalletToolTip] = useState<boolean>(false);

  const follow = useCallback(async () => {
    try {
      const data = {
        receiver_id: video_data?.user?.id,
        way_of_following: `video_box_gift:${video_data?.id}`,
      };
      setIsFollowing(true);
      await userApi.follow(data, my_data?.auth_token);
    } catch (error) {
      console.log('error', error);
    }
  }, [video_data, my_data]);

  const checkIsFollowing = useCallback(() => {
    return isFollowing;
  }, [isFollowing]);

  const handleReceiveRewardPress = async () => {
    setIsLoading(true);
    const tasks = [
      {text: 'Follow the user', check: checkIsFollowing},
      {text: 'Like the video', check: checkIsLiked},
      {text: 'Comment on the video', check: checkIsVideoCommentedByUser},
      {text: 'Share the video', check: checkIsVideoSharedByUser},
    ];

    const incompleteTasks = [];
    for (const [index, task] of tasks.entries()) {
      const isTaskComplete = await task.check();
      if (!isTaskComplete) {
        incompleteTasks.push(`${index + 1}. ${task.text}`);
      }
    }

    if (incompleteTasks.length === 0) {
      setIsLoading(false);
      setIs_timer_visible(false);
      setIs_congrats_visible(false);
      setIs_check_wallet_visible(true);
    } else {
      Alert.alert(
        'Incomplete Tasks',
        `To receive your reward, please complete the following tasks:\n\n${incompleteTasks.join(
          '\n',
        )}\n\nOnce all tasks are completed, you will be eligible to claim your reward.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIs_congrats_visible(false);
            },
          },
        ],
      );
      setIsLoading(false);
    }
  };

  const handleOkPress = () => {
    setIs_timer_visible(false);
    setIs_congrats_visible(false);
    setIs_check_wallet_visible(false);
  };

  const handleTimeFinished = useCallback(() => {
    if (timeLeft === 0 && is_timer_view_visible) {
      setIs_timer_visible(false);
      setIs_congrats_visible(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    handleTimeFinished();
  }, [handleTimeFinished]);

  const showTimerToolTipPressed = useCallback(() => {
    //  setHidden(false)
    setShowTimerToolTip(true);
  }, [showTimerToolTip]);

  const hideTimerToolTipPressed = useCallback(() => {
    // setHidden(true)
    setShowTimerToolTip(false);
  }, [showTimerToolTip]);

  const showCongratsToolTipPressed = useCallback(() => {
    setHidden(false);
    setShowCongratsToolTip(true);
  }, [showCongratsToolTip]);

  const hideCongratsToolTipPressed = useCallback(() => {
    setHidden(true);
    setShowCongratsToolTip(false);
  }, [showCongratsToolTip]);

  const showWalletToolTipPressed = useCallback(() => {
    setHidden(false);
    setShowWalletToolTip(true);
  }, [showWalletToolTip]);

  const hideWalletToolTipPressed = useCallback(() => {
    setHidden(true);
    setShowWalletToolTip(false);
  }, [showWalletToolTip]);

  const followButtonStyle = useMemo(
    () => (isFollowing ? styles.following_button : styles.follow_button),
    [isFollowing],
  );

  const followTextContent = useMemo(
    () => (isFollowing ? 'Following' : 'Follow'),
    [isFollowing],
  );

  const followBottomHandler = useMemo(() => {
    return isFollowing ? null : follow;
  }, [isFollowing]);

  return (
    <>
      {is_timer_view_visible && (
        <ImageBackground
          source={icons.giftBackground}
          style={styles.get_coin_for_free_container}>
          <View style={styles.top_view}>
            <Text style={styles.get_coin_for_free_txt}>Get Coin for Free</Text>

            <Pressable
              style={styles.question_mark_img}
              onPress={showTimerToolTipPressed}>
              <Tooltip
                isVisible={showTimerToolTip}
                content={
                  <Text>Writing something here for testing the tooltip</Text>
                }
                placement="top"
                onClose={hideTimerToolTipPressed}>
                <Image
                  source={icons.questionMark}
                  style={styles.question_mark_img}
                />
              </Tooltip>
            </Pressable>
          </View>

          <View style={styles.sticker_view}>
            <Image source={icons.boxGift} style={styles.box_gift_stickers} />
          </View>

          <View style={styles.profile_view}>
            <Image
              source={{uri: video_data?.user?.profile_pic}}
              style={styles.profile_pic_img}
            />
            <Text style={styles.nickname_txt}>
              {truncateText(video_data?.user?.nickname, 6)}
            </Text>
            <Text style={styles.username_txt}>
              @{truncateText(video_data?.user?.username, 6)}
            </Text>
            <Pressable onPress={followBottomHandler} style={followButtonStyle}>
              <Text style={styles.follow_txt}>{followTextContent}</Text>
            </Pressable>
          </View>

          <View style={styles.info_view}>
            <Text style={styles.info_txt}>{formatDuration(timeLeft)}</Text>
          </View>
        </ImageBackground>
      )}

      {is_congrats_visible && (
        <ImageBackground
          source={icons.giftBackground}
          style={styles.get_coin_for_free_container}>
          <View style={styles.top_view}>
            <Text style={styles.get_coin_for_free_txt}>
              Congratulations {'\n'}
              you won
            </Text>

            <Pressable
              style={styles.question_mark_img}
              onPress={showCongratsToolTipPressed}>
              <Tooltip
                isVisible={showCongratsToolTip}
                content={
                  <Text>Writing something here for testing the tooltip</Text>
                }
                placement="top"
                onClose={hideCongratsToolTipPressed}>
                <Image
                  source={icons.questionMark}
                  style={styles.question_mark_img}
                />
              </Tooltip>
            </Pressable>
          </View>

          <View style={styles.sticker_view}>
            <Image
              source={{uri: chest_open}}
              style={styles.box_gift_stickers_gif}
            />
          </View>

          <View style={styles.profile_view}>
            <Image
              source={{uri: video_data?.user?.profile_pic}}
              style={styles.profile_pic_img}
            />
            <Text style={styles.nickname_txt}>
              {truncateText(video_data?.user?.nickname, 6)}
            </Text>
            <Text style={styles.username_txt}>
              @{truncateText(video_data?.user?.username, 6)}
            </Text>
            <Pressable onPress={followBottomHandler} style={followButtonStyle}>
              <Text style={styles.follow_txt}>{followTextContent}</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.info_view}
            onPress={isLoading ? null : handleReceiveRewardPress}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={'#000'} />
            ) : (
              <Text style={styles.info_txt}>Receive Reward</Text>
            )}
          </Pressable>
        </ImageBackground>
      )}

      {is_check_wallet_visible && (
        <ImageBackground
          source={icons.giftBackground}
          style={styles.get_coin_for_free_container}>
          <View style={styles.top_view}>
            <Text style={styles.get_coin_for_free_txt}>Check your wallet</Text>

            <Pressable
              style={styles.question_mark_img}
              onPress={showWalletToolTipPressed}>
              <Tooltip
                isVisible={showWalletToolTip}
                content={
                  <Text>Writing something here for testing the tooltip</Text>
                }
                placement="top"
                onClose={hideWalletToolTipPressed}>
                <Image
                  source={icons.questionMark}
                  style={styles.question_mark_img}
                />
              </Tooltip>
            </Pressable>
          </View>

          <View style={styles.sticker_view}>
            <Image
              source={{uri: chest_open}}
              style={styles.box_gift_stickers_gif}
            />
          </View>

          <View style={styles.profile_view}>
            <Image
              source={{uri: video_data?.user?.profile_pic}}
              style={styles.profile_pic_img}
            />
            <Text style={styles.nickname_txt}>
              {truncateText(video_data?.user?.nickname, 6)}
            </Text>
            <Text style={styles.username_txt}>
              @{truncateText(video_data?.user?.username, 6)}
            </Text>
            <Pressable onPress={followBottomHandler} style={followButtonStyle}>
              <Text style={styles.follow_txt}>{followTextContent}</Text>
            </Pressable>
          </View>

          <View style={styles.diamond_view}>
            <Image source={icons.diamond} style={{width: 30, height: 30}} />
            <Text style={styles.diamond_txt}>+ 75</Text>
          </View>

          <Pressable style={styles.info_view} onPress={handleOkPress}>
            <Text style={styles.info_txt}>Ok</Text>
          </Pressable>
        </ImageBackground>
      )}
    </>
  );
};

export default React.memo(BoxGiftView);

const styles = StyleSheet.create({
  box_gift_view: {
    width: 60,
    height: 40,
  },
  box_gift_main_container: {
    position: 'absolute',
    top: 130,
    left: 20,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  get_coin_for_free_container: {
    width: 300,
    height: 350,
    position: 'absolute',
    top: 150,
    left: (width - 300) / 2,
    zIndex: 100,
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  get_coin_for_free_txt: {
    fontSize: 22,
    color: '#ffd631',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  question_mark_img: {
    width: 25,
    height: 25,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  top_view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    justifyContent: 'center',
    paddingVertical: 5,
    marginVertical: 10,
  },
  box_gift_stickers: {
    width: 110,
    height: 110,
    bottom: 13,
  },
  box_gift_stickers_gif: {
    width: 200,
    height: 200,
    bottom: 60,
  },
  profile_pic_img: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  nickname_txt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  username_txt: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7B7A7A',
  },
  profile_view: {
    alignItems: 'center',
    position: 'absolute',
    left: 5,
    top: 40,
  },
  follow_button: {
    width: 90,
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 5,
  },
  following_button: {
    width: 90,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 5,
  },
  sticker_view: {
    marginTop: 40,
  },
  follow_txt: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  info_view: {
    backgroundColor: '#fff',
    width: 190,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
  },
  info_txt: {
    color: '#7b4703',
    fontWeight: 'bold',
    fontSize: 20,
  },
  diamond_txt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffd631',
  },
  diamond_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -15,
  },
  duration_txt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
