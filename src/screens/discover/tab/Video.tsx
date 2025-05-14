import React, {useCallback, useEffect, useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import * as videoApi from '../../../apis/video.api';
import {useAppSelector} from '../../../store/hooks';
import {COLOR, SPACING} from '../../../configs/styles';
import {SearchVideoProps} from '../types/CountrySelection';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ListDiscoverTopVideo from '../components/ListDiscoverTopVideo';
import {selectMyProfileData, selectTxtSearch} from '../../../store/selectors';
import {WatchVideoProfileActionEnum} from '../../../enum/WatchProfileActionEnum';
import {DiscoverScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

const Video: React.FC = () => {
  const pageSize = 20;
  const isFocusTab = useIsFocused();
  const navigation = useNavigation<DiscoverScreenNavigationProps>();
  const txtSearch = useAppSelector(selectTxtSearch);
  const my_data = useAppSelector(selectMyProfileData);
  const [pageNo, setPageNo] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedCountryVideo, setSelectedCountryVideo] = useState<
    SearchVideoProps[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      const general_videos = await videoApi.getVideodiscover(
        txtSearch,
        pageNo,
        pageSize,
        my_data?.auth_token,
      );
      setVideos([...videos, ...general_videos.payload]);
    } catch (error) {
      console.log('Error generated while geting search video', error);
    } finally {
      setLoading(false);
    }
  }, [txtSearch, pageNo]);

  useEffect(() => {
    if (isFocusTab && videos?.length === 0) {
      fetchData();
    }
  }, [isFocusTab, fetchData]);

  const handleGetCountryVideo = async (countryId: number) => {
    try {
      // const res = await videoApi.getVideobycountryid(countryId);
      // setCountryVideo(res.payload);
    } catch (error) {
      console.error('Error geting videos by country ID:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralVideoImagePress = useCallback(
    (index: number, video_id: number) => {
      navigation.navigate('WatchProfileVideo', {
        action_name: WatchVideoProfileActionEnum.SEARCH_MAIN_VIDEO,
        respected_action_data: `${txtSearch}`,
        current_video_id: video_id,
        current_index: index,
      });
    },
    [txtSearch],
  );

  const handleCountryVideoImagePress = useCallback(
    (index: number, video_id: number) => {
      navigation.navigate('WatchProfileVideo', {
        action_name: WatchVideoProfileActionEnum.SEARCH_COUNTRY_VIDEO,
        respected_action_data: `${txtSearch}`,
        current_video_id: video_id,
        current_index: index,
      });
    },
    [txtSearch],
  );

  return (
    <View style={styles.container}>
      <ListDiscoverTopVideo
        videos={videos}
        loading={loading}
        setLoading={setLoading}
        countryVideos={selectedCountryVideo}
        reachedVideoEnd={fetchData}
        getSelectedCountryVideos={handleGetCountryVideo}
        handleImagePress={handleGeneralVideoImagePress}
        handleCountryImagePress={handleCountryVideoImagePress}
      />
    </View>
  );
};

export default React.memo(Video);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: SPACING.S2,
  },
});
