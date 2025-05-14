import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as audioApi from '../../apis/audio.api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {formatNumber} from '../../utils/formatNumber';
import RenderSoundUserVideo from './components/RenderSoundUserVideo';
import LinearGradient from 'react-native-linear-gradient';
import * as RNFS from '@dr.pogodin/react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import * as soundApi from '../../apis/sound';
import ShareAudio from './components/ShareAudio';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import {
  setSoundShareContent,
  showSoundShareSheet,
  addFavouriteSound,
  removeFavouriteSound,
} from '../../store/slices/ui/indexSlice';
import {
  SoundMainScreenScreenNavigationProps,
  SoundMainScreenScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {WatchVideoProfileActionEnum} from '../../enum/WatchProfileActionEnum';
import {colors1} from './utils/colors';
import Header from '../profile/profile/components/Header';
import ProfileImage from '../../components/ProfileImage';
import DownloadAndUseSound from './components/DownloadAndUseSound';
import {SoundVideoData} from './types/SoundVideo';
import {MediaType} from '../newVideo/enum/MediaType';
import {
  addNickname,
  setRemixedVideoId,
  setSoundRemoteUrl,
} from '../../store/slices/content/externalSoundSlice';
import {NewVideoCompositeNavigationProp} from '../../navigations/types/NewVideoNavigationAndRoute';
import ConfirmModal from '../../components/ConfirmModal';
import {useTranslation} from 'react-i18next';
import MaskedView from '@react-native-masked-view/masked-view';
import FastImage from '@d11/react-native-fast-image';
import {gifs} from '../../assets/gifs';

const {width, height} = Dimensions.get('screen');

interface SoundData {
  soundRemoteURL: string;
  id: number;
}

const SoundMainScreen: React.FC = () => {
  const route = useRoute<SoundMainScreenScreenRouteProps>();
  const navigation = useNavigation<NewVideoCompositeNavigationProp>();
  const dispatch = useDispatch();
  const video_id: number = route?.params?.video_id ?? -1;
  const my_data = useSelector((state: any) => state.my_data.my_profile_data);
  const [data, setData] = useState<SoundVideoData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [download_loading, setDownload_loading] = useState<boolean>(false);
  const [isFavourites, setIsFavourites] = useState<boolean>(false);
  const soundRemoteData = useRef<SoundData>({soundRemoteURL: '', id: -1});
  const [sound_list, setSound_list] = useState<string[]>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {t} = useTranslation();

  const getSound = async () => {
    try {
      if (soundRemoteData.current) {
        setDownload_loading(true);

        // Define download paths based on platform
        let downLoadDir: string;
        let filePath: string;

        if (Platform.OS === 'android') {
          // Android: Save to public Downloads directory
          downLoadDir = `${ReactNativeBlobUtil.fs.dirs.SDCardDir}/Download/Dream`;
          filePath = `${downLoadDir}/${data[0].user.nickname}.aac`;

          // Check if directory exists before creating
          const dirExists = await ReactNativeBlobUtil.fs.exists(downLoadDir);
          if (!dirExists) {
            await ReactNativeBlobUtil.fs.mkdir(downLoadDir);
          }
        } else {
          // iOS: Save to Documents directory using consistent API
          downLoadDir = `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/Dream`;
          filePath = `${downLoadDir}/${data[0].user.nickname}.aac`;

          // Check if directory exists before creating
          const dirExists = await ReactNativeBlobUtil.fs.exists(downLoadDir);
          if (!dirExists) {
            await ReactNativeBlobUtil.fs.mkdir(downLoadDir);
          }
        }

        // Download the file
        const response = await ReactNativeBlobUtil.config({
          fileCache: true,
          path: filePath,
        }).fetch('GET', soundRemoteData.current.soundRemoteURL);

        if (Platform.OS === 'android') {
          // Add to MediaStore and show notification
          ReactNativeBlobUtil.android.addCompleteDownload({
            title: `sound_${data[0].user.nickname}.aac`,
            description: 'Audio file downloaded from App',
            mime: 'audio/aac',
            path: filePath,
            showNotification: true,
          });
        }

        Toast.show(t('Successfully Downloaded'), Toast.LONG);

        if (Platform.OS === 'ios') {
          // Open Files app with downloaded file
          ReactNativeBlobUtil.ios.openDocument(filePath);
        }
      }
    } catch (error) {
      console.log('Error during download:', error);
      Toast.show(t('Error downloading audio'), Toast.LONG);
    } finally {
      setDownload_loading(false);
    }
  };
  /**
   * Get all remixed video
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await audioApi.getCompleteRemixedAudioByVideoId(video_id);
    setData(result?.payload);
    setLoading(false);
  }, [video_id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Get original sound url
   */
  const getSoundRemoteURL = useCallback(async () => {
    try {
      const result = await audioApi.getAudioFromVideoId(video_id);
      const url = `https://dpcst9y3un003.cloudfront.net/extracted_audio/${result?.payload?.audio_url}`;
      soundRemoteData.current = {
        soundRemoteURL: url,
        id: result?.payload?.id,
      };
    } catch (error) {
      console.log('Error while getting original sound link');
    }
  }, [data]);

  const handleUseSoundPress = async () => {
    console.log('SoundRemoteData:', soundRemoteData.current.soundRemoteURL);
    if (soundRemoteData.current) {
      dispatch(setRemixedVideoId(video_id));
      dispatch(addNickname(data[0].user?.nickname));
      dispatch(setSoundRemoteUrl(soundRemoteData.current.soundRemoteURL));
      navigation.navigate('BottomTabNavigation', {
        screen: 'NewVideoStackNavigation',
      });
    } else {
      getSoundRemoteURL();
    }
  };

  const handleProfileClick = () => {
    navigation.navigate('UserProfileMainPage', {user_id: data[0]?.user?.id});
  };

  const fetchSoundData = useCallback(async () => {
    try {
      const sound_data = await soundApi.getFavouriteSound(my_data?.auth_token);
      const newSoundList = sound_data?.payload;
      setSound_list(newSoundList);

      if (soundRemoteData.current && newSoundList) {
        const matchedFavorites = newSoundList.filter(
          (favSound: any) => favSound.sound_id === soundRemoteData.current.id,
        );
        setIsFavourites(matchedFavorites.length > 0);
      }
    } catch (error) {
      console.log('Error: generated while getting the fav sound data');
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    getSoundRemoteURL();
  }, [getSoundRemoteURL]);

  useEffect(() => {
    if (soundRemoteData.current.id !== -1) {
      fetchSoundData();
    }
  }, [soundRemoteData.current.id, fetchSoundData]);

  // Replace your handleFavPress with:
  const handleFavPress = async () => {
    const audio_url = soundRemoteData.current.soundRemoteURL.split('/').pop();
    try {
      if (soundRemoteData.current) {
        const soundData = {
          id: Date.now(),
          sound_id: soundRemoteData.current.id,
          user_id: my_data.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          extracted_audio: {
            audio_url: audio_url,
            id: soundRemoteData.current.id,
            user_id: data[0].user.id,
            video_id: data[0].id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: data[0].user.id,
              profile_pic: data[0].user.profile_pic,
              nickname: data[0].user.nickname,
              username: data[0].user.username,
            },
            video: {
              thum: data[0].thum,
            },
          },
        };

        if (isFavourites) {
          setShowConfirmModal(true);
        } else {
          await soundApi.addFavouriteSound(my_data?.auth_token, {
            sound_id: soundRemoteData.current.id,
          });
          dispatch(addFavouriteSound(soundData));
          Toast.show('Added to Favourites', Toast.LONG);
          setIsFavourites(!isFavourites);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removefavourite = async () => {
    try {
      if (soundRemoteData.current) {
        await soundApi.removeFavouriteSound(my_data?.auth_token, {
          sound_id: soundRemoteData.current.id,
        });
        dispatch(removeFavouriteSound(soundRemoteData.current.id));
        setIsFavourites(!isFavourites);
        setShowConfirmModal(false);
        Toast.show('Removed from Favourites', Toast.LONG);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPermissions = async () => {
    if (Platform.OS === 'android') {
      await requestMultiple([
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ]);
    } else if (Platform.OS === 'ios') {
      await requestMultiple([
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.MEDIA_LIBRARY,
      ]);
    }
  };

  const onPostClick = async (index: number, current_video_id: number) => {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.SOUND_VIDEO,
      respected_action_data: video_id,
      current_video_id: current_video_id,
      current_index: index,
    });
  };

  const handleSharePress = () => {
    dispatch(showSoundShareSheet(true));
    dispatch(setSoundShareContent(video_id));
  };

  return (
    <>
      <View style={styles.main_container}>
        <LinearGradient
          colors={colors1}
          style={styles.main_container}
          onLayout={getPermissions}>
          <View style={styles.main_container}>
            {loading && (
              <View style={styles.indicator}>
                <FastImage source={gifs.tiktokLoader} style={styles.loader} />
              </View>
            )}
            <Header
              thirdButton={true}
              headertext={data[0]?.user?.nickname}
              onPress={handleSharePress}
              thirdButtonText={
                <MaterialCommunityIcons
                  name="share-outline"
                  size={40}
                  color={'#000'}
                />
              }
            />

            <View style={styles.second_container}>
              <ProfileImage
                uri={data[0]?.user?.profile_pic}
                width={100}
                height={100}
                allowBorderRadius={true}
                allowCover={false}
                onPress={handleProfileClick}
                borderRadius={10}
              />
              <Text style={styles.original_txt}>{t('Original Sound')}</Text>
              <Text style={styles.published_txt}>
                {t('Published')} {formatNumber(data?.length)}
              </Text>
              <Pressable style={styles.fav_view} onPress={handleFavPress}>
                <Text style={styles.fav_txt}>
                  {isFavourites ? `${t('Added')}` : `${t('Add')}`}{' '}
                  {t('to Favorites')}
                </Text>
                <MaskedView
                  maskElement={
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <FontAwesome
                        name={isFavourites ? 'bookmark' : 'bookmark-o'}
                        size={20}
                        color="white"
                      />
                    </View>
                  }>
                  <LinearGradient
                    colors={
                      isFavourites ? ['#4287f5', '#42c5f5'] : ['#000', '#555']
                    }
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{width: 20, height: 20}}
                  />
                </MaskedView>
              </Pressable>
            </View>

            <View style={styles.last_container}>
              <FlatList
                data={data}
                numColumns={3}
                keyExtractor={item => item.id.toString()}
                renderItem={({item, index}) => (
                  <RenderSoundUserVideo
                    item={item}
                    video_id={video_id}
                    onPostClick={onPostClick}
                    index={index}
                  />
                )}
              />
            </View>

            <DownloadAndUseSound
              handleUseSoundPress={handleUseSoundPress}
              getSound={getSound}
              download_loading={download_loading}
            />
          </View>
          <ShareAudio />
        </LinearGradient>
      </View>

      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => removefavourite()}
        title={t('Remove from favorites')}
        message={t('Are you sure you want to remove hashtag from favorites?')}
        confirmText={t('Remove')}
        confirmColor="#fff"
        cancelText={t('Cancel')}
      />
    </>
  );
};

export default React.memo(SoundMainScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: width,
    height: '100%',
    paddingTop: 8,
  },
  header_view: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  mickname_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname_txt: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
  },
  second_container: {
    width: width,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    top: -3,
    borderBottomColor: 'rgb(192, 192, 192)',
  },
  profile_pic: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  fav_image: {
    width: 20,
    height: 20,
    tintColor: 'rgba(0, 0, 0, 0.7)',
  },
  original_txt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    textAlign: 'left',
  },
  published_txt: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    textAlign: 'left',
  },
  fav_view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 5,
  },
  fav_txt: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '600',
    marginRight: 10,
    fontSize: 12,
    textAlign: 'left',
  },
  last_container: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 100000,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  loader: {
    width: 40,
    height: 40,
  },
});
