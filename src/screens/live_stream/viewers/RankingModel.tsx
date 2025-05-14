import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  ListRenderItemInfo,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';

import {truncateText} from '../../../utils/truncateText';
import {formatNumber} from '../../../utils/formatNumber';
import {capitalize} from '../../../utils/captalize';

import ProfileImage from '../../../components/ProfileImage';
import TopThreeView from '../component/TopThreeView';
import UpdateTimers from '../component/UpdateTimers';

import * as userApi from '../../../apis/userApi';
import {HomeScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {
  DurationSelectionTabProps,
  RankingModelProps,
  UserRankData,
} from './types/ranking';
import {UserProfile} from '../../../types/UserProfileData';
import {
  selectCurrentVideo,
  selectMyProfileData,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

/**
 * RankingModel component displays user rankings in a modal
 */
const RankingModel: React.FC<RankingModelProps> = ({
  show_model,
  setShow_model,
  playVideo,
}) => {
  // Get screen dimensions for responsive layout
  const {width, height} = useWindowDimensions();

  // Translation hook
  const {t} = useTranslation();

  // Redux selectors
  const my_data = useAppSelector(selectMyProfileData);
  const currentVideo = useAppSelector(selectCurrentVideo);

  // Navigation
  const navigation = useNavigation<HomeScreenNavigationProps>();

  // Component state
  const [data, setData] = useState<UserRankData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected_time_frame, setSelected_time_frame] = useState<number>(0);
  const [duration, setDuration] = useState<string>('last_month');
  const [endtime, setEndtime] = useState<string | null>(null);
  const [user_details, setUserDetails] = useState<UserProfile | undefined>();

  // References
  const isApiCallInProgress = useRef<boolean>(false);
  const isMounted = useRef<boolean>(true);

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Navigate to user profile page
   */
  const handleProfileClick = useCallback(
    (id: string | number) => {
      if (id) {
        navigation.navigate('UserProfileMainPage', {user_id: id});
      }
    },
    [navigation],
  );

  /**
   * Fetch top viewers based on duration
   */
  const getTopViewers = useCallback(
    async (durationParam: string) => {
      // Prevent multiple simultaneous API calls
      if (isApiCallInProgress.current) {
        return;
      }

      try {
        isApiCallInProgress.current = true;
        setLoading(true);

        if (!my_data?.auth_token) {
          console.error('Auth token is missing');
          return;
        }

        const res = await userApi.getAllUserDiamondsByRanked(
          my_data.auth_token,
          durationParam,
        );

        // Only update state if component is still mounted
        if (isMounted.current) {
          setData(Array.isArray(res.payload) ? res.payload : []);
          setEndtime(res.endTime || null);
          setDuration(durationParam);
        }
      } catch (error) {
        console.error('Error fetching top viewers:', error);
        // Set empty data on error to prevent UI issues
        if (isMounted.current) {
          setData([]);
        }
      } finally {
        // Reset loading state and API flag
        if (isMounted.current) {
          setLoading(false);
        }
        isApiCallInProgress.current = false;
      }
    },
    [my_data?.auth_token],
  );

  /**
   * Fetch user diamond details
   */
  const getUserDiamond = useCallback(async () => {
    if (!my_data?.auth_token || !currentVideo?.user_id) {
      return;
    }

    try {
      const result = await userApi.getUserDiamondsValueByUserId(
        my_data.auth_token,
        currentVideo.user_id,
      );

      if (isMounted.current && result?.payload) {
        setUserDetails(result.payload);
      }
    } catch (error) {
      console.error('Error in getUserDiamond:', error);
    }
  }, [my_data?.auth_token, currentVideo?.user_id]);

  /**
   * Close modal and resume video playback
   */
  const handleClose = useCallback(() => {
    playVideo();
    setShow_model((prev: any) => ({
      ...prev,
      rankings: false,
    }));
  }, [playVideo, setShow_model]);

  /**
   * Duration tab options
   */
  const header_list = useMemo(
    () => [
      {
        id: 1,
        name: 'Evaluation',
        time_frame: 'last month',
        onPress: () => getTopViewers('last_month'),
      },
      {
        id: 2,
        name: 'Evaluation',
        time_frame: 'last week',
        onPress: () => getTopViewers('last_week'),
      },
      {
        id: 3,
        name: 'Evaluation',
        time_frame: 'last day',
        onPress: () => getTopViewers('last_day'),
      },
      {
        id: 4,
        name: 'Evaluation',
        time_frame: 'last hour',
        onPress: () => getTopViewers('last_hour'),
      },
    ],
    [getTopViewers],
  );

  /**
   * Render a user in the ranking list
   */
  const renderRankingItem = useCallback(
    ({item, index}: ListRenderItemInfo<UserRankData>) => {
      return (
        <View style={styles.rankingListContainer}>
          <View style={styles.leftView}>
            <Text style={styles.rankText}>{index + 4}</Text>
            <View style={styles.profileImageContainer}>
              <ProfileImage
                uri={item?.user.profile_pic}
                onPress={() => handleProfileClick(item?.user.id)}
              />
            </View>
            <Text style={styles.nameText}>
              {truncateText(item?.user?.username?.toUpperCase(), 10)}
            </Text>
          </View>
          <Text style={styles.diamondText}>{formatNumber(item?.diamonds)}</Text>
        </View>
      );
    },
    [handleProfileClick],
  );

  /**
   * Render a duration selection tab
   */
  const renderDurationTab = useCallback(
    ({item, index}: ListRenderItemInfo<DurationSelectionTabProps>) => {
      const isSelected = selected_time_frame === index;
      const gradientColors = isSelected
        ? ['#cdffd8', '#94b9ff']
        : ['#f1f1f1', '#f1f1f1'];

      const handleTabPress = () => {
        setSelected_time_frame(index);
        item.onPress();
      };

      return (
        <LinearGradient
          style={styles.tabGradient}
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Pressable
            onPress={handleTabPress}
            style={styles.timeFrameView}
            accessibilityRole="button"
            accessibilityLabel={`${t(item?.name)} ${t(item?.time_frame)}`}
            accessibilityState={{selected: isSelected}}>
            <Text style={styles.evaluationText}>{t(item?.name)}</Text>
            <Text style={styles.timeFrameText}>{t(item?.time_frame)}</Text>
          </Pressable>
        </LinearGradient>
      );
    },
    [selected_time_frame, t],
  );

  /**
   * Initialize data when modal is shown
   */
  const handleModalShow = useCallback(() => {
    getUserDiamond();
    getTopViewers('last_month');
  }, [getUserDiamond, getTopViewers]);

  /**
   * Calculate diamonds required to reach top 200
   */
  const diamondsRequired = useMemo(() => {
    if (data.length > 0 && user_details) {
      const lastRankDiamonds = data[data.length - 1]?.diamonds || 0;
      const userDiamonds = user_details?.gift_wallet || 0;
      return Math.max(0, lastRankDiamonds - userDiamonds);
    }
    return 0;
  }, [data, user_details]);

  /**
   * Optimize FlatList performance
   */
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: 50,
      offset: 50 * index,
      index,
    }),
    [],
  );

  /**
   * Key extractor for duration tabs
   */
  const keyExtractorDurationTabs = useCallback(
    (item: DurationSelectionTabProps) =>
      `${item.id.toString()}-${item.name}-${item.time_frame}`,
    [],
  );

  /**
   * Key extractor for ranking list
   */
  const keyExtractorRankings = useCallback(
    (item: UserRankData) => item.id.toString(),
    [],
  );

  /**
   * Handle gift button press
   */
  const handleGiftPress = useCallback(() => {
    handleClose();
  }, [handleClose]);

  /**
   * Render empty list component
   */
  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>{t('No rankings available')}</Text>
      </View>
    ),
    [t],
  );

  /**
   * Render list footer to provide space at bottom
   */
  const renderListFooter = useCallback(
    () => <View style={styles.footerView} />,
    [],
  );

  // Don't render anything if modal is not visible
  if (!show_model?.rankings) {
    return null;
  }

  return (
    <View>
      <Modal
        visible={show_model?.rankings}
        animationType="slide"
        onRequestClose={handleClose}
        transparent={true}
        statusBarTranslucent={true}
        onShow={handleModalShow}>
        <Pressable style={styles.topContainer} onPress={handleClose} />

        <View style={[styles.mainContainer, {width, height: height * 0.65}]}>
          {/* Duration Selection Tabs */}
          <View style={styles.headerView}>
            <FlatList
              data={header_list}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={renderDurationTab}
              keyExtractor={keyExtractorDurationTabs}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              removeClippedSubviews={true}
              contentContainerStyle={styles.tabsContainer}
            />
          </View>

          {/* Timer for next update */}
          <UpdateTimers
            endtime={endtime ?? ''}
            selected_time_frame={selected_time_frame}
          />

          {/* Top 3 Users */}
          <TopThreeView data={data} />

          {/* Header for list view */}
          <LinearGradient
            colors={['#cdffd8', '#94b9ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <View style={styles.headerBottomView}>
              <Text style={styles.topViewersText}>{t('Top Viewers')}</Text>
              <View style={styles.coinView}>
                <Image source={icons.diamond} style={styles.coinImage} />
                <Text style={styles.coinsText}>{t('Coins')}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Ranking List */}
          <View style={styles.listContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ed3a6d" />
                <Text style={styles.loadingText}>
                  {t('Loading rankings...')}
                </Text>
              </View>
            ) : (
              <FlatList
                data={data?.slice(3)}
                renderItem={renderRankingItem}
                ListEmptyComponent={renderEmptyList}
                ListFooterComponent={renderListFooter}
                keyExtractor={keyExtractorRankings}
                getItemLayout={getItemLayout}
                removeClippedSubviews={true}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
                contentContainerStyle={styles.listContentContainer}
              />
            )}
          </View>

          {/* Bottom user info and gift button */}
          <View style={styles.bottomView}>
            <ProfileImage
              uri={user_details?.profile_pic}
              onPress={() =>
                user_details?.id && handleProfileClick(user_details.id)
              }
            />
            <Text style={styles.requireGiftText}>
              {capitalize(truncateText(user_details?.nickname ?? '', 7))}{' '}
              {t('requires')} {'\n'}
              {diamondsRequired} {t('coins to be in top 200')}
            </Text>
            <Pressable
              onPress={handleGiftPress}
              accessibilityRole="button"
              accessibilityLabel={t('Gift')}>
              <LinearGradient
                style={styles.giftView}
                colors={['#cdffd8', '#94b9ff']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.giftText}>{t('Gift')}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerView: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 0.3,
    borderBottomColor: '#e0e0e0',
  },
  tabsContainer: {
    paddingHorizontal: 10,
  },
  headerBottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 15,
  },
  topViewersText: {
    color: '#020202',
    fontWeight: '600',
    fontSize: 14,
  },
  coinView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  coinsText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '600',
    fontSize: 12,
  },
  rankingListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingRight: 20,
    height: 50,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 0.6,
  },
  profileImageContainer: {
    width: 60,
  },
  rankText: {
    color: '#020202',
    fontSize: 16,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  nameText: {
    color: '#020202',
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
  },
  diamondText: {
    color: '#020202',
    fontWeight: '500',
    fontSize: 14,
  },
  footerView: {
    height: 200,
  },
  tabGradient: {
    marginHorizontal: 5,
    borderRadius: 10,
  },
  timeFrameView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  evaluationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  timeFrameText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  bottomView: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
  },
  requireGiftText: {
    color: '#020202',
    fontWeight: '600',
    fontSize: 12,
    flex: 0.59,
    textAlign: 'center',
  },
  giftView: {
    borderRadius: 5,
  },
  giftText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  topContainer: {
    flex: 1,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  },
  emptyListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyListText: {
    color: '#666',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 60,
  },
});

export default React.memo(RankingModel);
