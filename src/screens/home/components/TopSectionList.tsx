import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Duration} from 'luxon';

// Configs & Assets
import {icons} from '../../../assets/icons';

// Components
import BoxGiftView from './BoxGiftView';
import RankingModel from '../../live_stream/viewers/RankingModel';
import WheelLuckMainModel from '../../live_stream/luckyWheel/WheelLuckMainModel';

// Utils & API
import {formatNumber} from '../../../utils/formatNumber';
import * as boxGiftApi from '../../../apis/gifts';
import * as commentApi from '../../../apis/comment.api';
import * as shareApi from '../../../apis/share';

// Types & Redux
import {RootStackParamList} from '../../../types/navigation';
import {
  selectCurrentVideo,
  selectFollowing,
  selectMyProfileData,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const {width} = Dimensions.get('screen');

// Constants
const CHEST_MOVE =
  'https://dpcst9y3un003.cloudfront.net/video_gift/box_gift/chest_move.gif';
const CHEST_OPEN =
  'https://dpcst9y3un003.cloudfront.net/video_gift/box_gift/chest_open.gif';
const BOX_TIMER_INITIAL = 180000; // 3 minutes in milliseconds

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type HomeScreenNavigationProps = Props['navigation'];

interface TopSectionListProps {
  playVideo: () => void;
  pauseVideo: () => void;
  user?: any; // This prop is declared but not used in the component
}

const TopSectionList: React.FC<TopSectionListProps> = ({
  playVideo,
  pauseVideo,
}) => {
  // Hooks
  const {t} = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProps>();

  // Selectors
  const videoData = useAppSelector(selectCurrentVideo);
  const myData = useAppSelector(selectMyProfileData);
  const following = useAppSelector(selectFollowing);

  // State
  const [isBoxAvailable, setIsBoxAvailable] = useState(false);
  const [isCongratsVisible, setIsCongratsVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isLuckyWheelVisible, setIsLuckyWheelVisible] = useState(false);
  const [showModels, setShowModels] = useState({rankings: false});
  const [timeLeft, setTimeLeft] = useState(BOX_TIMER_INITIAL);

  // Refs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkIsFollowing = useCallback(() => {
    const isUserFollowing = following?.some(
      item => item?.UserRelationship?.receiver_id === videoData?.user?.id,
    );
    setIsFollowing(isUserFollowing);
    return isUserFollowing;
  }, [following, videoData?.user?.id]);

  const checkIsLiked = useCallback(() => {
    return videoData?.likes?.some(
      (item: any) => item?.sender_id === myData?.id,
    );
  }, [videoData?.likes, myData?.id]);

  const checkIsVideoSharedByUser = useCallback(async () => {
    if (!myData?.auth_token || !videoData?.id) return false;

    try {
      const result = await shareApi.checkIsVideoSharedByUser(
        myData.auth_token,
        videoData.id,
      );
      return result?.shared;
    } catch (error) {
      console.log('Error checking if video was shared:', error);
      return false;
    }
  }, [myData?.auth_token, videoData?.id]);

  const checkIsVideoCommentedByUser = useCallback(async () => {
    if (!myData?.auth_token || !videoData?.id) return false;

    try {
      const result = await commentApi.checkIsVideoCommentedByUser(
        myData.auth_token,
        videoData.id,
      );
      return result?.commented;
    } catch (error) {
      console.log('Error checking if video was commented:', error);
      return false;
    }
  }, [myData?.auth_token, videoData?.id]);

  const checkIsBoxGiftAvailable = useCallback(async () => {
    if (!myData?.auth_token || !videoData?.id) return;

    try {
      // Clear existing timer if any
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // Reset state
      setTimeLeft(BOX_TIMER_INITIAL);
      setIsBoxAvailable(false);

      // Check availability from API
      const result = await boxGiftApi.checkBoxGiftAvalible(
        myData.auth_token,
        videoData.id,
      );

      setIsBoxAvailable(result.success);

      // Start timer if box is available
      if (result.success) {
        timerIntervalRef.current = setInterval(() => {
          setTimeLeft(prev => (prev > 0 ? prev - 1000 : 0));
        }, 1000);
      }
    } catch (error) {
      console.log('Error checking box gift availability:', error);
    }
  }, [myData?.auth_token, videoData?.id]);

  const formatDuration = (milliseconds: number): string => {
    return Duration.fromMillis(milliseconds).toFormat('mm:ss');
  };

  const handleBoxPress = useCallback(() => {
    if (!isBoxAvailable) return;

    if (timeLeft > 0) {
      setIsTimerVisible(true);
    } else if (timeLeft === 0) {
      setIsCongratsVisible(true);
    }
  }, [timeLeft, isBoxAvailable]);

  const handleFeedPress = () => {
    navigation.navigate('FeedStackNavigation');
  };

  const handleRankingsPress = useCallback(() => {
    setShowModels(prev => ({...prev, rankings: true}));
    pauseVideo();
  }, [pauseVideo]);

  const handleWheelLuckPress = useCallback(() => {
    setIsLuckyWheelVisible(true);
  }, []);

  // Effects
  useEffect(() => {
    checkIsFollowing();
  }, [checkIsFollowing]);

  useEffect(() => {
    checkIsBoxGiftAvailable();

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [checkIsBoxGiftAvailable]);

  useEffect(() => {
    FastImage.preload([{uri: CHEST_MOVE}, {uri: CHEST_OPEN}]);
  }, []);

  return (
    <View style={styles.mainContainer}>
      {/* Feed Button */}
      <Pressable style={styles.nestedContainer} onPress={handleFeedPress}>
        <Image source={icons.left} style={styles.feedImg} />
        <Text style={styles.text}>{t('Feed')}</Text>
      </Pressable>

      {/* Rankings Button */}
      <Pressable style={styles.nestedContainer} onPress={handleRankingsPress}>
        <Image source={icons.crown2} style={styles.crownIcon} />
        <Text style={styles.text}>{t('Ranking')}</Text>
      </Pressable>

      {/* Box Gift Button */}
      <Pressable style={styles.nestedContainer} onPress={handleBoxPress}>
        {timeLeft > 0 ? (
          <>
            <FastImage
              source={icons.boxGift}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.boxGiftIcon}
            />
            {isBoxAvailable && (
              <Text style={styles.text}>{formatDuration(timeLeft)}</Text>
            )}
          </>
        ) : (
          <FastImage
            source={{uri: CHEST_MOVE}}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.chestMoveIcon}
          />
        )}
      </Pressable>

      {/* Diamond Counter */}
      <View style={styles.nestedContainer}>
        <Image source={icons.diamond} style={styles.diamondIcon} />
        <Text style={styles.text}>
          {formatNumber(videoData?.diamond_value || 0)}
        </Text>
      </View>

      {/* Lucky Wheel Button */}
      <Pressable
        onPress={handleWheelLuckPress}
        style={[styles.nestedContainer, styles.wheelContainer]}>
        <Image source={icons.luckyWheel} style={styles.wheelIcon} />
      </Pressable>

      {/* Modals */}
      <RankingModel
        show_model={showModels}
        setShow_model={setShowModels}
        playVideo={playVideo}
      />

      <WheelLuckMainModel
        setLuckyWheel={setIsLuckyWheelVisible}
        luckyWheel={isLuckyWheelVisible}
        user_id={videoData?.user?.id}
      />

      <BoxGiftView
        timeLeft={timeLeft}
        formatDuration={formatDuration}
        is_timer_view_visible={isTimerVisible}
        is_congrats_visible={isCongratsVisible}
        setIs_timer_visible={setIsTimerVisible}
        setIs_congrats_visible={setIsCongratsVisible}
        following={following}
        checkIsFollowing={checkIsFollowing}
        checkIsLiked={checkIsLiked}
        checkIsVideoSharedByUser={checkIsVideoSharedByUser}
        checkIsVideoCommentedByUser={checkIsVideoCommentedByUser}
        isFollowing={isFollowing}
        setIsFollowing={setIsFollowing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    top: 90,
    zIndex: 10000,
  },
  nestedContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 55,
    width: width / 5,
  },
  text: {
    color: '#fff',
    position: 'absolute',
    bottom: 0,
  },
  feedImg: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  crownIcon: {
    width: 40,
    height: 40,
  },
  boxGiftIcon: {
    width: 28,
    height: 23,
    marginTop: 10,
  },
  chestMoveIcon: {
    width: 60,
    height: 60,
  },
  diamondIcon: {
    width: 40,
    height: 40,
  },
  wheelContainer: {
    marginTop: 10,
  },
  wheelIcon: {
    width: 38,
    height: 34,
  },
});

export default React.memo(TopSectionList);
