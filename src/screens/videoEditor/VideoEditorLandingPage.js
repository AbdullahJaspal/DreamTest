import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {FFmpegKit, ReturnCode, FFprobeKit} from 'ffmpeg-kit-react-native';
import CircularPattern from './components/CircularPattern';
import FFmpegWrapper from './utils/Segment_video';

import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import LeftIcon from './components/LeftIcon';
import MainEditor from './components/MainEditor';
import TopSheetMediaSelection from './components/TopSheetMediaSelection';
import PropertySettings from './components/PropertySettings';
import {applyWarnEffect} from './utils/Trim_video';
import {stateList} from './State';
import {useDispatch} from 'react-redux';
import {
  change_video_url,
  change_loading,
} from '../../store/slices/content/videoSlice';
import Recording from './components/Recording';
import TopSheetMusicSelection from './components/TopSheetMusicSelection';
import SweetStickers from './sticker/SweetStickers';
import {useAppSelector} from '../../store/hooks';
import {
  selectPlayVideo,
  selectShowRecording,
  selectVideo,
} from '../../store/selectors';
import {gifs} from '../../assets/gifs';
const {width, height} = Dimensions.get('screen');
export const content_width = {
  LEFT_CONTAINER: {
    width: 50,
    height: height,
  },
  RIGHT_CONTAINER: {
    width: width - 50,
    height: height,
  },
  RIGHT_BOTTOM_CONTAINER: {
    width: width - 50,
    height: height * 38,
  },
  RIGHT_TOP_RIGHT: {
    width: 250,
    height: height - height * 38,
  },
  RIGHT_TOP_LEFT: {
    width: width - (50 + 250),
    height: height - height * 38,
  },
  POINTER_POSITION: {
    x: 300,
  },
};

const VideoEditorLandingPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const videoPlayRef = useRef(null);
  const imageDisplayView = useRef(null);
  const [video_segment, setvideo_segment] = useState('');
  const [trimmed_videopath, setTrimmed_video_path] = useState('');
  const leftPosition = useSharedValue(200);
  const positionX = useSharedValue(0);
  const selected_part = useSharedValue(800);
  const sliding_direction = useSharedValue(0);
  const positive_translation = useSharedValue(0);
  const negative_translation = useSharedValue(0);
  const left_position = useSharedValue(0);
  const right_position = useSharedValue(0);
  const [show_editor, setShow_editor] = useState(false);
  const [open_top_sheet, setOPen_top_sheet] = useState(false);
  const [show_media, setShow_media] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get('window'),
  );
  const {width, height} = Dimensions.get('window');
  const [start_recording, setStart_recording] = useState(true);
  const [show_music_selection, setShow_music_selection] = useState(true);
  const [text_overlay, setText_overlay] = useState('');
  const [property_settings, setProperty_settings] = useState({
    visible: false,
  });
  const video = useAppSelector(selectVideo);
  const play_video = useAppSelector(selectPlayVideo);
  const show_recording = useAppSelector(selectShowRecording);
  const sticker_top_position = useSharedValue(10);
  const sticker_left_position = useSharedValue(10);
  const sticker_right_position = useSharedValue(10);
  const sticker_bottom_position = useSharedValue(10);
  const [textSize, setTextSize] = useState({width: 0, height: 0});

  const handleTextLayout = event => {
    const {width, height} = event.nativeEvent.layout;
    setTextSize({width, height});
  };
  const content_width = {
    LEFT_CONTAINER: {
      width: 50,
      height: height,
    },
    RIGHT_CONTAINER: {
      width: width - 50,
      height: height,
    },
    RIGHT_BOTTOM_CONTAINER: {
      width: width - 50,
      height: height * 38,
    },
    RIGHT_TOP_RIGHT: {
      width: 250,
      height: height - height * 38,
    },
    RIGHT_TOP_LEFT: {
      width: width - (50 + 250),
      height: height - height * 38,
    },
    POINTER_POSITION: {
      x: 300,
    },
  };
  const [show_loader, setShow_loader] = useState(false);
  const [video_path, setVideo_path] = useState('');

  useEffect(() => {
    // DETECT WHEATHER THE LIST IS EMPTY OR NOT IF EMPTY THEN ADD THE CURRENT URL OF THE VIDEO TO IT
    if (stateList.size == 0) {
      stateList.addState(video?.video_url);
      dispatch(change_video_url(stateList.current.data));
    } else {
      dispatch(change_video_url(stateList.current.data));
    }
  }, []);

  // EFFECT FOR UPDATING THE DIMENSION OF THE SCREEN SO THAT IF THE ORIENTATION OF THE SCREEN CHANGES THEY MANAGE THE THINGS
  useEffect(() => {
    const updateDimensions = ({window}) => {
      setScreenDimensions(window);
    };
    Dimensions.addEventListener('change', updateDimensions);
    return () => {};
  }, []);

  // EFFECT FOR CHANGING THE ORIENTATION OF SCREEN
  // useEffect(() => {
  //   Orientation.lockToLandscape();
  //   return () => {
  //     Orientation.unlockAllOrientations();
  //   };
  // }, []);

  // WORK FLOW OF VIDEO EDIITNG
  // 1. CHAGE THE LOADER TO TRUE, SO THAT USER FEELS SOMETHING HAPPENING
  // 2. GET THE PATH OF CACHE DIRECTORY PATH.
  // 3. MAKE A FILENAME FOR THE EDITED VIDEO TO STORE WITH THAT NAME.
  // 4. MAKE THE PATH, WHERE YOU WANT TO STORE THE VIDEO
  // 5. WRITE FFMPEG COMMAND FOR VIDEO EDITING
  // 6. EXECUTE THE FFMPEG COMMAND
  // 7. IF SUCCESSFULLY EXECUTED THEN ADD THE OUTPUT PATH TO STATELIST FOR MANAGING EVERYTHING
  // 8. THEN AFTER ADD THE OUTPUT FILE TO REDUX SO THE VIDEO START PLAYING ON THE SCREEN

  // FUNCTION FOR ROTATING THE VIDEO
  const rotateVideo = async () => {
    console.log('video rotation');
    dispatch(change_loading(true)); // CHANGE THE LOADING TO TRUE
    const cache_dir_path = await RNFS.CachesDirectoryPath; // GETTING THE PATH OF CACHE DIRECTORY
    const filename = new Date().getTime(); // MAKING THE FILENAME OF THE OF THE VIDEO BY THE TIMESTAMP
    const output_path = `${cache_dir_path}/${filename}.mp4`; // OUTPUT FILE PATH WHEN THE VIDEO IS EDITED THEY STORED HERE
    const command = `-i ${video.video_url} -vf "transpose=0" ${output_path}`; // FFMPEG COMMAND FOR ROTATING THE VIDEO
    // FUNCTION FOR EXECUTING THE FFMPEG COMMAND
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode(); // GETTING THE RETURN CODE OF THE EXECUTION
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path); // IF THE VIDEO EDITING IS SUCCESSFULL SET THE OUTPUT FILE PATH THE STATELIST. STATELIST IS A DOUBLY LINKED LIST IMPORTED FROM STATE FILE
        dispatch(change_video_url(stateList.current.data)); // CHANGING THE CURRENT EDITED PATH OF VIDEO TO REDUX FOR PLAYING THE VIDEO ON THE SCREEN
        dispatch(change_loading(false)); // SET OUT THE LOADING VIDEO TO FALSE
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancel');
        dispatch(change_loading(false));
      } else {
        dispatch(change_loading(false));
        console.log('error');
      }
    });
  };
  const rotateAntiClockwiseVideo = async () => {
    console.log('video rotation');
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const command = `-i ${video.video_url} -vf "transpose=1" ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancel');
        dispatch(change_loading(false));
      } else {
        dispatch(change_loading(false));
        console.log('error');
      }
    });
  };
  const mirroringHorizontally = async () => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const command = `-i ${video.video_url} -vf "hflip" ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancel');
        dispatch(change_loading(false));
      } else {
        dispatch(change_loading(false));
        console.log('error');
      }
    });
  };
  const mirroringVertically = async () => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const command = `-i ${video.video_url} -vf "vflip" ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancel');
        dispatch(change_loading(false));
      } else {
        dispatch(change_loading(false));
        console.log('error');
      }
    });
  };
  const reverse_video = async () => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const command = `-i ${video.video_url} -vf reverse ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancel');
        dispatch(change_loading(false));
      } else {
        dispatch(change_loading(false));
        console.log('error');
      }
    });
  };

  const resize_video = async () => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const command = `-i ${video.video_url} -f lavfi -i color=c=white:s=1280x720:r=24 -filter_complex \" [0:v] [1:v]overlay=shortest=1,format=yuv420p [out]\" -map \" [out]\" ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancel');
        dispatch(change_loading(false));
      } else {
        dispatch(change_loading(false));
        console.log('error');
      }
    });
  };

  const compressVideo = async () => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;

    // Set the desired video bitrate and codec options
    const videoBitrate = '1000k'; // Adjust the bitrate as needed
    const videoCodec = 'libx264'; // Adjust the codec as needed

    const command = `-i ${video.video_url} -b:v ${videoBitrate} -vcodec ${videoCodec} -vf "scale=1280:720" ${output_path}`;

    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('Success: Compressed video saved at', output_path);
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('Cancel: Video compression canceled');
        dispatch(change_loading(false));
      } else {
        console.error('Error: Video compression failed');
        dispatch(change_loading(false));
      }
    });
  };

  const getVideoInformation = async () => {
    try {
      const ffprobeCommand = `-i ${video?.video_url} -show_format -show_streams -v quiet -print_format json`;
      const session = FFprobeKit.execute(ffprobeCommand);
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        const output = await session.getOutput();
        const ffprobeData = JSON.parse(output);
        const format = ffprobeData.format;
        const streams = ffprobeData.streams;

        const videoFormat = format.format_name;
        const durationInSeconds = parseFloat(format.duration);
        const videoStreams = streams.filter(
          stream => stream.codec_type === 'video',
        );
        const audioStreams = streams.filter(
          stream => stream.codec_type === 'audio',
        );
        return {
          videoFormat,
          durationInSeconds,
          videoStreams,
          audioStreams,
        };
      } else {
        console.error(
          'Error getting video information:',
          returnCode.getMessage(),
        );
        return null;
      }
    } catch (error) {
      console.error('Error getting video information:', error);
      return null;
    }
  };

  const getInformation = async () => {
    try {
      const result = await getVideoInformation();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const trim_video = async () => {
    const chache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${chache_dir_path}/${filename}.mp4`;
    const command = `-i ${output_video_path} -vf reverse ${output_path}`;

    FFmpegKit.execute(command).then(async session => {
      const returncode = await session.getReturnCode();
      if (returncode == 0) {
        console.log('video editing succesfull');
        setOutput_video_path('');
        setTrimmed_video_path(output_path);
      } else {
        console.log('video editing error');
      }
    });
  };

  // DATA OF THE LEFT ICONS
  const data = [
    {
      id: 1,
      group_name: 'Entypo',
      icon_name: 'chevron-left',
      active: true,
      onPress: () => {
        navigation.goBack();
      },
    },
    {
      id: 2,
      group_name: 'EvilIcons',
      icon_name: 'undo', // UNDO MEANS GOING BACK ONE STEP
      active: stateList?.current?.prev || false, // FALSE MEANS, CURRENTLY THEIER IS NOTHING HAPEENING WITH VIDEO, BECOME TRUE IF SOMETHING HAPPENING WITH THE VIDEO.
      onPress: () => {
        if (stateList?.current?.prev) {
          stateList.undo();
          dispatch(change_video_url(stateList.current.data));
        }
      },
    },
    {
      id: 3,
      group_name: 'EvilIcons',
      icon_name: 'redo', // REDO MEANS, IF SOMEONE EDITIED THE VIDEO AND THEY ARE NOT AT THE LAST EDITED VIDEO PATH
      active: stateList?.current?.next || false, // THEY BECOME TRUE IF SOMEONE CLICK UNDO ITEM BEFORE.
      onPress: () => {
        if (stateList?.current.next) {
          stateList.redo();
        }
        dispatch(change_video_url(stateList.current.data));
      },
    },
    {
      id: 4,
      group_name: 'MaterialCommunityIcons',
      icon_name: 'aspect-ratio',
      active: false,
      onPress: () => {
        // applyWarmEffect()
        console.log('resized video pressed');
        getInformation();
      },
    },
    {
      id: 5,
      group_name: 'Ionicons',
      icon_name: 'settings',
      active: false,
      onPress: () => {
        setProperty_settings(p => ({
          ...p,
          visible: true,
        }));
      },
    },
    {
      id: 6,
      group_name: 'MaterialIcons',
      icon_name: 'vertical-align-center',
      active: false,
      onPress: () => {
        compressVideo();
      },
    },
    {
      id: 7,
      group_name: 'MaterialCommunityIcons',
      icon_name: 'logout',
      active: false,
      onPress: () => {
        mirroring_video();
      },
    },
  ];
  const segment_video = async () => {
    FFmpegWrapper.getFrames(
      'segmentedd_cmd33sschsda2e31',
      video?.video_url,
      10,
      filePath => {
        const _frameURI = [];
        for (let i = 0; i < 10; i++) {
          _frameURI.push(
            `${filePath.replace('%4d', String(i + 1).padStart(4, 0))}`,
          );
        }
        console.log(_frameURI);
        setvideo_segment(_frameURI);
      },
    );
  };

  useEffect(() => {
    segment_video();
  }, []);

  const renderFrame = (frame, index) => {
    return (
      <Image
        key={index}
        source={{uri: 'file://' + frame}}
        style={{
          width: 80,
          height: 60,
          zIndex: 10,
        }}
        onLoad={() => {
          console.log('Image loaded');
        }}
      />
    );
  };

  const handleOnScroll = event => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    videoPlayRef.current.seek(9);
    // console.log(contentOffset)
    // console.log(contentSize)
    // console.log(layoutMeasurement)
  };

  const minrange = -500;
  const maxrange = 300;

  const handleOnTouchStart = event => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    console.log(contentOffset);
    console.log(contentSize);
    console.log(layoutMeasurement);
  };

  const onMomentumScrollBegin = event => {
    const {contentOffset} = event.nativeEvent;
    console.log('onMomentumScrollBegin', contentOffset);
  };

  const onMomentumScrollEnd = event => {
    const {contentOffset} = event.nativeEvent;
    console.log('onMomentumScrollEnd', contentOffset);
  };

  const handleGesture = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = leftPosition.value;
      const gesture_event = {
        absoluteX: event.absoluteX,
        absoluteY: event.absoluteY,
        x: event.x,
        y: event.y,
        handlerTag: event.handlerTag,
        numberOfPointers: event.numberOfPointers,
        state: event.state,
        translationX: event.translationX,
        translationY: event.translationY,
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      };
      const gesture_context = {
        dictionary: context.dictionary,
        width: context.width,
      };

      // console.log("onStart", gesture_event, gesture_context)
    },
    onActive: (event, context) => {
      leftPosition.value = context.startX + event.translationX;
      positionX.value = event.absoluteX;
      const gesture_event = {
        absoluteX: event.absoluteX,
        absoluteY: event.absoluteY,
        x: event.x,
        y: event.y,
        handlerTag: event.handlerTag,
        numberOfPointers: event.numberOfPointers,
        state: event.state,
        translationX: event.translationX,
        translationY: event.translationY,
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      };
      const gesture_context = {
        dictionary: context.dictionary,
        width: context.width,
      };

      // console.log("onActive", gesture_event,)
    },
    onEnd: (event, context) => {
      if (leftPosition.value < minrange) {
        leftPosition.value = withTiming(minrange);
      } else if (leftPosition.value > maxrange) {
        leftPosition.value = withTiming(maxrange);
      }
      const gesture_event = {
        absoluteX: event.absoluteX,
        absoluteY: event.absoluteY,
        x: event.x,
        y: event.y,
        handlerTag: event.handlerTag,
        numberOfPointers: event.numberOfPointers,
        state: event.state,
        translationX: event.translationX,
        translationY: event.translationY,
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      };
      const gesture_context = {
        dictionary: context.dictionary,
        width: context.width,
      };

      // console.log("onEnd", gesture_event, gesture_context)
    },
  });

  const getViewDetails = () => {
    imageDisplayView.current.measure((x, y, width, height, pageX, pageY) => {
      console.log('---------------');
      console.log('pageX', pageX);
      console.log('pageY', pageY);
      console.log('x', x);
      console.log('y', y);
      console.log('width', width);
      console.log('height', height);
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: withTiming(leftPosition.value)}],
    };
  });

  const handleTapGesture = event => {
    if (event.nativeEvent.state == State.END) {
      setShow_editor(e => !e);
    }
  };
  const stickerAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: sticker_top_position.value,
      bottom: sticker_bottom_position.value,
      left: sticker_left_position.value,
      right: sticker_right_position.value,
    };
  });

  const handleNestedGesture = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = event.x;
      const velocityX = event.velocityX;
      const direction = velocityX > 0 ? 1 : -1;
      sliding_direction.value = direction;

      const gesture_event = {
        absoluteX: event.absoluteX,
        absoluteY: event.absoluteY,
        x: event.x,
        y: event.y,
        handlerTag: event.handlerTag,
        numberOfPointers: event.numberOfPointers,
        state: event.state,
        translationX: event.translationX,
        translationY: event.translationY,
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      };
      const gesture_context = {
        dictionary: context.dictionary,
        width: context.width,
      };

      // console.log("onstart", gesture_event, gesture_context)
    },
    onActive: (event, context) => {
      // const { selected_part: x } = event;
      const velocityX = event.velocityX;
      const direction = velocityX > 0 ? 1 : -1;
      sliding_direction.value = direction;
      positive_translation.value = event.translationX;
      negative_translation.value = event.translationX;
      const x = event.x;
      if (x > 0 && x < 20) {
        if (direction > 0) {
          left_position.value = event.x + event.translationX;
          console.log('detecked');
        } else {
          left_position.value = event.x - event.translationX;
        }
      }
      // left_position.value = event.x;
      right_position.value = context.startX + event.translationX;

      // console.log(event.x)
      const gesture_event = {
        absoluteX: event.absoluteX,
        absoluteY: event.absoluteY,
        x: event.x,
        y: event.y,
        handlerTag: event.handlerTag,
        numberOfPointers: event.numberOfPointers,
        state: event.state,
        translationX: event.translationX,
        translationY: event.translationY,
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      };
      const gesture_context = {
        dictionary: context.dictionary,
        width: context.width,
      };
    },
    onEnd: (event, context) => {
      const {velocityX} = event;
      const snapThreshold = 100;
      const direction = velocityX > 0 ? 1 : -1;
      const target_width = direction > 0 ? 0 : -800;
      const gesture_event = {
        absoluteX: event.absoluteX,
        absoluteY: event.absoluteY,
        x: event.x,
        y: event.y,
        handlerTag: event.handlerTag,
        numberOfPointers: event.numberOfPointers,
        state: event.state,
        translationX: event.translationX,
        translationY: event.translationY,
        velocityX: event.velocityX,
        velocityY: event.velocityY,
      };
      const gesture_context = {
        dictionary: context.dictionary,
        width: context.width,
      };
    },
  });

  const selectedStyle = useAnimatedStyle(() => {
    const direction = sliding_direction.value ?? 0;
    const width =
      direction > 0
        ? withTiming(800 - positive_translation?.value ?? 0)
        : withTiming(800 + positive_translation?.value ?? 0);
    const left = withTiming(left_position.value);
    const right = withTiming(right_position.value);
    return {
      width,
      left,
      right,
    };
  });
  const minX = 0; // Minimum X coordinate
  const minY = -15; // Minimum Y coordinate
  const maxX = width - 350; // Maximum X coordinate
  const maxY = height * 0.5; // Max

  const handleStickerGesture = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startTop = sticker_top_position.value;
      ctx.startLeft = sticker_left_position.value;
      ctx.startBottom = sticker_bottom_position.value;
      ctx.startRight = sticker_right_position.value;
    },
    onActive: (event, ctx) => {
      runOnJS(clamp);
      const newTop = ctx.startTop + event.translationY;
      const newLeft = ctx.startLeft + event.translationX;
      const newBottom = ctx.startBottom - event.translationY;
      const newRight = ctx.startRight - event.translationX;
      runOnJS(updateStickerPosition)(
        newTop,
        newLeft,
        newBottom,
        newRight,
        minY,
        minX,
        maxY,
        maxX,
      );
    },
  });

  function updateStickerPosition(
    newTop,
    newLeft,
    newBottom,
    newRight,
    minY,
    minX,
    maxY,
    maxX,
  ) {
    sticker_top_position.value = clamp(newTop, minY, maxY);
    sticker_left_position.value = clamp(newLeft, minX, maxX);
    sticker_bottom_position.value = clamp(newBottom, minY, maxY);
    sticker_right_position.value = clamp(newRight, minX, maxX);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  return (
    <>
      <GestureHandlerRootView>
        <View
          style={{
            width: width,
            height: height,
            flexDirection: 'row',
            backgroundColor: 'grey',
          }}>
          {/* left button list */}
          <View
            style={{
              width: content_width.LEFT_CONTAINER.width,
              height: content_width.LEFT_CONTAINER.height,
              backgroundColor: 'red',
              zIndex: 1,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
            }}>
            {/* FlatList for displaying all the button */}
            <FlatList
              data={data}
              renderItem={({item}) => (
                <View
                  style={{
                    width: 50,
                    height: height / 7,
                    backgroundColor: 'red',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopWidth: 0.5,
                    borderColor: 'white',
                    borderRightWidth: 0,
                  }}>
                  <LeftIcon
                    group_name={item.group_name}
                    icon_name={item.icon_name}
                    size={25}
                    onPress={item.onPress}
                    color={item?.active ? '#fff' : 'rgba(255, 255, 255, 0.4)'}
                  />
                </View>
              )}
            />
          </View>

          {/* extreme right view  */}
          <View
            style={{
              width: content_width.RIGHT_CONTAINER.width,
              height: content_width.RIGHT_CONTAINER.height,
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
            }}>
            {/* Top View */}
            <View
              style={{
                width: width - 50,
                height: height * 0.62,
                backgroundColor: 'white',
                flexDirection: 'row',
              }}>
              {/* Left view  */}
              {/* video main view for handeling many thing */}
              <View
                style={{
                  width: content_width.RIGHT_TOP_LEFT.width,
                  height: content_width.RIGHT_TOP_LEFT.height,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRightWidth: 5,
                  borderRightColor: '#020202',
                  borderLeftWidth: 5,
                }}>
                {text_overlay && (
                  <PanGestureHandler onGestureEvent={handleStickerGesture}>
                    <Animated.Text
                      onLayout={handleTextLayout}
                      style={[
                        {
                          position: 'absolute',
                          zIndex: 1000,
                          color: text_overlay?.color,
                          fontSize: text_overlay?.fontSize,
                          // fontWeight: text.fontWeight,
                          // fontStyle: text.fontStyle,
                          // lineHeight: text.lineHeight,
                          // letterSpacing: text.letterSpacing,
                          textAlign: text_overlay?.textAlign,
                          // textAlignVertical: text.textAlignVertical,
                          // textDecorationLine: text.textDecorationLine,
                          // textDecorationColor: text.textDecorationColor,
                          // textDecorationStyle: text.textDecorationStyle,
                          // textTransform: text.textTransform,
                          // textShadowColor: text.textShadowColor,
                          // textShadowOffset: { width: text?.textShadowOffset?.width, height: text?.textShadowOffset?.height },
                          // textShadowRadius: text.textShadowRadius,
                          backgroundColor: text_overlay?.backgroundColor,
                          // opacity: text.opacity,
                          // elevation: text.elevation,
                          fontFamily: text_overlay?.fontFamily,
                        },
                        stickerAnimatedStyle,
                      ]}>
                      {text_overlay?.value}
                    </Animated.Text>
                  </PanGestureHandler>
                )}

                {video && (
                  <Video
                    source={{uri: 'file://' + video?.video_url}}
                    style={{flex: 1}}
                    resizeMode="contain"
                    paused={play_video}
                    repeat={false}
                    filterEnabled={false}
                    controls={false}
                  />
                )}
              </View>

              {/* main editor view for handeling all the editing functionality */}
              <View
                style={{
                  width: content_width.RIGHT_TOP_RIGHT.width,
                  height: content_width.RIGHT_TOP_RIGHT.height,
                  backgroundColor: 'grey',
                }}>
                {!show_editor && !show_recording && (
                  <CircularPattern
                    setShow_media={setShow_media}
                    setShow_editor={setShow_editor}
                    setOPen_top_sheet={setOPen_top_sheet}
                    setShow_music_selection={setShow_music_selection}
                    setText_overlay={setText_overlay}
                  />
                )}
                {show_editor && (
                  <MainEditor
                    setShow_editor={setShow_editor}
                    show_editor={show_editor}
                    rotateVideo={rotateVideo}
                    rotateAntiClockwiseVideo={rotateAntiClockwiseVideo}
                    mirroringHorizontally={mirroringHorizontally}
                    mirroringVertically={mirroringVertically}
                    reverse_video={reverse_video}
                  />
                )}
                {show_recording && !show_editor && <Recording />}
              </View>
            </View>

            {/* Bottom View */}
            <View
              style={{
                width: content_width.RIGHT_BOTTOM_CONTAINER.width,
                height: content_width.RIGHT_BOTTOM_CONTAINER.height,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                paddingTop: 10,
              }}>
              <PanGestureHandler onGestureEvent={handleGesture}>
                <Animated.View
                  style={{
                    width: content_width.RIGHT_BOTTOM_CONTAINER.width,
                    height: content_width.RIGHT_BOTTOM_CONTAINER.height,
                  }}>
                  {video_segment && (
                    <TapGestureHandler onHandlerStateChange={handleTapGesture}>
                      <Animated.View
                        ref={imageDisplayView}
                        style={[
                          {
                            flexDirection: 'row',
                            zIndex: -1,
                            width: 810,
                            height: 70,
                          },
                          animatedStyle,
                        ]}>
                        {video_segment.map((frame, index) =>
                          renderFrame(frame, index),
                        )}
                        {show_editor && (
                          <Animated.View
                            style={[
                              {
                                position: 'absolute',
                                bottom: 0,
                                top: 0,
                                height: 60,
                                zIndex: 1000,
                                borderWidth: 2,
                                borderColor: 'red',
                              },
                              selectedStyle,
                            ]}>
                            <PanGestureHandler
                              onGestureEvent={handleNestedGesture}>
                              <Animated.View style={{flex: 1}} />
                            </PanGestureHandler>
                          </Animated.View>
                        )}
                      </Animated.View>
                    </TapGestureHandler>
                  )}

                  {!video_segment && (
                    <TouchableOpacity
                      onPress={segment_video}
                      style={{
                        backgroundColor: 'blue',
                        width: 70,
                        height: 40,
                      }}>
                      <Text>Video</Text>
                    </TouchableOpacity>
                  )}
                  <View
                    style={{
                      width: 2,
                      height: content_width.RIGHT_BOTTOM_CONTAINER.height,
                      backgroundColor: 'yellow',
                      position: 'absolute',
                      bottom: 0,
                      right: content_width.POINTER_POSITION.x,
                    }}
                  />
                </Animated.View>
              </PanGestureHandler>
            </View>
          </View>

          <StatusBar hidden={true} />
        </View>
      </GestureHandlerRootView>
      {/* <Modal visible={property_settings.visible}> */}
      {open_top_sheet && (
        <TopSheetMediaSelection
          open_top_sheet={open_top_sheet}
          setOPen_top_sheet={setOPen_top_sheet}
        />
      )}
      {show_music_selection && (
        <TopSheetMusicSelection
          setShow_music_selection={setShow_music_selection}
        />
      )}

      <PropertySettings
        property_settings={property_settings}
        setProperty_settings={setProperty_settings}
      />
      {/* </Modal> */}
      {video?.show_loader && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={gifs.tiktokLoader} style={{width: 50, height: 50}} />
        </View>
      )}
    </>
  );
};

