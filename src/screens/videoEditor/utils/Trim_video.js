import {FFmpegKit} from 'ffmpeg-kit-react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

const trim_video = async ({
  starting_time,
  ending_time,
  input_path,
  output_path,
}) => {
  // const chache_dir_path = await RNFS.CachesDirectoryPath
  // const output_path = `${chache_dir_path}/edited_video30.mp4`
  const command = `-i ${input_path} -ss ${starting_time} -t ${ending_time} -c copy ${output_path}`;
  FFmpegKit.execute(command).then(async session => {
    const returncode = await session.getReturnCode();
    if (returncode == 0) {
      console.log('video trimming succesfull');
      return output_path;
    } else {
      console.log('video editing error');
    }
  });
};

export {trim_video};

const pick_video = async () => {
  const result = await ImagePicker.launchImageLibrary({mediaType: 'video'});
  const sourceUri = result.assets[0].uri;
  const cache_path = RNFS.CachesDirectoryPath;
  const out_put_path = `${cache_path}/oroginal_video.mp4`;
  RNFS.copyFile(sourceUri, out_put_path)
    .then(() => {
      const fileUri = `file://${out_put_path}`;
      console.log(fileUri);
      setOutput_video_path(fileUri);
    })
    .catch(err => {
      console.log(err.message);
    });
};

// const trim_video = async () => {
//     const chache_dir_path = await RNFS.CachesDirectoryPath
//     const output_path = `${chache_dir_path}/edited_video30.mp4`
//     const command = `-i ${output_video_path} -ss 00:00:00 -t 00:00:05 -c copy ${output_path}`
//     FFmpegKit.execute(command)
//         .then(async (session) => {
//             const returncode = await session.getReturnCode()
//             if (returncode == 0) {
//                 console.log("video editing succesfull")
//                 setOutput_video_path('')
//                 setTrimmed_video_path(output_path)
//             } else {
//                 console.log('video editing error')
//             }
//         })
// }

export async function applyWarnEffect(inputFile, outputFile) {
  const warnEffect = FFmpegKit.filters.warn({color: 'red'});

  const output = await FFmpegKit.runAsync({
    input: inputFile,
    filters: [warnEffect],
    output: outputFile,
  });

  return output;
}
