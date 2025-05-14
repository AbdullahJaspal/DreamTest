import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {Container} from '../../../components';
import CVideo from './CVideo';
import {useDispatch} from 'react-redux';
import VerticalLeftSection from './VerticalLeftSection';
import {useNavigation} from '@react-navigation/native';
import {setModalSignIn} from '../../../store/slices/ui/indexSlice';
import * as commentApi from '../../../apis/comment.api';
import * as userApi from '../../../apis/userApi';
import * as likeApi from '../../../apis/like.api';
import * as videoApi from '../../../apis/video.api';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import Description from './Description';
import VideoMainAd from './VideoMainAd';
import BottomContainerWithoutAd from './BottomContainerWithoutAd';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import {VideoRef} from 'react-native-video';
import useDiscAnimation from '../hooks/useDiscAnimation';
import {
  setCommentPrivacy,
  setIsShowGift,
} from '../../../store/slices/ui/mainScreenSlice';
import MuteAudio from './MuteAudio';
import {useAppSelector} from '../../../store/hooks';
import {
  selectCurrentUser,
  selectIsLogin,
  selectMyProfileData,
  selectShowVideoSectionIcons,
} from '../../../store/selectors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type HomeScreenNavigationProps = Props['navigation'];

interface VideoItemProps {
  item: any;
  index: number;
  flatListRef: React.RefObject<any>;
  dataLength: number;
  height_screen: number;
  saved_bottomheight: number;
}

