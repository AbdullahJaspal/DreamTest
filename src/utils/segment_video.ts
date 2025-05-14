import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

const segment_video = (
  input_path: string,
  frame_number: number,
  duration: number,
): Promise<string[]> => {
  const fr: number = Math.floor(duration / frame_number);

  return new Promise<string[]>((resolve, reject) => {
    try {
      const cache_dir: string = RNFS.CachesDirectoryPath;
      const current_date = Date.now();
      const output_path: string = `${cache_dir}/${current_date}`;
      const startTime = Date.now(); // Record start time

      RNFS.exists(output_path)
        .then(exists => {
          if (!exists) {
            return RNFS.mkdir(output_path);
          }
        })
        .then(() => {
          const ffmpegCommand: string = `-hwaccel auto -i ${input_path} -vf "fps=1/${fr},scale=640:-1" -pix_fmt yuv420p -an -preset ultrafast -threads 4 ${output_path}/%03d.jpg`;

          FFmpegKit.executeAsync(ffmpegCommand, async session => {
            const returnCode: ReturnCode = await session.getReturnCode();
            if (ReturnCode.isSuccess(returnCode)) {
              const files = await RNFS.readdir(output_path);
              const outputPaths = files.map(
                (file: string) => `${output_path}/${file}`,
              );
              const endTime = Date.now();
              const executionTime = endTime - startTime;

              console.log('excution time displaying ', executionTime);
              resolve(outputPaths);
            } else {
              const output: string = await session.getOutput();
              console.log(
                'Error generated while segmenting the video:',
                output,
              );
              reject(output);
            }
          });
        })
        .catch(error => {
          console.log('Error generated while segmenting your videos:', error);
          reject(error);
        });
    } catch (error) {
      console.log('Error generated while segmenting your videos:', error);
      reject(error);
    }
  });
};

export {segment_video};
