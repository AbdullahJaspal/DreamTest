import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import ShareHastag from './components/ShareHastag';
import * as hashtagApi from '../../apis/hashtag.api';
import {VideoData} from '../other_user/types/VideoData';
import {UserProfile} from '../../types/UserProfileData';
import {selectMyProfileData} from '../../store/selectors';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../profile/profile/components/Header';
import UseHashTagButton from './components/UseHashTagButton';
import * as hastagApi from '../../apis/favourate_hashtag_Api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import {showHastagShareSheet} from '../../store/slices/ui/indexSlice';
import {addhashtag} from '../../store/slices/content/postHashtagSlice';
import * as favouritehashtagapi from '../../apis/favourate_hashtag_Api';
import {WatchVideoProfileActionEnum} from '../../enum/WatchProfileActionEnum';
import RenderSoundUserVideoProps from '../sounds/components/RenderSoundUserVideo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  removeFavoriteHashtag,
  setFavoriteHashtags,
} from '../../store/slices/ui/favoriteHashtagsSlice';
import {
  HashtagScreenScreenNavigationProps,
  HashtagScreenScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import MaskedView from '@react-native-masked-view/masked-view';
import ConfirmModal from '../../components/ConfirmModal';
import FastImage from '@d11/react-native-fast-image';
import {gifs} from '../../assets/gifs';
import {icons} from '../../assets/icons';

const colors1 = [
  '#E6F0FF',
  '#ECF4FF',
  '#F1F7FF',
  '#F7FBFF',
  '#FCFEFF',
  '#FEFFFF',
  '#FEFFFF',
  '#FEFFFF',
  '#FEFFFF',
  '#FFFFFF',
];

const {width, height} = Dimensions.get('screen');

const HashtagScreen: React.FC = () => {
  const {t, i18n} = useTranslation();

  const route = useRoute<HashtagScreenScreenRouteProps>();
  const navigation = useNavigation<HashtagScreenScreenNavigationProps>();
  const title = route?.params?.hashtag_text || route?.params?.title;
  const noOfVideos = route.params.no_of_videos || route?.params?.post;
  const tag_id = route?.params?.hashtag_id || route?.params?.tag_id;
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [hastagData, setHashtagData] = useState<VideoData[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isFavourites, setIsFavourites] = useState<boolean>(false);

  const getVideoThroughTag = useCallback(async () => {
    try {
      const result = await hashtagApi.getVideoThroughTag(tag_id);
      setHashtagData(result.payload);
    } catch (error) {
      console.log('Error genereated while getting tag videos', error);
    } finally {
      setLoading(false);
    }
  }, [tag_id]);

  useEffect(() => {
    getVideoThroughTag();
  }, [getVideoThroughTag]);

  const fetchHashtagData = useCallback(async () => {
    try {
      const hastag_data = await hastagApi.getfavouritehashtag(
        my_data?.auth_token,
      );
      const hastag = hastag_data?.payload;

      const matchedFavorites = hastag.filter(
        (favSound: any) => favSound.tag_id === tag_id,
      );
      setIsFavourites(matchedFavorites.length > 0);

      hastag.forEach(tag => {
        dispatch(setFavoriteHashtags(tag));
      });
    } catch (error) {
      console.log('Error: genrated while getting the fav hashtag data');
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    fetchHashtagData();
  }, [fetchHashtagData]);

  const addfavourite = async () => {
    try {
      const data = {
        hashtag_id: tag_id,
      };
      const Response = await favouritehashtagapi.Addfavouritehashtag(
        data,
        my_data?.auth_token,
      );
      if (Response.result == 'all Ready exit') {
        Toast.show('All Ready Add Favorites', Toast.LONG);
        setIsFavourites(true);
      }
      if (Response.success === true) {
        Toast.show('Added Favorites Hashtag ', Toast.LONG);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removefavourite = async () => {
    try {
      const data = {
        hashtag_id: tag_id,
      };
      const Response = await favouritehashtagapi.Removefavouritehashtag(
        data,
        my_data?.auth_token,
      );
      // dispatch(removeFavoriteHashtag(tag_id));
      setIsFavourites(!isFavourites);
      if (Response.success === true) {
        Toast.show('Removed Favorites Hashtag ', Toast.LONG);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleUseHashtagPress = () => {
    dispatch(addhashtag(title));
    navigation.navigate('NewVideo');
  };

  const handleFavoritePress = () => {
    if (isFavourites) {
      setShowConfirmModal(true);
    } else {
      addfavourite();
      setIsFavourites(!isFavourites);
    }
  };

  const handleSharePress = () => {
    dispatch(showHastagShareSheet(true));
  };

  function handlePostClick(index: number, video_id: number): void {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.HASHTAG_VIDEO,
      respected_action_data: tag_id,
      current_index: index,
      current_video_id: video_id,
    });
  }

  return (
    <>
      <View style={styles.main_container}>
        <LinearGradient colors={colors1} style={styles.main_container}>
          <View style={styles.main_container}>
            {loading && (
              <View style={styles.indicator}>
                <FastImage source={gifs.tiktokLoader} style={styles.loader} />
              </View>
            )}

            <Header
              thirdButton={true}
              headertext={t('Hashtag Screen')}
              onPress={handleSharePress}
              thirdButtonText={
                <MaterialCommunityIcons
                  name="share-outline"
                  size={30}
                  color={'#000'}
                />
              }
            />

            <View style={styles.second_container}>
              <Image source={icons.hashtag} style={styles.profile_pic} />
              <Text style={styles.original_txt}># {title}</Text>
              <Text style={styles.published_txt}>
                {t('Post')} {noOfVideos}
              </Text>
              <Pressable style={styles.fav_view} onPress={handleFavoritePress}>
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
                data={hastagData}
                numColumns={3}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                  <Text style={styles.text}>{t('No videos found')}.</Text>
                }
                ListFooterComponent={
                  <Text style={styles.text}>
                    {t('No more videos avaliable')}
                  </Text>
                }
                renderItem={({item, index}) => (
                  <RenderSoundUserVideoProps
                    item={item}
                    index={index}
                    video_id={-1}
                    onPostClick={handlePostClick}
                  />
                )}
              />
            </View>
          </View>
          <UseHashTagButton handleUseHashtagPress={handleUseHashtagPress} />
          <ShareHastag />
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

export default React.memo(HashtagScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: width,
    height: '100%',
    paddingTop: 8,
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
    borderWidth: 0.4,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  original_txt: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    textAlign: 'left',
  },
  published_txt: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
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
  },
  text: {
    width: width,
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    marginVertical: 10,
  },
  fav_image: {
    width: 20,
    height: 20,
    tintColor: 'rgba(0, 0, 0, 0.7)',
  },
  loader: {
    width: 40,
    height: 40,
  },
});
