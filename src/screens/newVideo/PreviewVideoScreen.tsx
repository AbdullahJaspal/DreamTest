import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Pressable, Dimensions} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import Video from 'react-native-video';
import {useDispatch} from 'react-redux';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {useSharedValue} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';

import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';
import {CText, Icon} from '../../components';
import CloseButton from './components/CloseButton';
import AddSound from './components/AddSound';
import FullScreenLoader from '../../components/FullScreenLoader';

import {change_video_url} from '../../store/slices/content/videoSlice';
import {
  selectExternalAudio,
  selectRemixedVideoId,
  selectSoundRemoteUrl,
} from '../../store/selectors';

import {
  PreviewVideoScreenNavigationProps,
  PreviewVideoScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {getLocalSoundUrlFromRemoteUrl} from './utils/getLocalSoundUrlFromRemoteUrl';
import {mergeSoundToVideo} from './utils/mergeSoundToVideo';
import {useAppSelector} from '../../store/hooks';
import {icons} from '../../assets/icons';

const {width, height} = Dimensions.get('window');

interface SoundData {
  soundURL: string;
  extention: string;
  loading: boolean;
}

const PreviewVideoScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<PreviewVideoScreenNavigationProps>();
  const route = useRoute<PreviewVideoScreenRouteProps>();
  const isFocused = useIsFocused();
  const externalAudio = useAppSelector(selectExternalAudio);
  const remixedVideoId = useAppSelector(selectRemixedVideoId);
  const soundRemoteUrl = useAppSelector(selectSoundRemoteUrl);
  const videoDuration = useRef<number>(0);
  const [pauseVideo, setPauseVideo] = useState(false);
  const loading = useSharedValue<boolean>(false);
  const [show_loader, setShow_loader] = useState(false);
  const [final_video_url, setFinal_video_url] = useState<string | null>(null);
  const localSoundData = useRef<SoundData>({
    soundURL: '',
    extention: '',
    loading: true,
  });
  const [nonSoundVideoURI, setNonSoundVideoURI] = useState<string>('');

  const originalVideoUri = useMemo(() => {
    const videoURL = route.params.pathVideo;
    if (videoURL.startsWith('/')) {
      return videoURL;
    } else {
      return videoURL.slice(7);
    }
  }, [route.params.pathVideo]);

  /**
   * get local audio url from remote url
   */
  const extractLocalSoundURL = useCallback(async (): Promise<void> => {
    if (!soundRemoteUrl) {
      return;
    }
    try {
      loading.value = true;
      localSoundData.current = {
        soundURL: '',
        extention: '',
        loading: true,
      };
      const result = await getLocalSoundUrlFromRemoteUrl(soundRemoteUrl);
      if (result) {
        localSoundData.current = {
          soundURL: result,
          extention: 'aac',
          loading: false,
        };
        if (nonSoundVideoURI) {
          const videoURL = await mergeSoundToVideo(
            nonSoundVideoURI,
            result,
            'aac',
          );
          if (videoURL) {
            setFinal_video_url(videoURL);
          }
        }
      }
    } catch (error) {
      console.error('Error while extracting sound URL:', error);
    } finally {
      loading.value = false;
    }
  }, [soundRemoteUrl, nonSoundVideoURI]);

  useEffect(() => {
    extractLocalSoundURL();
  }, [extractLocalSoundURL]);

  // Extract audio from video
  const extractAudioFromVideo = useCallback(async () => {
    if (nonSoundVideoURI || !soundRemoteUrl) {
      return;
    }
    try {
      if (!nonSoundVideoURI && soundRemoteUrl) {
        const cache_dir_path = RNFS.CachesDirectoryPath;
        const filename = new Date().getTime();
        const output_path = `${cache_dir_path}/${filename}.mp4`;

        const command = `-i ${originalVideoUri} -c:v copy -an ${output_path}`;

        FFmpegKit.executeAsync(command, async session => {
          const returnCode = await session.getReturnCode();
          if (ReturnCode.isSuccess(returnCode)) {
            setNonSoundVideoURI(output_path);
            console.log('audio successfully removed', output_path);
          } else {
            console.error('Error: removing audio from video');
          }
        });
      }
    } catch (error) {
      console.log('Error while extracting audio from video', error);
    }
  }, [originalVideoUri, soundRemoteUrl]);

  useEffect(() => {
    extractAudioFromVideo();
  }, [extractAudioFromVideo]);

  /**
   * handle navigating to video download
   */
  const handleNavigation = async () => {
    dispatch(change_video_url(videoURI.uri));
    navigation.navigate('PostVideoScreen', {
      durations: route.params?.duration,
      remix_video_id: remixedVideoId,
    });
  };
  const handleContinue = () => {
    const data = {
      duration: route?.params.duration,
      pathVideo: videoURI.uri,
    };
    if (videoDuration.current <= 60) {
      handleNavigation();
    } else {
      navigation.navigate('TrimVideo', {props: data});
    }
  };

  /**
   * handle video load
   */
  const handleVideoLoad = useCallback(
    (e: {duration: number}) => {
      videoDuration.current = e.duration;
    },
    [videoDuration.current],
  );

  /**
   * Video url
   */
  const videoURI = useMemo(() => {
    const url = final_video_url
      ? `file://${final_video_url}`
      : route?.params?.pathVideo;
    return {uri: url};
  }, [final_video_url, route?.params?.pathVideo]);

  // handle when inserted audio is removed
  function handleSoundRemove(): void {
    setFinal_video_url(null);
  }

  // handle video trim
  const handleTrimVideoPress = () => {
    const data = {
      duration: route?.params.duration,
      pathVideo: final_video_url
        ? `file://${final_video_url}`
        : route.params.pathVideo,
    };
    navigation.navigate('TrimVideo', {props: data});
  };

  if (isFocused) {
    return (
      <View style={styles.container}>
        <View style={styles.Addsound_container}>
          <CloseButton icon={icons.left} />
          <AddSound onRemoveSound={handleSoundRemove} />
          <Icon source={icons.videoTrim} onPress={handleTrimVideoPress} />
        </View>

        <Video
          style={styles.video}
          source={videoURI}
          resizeMode={'cover'}
          paused={pauseVideo}
          repeat={true}
          controls={true}
          onLoad={handleVideoLoad}
          muted={false}
        />

        <View style={styles.actionBottom}>
          <Pressable
            style={[styles.button, {backgroundColor: COLOR.WHITE}]}
            onPress={extractAudioFromVideo}>
            <CText>{t('Edit')}</CText>
          </Pressable>
          <Pressable
            style={[styles.button, {backgroundColor: COLOR.DANGER}]}
            onPress={handleContinue}>
            <CText color={COLOR.WHITE}>{t('Continue')}</CText>
          </Pressable>
        </View>
        <FullScreenLoader sharedLoader={loading} />
      </View>
    );
  } else {
    return null;
  }
};

export default React.memo(PreviewVideoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    zIndex: -1,
    flex: 1,
  },
  actionRight: {
    position: 'absolute',
    top: SPACING.S4,
    right: SPACING.S2,
  },
  actionBottom: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: BORDER.SMALL,
  },
  itemOption: {
    alignItems: 'center',
    padding: 3,
  },
  icon: {
    width: 25,
    height: 25,
    tintColor: COLOR.WHITE,
  },
  txtOption: {
    ...TEXT.SMALL_STRONG,
    color: COLOR.WHITE,
  },
  Addsound_container: {
    position: 'absolute',
    top: 50,
    zIndex: 100,
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
});
