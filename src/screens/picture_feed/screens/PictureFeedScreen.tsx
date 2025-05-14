// Improved PictureFeedScreen.tsx
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ViewToken,
  RefreshControl,
  Text,
  InteractionManager,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {PicturePost} from '../types/picturePost';
import ShareSheet from '../components/ShareSheet';
import {POST_EVENTS} from '../../../socket/events';
import {useAppSelector} from '../../../store/hooks';
import * as imagePostApi from '../../../apis/imagePost';
import {useSocket} from '../../../socket/SocketProvider';
import * as videoApi from '../../../apis/video.api';
import RenderMainFeed from '../components/RenderMainFeed';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../profile/profile/components/Header';
import MoreOptionsModel from '../components/MoreOptionsModel';
import ListPictureFeedHeader from '../components/ListPictureFeedHeader';
import RemovedPostPlaceholderProps from '../components/RemovedPostPlaceholderProps';
import HiddenPostPlaceholder from '../components/HiddenPostPlaceholderProps';
import {
  selectMyProfileData,
  selectBlockedUserIds,
  selectHiddenPostIds,
  selectRemovePostIds,
} from '../../../store/selectors';
import FastImage from '@d11/react-native-fast-image';
import {useRoute} from '@react-navigation/native';
import {gifs} from '../../../assets/gifs';

