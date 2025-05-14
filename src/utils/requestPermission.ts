import {Alert} from 'react-native';
import {
  request,
  openSettings,
  check,
  Permission,
  RESULTS,
} from 'react-native-permissions';

export const checkAndRequestPermission = async (
  permission: Permission,
  permissionName: string,
): Promise<void> => {
  try {
    const result = await check(permission);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        Alert.alert(`${permissionName} not available on this device`);
        break;
      case RESULTS.DENIED:
        // Request permission
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          console.log(`${permissionName} permission granted`);
        } else if (requestResult === RESULTS.BLOCKED) {
          // Permission blocked, prompt user to open settings
          Alert.alert(
            `${permissionName} permission denied`,
            `Please allow ${permissionName} access from settings`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => openSettings(),
              },
            ],
          );
        }
        break;
      case RESULTS.GRANTED:
        console.log(`${permissionName} permission already granted`);
        break;
      case RESULTS.BLOCKED:
        // Permission blocked, prompt user to open settings
        Alert.alert(
          `${permissionName} permission blocked`,
          `Please enable ${permissionName} access in settings`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
        break;
    }
  } catch (error) {
    console.error(`Error checking ${permissionName} permission: `, error);
  }
};

/**
 * Usage Example:
 *
 * import { checkAndRequestPermission } from './path-to-your-file';
 * import { PERMISSIONS, Platform } from 'react-native-permissions';
 *
 * const requestPermissions = async () => {
 *   // For Camera Permission
 *   const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;
 *   await checkAndRequestPermission(cameraPermission, 'Camera');
 *
 *   // For Microphone Permission
 *   const micPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.RECORD_AUDIO : PERMISSIONS.IOS.MICROPHONE;
 *   await checkAndRequestPermission(micPermission, 'Microphone');
 * };
 *
 * // Call the function somewhere in your component
 * requestPermissions();
 */
