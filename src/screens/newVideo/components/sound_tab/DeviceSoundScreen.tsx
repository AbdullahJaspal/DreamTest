import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {COLOR} from '../../../../configs/styles';
import * as RNFS from '@dr.pogodin/react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {
  addExternalAudio,
  addNickname,
  setSoundRemoteUrl,
} from '../../../../store/slices/content/externalSoundSlice';
import FastImage from '@d11/react-native-fast-image';
import {gifs} from '../../../../assets/gifs';

const {width} = Dimensions.get('screen');

interface DeviceSoundScreenProps {
  route: any;
}

const DeviceSoundScreen: React.FC<DeviceSoundScreenProps> = ({route}) => {
  const {closeModal} = route.params;
  const [audio_list, setAudio_list] = useState<string[]>([]);
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const handlePlayPause = async (url: string) => {
    try {
      if (currentPlayingUrl === url) {
        SoundPlayer.pause();
        setCurrentPlayingUrl(null);
      } else {
        if (currentPlayingUrl) SoundPlayer.stop();
        SoundPlayer.playUrl(`file://${url}`);
        setCurrentPlayingUrl(url);
      }
    } catch (error) {
      console.log('Playback error:', error);
    }
  };

  const requestPermission = async () => {
    try {
      let permissionStatus;

      if (Platform.OS === 'ios') {
        // iOS requires media library permission
        permissionStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
      } else {
        // Android permission
        permissionStatus = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
      }

      return permissionStatus === RESULTS.GRANTED;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };

  const getPathsToScan = () => {
    if (Platform.OS === 'ios') {
      // iOS has different directory structure
      return [
        RNFS.DocumentDirectoryPath,
        RNFS.LibraryDirectoryPath,
        RNFS.TemporaryDirectoryPath,
        // Add any app-specific directories where audio might be stored
      ];
    } else {
      // Android paths
      return [
        RNFS.ExternalStorageDirectoryPath,
        `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.nojomalmadina.appdream/files/Download/Dream`,
        RNFS.DownloadDirectoryPath,
        RNFS.DocumentDirectoryPath,
      ];
    }
  };

  const selectAudio = async () => {
    try {
      const hasPermission = await requestPermission();

      if (!hasPermission) {
        console.log('Permission denied');
        Toast.show('Permission to access media files was denied', Toast.LONG);
        setIsLoading(false);
        return;
      }

      const pathsToScan = getPathsToScan();

      for (const path of pathsToScan) {
        try {
          await processPath(path);
          const dirContents = await RNFS.readdir(path);
          for (const file of dirContents) {
            await processPath(`${path}/${file}`);
          }
        } catch (dirError) {
          console.log('Skipping unreadable directory:', path);
        }
      }
    } catch (error) {
      console.error('Error selecting audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processPath = async (path: any) => {
    try {
      const stat = await RNFS.stat(path);
      if (stat.isDirectory()) {
        try {
          const dirContents = await RNFS.readdir(path);
          for (const file of dirContents) {
            await processPath(`${path}/${file}`);
          }
        } catch (error) {
          // Skip directories we can't read
        }
      } else if (
        path.toLowerCase().endsWith('.mp3') ||
        path.toLowerCase().endsWith('.aac') ||
        path.toLowerCase().endsWith('.m4a')
      ) {
        setAudio_list(prev => Array.from(new Set([...prev, path])));
      }
    } catch (error) {
      // Skip invalid paths silently
    }
  };

  const externalAudio = async (url: string, nickname: string | null) => {
    try {
      closeModal();
      dispatch(setSoundRemoteUrl(url));
      dispatch(addNickname(nickname || 'Device Audio'));
    } catch (error) {
      console.log('error', error);
      Toast.show('You cannot use this sound for now', Toast.LONG);
    }
  };

  useEffect(() => {
    const subscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        setCurrentPlayingUrl(null);
      },
    );
    return () => subscription.remove();
  }, []);

  const RenderItem = ({item}: {item: string}) => {
    const [loading, setLoading] = useState(false);
    const fileName = item.split('/').pop() || '';

    const isPlaying = currentPlayingUrl === item;

    const togglePlayPause = async () => {
      if (loading) return;
      setLoading(true);
      await handlePlayPause(item);
      setLoading(false);
    };

    const handleAddAudio = () => {
      const fileName = item.split('/').pop() || 'Device Audio';
      externalAudio(item, fileName); // Pass file name as nickname
    };

    return (
      <View style={styles.item_main_container}>
        <View style={styles.right_main_container}>
          <View style={styles.right_container}>
            <Ionicons
              name="musical-notes-outline"
              size={35}
              color="rgba(255, 255, 255, 0.5)"
            />
            <Pressable onPress={togglePlayPause} style={styles.play_icon}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <AntDesign
                  name={isPlaying ? 'pause' : 'play'}
                  size={20}
                  color="#fff"
                />
              )}
            </Pressable>
          </View>
          <Pressable onPress={handleAddAudio}>
            <Text style={styles.audio_name} numberOfLines={1}>
              {fileName}
            </Text>
          </Pressable>
        </View>
        <Pressable onPress={handleAddAudio}>
          <AntDesign name="right" size={15} color="#000" />
        </Pressable>
      </View>
    );
  };

  useEffect(() => {
    selectAudio();
    return () => SoundPlayer.stop();
  }, []);

  return (
    <View style={styles.main_container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <FastImage source={gifs.tiktokLoader} style={styles.loader} />
          <Text style={styles.loadingText}>
            {t('Scanning device for audio files...')}
          </Text>
        </View>
      ) : audio_list.length > 0 ? (
        <FlatList
          data={audio_list}
          renderItem={({item}) => <RenderItem item={item} />}
          keyExtractor={(item, index) => `${item}-${index}`}
        />
      ) : (
        <View style={styles.no_audio_container}>
          <Text style={styles.no_audio_text}>
            {t('It appears that there are no songs stored on your device')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(DeviceSoundScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  item_main_container: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 15,
    alignItems: 'center',
  },
  right_container: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  right_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audio_name: {
    marginLeft: 20,
    color: '#000',
    fontSize: 14,
    maxWidth: width * 0.6,
  },
  play_icon: {
    position: 'absolute',
  },
  no_audio_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no_audio_text: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    color: COLOR.BLACK,
    fontSize: 16,
  },
  loader: {
    width: 40,
    height: 40,
  },
});
