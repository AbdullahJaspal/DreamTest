import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import Video from 'react-native-video';
import {Container} from '../../../components';
import {Slider} from 'react-native-awesome-slider';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {setShowVideoSectionIcons} from '../../../store/slices/ui/indexSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/navigation';
import FastImage from '@d11/react-native-fast-image';
import {generate_link} from '../../../utils/generate_link';
import {updateGiftData} from '../../../store/slices/content/videoSlice';
import {
  selectCurrentUser,
  selectGiftData,
  selectShowVideoSectionIcons,
  selectVideoPlayback,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

interface CVideoProps {
  videoRef: React.RefObject<any>;
  url: string;
  avatar: string;
  flatListRef: React.RefObject<FlatList<any>>;
  index: number;
  dataLength: number;
  user: any;
  height_screen: number;
  itemId: number;
  allow_audio: boolean;
  functionForVideoClick1: () => void;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type HomeScreenNavigationProps = Props['navigation'];

const CVideo: React.FC<CVideoProps> = ({
  videoRef,
  url,
  avatar,
  flatListRef,
  index,
  dataLength,
  user,
  height_screen,
  itemId,
  allow_audio,
  functionForVideoClick1,
}) => {
  // Use window dimensions for responsive layout
  const {width, height} = useWindowDimensions();

  // State variables
  const [duration, setDuration] = useState(0);
  const [updatedTxt, setUpdatedTxt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [trackHeight, setTrackHeight] = useState(4);
  const [backButtonClick, setBackButtonClick] = useState<number>(0);

  // Refs for timeouts - using refs instead of state for better cleanup
  const timeoutRef = React.useRef<{
    func1: NodeJS.Timeout | null;
    func2: NodeJS.Timeout | null;
    reset: NodeJS.Timeout | null;
  }>({
    func1: null,
    func2: null,
    reset: null,
  });

  // Hooks
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const route = useRoute();
  const dispatch = useDispatch();

  // Selectors
  const currentUser = useAppSelector(selectCurrentUser);
  const showVideoSectionIcons = useAppSelector(selectShowVideoSectionIcons);
  const videoPlayBack = useAppSelector(selectVideoPlayback);
  const videoGift = useAppSelector(selectGiftData);

  // Animated values
  const sliderProgress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);
  const sliderHeight = useSharedValue(1);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Handle showing/hiding video controls
  const handleShowIcons = useCallback(
    (show: boolean) => {
      dispatch(setShowVideoSectionIcons(show));
    },
    [dispatch],
  );

  // Pinch gesture for zoom functionality
  const pinchGesture = useMemo(() => {
    return Gesture.Pinch()
      .onStart(e => {
        focalX.value = e.focalX;
        focalY.value = e.focalY;
        runOnJS(handleShowIcons)(false);
      })
      .onUpdate(e => {
        let newScale = savedScale.value * e.scale;
        // Limit scale between 1 and 4
        newScale = Math.max(1, Math.min(newScale, 4));

        const diffX = focalX.value - width / 2;
        const diffY = focalY.value - height / 2;

        translationX.value = (diffX * (newScale - 1)) / newScale;
        translationY.value = (diffY * (newScale - 1)) / newScale;

        scale.value = newScale;
      })
      .onEnd(() => {
        scale.value = withSpring(1);
        translationX.value = withSpring(0);
        translationY.value = withSpring(0);
        runOnJS(handleShowIcons)(true);
        savedScale.value = 1;
      });
  }, [
    focalX,
    focalY,
    handleShowIcons,
    height,
    savedScale,
    scale,
    translationX,
    translationY,
    width,
  ]);

  // Animated style for pinch zoom
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translationX.value},
      {translateY: translationY.value},
      {scale: scale.value},
    ],
  }));

  // Function to move to next video
  const moveToNext = useCallback(() => {
    if (flatListRef?.current && dataLength > index + 1) {
      flatListRef.current.scrollToIndex({
        index: index + 1,
        animated: true,
      });
    }
  }, [dataLength, index, flatListRef]);

  // Back button handler
  const handleBackButton = useCallback(() => {
    if (route.name === 'Home') {
      setBackButtonClick(prevCount => prevCount + 1);
      return true;
    }
    return false;
  }, [route.name]);

  // Back button focus effect
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      };
    }, [handleBackButton]),
  );

  // Back button actions based on press count
  const backButtonActions = useMemo(
    () => ({
      func1: () => {
        moveToNext();
        return true;
      },
      func2: () => {
        navigation.navigate('UserProfileMainPage', {user_id: user?.id});
        return true;
      },
      func3: () => {
        BackHandler.exitApp();
      },
    }),
    [moveToNext, navigation, user?.id],
  );

  // Effect for handling back button click count
  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current.func1) clearTimeout(timeoutRef.current.func1);
    if (timeoutRef.current.func2) clearTimeout(timeoutRef.current.func2);
    if (timeoutRef.current.reset) clearTimeout(timeoutRef.current.reset);

    // Handle back button clicks
    switch (backButtonClick) {
      case 1:
        timeoutRef.current.func1 = setTimeout(backButtonActions.func1, 400);
        break;
      case 2:
        timeoutRef.current.func2 = setTimeout(backButtonActions.func2, 400);
        break;
      case 3:
        setTimeout(backButtonActions.func3, 400);
        break;
      default:
        break;
    }

    // Reset back button click count after 2 seconds
    timeoutRef.current.reset = setTimeout(() => {
      setBackButtonClick(0);
    }, 2000);

    // Cleanup timeouts
    return () => {
      if (timeoutRef.current.func1) clearTimeout(timeoutRef.current.func1);
      if (timeoutRef.current.func2) clearTimeout(timeoutRef.current.func2);
      if (timeoutRef.current.reset) clearTimeout(timeoutRef.current.reset);
    };
  }, [backButtonClick, backButtonActions]);

  // Determine if video should be paused
  const shouldPauseVideo = useMemo(() => {
    return !(itemId === currentUser && videoPlayBack);
  }, [currentUser, itemId, videoPlayBack]);

  // Empty bubble renderer for slider
  const renderBubble = useCallback(() => null, []);

  // Handle video load progress
  const handleVideoProgress = useCallback(
    data => {
      if (duration > 0) {
        sliderProgress.value = data.currentTime / duration;
      }
    },
    [duration, sliderProgress],
  );

  // Handle video load
  const handleVideoLoad = useCallback(data => {
    setDuration(data.duration);
    setLoading(false);
  }, []);

  // Handle slider sliding start
  const handleSlidingStart = useCallback(() => {
    sliderHeight.value = 6;
    setTrackHeight(12);
    dispatch(setShowVideoSectionIcons(false));
  }, [dispatch, sliderHeight]);

  // Handle slider sliding complete
  const handleSlidingComplete = useCallback(
    value => {
      sliderHeight.value = 1;
      setTrackHeight(4);
      if (videoRef.current) {
        videoRef.current.seek(value * duration);
      }
      sliderProgress.value = value;
      dispatch(setShowVideoSectionIcons(true));
    },
    [dispatch, duration, sliderHeight, sliderProgress, videoRef],
  );

  // Handle slider value change
  const handleValueChange = useCallback(
    v => {
      sliderProgress.value = v;
      if (videoRef.current) {
        videoRef.current.seek(v * duration);
      }
    },
    [duration, sliderProgress, videoRef],
  );

  // Handle gift animation end
  const handleGiftAnimationEnd = useCallback(() => {
    setTimeout(() => {
      dispatch(
        updateGiftData({
          video_link: null,
          video_id: -1,
        }),
      );
    }, 5000);
  }, [dispatch]);

  return (
    <>
      <Pressable onPress={functionForVideoClick1}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.View
            style={[
              styles.mainContainer,
              {height: height_screen, width},
              animatedStyle,
            ]}>
            {url && (
              <Video
                ref={videoRef}
                source={{uri: url}}
                style={styles.video}
                resizeMode="cover"
                paused={shouldPauseVideo}
                fullscreen={false}
                repeat={true}
                muted={allow_audio === true}
                onLoadStart={() => setLoading(true)}
                onLoad={handleVideoLoad}
                onProgress={handleVideoProgress}
                onError={error => console.error('Video error:', error)}
                playInBackground={false}
                ignoreSilentSwitch="ignore"
                bufferConfig={{
                  minBufferMs: 15000,
                  maxBufferMs: 50000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 5000,
                }}
              />
            )}
          </Animated.View>
        </GestureDetector>
      </Pressable>

      {!showVideoSectionIcons && trackHeight === 4 && (
        <View style={[styles.sliderBubbleView, {width}]}>
          <Text style={styles.sliderBubbleTxt}>{updatedTxt}</Text>
        </View>
      )}

      {loading && (
        <View style={[styles.loading, {width}]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Gift overlay */}
      {videoGift.video_link && videoGift.video_id === itemId && (
        <View style={[styles.videoPlayer, {width: width + 70, height}]}>
          <FastImage
            source={{uri: generate_link(videoGift.video_link)}}
            style={styles.fullFlex}
            resizeMode="stretch"
            onLoadEnd={handleGiftAnimationEnd}
          />
        </View>
      )}

      <Container
        width={width}
        alignItems="center"
        justifyContent="center"
        position="absolute"
        bottom={0.2}
        zIndex={10000000}>
        <Slider
          style={[styles.sliderContainer, {width: width - 10}]}
          progress={sliderProgress}
          minimumValue={min}
          maximumValue={max}
          sliderHeight={sliderHeight.value}
          renderBubble={renderBubble}
          onSlidingStart={handleSlidingStart}
          onSlidingComplete={handleSlidingComplete}
          thumbWidth={trackHeight}
          onValueChange={handleValueChange}
          theme={{
            disableMinTrackTintColor: '#fff',
            maximumTrackTintColor: '#ffffff',
            minimumTrackTintColor: '#09fff0',
            cacheTrackTintColor: '#333',
            bubbleBackgroundColor: '#666',
            heartbeatColor: '#999',
          }}
        />
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
  },
  mainContainer: {
    zIndex: 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  sliderBubbleView: {
    height: 150,
    position: 'absolute',
    zIndex: 1000,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderBubbleTxt: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loading: {
    position: 'absolute',
    height: '100%',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -35,
    right: 0,
    zIndex: 100000,
  },
  fullFlex: {
    flex: 1,
  },
});

export default React.memo(CVideo);
