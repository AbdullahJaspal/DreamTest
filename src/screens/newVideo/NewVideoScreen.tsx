import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useRef, useState, RefObject, useMemo} from 'react';
import Camera from './components/Camera';
import CloseButton from './components/CloseButton';
import {useIsFocused} from '@react-navigation/native';
import {Camera as RNCamera} from 'react-native-vision-camera';
import RecordingBottomContainer from './components/RecordingBottomContainer';
import {RecordingState} from './enum/MediaType';
import AddSound from './components/AddSound';
import {SPACING} from '../../configs/styles';

const {width} = Dimensions.get('screen');

const NewVideoScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const camera: RefObject<RNCamera> = useRef<RNCamera>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingState.IDLE,
  );
  const isRecord = useMemo(() => {
    return (
      recordingState === RecordingState.PAUSED ||
      recordingState === RecordingState.RECORDING
    );
  }, [recordingState]);

  if (!isFocused) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Sound Container */}
      <View style={styles.Addsound_container}>
        <AddSound />
      </View>
      <Camera camera={camera} isRecord={isRecord} />
      {!isRecord && <CloseButton containerStyle={styles.close_button} />}

      {/* Bottom Recording Container */}
      <RecordingBottomContainer
        camera={camera}
        recordingState={recordingState}
        setRecordingState={setRecordingState}
      />
    </View>
  );
};

export default React.memo(NewVideoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  Addsound_container: {
    position: 'absolute',
    top: SPACING.S8,
    zIndex: 100,
    right: (width - 110) / 2,
  },
  close_button: {
    position: 'absolute',
    top: SPACING.S6,
    left: SPACING.S1,
  },
});
