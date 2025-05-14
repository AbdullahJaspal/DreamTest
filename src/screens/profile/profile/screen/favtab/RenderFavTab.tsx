import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import RenderFavFeed from './RenderFavFeed';
import {useTranslation} from 'react-i18next';
import RenderFavVideo from './RenderFavVideo';
import Toast from 'react-native-simple-toast';
import RenderFavUsers from './RenderFavUsers';
import RenderFavSound from './RenderFavSound';
import RenderFavHastag from './RenderFavHastag';
import RenderFavTabList from './RenderFavTabList';
import * as soundApi from '../../../../../apis/sound';
import * as userApi from '../../../../../apis/userApi';
import * as videoApi from '../../../../../apis/video.api';
import {useAppSelector} from '../../../../../store/hooks';
import {VideoData} from '../../../../other_user/types/VideoData';
import {useSocket} from '../../../../../socket/SocketProvider';
import {POST_EVENTS} from '../../../../../socket/events';
import {FlatList, StyleSheet, View, Image, Text} from 'react-native';
import {PicturePost} from '../../../../picture_feed/types/picturePost';
import * as hastagApi from '../../../../../apis/favourate_hashtag_Api';
import {addToFavorites} from '../../../../../store/slices/content/pictureSlice';
import {
  addFavouriteSound,
  setFavouriteSounds,
  addFavouriteUser,
  setFavouriteUsers,
} from '../../../../../store/slices/ui/indexSlice';
import {
  selectFavoritePosts,
  selectFavoriteSounds,
  selectFavoriteUsers,
  selectMyProfileData,
  selectFavoritesUpdateCount,
  selectFavoritesPostCount,
} from '../../../../../store/selectors';
import {icons} from '../../../../../assets/icons';

interface RenderFavTabProps {
  item: any;
  index: number;
}