export default VideoEditorLandingPage;

const styles = StyleSheet.create({
  mainContainers: {
    width: width,
    height: height,
    flexDirection: 'row',
    backgroundColor: 'grey',
  },
  leftView: {
    width: content_width.LEFT_CONTAINER.width,
    height: content_width.LEFT_CONTAINER.height,
    backgroundColor: 'red',
    zIndex: 100,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  rightView: {
    width: content_width.RIGHT_CONTAINER.width,
    height: content_width.RIGHT_CONTAINER.height,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  topView: {
    width: width - 50,
    height: height * 0.62,
    backgroundColor: 'white',
    flexDirection: 'row',
  },
  bottomView: {
    width: content_width.RIGHT_BOTTOM_CONTAINER.width,
    height: content_width.RIGHT_BOTTOM_CONTAINER.height,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  topRightView: {
    width: content_width.RIGHT_TOP_RIGHT.width,
    height: content_width.RIGHT_TOP_RIGHT.height,
    backgroundColor: 'grey',
  },
  topLeftView: {
    width: content_width.RIGHT_TOP_LEFT.width,
    height: content_width.RIGHT_TOP_LEFT.height,
  },
  image_view: {
    width: 50,
    height: (height - 25) / 7,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: 'white',
    borderRightWidth: 0,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
