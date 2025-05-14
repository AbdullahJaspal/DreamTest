import {FFmpegKit} from 'ffmpeg-kit-react-native';

const trim_video = async () => {
  const chache_dir_path = await RNFS.CachesDirectoryPath;
  const output_path = `${chache_dir_path}/edited_video50.mp4`;
  // const command = `-i ${output_video_path} -vf reverse ${output_path}`
  const command = `-i ${inputPath} -vf "transpose=${rotation}" ${output_path}`;

  FFmpegKit.execute(command).then(async session => {
    const returncode = await session.getReturnCode();
    if (returncode == 0) {
      console.log('video editing succesfull');
      setOutput_video_path('');
      setTrimmed_video_path(output_path);
    } else {
      console.log('video editing error');
    }
  });
};
