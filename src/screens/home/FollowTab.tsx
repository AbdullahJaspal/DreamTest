import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useRoute, useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import notifee from '@notifee/react-native';

import {Icon} from '../../components';
import {COLOR} from '../../configs/styles';
import * as VideoApi from '../../apis/video.api';
import {
  setCurrentUser,
  setCurrentVideo,
} from '../../store/slices/ui/indexSlice';
import {hideStatusBar} from '../../utils/statusBar';

import VideoItem from './components/VideoItem';
import NotFoundData from './components/NotFoundData';
import {gifs} from '../../assets/gifs';

const {height, width} = Dimensions.get('screen');

interface CellType {
  playVideo: () => void;
  pauseVideo: () => void;
}

interface CellRefsType {
  [key: string]: CellType;
}

const FollowTab = () => {
  const PAGE_SIZE = 20;

  // Hooks
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const bottomHeight = useBottomTabBarHeight();

  // Refs
  const flatListRef = useRef<FlatList<any> | null>(null);
  const videoPlaying = useRef<string | undefined>(undefined);
  const cellRefs = useRef<CellRefsType>({});
  const isRefreshing = useRef<boolean>(true);

  // State
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [screenHeight] = useState(height - bottomHeight);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 95,
  }).current;

  const onViewableItemsChanged = useRef(({changed}) => {
    changed.forEach(item => {
      const cell = cellRefs.current[item.key];
      if (!cell) return;

      if (item.isViewable) {
        cell.playVideo();
        if (item.item?.id) {
          dispatch(setCurrentUser(item.item.id));
          dispatch(setCurrentVideo(item.item));
          videoPlaying.current = item.key;
        }
      } else {
        cell.pauseVideo();
      }
    });
  }).current;

  const fetchData = useCallback(async () => {
    if (!isLoading && isRefreshing.current === false) return;

    try {
      const result = await VideoApi.getVideo(currentPage, PAGE_SIZE);
      if (result.status === 200) {
        setData(prevData => {
          // If refreshing, replace data; otherwise append
          return isRefreshing.current
            ? [...result.data.videos]
            : [...prevData, ...result.data.videos];
        });
      }
    } catch (error) {
      console.log('Error fetching videos:', error);
    } finally {
      isRefreshing.current = false;
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [currentPage, isLoading]);

  useEffect(() => {
    const currentVideoKey = videoPlaying.current;
    if (!currentVideoKey) return;

    const cell = cellRefs.current[currentVideoKey];
    if (!cell) return;

    if (isFocused) {
      cell.playVideo();
    } else {
      cell.pauseVideo();
    }

    // Clean up on unmount - pause any playing video
    return () => {
      if (cell) {
        cell.pauseVideo();
      }
    };
  }, [isFocused]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEndReached = useCallback(() => {
    if (isRefreshing.current || isLoading) return;
    setCurrentPage(p => p + 1);
  }, [isLoading]);

  const handleLayout = useCallback(async () => {
    try {
      await notifee.requestPermission();
      hideStatusBar();
    } catch (error) {
      console.log('Error setting up layout:', error);
    }
  }, []);

  const handleRefreshing = useCallback(() => {
    isRefreshing.current = true;
    setIsLoading(true);
    setData([]);
    setCurrentPage(1);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => (
      <VideoItem
        ref={ref => {
          if (ref) cellRefs.current[index] = ref;
        }}
        index={index}
        item={item}
        flatListRef={flatListRef}
        dataLength={data.length}
        height_screen={screenHeight}
        saved_bottomheight={bottomHeight}
      />
    ),
    [data.length, screenHeight, bottomHeight],
  );

  const getItemLayout = useCallback(
    (_data, index) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [screenHeight],
  );

  if (!isFocused) {
    return null;
  }

  return (
    <View
      onLayout={handleLayout}
      style={[styles.mainContainer, {height: screenHeight}]}>
      {isLoading ? (
        <View style={styles.loader}>
          <Icon source={gifs.tiktokLoader} width={50} height={50} />
        </View>
      ) : data.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={data}
          pagingEnabled
          onRefresh={handleRefreshing}
          refreshing={isRefreshing.current}
          renderItem={renderItem}
          keyExtractor={(_item, index) => index.toString()}
          scrollEventThrottle={16}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialNumToRender={1}
          removeClippedSubviews={true}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          pinchGestureEnabled={true}
          snapToAlignment="start"
          windowSize={3}
          maxToRenderPerBatch={2}
          decelerationRate="normal"
          getItemLayout={getItemLayout}
          updateCellsBatchingPeriod={50}
        />
      ) : (
        <NotFoundData onPress={fetchData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    width,
    height,
    backgroundColor: COLOR.BACKGROUND_LOADING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.BLACK,
    zIndex: 10,
  },
});

export default React.memo(FollowTab);
