import React, {
  Dispatch,
  RefObject,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {RecordingState} from '../enum/MediaType';
import {Camera} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import CircularProgressRecorder from './CircularProgressRecorder';
import Upload from './Upload';
import Effect from './Effect';
import {PreviewVideoScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import RecordingTimer from './RecordingTimer';
import RecordingCancelButton from './RecordingCancelButton';

const {width} = Dimensions.get('screen');
const data = ['60s', '30s', '15s'];
const widthButton = 120;

interface RecordingBottomContainerProps {
  camera: RefObject<Camera>;
  recordingState: RecordingState;
  setRecordingState: Dispatch<React.SetStateAction<RecordingState>>;
}

const RecordingBottomContainer: React.FC<RecordingBottomContainerProps> = ({
  camera,
  recordingState,
  setRecordingState,
}) => {
  const navigation = useNavigation<PreviewVideoScreenNavigationProps>();
  const progress = useSharedValue(0);
  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>(0);
  const widthButtonRecord = useSharedValue(widthButton - 40);
  const borderRadiusButtonRecord = useSharedValue(50);
  const [recordingDuration, setRecordingDuration] = useState<number>(60000);

  // Reset the progress animation and button state
  const resetRecordingState = () => {
    progress.value = 0;
    borderRadiusButtonRecord.value = 50;
    widthButtonRecord.value = widthButton - 40;
    setRecordingState(RecordingState.IDLE);
  };

  // Cancel the recording
  const cancelRecording = () => {
    if (camera.current) {
      camera.current.cancelRecording();
      resetRecordingState();
    }
  };

  // Stop the recording completely
  const stopRecording = () => {
    if (camera.current) {
      camera.current.stopRecording();
      resetRecordingState();
    }
  };

  // Use useMemo for derived state
  const isRecord = useMemo(() => {
    return (
      recordingState === RecordingState.PAUSED ||
      recordingState === RecordingState.RECORDING
    );
  }, [recordingState]);

  const animatedStyle = useAnimatedStyle(() => {
    const leftPosition = () => {
      switch (selectedDurationIndex) {
        case 0:
          runOnJS(setRecordingDuration)(60000);
          return width * 0.43;
        case 1:
          runOnJS(setRecordingDuration)(30000);
          return width * 0.25;
        case 2:
          runOnJS(setRecordingDuration)(15000);
          return 20;
        default:
          return 0;
      }
    };
    return {
      left: withSpring(leftPosition()),
    };
  }, [recordingDuration, selectedDurationIndex]);

  // Move handle functions outside render return
  const handleDurationPress = (index: number) => {
    setSelectedDurationIndex(index);
  };

  const endRecord = (myUri: string, duration: number) => {
    navigation.navigate('PreviewVideoScreen', {
      pathVideo: myUri,
      duration: duration,
      remix_video_id: undefined,
    });
  };

  const renderDurationSelection = useCallback(() => {
    if (!isRecord && progress.value === 0) {
      return (
        <Animated.View style={[styles.durationSelectionView, animatedStyle]}>
          {data.map((item, index) => {
            const textAnimatedStyle = (index: number) => {
              return {
                backgroundColor:
                  selectedDurationIndex === index ? '#fff' : 'transparent',
                color: selectedDurationIndex === index ? '#000' : '#fff',
              };
            };
            return (
              <Animated.Text
                key={index}
                onPress={() => handleDurationPress(index)}
                style={[styles.durationTxt, textAnimatedStyle(index)]}>
                {item}
              </Animated.Text>
            );
          })}
        </Animated.View>
      );
    }
    return null;
  }, [isRecord, selectedDurationIndex]);

  return (
    <View style={styles.containerBottom}>
      {!isRecord && progress.value === 0 && <Effect />}

      {renderDurationSelection()}

      <View style={styles.containerButtonRecord}>
        <RecordingTimer
          progress={progress}
          recordingDuration={recordingDuration}
        />
        <CircularProgressRecorder
          cameraRef={camera}
          onFinishRecording={endRecord}
          progress={progress}
          widthButtonRecord={widthButtonRecord}
          borderRadiusButtonRecord={borderRadiusButtonRecord}
          recordingState={recordingState}
          setRecordingState={setRecordingState}
          recordingDuration={recordingDuration}
          resetRecordingState={resetRecordingState}
          stopRecording={stopRecording}
        />

        <RecordingCancelButton
          progress={progress}
          cancelRecording={cancelRecording}
          stopRecording={stopRecording}
          recordingDuration={recordingDuration}
        />
      </View>

      {!isRecord && progress.value === 0 && <Upload />}
    </View>
  );
};

export default React.memo(RecordingBottomContainer);

const styles = StyleSheet.create({
  containerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 30,
    left: 0,
    right: 0,
    position: 'absolute',
    padding: 16,
  },
  containerButtonRecord: {
    alignItems: 'center',
  },
  durationSelectionView: {
    backgroundColor: 'transparent',
    width: width * 0.5,
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    top: -10,
  },
  durationTxt: {
    fontWeight: '800',
    fontSize: 16,
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 3,
  },
});
