import {FFmpegKit, FFmpegKitConfig, ReturnCode} from 'ffmpeg-kit-react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

class FFmpegWrapper {
  static splitVideo(videoURI, segmentDuration, successCallback, errorCallback) {
    const outputPrefix = `${RNFS.CachesDirectoryPath}/segment_`;
    const ffmpegCommand = `-i ${videoURI} -vf "fps=1/10,scale=-1:480" ${outputPrefix}%03d.jpg`;

    FFmpegKit.executeAsync(
      ffmpegCommand,
      async session => {
        const state = FFmpegKitConfig.sessionStateToString(
          await session.getState(),
        );
        const returnCode = await session.getReturnCode();
        const failStackTrace = await session.getFailStackTrace();
        const duration = await session.getDuration();

        if (ReturnCode.isSuccess(returnCode)) {
          console.log(
            `Video split completed successfully in ${duration} milliseconds.`,
          );
          successCallback(outputPrefix);
        } else {
          console.log('Video split failed. Please check log for the details.');
          console.log(
            `Video split failed with state ${state} and rc ${returnCode}.${
              (failStackTrace, '\\n')
            }`,
          );
          errorCallback();
        }
      },
      log => {
        console.log(log.getMessage());
      },
      statistics => {
        console.log(statistics);
      },
    ).then(session =>
      console.log(
        `Async FFmpeg process started with sessionId ${session.getSessionId()}.`,
      ),
    );
  }
}

export default FFmpegWrapper;
