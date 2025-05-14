import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Video, {VideoProperties} from 'react-native-video';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  withDecay,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {change_video_url} from '../../store/slices/content/videoSlice';
import {useDispatch} from 'react-redux';
import {segment_video} from '../../utils/segment_video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
interface TrimVideoProps {}

const {width} = Dimensions.get('screen');
const TrimVideo: React.FC<TrimVideoProps> = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const initial_video_duration = route?.params?.props?.duration;
  const [duration_list, setDuration_list] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timeLinePosX = useSharedValue(10);
  const widthPerSecond = parseFloat(
    ((width * 0.9) / initial_video_duration).toFixed(1),
  );
  const minWidth = widthPerSecond * 15;
  const maxWidth = widthPerSecond * 60;
  const leftAbsPos = useSharedValue(0);
  const rightAbsPos = useSharedValue(
    width * 0.9 > maxWidth ? maxWidth : width * 0.9,
  );
  const videoRef = useRef<VideoProperties>();
  const [complete_video_segment, setComplete_video_segment] = useState<
    string[]
  >([]);
  const [video_volume, setVideo_volume] = useState<boolean>(true);

  const stateHistory = useRef([
    {left: leftAbsPos.value, right: rightAbsPos.value},
  ]);
  const currentPosition = useRef(0);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const undo = () => {
    if (canUndo) {
      currentPosition.current--;
      const {left, right} = stateHistory.current[currentPosition.current];
      leftAbsPos.value = withDecay({velocity: 0, state: left});
      rightAbsPos.value = withDecay({velocity: 0, state: right});
    }
  };

  const redo = () => {
    if (canRedo) {
      currentPosition.current++;
      const {left, right} = stateHistory.current[currentPosition.current];
      leftAbsPos.value = withDecay({velocity: 0, state: left});
      rightAbsPos.value = withDecay({velocity: 0, state: right});
    }
  };

  useEffect(() => {
    setCanUndo(currentPosition.current > 0);
    setCanRedo(currentPosition.current < stateHistory.current.length - 1);
  }, [currentPosition.current, stateHistory.current]);

  const storeState = () => {
    currentPosition.current++;
    stateHistory.current.splice(currentPosition.current);
    stateHistory.current.push({
      left: leftAbsPos.value,
      right: rightAbsPos.value,
    });
    // Update the undo and redo buttons
    updateUndoRedoButtons();
  };

  const updateUndoRedoButtons = () => {
    setCanUndo(currentPosition.current > 0);
    setCanRedo(currentPosition.current < stateHistory.current.length - 1);
  };

  const segment = useCallback(async () => {
    const result = await segment_video(
      route?.params?.props?.pathVideo,
      6,
      initial_video_duration,
    );
    setComplete_video_segment(result);
  }, []);

  useEffect(() => {
    runOnJS(segment)();
  }, []);

  const saveVideo = async () => {
    try {
      const cache_dir_path = await RNFS.CachesDirectoryPath;
      const filename = new Date().getTime();
      const output_path = `${cache_dir_path}/${filename}.mp4`;

      const command = `-i ${route?.params?.props?.pathVideo} -ss ${
        leftAbsPos.value / widthPerSecond
      } -t ${rightAbsPos.value / widthPerSecond} -c copy ${output_path}`;

      FFmpegKit.executeAsync(command, async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          dispatch(change_video_url(`file://${output_path}`));
          navigation.navigate('PostVideoScreen', {
            durations: total_video_duration.value,
            remix_video_id: route?.params?.props?.remix_video_id,
          });
        } else {
          Toast.show('Save Failed', Toast.LONG);
          console.error('Error: Video Trimming failed');
        }
      });
    } catch (error) {
      Toast.show('Save Failed', Toast.LONG);
      console.log('error', error);
    }
  };

  const difference = useDerivedValue(() => {
    return rightAbsPos.value - leftAbsPos.value;
  });

  const total_video_duration = useDerivedValue(() => {
    return Math.floor((rightAbsPos.value - leftAbsPos.value) / widthPerSecond);
  });

  const handleGoBack = () => {
    Alert.alert(t('Confirmation'), t('Are you sure you want to go back?'), [
      {
        text: t('Cancel'),
        style: 'cancel',
      },
      {
        text: t('Discard'),
        onPress: () => {
          navigation.goBack();
        },
      },
      {
        text: t('Save'),
        onPress: async () => {
          await saveVideo();
        },
      },
    ]);
  };

  const splitDuration = () => {
    const dur = initial_video_duration / 7;
    const dur_list = [];
    for (let i = 0; i < 8; i++) {
      dur_list.push(parseFloat((dur * i).toFixed(1)));
      if (i != 7) {
        dur_list.push('.');
      }
    }
    setDuration_list(dur_list);
  };

  useEffect(() => {
    splitDuration();
  }, [initial_video_duration]);

  const handleTimelineGesture = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      ctx.start = timeLinePosX.value;
      runOnJS(setIsPlaying)(false);
    },
    onActive: (e, ctx) => {
      timeLinePosX.value = ctx.start + e.translationX;
    },
    onEnd: (e, ctx) => {
      runOnJS(setIsPlaying)(true);
    },
  });

  const handleLeftTimeGesture = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      ctx.startX = leftAbsPos.value;
      runOnJS(storeState)();
    },
    onActive: (e, ctx) => {
      leftAbsPos.value = ctx.startX + e.translationX;
    },
    onEnd: (e, ctx) => {
      if (difference.value < minWidth) {
        leftAbsPos.value = minWidth;
      }
      if (difference.value > maxWidth) {
        leftAbsPos.value = maxWidth;
      }
      if (difference.value >= minWidth && difference.value <= maxWidth) {
      } else {
        runOnJS(Toast.show)(
          'We are currently allowing the maximum duration of 60s and minimum duration of 15s',
          Toast.SHORT,
        );
      }

      if (
        timeLinePosX.value < leftAbsPos.value ||
        timeLinePosX.value > rightAbsPos.value
      ) {
        timeLinePosX.value = leftAbsPos.value;
      }
      runOnJS(storeState)();
    },
  });

  const handleRightTimeGesture = useAnimatedGestureHandler({
    onStart: (e, ctx) => {
      ctx.startX = rightAbsPos.value;
      runOnJS(storeState)();
    },
    onActive: (e, ctx) => {
      rightAbsPos.value = ctx.startX + e.translationX;
    },
    onEnd: (e, ctx) => {
      if (difference.value < minWidth) {
        rightAbsPos.value = minWidth;
      }
      if (difference.value > maxWidth) {
        rightAbsPos.value = maxWidth;
      }
      if (difference.value >= minWidth && difference.value <= maxWidth) {
      } else {
        runOnJS(Toast.show)(
          'We are currently allowing the maximum duration of 60s and minimum duration of 15s',
          Toast.SHORT,
        );
      }
      if (
        timeLinePosX.value < leftAbsPos.value ||
        timeLinePosX.value > rightAbsPos.value
      ) {
        timeLinePosX.value = leftAbsPos.value;
      }
      runOnJS(storeState)();
    },
  });

  const rightTimeLineAnimatedStyle = useAnimatedStyle(() => {
    return {
      right: width * 0.9 - rightAbsPos.value,
    };
  });

  const leftTimeLineAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: leftAbsPos.value,
    };
  });

  const durationSelectorAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: leftAbsPos.value,
      right: width * 0.9 - rightAbsPos.value,
    };
  });

  const timeLineAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: timeLinePosX.value,
    };
  });

  const handleSoundPress = () => {
    setVideo_volume(p => !p);
  };

  return (
    <View style={styles.main_container}>
      <View style={styles.top_most_container}>
        <Pressable style={styles.save_button} onPress={saveVideo}>
          <Text style={styles.save_txt}>{t('save')}</Text>
        </Pressable>

        <Pressable onPress={handleGoBack}>
          <Entypo name="chevron-right" size={30} color={'#fff'} />
        </Pressable>
      </View>

      <View style={styles.first_container}>
        <Video
          source={{uri: route?.params?.props?.pathVideo}}
          style={styles.video}
          ref={videoRef}
          resizeMode="contain"
          repeat={true}
          paused={!isPlaying}
          volume={video_volume ? 1.0 : 0.0}
          seek={timeLinePosX.value / widthPerSecond}
          onProgress={v => {
            timeLinePosX.value = widthPerSecond * v?.currentTime;
            const right_duration = rightAbsPos.value / widthPerSecond;
            const left_duration = leftAbsPos.value / widthPerSecond;
            if (v.currentTime > right_duration) {
              videoRef.current?.seek(left_duration);
            }
            if (v.currentTime < left_duration - 1) {
              videoRef.current?.seek(left_duration);
            }
          }}
        />
      </View>

      <View style={styles.middle_container}>
        <Text style={styles.duration_info_txt}>
          {total_video_duration.value} / {initial_video_duration}
        </Text>

        <Pressable
          onPress={() => {
            setIsPlaying(p => !p);
          }}>
          <MaterialIcons
            name={isPlaying ? 'pause-circle-filled' : 'play-circle-fill'}
            size={30}
            color={'#fff'}
          />
        </Pressable>

        <Pressable style={styles.sound_button} onPress={handleSoundPress}>
          <Ionicons
            name={video_volume ? 'volume-high' : 'volume-mute'}
            size={20}
            color={'#fff'}
          />
        </Pressable>

        <View style={styles.undo_redo_view}>
          <Pressable onPress={undo}>
            <MaterialCommunityIcons
              name="undo-variant"
              size={25}
              color={canUndo ? '#fff' : 'grey'}
            />
          </Pressable>

          <Pressable onPress={redo}>
            <MaterialCommunityIcons
              name="redo-variant"
              size={25}
              color={canRedo ? '#fff' : 'grey'}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.bottom_container}>
        <View style={styles.scale_style}>
          {duration_list?.map((item, index) => (
            <Text key={index} style={styles.duration_txt}>
              {item}
            </Text>
          ))}
        </View>

        <View style={styles.timeline_main_style}>
          <View style={styles.timeline_styles}>
            {complete_video_segment?.map((item, index) => (
              <Image
                key={index}
                source={{uri: `file://${item}`}}
                style={{
                  width: (width * 0.9) / complete_video_segment.length,
                  height: 55,
                }}
              />
            ))}
          </View>

          <Animated.View
            style={[styles.duration_selector, durationSelectorAnimatedStyle]}
          />

          <PanGestureHandler onGestureEvent={handleTimelineGesture}>
            <Animated.View
              style={[styles.timeline_selector, timeLineAnimatedStyle]}
            />
          </PanGestureHandler>

          <PanGestureHandler onGestureEvent={handleLeftTimeGesture}>
            <Animated.View
              style={[
                styles.left_timeline_selector,
                leftTimeLineAnimatedStyle,
              ]}>
              <View style={{height: 30, width: 2, backgroundColor: 'red'}} />
            </Animated.View>
          </PanGestureHandler>

          <PanGestureHandler onGestureEvent={handleRightTimeGesture}>
            <Animated.View
              style={[
                styles.right_timeline_selector,
                rightTimeLineAnimatedStyle,
              ]}>
              <View style={{height: 30, width: 2, backgroundColor: 'red'}} />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    </View>
  );
};