const VideoItem = React.forwardRef<any, VideoItemProps>(
  (
    {item, index, flatListRef, dataLength, height_screen, saved_bottomheight},
    ref,
  ) => {
    const {width} = useWindowDimensions();

    const {
      id,
      user_id,
      description,
      video,
      thum,
      created,
      like,
      comment,
      shared,
      user,
      likes,
      title,
      addlink,
      linkwithimg,
      linktext,
      commentPrivacy,
      allow_comments,
      allow_audio,
      remix_video_id,
    } = item;

    const url = `https://dpcst9y3un003.cloudfront.net/${video}`;
    const avatar = `https://dpcst9y3un003.cloudfront.net/${thum}`;

    const dispatch = useDispatch();
    const navigation = useNavigation<HomeScreenNavigationProps>();
    const videoRef = useRef<VideoRef>(null);
    const isPausedRef = useRef<boolean>(false);
    const discAnimatedStyle = useDiscAnimation();

    const isLogin = useAppSelector(selectIsLogin);
    const my_data = useAppSelector(selectMyProfileData);
    const current_video_id = useAppSelector(selectCurrentUser);
    const showVideoSectionIcons = useAppSelector(selectShowVideoSectionIcons);

    const [no_of_comment, setNoOfComment] = useState<number>(0);
    const [original_video_audio_details, setOrigin_video_audio_details] =
      useState<any>();
    const [isLikeAnimating, setLikeAnimating] = useState(false);
    const [num_like, setNum_like] = useState<number>(likes?.length || 0);
    const isIdPresent = useMemo(
      () => likes?.some((item: any) => item?.sender_id === my_data?.id),
      [likes, my_data?.id],
    );
    const [isLike, setIsLike] = useState(!!isIdPresent);

    const textTranslateX = useSharedValue(-50);

    const animationConfig = useMemo(
      () => ({
        toValue: width - 180,
        duration: 10000,
        easing: Easing.linear,
      }),
      [width],
    );

    const soundTestAnimatedStyle = useAnimatedStyle(
      () => ({
        transform: [{translateX: -textTranslateX.value}],
      }),
      [textTranslateX],
    );

    useEffect(() => {
      textTranslateX.value = withRepeat(
        withTiming(animationConfig.toValue, {
          duration: animationConfig.duration,
          easing: animationConfig.easing,
        }),
        -1,
        false,
      );
    }, [textTranslateX, animationConfig]);

    const getNoOfComment = useCallback(async () => {
      if (id !== current_video_id) return;

      try {
        const result = await commentApi.fetchComment(id);
        setNoOfComment(result?.comments?.length || 0);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setNoOfComment(0);
      }
    }, [id, current_video_id]);

    useEffect(() => {
      getNoOfComment();
    }, [getNoOfComment]);

    const getCommentPrivacy = useCallback(async () => {
      if (!my_data?.auth_token) return;

      try {
        const result = await commentApi.fetchCommentPrivacy(my_data.auth_token);
        dispatch(setCommentPrivacy(result?.data?.commentPrivacy));
      } catch (error) {
        console.error('Failed to fetch comment privacy:', error);
      }
    }, [my_data?.auth_token, dispatch]);

    useEffect(() => {
      getCommentPrivacy();
    }, [getCommentPrivacy]);

    const handleClickAvatar = useCallback(() => {
      if (my_data) {
        navigation.navigate('UserProfileMainPage', {user_id: user?.id});
      } else {
        dispatch(setModalSignIn(true));
      }
    }, [my_data, navigation, user?.id, dispatch]);

    useImperativeHandle(ref, () => ({
      pauseVideo: () => pauseVideo(),
      playVideo: () => playVideo(),
    }));

    const pauseVideo = useCallback(() => {
      if (videoRef.current && !isPausedRef.current) {
        videoRef.current.pause();
        isPausedRef.current = true;
      }
    }, []);

    const playVideo = useCallback(() => {
      if (videoRef.current && isPausedRef.current) {
        videoRef.current.resume();
        isPausedRef.current = false;
      }
    }, []);

    const onGiftPress = useCallback(() => {
      if (isLogin) {
        dispatch(setIsShowGift(true));
      } else {
        dispatch(setModalSignIn(true));
      }
    }, [isLogin, dispatch]);

    const handleLike = useCallback(async () => {
      if (!my_data) {
        dispatch(setModalSignIn(true));
        return;
      }

      const video_id = id;
      const reciever_id = user_id;

      try {
        if (isLike) {
          setIsLike(false);
          setNum_like(prev => Math.max(0, prev - 1));
          await likeApi.like(
            {video_id, reciever_id, unlike: true},
            my_data.auth_token,
          );
        } else {
          // Like
          setIsLike(true);
          setNum_like(prev => prev + 1);
          setLikeAnimating(true);

          // Reset animation after delay
          setTimeout(() => {
            setLikeAnimating(false);
          }, 2000);

          await likeApi.like(
            {video_id, reciever_id, unlike: false},
            my_data.auth_token,
          );
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        // Revert UI state on error
        setIsLike(!isLike);
        setNum_like(prev => (isLike ? prev + 1 : Math.max(0, prev - 1)));
      }
    }, [my_data, isLike, id, user_id, dispatch]);

    /**
     * Toggle video play/pause on tap
     */
    const functionForVideoClick1 = useCallback(() => {
      if (isPausedRef.current) {
        playVideo();
      } else {
        pauseVideo();
      }
    }, [pauseVideo, playVideo]);

    /**
     * Record video view
     */
    const addVideoView = useCallback(async () => {
      if (!id || !my_data?.id || id !== current_video_id) return;

      try {
        await userApi.addView({
          video_id: id,
          viewers_id: my_data.id,
        });
      } catch (error) {
        console.error('Failed to add video view:', error);
      }
    }, [id, my_data?.id, current_video_id]);

    useEffect(() => {
      addVideoView();
    }, [addVideoView]);

    /**
     * Handle disc button press to navigate to sound screen
     */
    const handleDiscPress = useCallback(() => {
      if (!my_data) {
        dispatch(setModalSignIn(true));
        return;
      }

      const video_id = remix_video_id || id;
      navigation.navigate('SoundMainScreen', {
        video_id,
        original_video_id: id,
      });
    }, [my_data, remix_video_id, id, navigation, dispatch]);

    /**
     * Get original video details for remixed content
     */
    const getOriginalVideoDetails = useCallback(async () => {
      try {
        if (remix_video_id) {
          const result = await videoApi.getVideoShortInfo(remix_video_id);
          setOrigin_video_audio_details(result?.payload[0]);
        } else {
          setOrigin_video_audio_details(item);
        }
      } catch (error) {
        console.error('Error getting original video details:', error);
      }
    }, [item, remix_video_id]);

    useEffect(() => {
      getOriginalVideoDetails();
    }, [getOriginalVideoDetails]);

    // Determine if ad is available
    const hasAd = Array.isArray(linkwithimg) && linkwithimg.length > 0;

    return (
      <Container width={width} zIndex={10000} height={height_screen}>
        {/* Video Player */}
        <CVideo
          url={url}
          videoRef={videoRef}
          avatar={avatar}
          flatListRef={flatListRef}
          index={index}
          dataLength={dataLength}
          user={user}
          height_screen={height_screen}
          itemId={id}
          allow_audio={allow_audio}
          functionForVideoClick1={functionForVideoClick1}
        />

        {/* UI Elements - Only shown when showVideoSectionIcons is true */}
        {showVideoSectionIcons && (
          <>
            {/* Description (Title and text) */}
            <Description
              title={title}
              description={description}
              addlink={addlink}
              linktext={linktext}
              linkwithimg={linkwithimg}
            />

            {/* Ad or Music/Sound Info */}
            {hasAd ? (
              <VideoMainAd linkwithimg={linkwithimg} />
            ) : (
              <BottomContainerWithoutAd
                discAnimatedStyle={discAnimatedStyle}
                handleDiscPress={handleDiscPress}
                original_video_audio_details={original_video_audio_details}
                createdAt={created}
                soundTestAnimatedStyle={soundTestAnimatedStyle}
                item={item}
              />
            )}

            {/* Mute Audio Indicator */}
            {allow_audio === true && <MuteAudio />}

            {/* Left Side Icons (Like, Comment, Share, etc.) */}
            <VerticalLeftSection
              comment={no_of_comment}
              idVideo={id}
              share={shared}
              item={item}
              num_like={num_like}
              isLike={isLike}
              handleLike={handleLike}
              allow_comments={allow_comments}
              isLikeAnimating={isLikeAnimating}
              playVideo={playVideo}
              pauseVideo={pauseVideo}
              author={thum}
              onGiftPress={onGiftPress}
              user={user}
              handleClickAvatar={handleClickAvatar}
              handleDiscPress={handleDiscPress}
              isAdAvaliable={hasAd}
              discAnimatedStyle={discAnimatedStyle}
              commentPrivacy={commentPrivacy}
            />
          </>
        )}
      </Container>
    );
  },
);

const styles = StyleSheet.create({
  discIcon: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discMainContainer: {
    position: 'absolute',
    left: 10,
    bottom: 15,
    zIndex: 1000000,
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 5,
    color: '#fff',
    textAlign: 'center',
  },
  originalText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0.2, height: 0.2},
    textShadowRadius: 5,
    position: 'absolute',
    left: 0,
  },
  rankingWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: 95,
    right: 2,
    zIndex: 10000,
  },
  rankText: {
    color: '#fff',
    marginLeft: 10,
  },
});

export default React.memo(VideoItem);
