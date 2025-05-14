import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {SharedValue, runOnJS, useDerivedValue} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
interface RecordingCancelButtonProps {
  progress: SharedValue<number>;
  cancelRecording: () => void;
  stopRecording: () => void;
  recordingDuration: number;
}

const {width} = Dimensions.get('screen');

const RecordingCancelButton: React.FC<RecordingCancelButtonProps> = ({
  progress,
  cancelRecording,
  stopRecording,
  recordingDuration,
}) => {
  const [progressSecond, setProgressSecond] = useState<string>('0.0');
  const {t, i18n} = useTranslation();
  useDerivedValue(() => {
    const currentDuration = (
      (progress.value * recordingDuration) /
      1000
    ).toFixed(1);
    if (currentDuration === '15.0' || currentDuration === '0.5') {
      runOnJS(setProgressSecond)(currentDuration);
    }
  }, [progress, recordingDuration]);

  const handleRecordingCancel = () => {
    Alert.alert(
      t('Confirmation'),
      t('Are you sure you want to stop recording?'),
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setProgressSecond('0.0');
            cancelRecording();
          },
        },
      ],
    );
  };

  const handleRecordingStop = () => {
    setProgressSecond('0.0');
    stopRecording();
  };

  if (Number(progressSecond) > 0) {
    return (
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleRecordingCancel}>
          <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
        </TouchableOpacity>

        {Number(progressSecond) >= 15 && (
          <TouchableOpacity
            style={styles.continue_button}
            onPress={handleRecordingStop}>
            <Entypo name="chevron-right" size={35} color={'#fff'} />
          </TouchableOpacity>
        )}
      </View>
    );
  } else {
    return null;
  }
};

export default React.memo(RecordingCancelButton);

const styles = StyleSheet.create({
  leftContainer: {
    width: width,
    position: 'absolute',
    flexDirection: 'row',
    bottom: -35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    alignSelf: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  continue_button: {
    position: 'absolute',
    right: width / 2 - 100,
  },
});
