import RNFetchBlob from 'react-native-blob-util';

export const getLocalSoundUrlFromRemoteUrl = async (
  remoteUrl: string,
): Promise<string | null> => {
  try {
    const soundFileName: string = `${Date.now()}.aac`;

    const soundFilePath: string = `${RNFetchBlob.fs.dirs.CacheDir}/${soundFileName}`;

    const res = await RNFetchBlob.config({
      path: soundFilePath,
    }).fetch('GET', remoteUrl);

    return res.path();
  } catch (error) {
    console.error('Error downloading the sound file:', error);
    return null;
  }
};
