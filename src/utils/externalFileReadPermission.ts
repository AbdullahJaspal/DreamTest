import {Alert, Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
  check,
  request,
  requestMultiple,
} from 'react-native-permissions';

const externalFileReadPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ]);

      return (
        result[PERMISSIONS.ANDROID.READ_MEDIA_VIDEO] === 'granted' &&
        result[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] === 'granted' &&
        result[PERMISSIONS.ANDROID.READ_MEDIA_AUDIO] === 'granted'
      );
    } else {
      const result: PermissionStatus = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      return result === 'granted';
    }
  } else if (Platform.OS === 'ios') {
    const result = await requestMultiple([PERMISSIONS.IOS.PHOTO_LIBRARY]);
    return result[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted';
  }
  return false;
};

const checkFilePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const videoRead: PermissionStatus = await check(
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      );
      const photoRead: PermissionStatus = await check(
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      );
      const audioRead: PermissionStatus = await check(
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      );

      return (
        videoRead === 'granted' &&
        photoRead === 'granted' &&
        audioRead === 'granted'
      );
    } else {
      const result: PermissionStatus = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      return result === 'granted';
    }
  } else if (Platform.OS === 'ios') {
    const photoRead: PermissionStatus = await check(
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    );
    return photoRead === 'granted';
  }
  return false;
};

const requestPermissions = async () => {
  const hasPermission = await checkFilePermission();
  if (!hasPermission) {
    const granted = await externalFileReadPermission();
    if (!granted) {
      Alert.alert('Permission denied', 'We need access to your media files.');
    }
  } else {
    console.log('All permissions are granted.');
  }
};

const requestLocationPermission = async (): Promise<boolean> => {
  try {
    let permission;
    if (Platform.OS === 'android') {
      permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else if (Platform.OS === 'ios') {
      permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }

    if (permission === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

export {
  checkFilePermission,
  externalFileReadPermission,
  requestPermissions,
  requestLocationPermission,
};
