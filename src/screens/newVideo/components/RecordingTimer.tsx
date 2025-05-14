import {StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {useDerivedValue, runOnJS, SharedValue} from 'react-native-reanimated';

interface RecordingTimerProps {
  progress: SharedValue<number>;
  recordingDuration: number;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({
  progress,
  recordingDuration,
}) => {
  const [duration, setDuration] = useState<string>('0.0');

  useDerivedValue(() => {
    const currentDuration = (
      (progress.value * recordingDuration) /
      1000
    ).toFixed(1);
    if (currentDuration.endsWith('.0') || currentDuration.endsWith('.5')) {
      runOnJS(setDuration)(currentDuration);
    }
  }, [progress, recordingDuration]);

  if (Number(duration) > 0) {
    return <Text style={styles.txt}>{duration}</Text>;
  }

  return null;
};

export default React.memo(RecordingTimer);

const styles = StyleSheet.create({
  txt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
