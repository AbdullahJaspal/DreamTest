import React, {useRef, useEffect, useCallback, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewToken,
  Platform,
} from 'react-native';

import {useRoute, useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../store/hooks';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from '../../components/Icon';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

import VideoItem from '../home/components/VideoItem';

import * as videoApi from '../../apis/video.api';
import * as audioApi from '../../apis/audio.api';
import * as shareApi from '../../apis/share';
import * as hashtagApi from '../../apis/hashtag.api';

import BottomSheetComment from '../main/components/BottomSheetComment';
import GiftSheet from '../home/components/GiftSheet';

import {
  setCurrentUser,
  setCurrentVideo,
} from '../../store/slices/ui/indexSlice';

import {adUnitId} from '../../ads/BannerAds';
import {COLOR} from '../../configs/styles';

import {
  WatchProfileVideoScreenNavigationProps,
  WatchProfileVideoScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {WatchVideoProfileActionEnum} from '../../enum/WatchProfileActionEnum';
import {UserProfile} from '../../types/UserProfileData';

import {
  selectBottomSectionHeight,
  selectBottomTabHeight,
  selectMyProfileData,
} from '../../store/selectors';
import {gifs} from '../../assets/gifs';

const {width, height} = Dimensions.get('window');

interface CellType {
  playVideo: () => void;
  pauseVideo: () => void;
}

interface CellRefsType {
  [key: string]: CellType;
}

const WatchProfileVideo: React.FC = () => {
  const route = useRoute<WatchProfileVideoScreenRouteProps>();
  const flatListRef = useRef<FlatList<any>>(null);
  const navigation = useNavigation<WatchProfileVideoScreenNavigationProps>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const videoPlaying = useRef<string | undefined>(undefined);
  const bottomTabHeight = useAppSelector(selectBottomTabHeight);
  const bottomSectionHeight = useAppSelector(selectBottomSectionHeight);
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const saved_bottomheight = bottomSectionHeight - bottomTabHeight;
  const cellRefs = useRef<CellRefsType>({});
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(0);
  const bannerRef = useRef<BannerAd | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const actionName: WatchVideoProfileActionEnum = route.params.action_name;
  const respectedActionId: number | string | undefined =
    route.params.respected_action_data;
  const currentVideoId: number | undefined = route.params.current_video_id;
  const initialIndex: number | undefined = route.params.current_index;
  const [page, setPage] = useState<number>(1);

  const getMyUploadedVideos = useCallback(async () => {
    try {
      const result = await videoApi.getUserFullUploadedVideos({
        token: my_data.auth_token ?? '',
        user_id: respectedActionId ?? '',
        video_id: currentVideoId ?? '',
        page: page,
        limit: 5,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error('Error fetching my uploaded videos:', error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, page]);

  const getMyPrivateVideos = useCallback(async () => {
    try {
      const result = await videoApi.getUserFullPrivateVideos({
        token: my_data.auth_token ?? '',
        user_id: respectedActionId ?? '',
        video_id: currentVideoId ?? '',
        page: page,
        limit: 5,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error('Error fetching my private videos:', error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, currentVideoId, page]);

  const getMyFavouriteVideos = useCallback(async () => {
    try {
      const result = await videoApi.getFullFavouriteVideo({
        token: my_data.auth_token ?? '',
        user_id: respectedActionId ?? '',
        video_id: currentVideoId ?? '',
        page: page,
        limit: 5,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error('Error fetching my favourite videos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentVideoId, respectedActionId, page]);

  const getMyLikedVideos = useCallback(async () => {
    try {
      const result = await videoApi.getUserFullLikedVideos({
        token: my_data.auth_token ?? '',
        user_id: respectedActionId ?? '',
        video_id: currentVideoId ?? '',
        page: page,
        limit: 5,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error('Error fetching my liked videos:', error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, page]);

  const getAnotherUserUploadedVideos = useCallback(async () => {
    try {
      const result = await videoApi.getUserFullUploadedVideos({
        token: my_data.auth_token ?? '',
        user_id: respectedActionId ?? '',
        video_id: currentVideoId ?? '',
        page: page,
        limit: 5,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error("Error fetching another user's uploaded videos:", error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, page]);

  const getAnotherUserLikedVideos = useCallback(async () => {
    try {
      const result = await videoApi.getUserFullLikedVideos({
        token: my_data.auth_token ?? '',
        user_id: respectedActionId ?? '',
        video_id: currentVideoId ?? '',
        page: page,
        limit: 5,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error("Error fetching another user's liked videos:", error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, page]);

  const getSoundVideos = useCallback(async () => {
    try {
      const result = await audioApi.getFullCompleteRemixedAudioByVideoId({
        video_id: Number(respectedActionId),
        respected_id: Number(currentVideoId),
        limit: 5,
        page: page,
      });
      if (result.payload) {
        setVideos([...videos, ...result?.payload]);
      }
    } catch (error) {
      console.error('Error fetching sound videos:', error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, currentVideoId, page]);

  const getHashtagVideos = useCallback(async () => {
    try {
      if (respectedActionId && currentVideoId) {
        const result = await hashtagApi.getFullVideoThroughTag(
          Number(respectedActionId),
          currentVideoId,
          page,
          5,
        );
        if (result.payload) {
          setVideos([...videos, ...result?.payload]);
        }
      }
    } catch (error) {
      console.error('Error fetching hashtag videos:', error);
    } finally {
      setLoading(false);
    }
  }, [respectedActionId, currentVideoId, page]);

  const getShareVideos = useCallback(async () => {
    try {
      setLoading(true);
      const result = await shareApi.getVideoIdFromVideoShareToken(
        respectedActionId,
      );
      setVideos(result.payload);
    } catch (error) {
      console.error('Error fetching share videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * TO DO
   * Need to implement the pagination
   */
  const getSearchMainVideos = useCallback(async () => {
    try {
      if (currentVideoId) {
        const result = await videoApi.getFullVideodiscover(
          respectedActionId,
          page,
          5,
          my_data?.auth_token,
          currentVideoId,
        );
        if (result.payload) {
          setVideos([...videos, ...result?.payload]);
        }
      }
    } catch (error) {
      console.error('Error fetching search main videos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, currentItemIndex, respectedActionId]);

  const getSearchTopVideoByView = useCallback(async () => {
    try {
      if (currentVideoId) {
        const result = await videoApi.discoverFullVideobyview(
          currentVideoId,
          page,
          5,
          my_data?.auth_token,
        );
        if (result.payload) {
          setVideos([...videos, ...result?.payload]);
        }
      }
    } catch (error) {
      console.error('Error fetching search top video by view:', error);
    } finally {
      setLoading(false);
    }
  }, [currentVideoId, page]);

  const getSearchTopVideoByCoin = useCallback(async () => {
    try {
      if (currentVideoId) {
        const result = await videoApi.discoverFullVideobycoins(
          currentVideoId,
          page,
          5,
          my_data?.auth_token,
        );
        if (result.payload) {
          setVideos([...videos, ...result?.payload]);
        }
      }
    } catch (error) {
      console.error('Error fetching search top video by coin:', error);
    } finally {
      setLoading(false);
    }
  }, [currentVideoId, page]);

  const getSearchTopVideoByCountryID = useCallback(async () => {
    try {
      if (respectedActionId) {
        const respectedData = respectedActionId.toString().split(':');
        const result = await videoApi.discoverSearchFullVideoByCountryID({
          countryId: Number(respectedData[0]),
          sortedType: respectedData[1] as unknown as 'view' | 'diamond_value',
          pageNo: page,
          pageSize: 5,
          video_id: currentVideoId,
        });
        if (result.payload) {
          setVideos([...videos, ...result?.payload]);
        }
      }
    } catch (error) {
      console.error('Error fetching search top video by country id:', error);
    } finally {
      setLoading(false);
    }
  }, [page, respectedActionId, currentVideoId]);

  const handleApiSelection = useCallback(() => {
    switch (actionName) {
      case WatchVideoProfileActionEnum.MY_UPLOADED_VIDEO:
        getMyUploadedVideos();
        break;
      case WatchVideoProfileActionEnum.MY_PRIVATE_VIDEO:
        getMyPrivateVideos();
        break;
      case WatchVideoProfileActionEnum.MY_FAVOURITE_VIDEO:
        getMyFavouriteVideos();
        break;
      case WatchVideoProfileActionEnum.MY_LIKED_VIDEO:
        getMyLikedVideos();
        break;
      case WatchVideoProfileActionEnum.ANOTHER_USER_UPLOADED_VIDEO:
        getAnotherUserUploadedVideos();
        break;
      case WatchVideoProfileActionEnum.ANOTHER_USER_LIKED_VIDEO:
        getAnotherUserLikedVideos();
        break;
      case WatchVideoProfileActionEnum.SOUND_VIDEO:
        getSoundVideos();
        break;
      case WatchVideoProfileActionEnum.HASHTAG_VIDEO:
        getHashtagVideos();
        break;
      case WatchVideoProfileActionEnum.SHARE_VIDEO:
        getShareVideos();
        break;
      case WatchVideoProfileActionEnum.SEARCH_MAIN_VIDEO:
        getSearchMainVideos();
        break;
      case WatchVideoProfileActionEnum.SEARCH_TOP_VIDEO_BY_VIEW:
        getSearchTopVideoByView();
        break;
      case WatchVideoProfileActionEnum.SEARCH_TOP_VIDEO_BY_COIN:
        getSearchTopVideoByCoin();
        break;
      case WatchVideoProfileActionEnum.SEARCH_TOP_VIDEO_BY_COUNTRY_ID:
        getSearchTopVideoByCountryID();
        break;
      default:
        break;
    }
  }, [
    getMyUploadedVideos,
    getMyPrivateVideos,
    getMyFavouriteVideos,
    getMyLikedVideos,
    getAnotherUserUploadedVideos,
    getAnotherUserLikedVideos,
    getSoundVideos,
    getHashtagVideos,
    getShareVideos,
    getSearchMainVideos,
    getSearchTopVideoByView,
    getSearchTopVideoByCoin,
    getSearchTopVideoByCountryID,
  ]);

  useEffect(() => {
    handleApiSelection();
  }, [handleApiSelection]);

  /********************************************** */
  const onViewableItemsChanged = useRef((props: {changed: ViewToken[]}) => {
    const changed = props.changed;
    changed.forEach(item => {
      const cell = cellRefs.current[item.key];
      if (cell) {
        if (item.isViewable) {
          cell.playVideo();
          setCurrentItemIndex(item.index ?? -1);
          dispatch(setCurrentUser(item.item.id));
          dispatch(setCurrentVideo(item?.item));
          videoPlaying.current = item.key;
        } else {
          cell.pauseVideo();
        }
      } else {
      }
    });
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 95,
  }).current;
  /********************************************** */

  /********************************************** */
  useEffect(() => {
    const cell = cellRefs.current[videoPlaying.current ?? -1];
    if (cell) {
      if (isFocused === true) {
        cell.playVideo();
      } else {
        cell.pauseVideo();
      }
    }
    return () => {
      if (cell) {
        cell.pauseVideo();
      }
    };
  }, [route, isFocused]);
  /********************************************** */

  const renderItem = useCallback(
    ({item, index}: {item: any; index: number}) => (
      <>
        <View style={styles.header}>
          <BannerAd
            ref={bannerRef}
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />

          <View style={styles.username_view}>
            <TouchableOpacity
              style={styles.arrow_button}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('Index');
                }
              }}>
              <AntDesign name="arrowleft" color={'#fff'} size={25} />
            </TouchableOpacity>

            <Text style={styles.txt}>{item?.user?.username}</Text>
          </View>
        </View>

        <VideoItem
          ref={(ref: any) => (cellRefs.current[index] = ref as any)}
          index={index}
          item={item}
          dataLength={videos?.length}
          flatListRef={flatListRef}
          height_screen={height}
          saved_bottomheight={saved_bottomheight}
        />
      </>
    ),
    [],
  );

  function handleEndReached(info: {distanceFromEnd: number}): void {
    setPage(p => (p = p + 1));
  }

  return (
    <View style={styles.main_container}>
      {loading ? (
        <View style={styles.loader}>
          <Icon source={gifs.tiktokLoader} width={50} height={50} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={videos}
          pagingEnabled={true}
          renderItem={renderItem}
          keyExtractor={(_item, index) => index.toString()}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={1}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          pinchGestureEnabled={true}
          snapToAlignment="start"
          windowSize={3}
          onEndReachedThreshold={0.5}
          onEndReached={handleEndReached}
          maxToRenderPerBatch={2}
          decelerationRate={'normal'}
          getItemLayout={(data, index) => ({
            length: height,
            offset: height * index,
            index,
          })}
        />
      )}
      <BottomSheetComment />
      <GiftSheet />
    </View>
  );
};

export default React.memo(WatchProfileVideo);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#020202',
  },
  video: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: Platform.select({
      ios: 10,
      android: 0,
    }),
    left: 0,
    right: 0,
    zIndex: 10001,
    paddingVertical: 18,
  },
  arrow_button: {
    position: 'absolute',
    left: 5,
    zIndex: 100000,
  },
  txt: {
    fontSize: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 5, height: 5},
    textShadowRadius: 10,
  },
  username_view: {
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loader: {
    width: width,
    height: height,
    backgroundColor: COLOR.BACKGROUND_LOADING,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
