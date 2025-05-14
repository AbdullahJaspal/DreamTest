import {PermissionsAndroid, Platform} from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

const readAllFolder = async () => {
  try {
    const granted = await requestPermission();

    if (granted) {
      const folderPath = RNFS.ExternalStorageDirectoryPath;
      const folders = await readAllFolders(folderPath);
      const results = await Promise.all(
        folders.map(async folder => {
          const folderFiles = await RNFS.readDir(folder.path);
          const pictureFile = folderFiles.find(
            file => file.isFile() && isPicture(file.name),
          );
          const videoFile = folderFiles.find(
            file => file.isFile() && isVideo(file.name),
          );

          if (pictureFile || videoFile) {
            return {
              folderName: folder.name,
              folderPath: folder.path,
              pictureFile,
              videoFile,
            };
          }

          return null;
        }),
      );
      return results.filter(Boolean);
    } else {
      throw new Error('Permission denied');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const readAllFolders = async folderPath => {
  const folders = [];
  const items = await RNFS.readDir(folderPath);
  for (const item of items) {
    if (item.isDirectory()) {
      folders.push(item);
      const nestedFolders = await readAllFolders(item.path);
      folders.push(...nestedFolders);
    }
  }
  return folders;
};

const requestPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message: 'This app needs permission to access the external storage.',
          buttonPositive: 'OK',
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return false;
};

const isPicture = fileName => {
  const pictureExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return pictureExtensions.includes(extension);
};

const isVideo = fileName => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv'];
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
};

export {readAllFolder};