const RenderFavTab: React.FC<RenderFavTabProps> = ({item, index}) => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const {emit} = useSocket();

  const [isLoading, setIsLoading] = useState(true);
  const [users_list, setUsers_list] = useState<string[]>();
  const [posts_list, setPosts_list] = useState<string[]>();
  const [hastag_list, setHastag_list] = useState<string[]>();
  const [video_list, setVideo_list] = useState<VideoData[]>();
  const [selected_tab, setSelected_tab] = useState<string>('Videos');
  const page = useRef<number>(1);
  const pageSize = useRef<number>(9);

  const my_data = useAppSelector(selectMyProfileData);
  const favoriteUsers = useAppSelector(selectFavoriteUsers);
  const favoritePosts = useAppSelector(selectFavoritePosts);
  const favoriteSounds = useAppSelector(selectFavoriteSounds);
  const favoritesUpdateCount = useAppSelector(selectFavoritesUpdateCount);
  const favoritesPostCount = useAppSelector(selectFavoritesPostCount);

  const data = [
    {
      title: t('Videos'),
      total_no: video_list?.length || 0,
      img: icons.videocam,
    },
    {
      title: t('Sounds'),
      total_no: favoriteSounds?.length || 0,
      img: icons.headphones,
    },
    {
      title: t('Hashtags'),
      total_no: hastag_list?.length || 0,
      img: icons.hashtag,
    },
    {
      title: t('Users'),
      total_no: favoriteUsers?.length || 0,
      img: icons.userFilled,
    },
    {
      title: t('Feed'),
      total_no: posts_list?.length || 0,
      img: icons.userFilled,
    },
  ];

  /**
   * get Favourite video
   */
  const fetchVideoData = useCallback(async () => {
    try {
      const video_data = await videoApi.getFavouriteVideo(my_data?.auth_token);
      setVideo_list(video_data?.payload);
    } catch (error) {
      console.log('Error: genrated while getting the fav video data');
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    fetchVideoData();
  }, [favoritesUpdateCount]);

  /**
   * get Favourite sound
   */
  const fetchSoundData = useCallback(async () => {
    try {
      const sound_data = await soundApi.getFavouriteSound(my_data?.auth_token);
      const payload = sound_data?.payload || [];
      dispatch(setFavouriteSounds([]));
      // Add each sound individually
      payload.forEach((sound: any) => {
        dispatch(addFavouriteSound(sound));
      });
    } catch (error) {
      console.log('Error: genrated while getting the fav sound data');
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    fetchSoundData();
  }, [fetchSoundData]);

  /**
   * get Favourite hastag
   */
  const fetchHashtagData = useCallback(async () => {
    try {
      const hastag_data = await hastagApi.getfavouritehashtag(
        my_data?.auth_token,
      );
      setHastag_list(hastag_data?.payload);
    } catch (error) {
      console.log('Error: genrated while getting the fav hashtag data');
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    fetchHashtagData();
  }, [fetchHashtagData]);

  /**
   * get Favourite users
   */
  const fetchUserData = useCallback(async () => {
    try {
      const user_data = await userApi.getUserFavouriteUsers(
        my_data?.auth_token,
      );
      const payload = user_data?.payload || [];
      setUsers_list(payload);

      dispatch(setFavouriteUsers([]));

      payload.forEach((item: any) => {
        dispatch(addFavouriteUser(item));
      });
    } catch (error) {
      console.log('Error: genrated while getting the fav users data');
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (!emit) return;

    emit(
      POST_EVENTS.GET_FAVORITE_POSTS,
      {page: page.current, pageSize: pageSize.current},
      (response: {
        success: boolean;
        message: string;
        data: Array<PicturePost>;
      }) => {
        setIsLoading(false);
        if (response.success) {
          setPosts_list(response.data.posts);
        } else {
          Toast.show(
            t(response.message || 'Failed to load favorites'),
            Toast.SHORT,
          );
        }
      },
    );
  }, [emit, dispatch, favoritesPostCount]);

  // Render empty screen when no content is available
  const RenderEmptyScreen = useCallback(() => {
    const selectedData = data.find(item => item.title === selected_tab);

    return (
      //GeneralChange
      <View style={styles.empty_container}>
        <Image source={selectedData?.img} style={styles.empty_image} />
        <Text style={styles.empty_text}>No {selected_tab} available yet!</Text>
      </View>
    );
  }, [selected_tab, data]);

  // Render the selected tab content
  const RenderSelectedTab = useCallback(() => {
    switch (selected_tab) {
      case t('Videos'):
        return video_list && video_list.length > 0 ? (
          <RenderFavVideo data={video_list} />
        ) : (
          RenderEmptyScreen()
        );
      case t('Sounds'):
        return favoriteSounds && favoriteSounds.length > 0 ? (
          <RenderFavSound data={favoriteSounds} />
        ) : (
          RenderEmptyScreen()
        );
      case t('Hashtags'):
        return hastag_list && hastag_list.length > 0 ? (
          <RenderFavHastag data={hastag_list} />
        ) : (
          RenderEmptyScreen()
        );
      case t('Users'):
        return favoriteUsers && favoriteUsers.length > 0 ? (
          <RenderFavUsers data={favoriteUsers} />
        ) : (
          RenderEmptyScreen()
        );
      case t('Feed'):
        return posts_list && posts_list.length > 0 ? (
          <RenderFavFeed data={posts_list} />
        ) : (
          RenderEmptyScreen()
        );
      default:
        return null;
    }
  }, [
    selected_tab,
    video_list,
    favoriteSounds,
    hastag_list,
    users_list,
    favoriteUsers,
    favoritePosts,
    t,
    RenderEmptyScreen,
  ]);

  return (
    <View style={styles.main_container}>
      <FlatList
        data={data}
        horizontal={true}
        keyExtractor={(_item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <RenderFavTabList
            item={item}
            selected_tab={selected_tab}
            setSelected_tab={setSelected_tab}
            index={index}
          />
        )}
      />
      <View>{RenderSelectedTab()}</View>
    </View>
  );
};

export default React.memo(RenderFavTab);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  empty_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  empty_image: {
    width: 70,
    height: 70,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  empty_text: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
