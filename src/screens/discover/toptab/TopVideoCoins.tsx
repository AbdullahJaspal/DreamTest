import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../../../store/hooks';
import * as videoApi from '../../../apis/video.api';
import {SearchVideoProps} from '../types/CountrySelection';
import {COLOR, SPACING} from '../../../../src/configs/styles';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ListDiscoverTopVideo from '../components/ListDiscoverTopVideo';
import {selectMyProfileData, selectTxtSearch} from '../../../store/selectors';
import {WatchVideoProfileActionEnum} from '../../../enum/WatchProfileActionEnum';
import {DiscoverScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

const TopVideoCoins: React.FC = () => {
  const isFocusTab = useIsFocused();
  const navigation = useNavigation<DiscoverScreenNavigationProps>();
  const txtSearch = useAppSelector(selectTxtSearch);
  const my_data = useAppSelector(selectMyProfileData);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedCountryVideo, setSelectedCountryVideo] = useState<
    SearchVideoProps[]
  >([]);

  const getCountryVideosBySortedDiamonds = async (country_id: number) => {
    try {
      const {payload, currentPage, totalPages} =
        await videoApi.discoverSearchByCountryID({
          countryId: country_id,
          sortedType: 'diamond_value',
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
      const getVideo = await videoApi.getVideobycoins(
        pageNo,
        pageSize,
        my_data?.auth_token,
      );

      setVideos(getVideo.payload);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [txtSearch]);

  useEffect(() => {
    if (isFocusTab) {
      fetchData();
    }
  }, [isFocusTab, fetchData]);

  const handleImagePress = (index: number, video_id: number) => {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.SEARCH_TOP_VIDEO_BY_COIN,
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
      respected_action_data: `${country_id}:diamond_value`,
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
        getSelectedCountryVideos={getCountryVideosBySortedDiamonds}
        handleImagePress={handleImagePress}
        handleCountryImagePress={handleCountryImagePress}
      />
    </View>
  );
};

export default TopVideoCoins;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: SPACING.S2,
  },
});
