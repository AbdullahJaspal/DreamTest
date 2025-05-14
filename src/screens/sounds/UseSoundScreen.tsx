import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import * as audioApi from '../../apis/audio.api';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as RNFS from '@dr.pogodin/react-native-fs';
import RenderVideoList from './components/RenderVideoList';
import Entypo from 'react-native-vector-icons/Entypo';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import Toast from 'react-native-simple-toast';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Image} from 'react-native';
import {
  UseSoundScreenScreenNavigationProps,
  UseSoundScreenScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {externalFileReadPermission} from '../../utils/externalFileReadPermission';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../profile/profile/components/Header';
import {gifs} from '../../assets/gifs';

const {width, height} = Dimensions.get('screen');

const UseSoundScreen: React.FC = () => {
  const route = useRoute<UseSoundScreenScreenRouteProps>();
  const navigation = useNavigation<UseSoundScreenScreenNavigationProps>();
  const [isPermissionGranted, setIsPermissionGranted] =
    useState<boolean>(false);
  const [audio_url, setAudio_url] = useState<string>();
  const [videos, setVideos] = useState<string[]>([]);
  const [selected_video_index, setSelected_video_index] = useState<number>();
  const [selected_video_durations, setSelected_video_durations] =
    useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const getAudioUrl = async () => {
    const result = await audioApi.getAudioFromVideoId(route?.params?.video_id);
    const audioUrl = `https://dpcst9y3un003.cloudfront.net/extracted_audio/${result?.payload?.audio_url}`;
    setAudio_url(audioUrl);
  };

  const pickVideo = (index: number, durations: number) => {
    setSelected_video_index(index);
    setSelected_video_durations(durations);
  };

  const handleFinalSelection = () => {
    setLoading(true);
    extractVideo();
  };

  const extractVideo = async () => {
    try {
      const cache_dir_path = await RNFS.CachesDirectoryPath;
      const filename = new Date().getTime();
      const output_path = `${cache_dir_path}/${filename}.mp4`;

      const command = `-i ${videos[selected_video_index]} -c:v copy -an ${output_path}`;

      FFmpegKit.executeAsync(command, async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          downloadAndMergerAudio(output_path);
        } else {
          Toast.show('Save Failed', Toast.LONG);
          console.error('Error: Video Trimming failed');
          setLoading(false);
        }
      });
    } catch (error) {
      Toast.show('Save Failed', Toast.LONG);
      console.log('error', error);
      setLoading(false);
    }
  };

  const downloadAndMergerAudio = async (inputPath: string) => {
    const output_video_path = `${RNFS.CachesDirectoryPath}/${Date.now()}.mp4`;

    const path = `${RNFS.CachesDirectoryPath}/${Date.now()}.aac`;

    const response = await ReactNativeBlobUtil.config({
      path: path,
    }).fetch('GET', audio_url);

    if (response.respInfo.status === 200) {
      console.log('File downloaded to:', response.path());

      const command = `-i ${inputPath} -i ${response.path()} -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ${output_video_path}`;

      FFmpegKit.executeAsync(command, async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          setLoading(false);
          navigation.navigate('PreviewVideoScreen', {
            pathVideo: output_video_path,
            duration: selected_video_durations,
            remix_video_id: route?.params?.video_id,
          });
        } else {
          Toast.show('Save Failed', Toast.LONG);
          console.error('Error: Video Trimming failed');
          setLoading(false);
        }
      });
    } else {
      console.error('Failed to download file');
    }
  };

  /**
   * handle permissions
   */
  const requestPermission = useCallback(async () => {
    const result = await externalFileReadPermission();
    if (result) {
      setIsPermissionGranted(true);
    } else {
      Alert.alert(
        'Permission Denied',
        'You need to grant permission to access media files.',
        [
          {
            text: 'Try Again',
            onPress: () => requestPermission(),
          },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  }, []);

  useEffect(() => {
    if (!isPermissionGranted) {
      requestPermission();
    }
  }, [isPermissionGranted, requestPermission]);

  return (
    <SafeAreaView onLayout={getAudioUrl} style={styles.main_container}>
      {loading && (
        <View style={styles.loader_view}>
          <Image source={gifs.tiktokLoader} style={{width: 50, height: 50}} />
        </View>
      )}
      <Header headertext={'Select Video'} />

      <View style={styles.video_list}>
        {videos && (
          <FlatList
            data={videos}
            renderItem={({item, index}) => (
              <RenderVideoList
                item={item}
                index={index}
                pickVideo={pickVideo}
                selected_video_index={selected_video_index}
              />
            )}
            numColumns={4}
          />
        )}
      </View>

      {selected_video_index != null ? (
        <Pressable style={styles.finalSelect} onPress={handleFinalSelection}>
          <Entypo name="chevron-right" size={20} color={'#fff'} />
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
};

export default React.memo(UseSoundScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  back_button: {
    marginHorizontal: 10,
  },
  title_txt: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
  },
  video_list: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  finalSelect: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: 20,
    bottom: 50,
    backgroundColor: 'red',
    borderRadius: 10,
    zIndex: 100000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader_view: {
    position: 'absolute',
    zIndex: 10000,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