const PictureFeedScreen: React.FC = () => {
  const {t} = useTranslation();
  const {emit} = useSocket();
  const [refreshing, setRefreshing] = useState(false);
  const my_data = useAppSelector(selectMyProfileData);
  const blockedUserIds = useAppSelector(selectBlockedUserIds);
  const hiddenPostIds = useAppSelector(selectHiddenPostIds);
  const removePostIds = useAppSelector(selectRemovePostIds);
  const route = useRoute();

  const [loading, setLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [postData, setPostData] = useState<PicturePost[]>([]);
  const [initialRenderComplete, setInitialRenderComplete] =
    useState<boolean>(false);
  const [targetPostIndex, setTargetPostIndex] = useState<number>(-1);
  const pageNo = useRef<number>(1);
  const pageSize = useRef<number>(20);
  const flatListRef = useRef<FlatList>(null);
  const {postId} = route.params as {postId?: number};
  const {isUserPost} = route.params as {isUserPost?: boolean};

  // Shuffle array function for randomizing feed content
  const shuffleArray = (array: PicturePost[]) => {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  // Fetch posts from API
  const getImagePost = useCallback(async (): Promise<void> => {
    const isRefreshing = pageNo.current === 1;

    if (isRefreshing) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      let result;

      if (postId && isUserPost) {
        result = await videoApi.getUserPicturePosts(
          my_data.auth_token,
          pageNo.current,
          pageSize.current,
        );
      } else {
        result = await imagePostApi.getPicturePost(
          my_data.auth_token,
          pageNo.current,
          pageSize.current,
        );
      }

      if (result.payload.length === 0) return;

      const filteredPosts = result.payload.filter(
        (post: PicturePost) => !blockedUserIds.includes(post.user.id),
      );

      const processedPosts = postId
        ? filteredPosts
        : shuffleArray([...filteredPosts]);

      if (postId && isRefreshing) {
        const index = processedPosts.findIndex(
          (post: any) => post.id === postId,
        );
        if (index !== -1) {
          setTargetPostIndex(index);
        }
      }

      if (isRefreshing) {
        setPostData(processedPosts);
      } else {
        setPostData(prev => {
          const newPosts = [...prev, ...processedPosts];
          if (postId && targetPostIndex === -1) {
            const index = newPosts.findIndex(post => post.id === postId);
            if (index !== -1) {
              setTargetPostIndex(index);
            }
          }
          return newPosts;
        });
      }

      pageNo.current += 1;
    } catch (error) {
      console.log('Error getting picture feed from backend', error);
    } finally {
      if (isRefreshing) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [my_data.auth_token, blockedUserIds, postId, targetPostIndex]);

  // Initial data fetch
  useEffect(() => {
    getImagePost();
  }, [getImagePost]);

  // Handle the initial render and scrolling
  useEffect(() => {
    if (
      !loading &&
      postId &&
      targetPostIndex !== -1 &&
      !initialRenderComplete
    ) {
      InteractionManager.runAfterInteractions(() => {
        setInitialRenderComplete(true);
      });
    }
  }, [loading, postId, targetPostIndex, initialRenderComplete]);

  useEffect(() => {
    if (
      initialRenderComplete &&
      targetPostIndex !== -1 &&
      flatListRef.current
    ) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: targetPostIndex,
          animated: false,
          viewPosition: 0,
        });
      });
    }
  }, [initialRenderComplete, targetPostIndex]);

  // Pull-to-refresh handler
  const handleRefresh = () => {
    setInitialRenderComplete(false);
    setTargetPostIndex(-1);
    pageNo.current = 1;
    getImagePost();
  };

  // Load more posts when reaching end of list
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && !loading) {
      getImagePost();
    }
  }, [isLoadingMore, loading, getImagePost]);

  // Handle scroll to index failure
  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const offset = info.averageItemLength * info.index;
    flatListRef.current?.scrollToOffset({
      offset,
      animated: false,
    });

    setTimeout(() => {
      if (flatListRef.current && info.index > 0) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: false,
        });
      }
    }, 100);
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 95,
  }).current;

  const handleOnViewableItemsChanged = useRef(
    (info: {
      viewableItems: ViewToken<PicturePost>[];
      changed: ViewToken<PicturePost>[];
    }): void => {
      info.changed.forEach(item => {
        if (item.isViewable) {
          emit(POST_EVENTS.NEW_POST_VIEW, {post_id: item.item.id});
        }
      });
    },
  ).current;

  if (postId && !initialRenderComplete && targetPostIndex === -1) {
    return (
      <SafeAreaView style={styles.main_container}>
        <Header headertext={postId ? t('Your Posts') : t('General Feed')} />
        <View style={styles.loading_container}>
          <FastImage source={gifs.tiktokLoader} style={styles.loader} />
          <Text style={styles.loadingText}>{t('Finding your post...')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (loading && !initialRenderComplete) {
    return (
      <SafeAreaView style={styles.main_container}>
        <Header headertext={postId ? t('Your Posts') : t('General Feed')} />
        <View style={styles.loading_container}>
          <FastImage source={gifs.tiktokLoader} style={styles.loader} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <Header headertext={postId ? t('Your Posts') : t('General Feed')} />
      <FlatList
        ref={flatListRef}
        data={postData.filter(post => !blockedUserIds.includes(post.user.id))}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        windowSize={10}
        initialNumToRender={postId ? Math.max(10, targetPostIndex + 3) : 10}
        maxToRenderPerBatch={postId ? Math.max(10, targetPostIndex + 3) : 10}
        ListHeaderComponent={ListPictureFeedHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.main_container}>
            <Text style={styles.text}>
              {postId
                ? t('No posts found for this user')
                : t('No posts available in the feed')}
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer_view}>
            {isLoadingMore && (
              <FastImage source={gifs.tiktokLoader} style={styles.loader} />
            )}
          </View>
        )}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        renderItem={({item, index}) => {
          if (hiddenPostIds.includes(item.id)) {
            return <HiddenPostPlaceholder postId={item.id} />;
          }
          if (removePostIds.includes(item.id)) {
            return <RemovedPostPlaceholderProps postId={item.id} />;
          }
          return <RenderMainFeed item={item} index={index} />;
        }}
      />
      <MoreOptionsModel />
      <ShareSheet />
    </SafeAreaView>
  );
};

export default React.memo(PictureFeedScreen);

const styles = StyleSheet.create({
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  footer_view: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  loader: {
    width: 40,
    height: 40,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
