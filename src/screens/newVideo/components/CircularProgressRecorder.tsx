import React, {Dispatch, useCallback, useMemo} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  withTiming,
  useAnimatedProps,
  Easing,
  useAnimatedStyle,
  cancelAnimation,
  runOnJS,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';
import {Camera, VideoFile} from 'react-native-vision-camera';
import {RecordingState} from '../enum/MediaType';
import {useTranslation} from 'react-i18next';
interface CircularProgressRecorderProps {
  cameraRef: React.RefObject<Camera>;
  onFinishRecording: (path: string, duration: number) => void;
  progress: SharedValue<number>;
  widthButtonRecord: SharedValue<number>;
  borderRadiusButtonRecord: SharedValue<number>;
  recordingState: RecordingState;
  setRecordingState: Dispatch<React.SetStateAction<RecordingState>>;
  recordingDuration: number;
  resetRecordingState: () => void;
  stopRecording: () => void;
}

const widthButton = 120;
const SIZE_MORE = 15;
const BACKGROUND_COLOR = '#F0F0F0';
const STROKE_COLOR = '#FF0000';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgressRecorder: React.FC<CircularProgressRecorderProps> = ({
  cameraRef,
  onFinishRecording,
  progress,
  widthButtonRecord,
  borderRadiusButtonRecord,
  recordingState,
  setRecordingState,
  recordingDuration,
  resetRecordingState,
  stopRecording,
}) => {
  const {R, CIRCLE_LENGTH} = useMemo(() => {
    const R = widthButton / 2 - SIZE_MORE;
    const CIRCLE_LENGTH = 2 * Math.PI * R;
    return {
      R,
      CIRCLE_LENGTH,
    };
  }, []);

  const remainingTime = useSharedValue(recordingDuration);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));
  const {t, i18n} = useTranslation();
  const styleAnimated = useAnimatedStyle(() => {
    const animationDuration = 200;
    return {
      borderRadius: withTiming(borderRadiusButtonRecord.value, {
        duration: animationDuration,
        easing: Easing.linear,
      }),
      width: withTiming(widthButtonRecord.value, {
        duration: animationDuration,
        easing: Easing.linear,
      }),
      height: withTiming(widthButtonRecord.value, {
        duration: animationDuration,
        easing: Easing.linear,
      }),
    };
  });

  const startRecording = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.startRecording({
        fileType: 'mp4',
        videoBitRate: 'extra-high',
        onRecordingError: error => {
          setRecordingState(RecordingState.IDLE);
          console.error('Recording Error:', error);
        },
        onRecordingFinished: (video: VideoFile) => {
          console.log('Recording finished:', video);
          onFinishRecording(video.path, video.duration);
          resetRecordingState();
        },
        videoCodec: 'h265',
      });
    }
  }, [cameraRef, onFinishRecording]);

  const handlePauseRecording = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.pauseRecording();
      setRecordingState(RecordingState.PAUSED);
      cancelAnimation(progress);

      remainingTime.value = (1 - progress.value) * recordingDuration;
    }
  }, [cameraRef, setRecordingState, progress, recordingDuration]);

  // Resume recording logic
  const handleResumeRecording = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.resumeRecording();
      setRecordingState(RecordingState.RECORDING);
      startProgressAnimation(remainingTime.value);
    }
  }, [cameraRef, setRecordingState, progress, remainingTime]);

  const startProgressAnimation = (duration: number) => {
    progress.value = withTiming(
      1,
      {
        duration,
        easing: Easing.linear,
      },
      isFinished => {
        if (isFinished) {
          runOnJS(finishedRecording)();
        }
      },
    );
  };

  const finishedRecording = () => {
    stopRecording();
  };

  const handlePress = () => {
    switch (recordingState) {
      case RecordingState.IDLE:
        startRecording();
        setRecordingState(RecordingState.RECORDING);
        startProgressAnimation(recordingDuration);
        break;
      case RecordingState.RECORDING:
        handlePauseRecording();
        break;
      case RecordingState.PAUSED:
        handleResumeRecording();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Svg style={{transform: [{rotate: '-90deg'}]}}>
        <Circle
          cx={widthButton / 2}
          cy={widthButton / 2}
          r={R}
          strokeWidth={6}
          stroke={BACKGROUND_COLOR}
          fill={BACKGROUND_COLOR}
        />
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
        <TouchableOpacity activeOpacity={1} onPress={handlePress}>
          <Animated.View style={[styles.button, styleAnimated]}>
            <Text style={styles.buttonText}>
              {recordingState === RecordingState.IDLE
                ? t('Start')
                : recordingState === RecordingState.RECORDING
                ? t('Pause')
                : t('Resume')}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(CircularProgressRecorder);

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
    backgroundColor: STROKE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