export default TrimVideo;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  bottom_container: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 5,
    bottom: 0,
    left: 0,
    right: 0,
  },
  middle_container: {
    width: width,
    height: 45,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  first_container: {
    width: width,
    backgroundColor: '#000',
    paddingHorizontal: 35,
    paddingBottom: 20,
    paddingTop: 5,
    flex: 1,
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  top_most_container: {
    width: width,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  timeline_styles: {
    width: width * 0.9,
    height: 55,
    flexDirection: 'row',
  },
  scale_style: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    position: 'absolute',
    top: 0,
  },
  duration_txt: {
    color: '#fff',
    fontWeight: '700',
  },
  timeline_selector: {
    height: 70,
    width: 5,
    backgroundColor: '#FF3131',
    borderRadius: 5,
    position: 'absolute',
    bottom: -2,
  },
  duration_selector: {
    position: 'absolute',
    height: 55,
    borderRadius: 0,
    borderColor: '#00E8FF',
    justifyContent: 'center',
    borderWidth: 2,
  },
  timeline_main_style: {
    width: width * 0.9,
    position: 'absolute',
    bottom: 5,
  },
  left_timeline_selector: {
    height: 55,
    backgroundColor: '#00E8FF',
    position: 'absolute',
    width: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right_timeline_selector: {
    height: 55,
    backgroundColor: '#00E8FF',
    position: 'absolute',
    width: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  save_button: {
    backgroundColor: '#FF3131',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  save_txt: {
    color: '#fff',
    fontWeight: '700',
  },
  duration_info_txt: {
    color: '#00E8FF',
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    left: 10,
  },
  sound_button: {
    position: 'absolute',
    right: 100,
  },
  undo_redo_view: {
    position: 'absolute',
    flexDirection: 'row',
    right: 10,
    width: 65,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
