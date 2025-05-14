import {StyleSheet, View, Text, Pressable, Platform} from 'react-native';
import React, {RefObject, useCallback, useEffect, useState} from 'react';
import {TEXT, COLOR, SPACING} from '../../../configs/styles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Camera as VisionCamera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {PERMISSIONS} from 'react-native-permissions';
import {checkAndRequestPermission} from '../../../utils/requestPermission';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../assets/icons';
interface CameraProps {
  camera: RefObject<VisionCamera>;
  isRecord: boolean;
}

enum FlashMode {
  ON = 'on',
  OFF = 'off',
}

enum CameraType {
  FRONT = 'front',
  BACK = 'back',
}
const Camera: React.FC<CameraProps> = ({camera, isRecord}) => {
  const {t, i18n} = useTranslation();
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode.OFF);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.FRONT);
  const rotateFlip = useSharedValue(0);
  const device = useCameraDevice(cameraType);
  const camP = useCameraPermission();
  const micP = useMicrophonePermission();
  const format = useCameraFormat(device, [
    {videoHdr: true, videoStabilizationMode: 'cinematic-extended'},
  ]);

  const flipStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotateFlip.value}deg`}],
    };
  }, []);
  /**
   * Flip Camera
   */
  const handleClickFlip = useCallback(() => {
    rotateFlip.value =
      rotateFlip.value === 360 ? withSpring(0) : withSpring(360);
    if (cameraType === CameraType.FRONT) {
      setCameraType(CameraType.BACK);
    } else {
      setCameraType(CameraType.FRONT);
    }
  }, [cameraType]);

  /**
   * Torch
   */
  const handleFlashPress = () => {
    if (flashMode == FlashMode.ON) {
      setFlashMode(FlashMode.OFF);
    } else {
      setFlashMode(FlashMode.ON);
    }
  };

  const handleSpeedPress = () => {
    console.log('handle speed press');
  };

  const handleTimerPress = () => {
    console.log('timer pressed');
  };

  const requestPermissions = async () => {
    // For Camera Permission
    const cameraPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;
    await checkAndRequestPermission(cameraPermission, 'Camera');

    // For Microphone Permission
    const micPermission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;
    await checkAndRequestPermission(micPermission, 'Microphone');
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  if (!device) {
    return null;
  }

  if (!camP.hasPermission || !micP.hasPermission) {
    return null;
  }

  return (
    <>
      <VisionCamera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        format={format}
        enableZoomGesture={true}
        torch={flashMode}
        videoHdr={format?.supportsVideoHdr}
        outputOrientation="device"
        isMirrored={true}
        video={true}
        audio={true}
      />

      {!isRecord && (
        <View style={styles.containerOption}>
          <Pressable onPress={handleClickFlip} style={styles.itemOption}>
            <Animated.Image
              source={icons.repeat}
              style={[styles.icon, flipStyle]}
            />
            <Text style={styles.txtOption}>{t(cameraType)}</Text>
          </Pressable>

          <Pressable onPress={handleFlashPress} style={styles.itemOption}>
            <Animated.Image
              source={
                flashMode === FlashMode.ON ? icons.flashOn : icons.flashOff
              }
              style={styles.icon}
            />
            <Text style={styles.txtOption}>
              {flashMode === FlashMode.ON ? t('On') : t('Off')}
            </Text>
          </Pressable>

          <Pressable onPress={handleSpeedPress} style={styles.itemOption}>
            <Animated.Image source={icons.speed} style={styles.icon} />
            <Text style={styles.txtOption}>1x</Text>
          </Pressable>

          <Pressable onPress={handleTimerPress} style={styles.itemOption}>
            <Animated.Image source={icons.stopwatch} style={styles.icon} />
            <Text style={styles.txtOption}>{t('Timer')}</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default React.memo(Camera);

const styles = StyleSheet.create({
  containerOption: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    padding: SPACING.S2,
    top: SPACING.S6,
  },
  itemOption: {
    alignItems: 'center',
    padding: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: COLOR.WHITE,
  },
  txtOption: {
    ...TEXT.SMALL_STRONG,
    color: COLOR.WHITE,
  },
});
