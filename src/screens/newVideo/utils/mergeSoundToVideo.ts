import * as RNFS from '@dr.pogodin/react-native-fs';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

export const mergeSoundToVideo = (
  videoURI: string,
  audioPath: string,
  audioFormat: 'aac' | 'mp3',
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      const outPutVideoPath = `${RNFS.CachesDirectoryPath}/${Date.now()}.mp4`;
      // Use -shortest to ensure the output duration matches the shortest input
      const command = `-i ${videoURI} -i ${audioPath} -c:v copy -c:a ${audioFormat} -strict experimental -map 0:v:0 -map 1:a:0 -shortest ${outPutVideoPath}`;

      FFmpegKit.executeAsync(command, async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          resolve(outPutVideoPath);
        } else {
          reject(new Error('Failed to merge video and audio.'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
