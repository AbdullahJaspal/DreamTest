import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {
  Dispatch,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {COLOR} from '../../../configs/styles';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import {
  Camera,
  CameraCaptureError,
  VideoFile,
} from 'react-native-vision-camera';

const BACKGROUND_COLOR = COLOR.LIGHT_GRAY;
const BACKGROUND_STROKE_COLOR = COLOR.setOpacity(COLOR.DANGER, 0.6);
const STROKE_COLOR = COLOR.DANGER;
const widthButton = 120;
const second = 15000;
const SIZE_MORE = 15;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  isRecord: boolean;
  setIsRecord: Dispatch<React.SetStateAction<boolean>>;
  endRecord: (myUri: string, duration: number) => void;
  camera: RefObject<Camera>;
  progress: SharedValue<number>;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  isRecord,
  endRecord,
  camera,
  progress,
  setIsRecord,
}) => {
  const {R, CIRCLE_LENGTH} = useMemo(() => {
    const R = widthButton / 2 - SIZE_MORE;
    const CIRCLE_LENGTH = 2 * Math.PI * R;
    return {
      R,
      CIRCLE_LENGTH,
    };
  }, []);

  const borderRadiusButtonRecord = useSharedValue(50);
  const widthButtonRecord = useSharedValue(widthButton - 40);

  const startRecording = () => {
    if (camera.current) {
      setIsRecord(true);
      camera.current.startRecording({
        fileType: 'mp4',
        videoBitRate: 'extra-high',
        onRecordingError: function (error: CameraCaptureError): void {
          setIsRecord(false);
          console.log('video recording error', error);
        },
        onRecordingFinished: function (video: VideoFile): void {
          console.log('video recorder ', video);
          setIsRecord(false);
          endRecord(video.path, video.duration);
        },
        videoCodec: 'h265',
      });
    }
  };

  const updateState = useCallback(() => {
    if (camera.current) {
      camera.current.stopRecording();
    }
  }, [camera]);

  const handleAnimationCancelation = () => {
    progress.value = 0;
    cancelAnimation(progress);
    borderRadiusButtonRecord.value = 50;
    widthButtonRecord.value = widthButton - 40;
  };

  useEffect(() => {
    if (isRecord) {
      progress.value = withTiming(
        1,
        {
          duration: (1 - progress.value) * second,
          easing: Easing.linear,
        },
        isFinished => {
          if (isFinished) {
            runOnJS(updateState)();
            runOnJS(handleAnimationCancelation)();
          }
        },
      );
      borderRadiusButtonRecord.value = 10;
      widthButtonRecord.value = widthButton - 80;
    } else {
      handleAnimationCancelation();
    }
  }, [
    widthButtonRecord,
    borderRadiusButtonRecord,
    progress,
    isRecord,
    widthButton,
  ]);

  const handleClick = useCallback(() => {
    if (isRecord) {
      if (camera.current) {
        camera.current.pauseRecording();
        handleAnimationCancelation();
      }
    } else if (progress.value >= 1) {
      setIsRecord(true);
      camera.current?.resumeRecording();
    } else {
      startRecording();
    }
  }, [startRecording, isRecord]);

  /**
   * Button Animation
   */
  const styleAnimated = useAnimatedStyle(() => {
    const timer = 200;
    const borderRadius = withTiming(borderRadiusButtonRecord.value, {
      duration: timer,
      easing: Easing.linear,
    });
    const width = withTiming(widthButtonRecord.value, {
      duration: timer,
      easing: Easing.linear,
    });
    return {
      borderRadius,
      width,
      height: width,
    };
  }, []);

  // Stroke animation
  const animatedProps = useAnimatedProps(
    () => ({
      strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Svg style={{transform: [{rotate: '-90deg'}]}}>
        {/* <Circle
          cx={widthButton / 2}
          cy={widthButton / 2}
          r={R}
          strokeWidth={6}
          stroke={!isRecord ? BACKGROUND_STROKE_COLOR : BACKGROUND_COLOR}
          fill={BACKGROUND_COLOR}
        /> */}
        <AnimatedCircle
          cx={widthButton / 2}
          cy={widthButton / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={6}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={styles.containerButton}>
        <TouchableOpacity activeOpacity={1} onPress={handleClick}>
          <Animated.View style={[styles.button, styleAnimated]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(CircularProgress);

const styles = StyleSheet.create({
  container: {
    width: widthButton,
    height: widthButton,
  },
  containerButton: {
    position: 'absolute',
    width: widthButton,
    height: widthButton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLOR.DANGER,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
