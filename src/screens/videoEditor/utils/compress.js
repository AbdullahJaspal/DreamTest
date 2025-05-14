const compressVideo = async () => {
  dispatch(change_loading(true));
  const cache_dir_path = await RNFS.CachesDirectoryPath;
  const filename = new Date().getTime();
  const output_path = `${cache_dir_path}/${filename}.mp4`;

  // Set the desired video bitrate and codec options
  const videoBitrate = '1000k'; // Adjust the bitrate as needed
  const videoCodec = 'libx264'; // Adjust the codec as needed

  const command = `-i ${video.video_url} -b:v ${videoBitrate} -vcodec ${videoCodec} -vf "scale=1280:720" ${output_path}`;

  FFmpegKit.executeAsync(command, async session => {
    const returnCode = await session.getReturnCode();
    if (ReturnCode.isSuccess(returnCode)) {
      console.log('Success: Compressed video saved at', output_path);
      stateList.addState(output_path);
      dispatch(change_video_url(stateList.current.data));
      dispatch(change_loading(false));
    } else if (ReturnCode.isCancel(returnCode)) {
      console.log('Cancel: Video compression canceled');
      dispatch(change_loading(false));
    } else {
      console.error('Error: Video compression failed');
      dispatch(change_loading(false));
    }
  });
};
