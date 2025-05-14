import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {COLOR, SPACING} from '../../../../src/configs/styles';
import * as videoApi from '../../../apis/video.api';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ListDiscoverTopVideo from '../components/ListDiscoverTopVideo';
import {SearchVideoProps} from '../types/CountrySelection';
import {DiscoverScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {WatchVideoProfileActionEnum} from '../../../enum/WatchProfileActionEnum';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData, selectTxtSearch} from '../../../store/selectors';

const TopVideoView: React.FC = () => {
  const navigation = useNavigation<DiscoverScreenNavigationProps>();
  const isFocusTab = useIsFocused();
  const txtSearch = useAppSelector(selectTxtSearch);
  const my_data = useAppSelector(selectMyProfileData);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedCountryVideo, setSelectedCountryVideo] = useState<
    SearchVideoProps[]
  >([]);

  const getCountryVideosBySortedView = async (country_id: number) => {
    try {
      const {payload, currentPage, totalPages} =
        await videoApi.discoverSearchByCountryID({
          countryId: country_id,
          sortedType: 'view',
          pageNo: 1,
          pageSize: 100,
        });
      setSelectedCountryVideo(payload);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const getVideo = await videoApi.getVideobyview(
        pageNo,
        pageSize,
        my_data?.auth_token,
      );
      setVideos(getVideo.payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [txtSearch]);

  useEffect(() => {
    if (isFocusTab) {
      fetchData();
    }
  }, [fetchData]);

  const handleImagePress = (index: number, video_id: number) => {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.SEARCH_TOP_VIDEO_BY_VIEW,
      respected_action_data: video_id,
      current_video_id: video_id,
      current_index: index,
    });
  };

  const handleCountryImagePress = (
    index: number,
    video_id: number,
    country_id: number,
  ) => {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.SEARCH_TOP_VIDEO_BY_COUNTRY_ID,
      respected_action_data: `${country_id}:view`,
      current_video_id: video_id,
      current_index: index,
    });
  };

  return (
    <View style={styles.container}>
      <ListDiscoverTopVideo
        videos={videos}
        loading={loading}
        setLoading={setLoading}
        countryVideos={selectedCountryVideo}
        reachedVideoEnd={fetchData}
        getSelectedCountryVideos={getCountryVideosBySortedView}
        handleImagePress={handleImagePress}
        handleCountryImagePress={handleCountryImagePress}
      />
    </View>
  );
};

export default TopVideoView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: SPACING.S2,
  },
});
