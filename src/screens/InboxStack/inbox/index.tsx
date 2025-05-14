import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {InboxScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

// APIs
import * as userApi from '../../../apis/userApi';
import * as notification from '../../../apis/notification';
import * as suggestedApi from '../../../apis/suggested_account';
import RenderNotificationData from './RenderNotificationData';
import RenderChatUserList from './RenderChatUserList';
import SuggestedUserItem from './SuggestedUserItem';
import Header from '../../profile/profile/components/Header';
import SearchPeople from './SearchPeople';
import {
  selectMyProfileData,
  selectUnreadNotification,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';
// Components

// Config and Types

const {width} = Dimensions.get('screen');

// Define proper types
export interface NotificationItem {
  id: number;
  profile_pic: any;
  notification_name: string;
  new_notification: number;
  type: 'notification';
  onPress: () => void;
}

// We don't know the exact structure, so using a partial type
export interface ChatUser {
  user_id?: string;
  username?: string;
  nickname?: string;
  profile_pic?: string;
  [key: string]: any;
}

export interface SuggestedUser {
  id?: string;
  username?: string;
  profile_pic?: string;
  [key: string]: any;
}

type ListItem = NotificationItem | ChatUser;

const InboxScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<InboxScreenNavigationProps>();
  const myData = useAppSelector(selectMyProfileData);
  const unreadNotification = useAppSelector(selectUnreadNotification);

  // State management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ListItem[]>([]);
  const [notificationList, setNotificationList] = useState<ListItem[]>([]);
  const [suggestedAccounts, setSuggestedAccounts] = useState<SuggestedUser[]>(
    [],
  );
  const [endingIndex, setEndingIndex] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showSuggested, setShowSuggested] = useState<boolean>(true);

  const flatlistRef = useRef<FlatList>(null);

  // In the notificationData array in index.tsx, update onPress handlers:
  const notificationData = useMemo<NotificationItem[]>(
    () => [
      {
        id: 1,
        profile_pic: icons.followingNotifcation,
        notification_name: t('Followings'),
        new_notification: 0,
        type: 'notification',
        onPress: () =>
          navigation.navigate('Notifications', {initialTab: 'following'}),
      },
      {
        id: 2,
        profile_pic: icons.notificationBell,
        notification_name: t('Activities'),
        new_notification: 0,
        type: 'notification',
        onPress: () =>
          navigation.navigate('Notifications', {initialTab: 'videos'}),
      },
      {
        id: 3,
        profile_pic: icons.systemNotification,
        notification_name: t('Dream Information'),
        new_notification: 0,
        type: 'notification',
        onPress: () =>
          navigation.navigate('Notifications', {initialTab: 'system'}),
      },
      {
        id: 4,
        profile_pic: icons.videoNotification,
        notification_name: t('Profile visitors'),
        new_notification: 0,
        type: 'notification',
        onPress: () =>
          navigation.navigate('Notifications', {initialTab: 'profile'}),
      },
      {
        id: 5,
        profile_pic: icons.gift,
        notification_name: t('Gift'),
        new_notification: 0,
        type: 'notification',
        onPress: () =>
          navigation.navigate('Notifications', {initialTab: 'gifts'}),
      },
    ],
    [t, navigation],
  );

  // Fetch user notification and chat data
  const fetchUserData = useCallback(async () => {
    if (!myData?.auth_token) return;

    try {
      setIsLoading(true);

      const chatResult = await userApi.getMyAllChatedPerson(myData.auth_token);
      const chatUsers = chatResult?.uniqueUsers || [];

      const unreadNotificationData =
        await notification.getAllUnreadNotificationByCategories(
          myData.auth_token,
        );

      const updatedNotifications = notificationData.map(item => {
        const newItem = {...item};

        switch (item.id) {
          case 1:
            newItem.new_notification =
              unreadNotificationData?.unread_following_data || 0;
            break;
          case 2:
            newItem.new_notification =
              unreadNotificationData?.unread_videos_data || 0;
            break;
          case 3:
            newItem.new_notification =
              unreadNotificationData?.unread_system_data || 0;
            break;
          case 4:
            newItem.new_notification =
              unreadNotificationData?.unread_profile_data || 0;
            break;
          case 5:
            newItem.new_notification =
              unreadNotificationData?.unread_gift_data || 0;
            break;
        }

        return newItem;
      });

      setNotificationList([...updatedNotifications, ...chatUsers]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [myData?.auth_token, notificationData]);

  // Fetch suggested accounts
  const fetchSuggestedAccounts = useCallback(async () => {
    if (!myData?.auth_token) return;

    try {
      const result = await suggestedApi.getAllMySuggestionAccount(
        myData.auth_token,
      );
      setSuggestedAccounts(result?.payload || []);
    } catch (error) {
      console.error('Error fetching suggested accounts:', error);
    }
  }, [myData?.auth_token]);

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredData([]);
        return;
      }

      const filtered = notificationList.filter(item => {
        if ('notification_name' in item) {
          return item.notification_name
            .toLowerCase()
            .includes(query.toLowerCase());
        } else {
          const username = item.username || '';
          const nickname = item.nickname || '';
          return (
            username.toLowerCase().includes(query.toLowerCase()) ||
            nickname.toLowerCase().includes(query.toLowerCase())
          );
        }
      });

      setFilteredData(filtered);
    },
    [notificationList],
  );

  // Handlers for data fetching
  useEffect(() => {
    fetchUserData();
    fetchSuggestedAccounts();
  }, [fetchUserData, fetchSuggestedAccounts]);

  useEffect(() => {
    if (unreadNotification) {
      fetchUserData();
    }
  }, [unreadNotification, fetchUserData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUserData();
    fetchSuggestedAccounts();
  }, [fetchUserData, fetchSuggestedAccounts]);

  // Handle show more
  const handleShowMore = useCallback(() => {
    setEndingIndex(prev => prev + 8);

    setTimeout(() => {
      if (flatlistRef.current && endingIndex < notificationList.length) {
        flatlistRef.current.scrollToIndex({
          animated: true,
          index: Math.min(endingIndex, notificationList.length - 1),
        });
      }
    }, 500);
  }, [endingIndex, notificationList.length]);

  // Render list items
  const renderItem = useCallback(
    ({item, index}: {item: any; index: number}) => {
      if ('type' in item && item.type === 'notification') {
        return <RenderNotificationData item={item} index={index} />;
      } else {
        return <RenderChatUserList item={item} index={index} />;
      }
    },
    [],
  );

  // List optimization
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: 70,
      offset: 70 * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback((item: any, index: number) => {
    if ('id' in item) return `notification-${item.id}`;
    if ('user_id' in item) return `user-${item.user_id}`;
    return `item-${index}`;
  }, []);

  // Render list header
  const ListHeaderComponent = useCallback(() => {
    return <View style={styles.listHeader} />;
  }, []);

  // Render list footer with "show more" button and suggested accounts
  const ListFooterComponent = useCallback(() => {
    const hasMoreItems = !searchQuery && notificationList.length > endingIndex;

    return (
      <View style={styles.footerContainer}>
        {hasMoreItems && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={handleShowMore}
            activeOpacity={0.7}>
            <Text style={styles.showMoreText}>{t('Show more')}</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color="#007AFF"
            />
          </TouchableOpacity>
        )}

        {showSuggested && suggestedAccounts.length > 0 && (
          <View style={styles.suggestedSection}>
            <View style={styles.suggestedHeader}>
              <Text style={styles.suggestedTitle}>
                {t('Suggested Accounts')}
              </Text>
              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => setShowSuggested(false)}>
                <Text style={styles.hideButtonText}>{t('Hide')}</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={suggestedAccounts.slice(0, 6)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => <SuggestedUserItem item={item} />}
              contentContainerStyle={styles.suggestedList}
              keyExtractor={(item, index) => `suggested-${item.id || index}`}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        )}
      </View>
    );
  }, [
    searchQuery,
    notificationList.length,
    endingIndex,
    suggestedAccounts,
    showSuggested,
    handleShowMore,
    t,
  ]);

  // Empty state component
  const EmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons
                name="notifications-none"
                size={40}
                color="#9E9E9E"
              />
            </View>
            <Text style={styles.emptyPrimaryText}>{t('No notifications')}</Text>
            <Text style={styles.emptySecondaryText}>
              {t('All caught up! No new notifications')}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              activeOpacity={0.7}>
              <Text style={styles.refreshButtonText}>{t('Refresh')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    ),
    [isLoading, handleRefresh, t],
  );

  // Get the data to display
  const dataToDisplay = useMemo(() => {
    if (searchQuery) {
      return filteredData;
    }
    return notificationList.slice(0, endingIndex);
  }, [searchQuery, filteredData, notificationList, endingIndex]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header headertext={t('Messages')} />

      <SearchPeople
        searched_data={filteredData}
        setSearched_data={setFilteredData}
        data={notificationList}
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder={t('Search messages and notifications')}
      />

      <View style={styles.listContainer}>
        {isLoading && notificationList.length === 0 ? (
          <EmptyComponent />
        ) : (
          <FlatList
            ref={flatlistRef}
            data={dataToDisplay}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={
              dataToDisplay.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  listHeader: {
    height: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyPrimaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  emptySecondaryText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footerContainer: {
    width: '100%',
    // paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  showMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 20,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  suggestedSection: {
    marginTop: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  suggestedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  hideButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  hideButtonText: {
    fontSize: 13,
    color: '#757575',
  },
  suggestedList: {
    paddingVertical: 8,
  },
});

export default React.memo(InboxScreen);
