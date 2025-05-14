import * as RNFS from '@dr.pogodin/react-native-fs';
import {Platform} from 'react-native';

/**
 * Copies a video from a URI to a local path, ensuring the correct file extension for iOS and Android.
 * @param videoUri - URI of the original video
 * @param fileExtension - Optional extension for the video file (defaults to 'mov' for iOS, 'mp4' for Android)
 * @returns The local file path if successful, or undefined on failure
 */
export const copyVideoToLocalPath = async (
  videoUri: string,
  fileExtension?: string,
): Promise<string | void> => {
  console.log(videoUri, fileExtension);
  try {
    const videoFileExtension =
      fileExtension || (Platform.OS === 'ios' ? 'mov' : 'mp4');
    const uniqueFileName = `${Date.now()}.${videoFileExtension}`;
    const localPath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;

    if (Platform.OS == 'android') {
      await RNFS.copyFile(videoUri, localPath);
    } else {
      await RNFS.copyAssetsVideoIOS(videoUri, localPath);
    }

    return localPath;
  } catch (error) {
    console.error(
      'Error copying video to local path:',
      error instanceof Error ? error.message : error,
    );
    return;
  }
};
