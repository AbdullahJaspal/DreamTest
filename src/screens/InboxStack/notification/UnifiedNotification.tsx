import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import * as userApi from '../../../apis/userApi';
import {useAppSelector} from '../../../store/hooks';
import Entypo from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProfileImage from '../../../components/ProfileImage';
import {RootStackParamList} from '../../../types/navigation';
import {selectMyProfileData} from '../../../store/selectors';
import * as notificationApi from '../../../apis/notification';
import {getTimeDuration} from '../../../utils/getTimeDuration';
import {useNavigation, RouteProp} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type NotificationType = 'following' | 'gifts' | 'profile' | 'videos' | 'system';

type NotificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Notifications'
>;

interface Props {
  route: NotificationScreenRouteProp;
}

const NotificationItem: React.FC<{
  item: NotificationItem;
  type: NotificationType;
  auth_token: string;
}> = ({item, type, auth_token}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [friend, setFriend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Mark notification as read when rendered
    const readNotification = async () => {
      if (!item.read) {
        try {
          await notificationApi.readNotification(auth_token, [item.id]);
        } catch (error) {
          console.log('Error marking notification as read:', error);
        }
      }
    };

    readNotification();

    // Check if following for following notifications
    if (type === 'following') {
      const checkIsFollowOrNot = async () => {
        try {
          const isFollowData = await userApi.checkIsUserFriendOrNot(
            auth_token,
            item?.user?.id,
          );
          setFriend(isFollowData.message);
        } catch (error) {
          console.log('Error checking follow status:', error);
        }
      };

      checkIsFollowOrNot();
    }
  }, [item.id, auth_token, type, item.user?.id]);

  const handleProfileClick = () => {
    console.log('here');

    navigation.navigate('UserProfileMainPage', {user_id: item?.user?.id});
  };

  const handleVideoClick = () => {
    if (type === 'videos' && item?.video) {
      navigation.navigate('WatchProfileVideo', {
        data: [item?.video],
        index: 0,
      });
    }
  };

  const handleFollowPress = async () => {
    if (isLoading || friend) return;

    setIsLoading(true);
    try {
      const data = {
        sender_id: auth_token.id,
        receiver_id: item.user.id,
      };

      await userApi.follow(data, auth_token);
      setFriend(true);
    } catch (error) {
      console.log('Error following user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = () => {
    if (type === 'following') {
      return (
        <TouchableOpacity
          onPress={handleFollowPress}
          disabled={isLoading}
          style={[
            styles.actionButton,
            friend ? styles.friendButton : styles.followButton,
            isLoading && styles.disabledButton,
          ]}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>
                {friend ? t('Following') : t('Follow')}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderContent = () => {
    const defaultContent = (
      <>
        <View style={styles.avatarContainer}>
          <ProfileImage
            onPress={handleProfileClick}
            uri={item?.user?.profile_pic}
          />
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{item?.user?.username}</Text>
            <Text style={styles.timeAgo}>
              {getTimeDuration(item?.createdAt)}
            </Text>
          </View>
          <Text style={styles.messageText}>{item?.message}</Text>
        </View>
      </>
    );

    if (type === 'videos') {
      return (
        <>
          <View style={styles.avatarContainer}>
            <ProfileImage
              onPress={handleProfileClick}
              uri={item?.user?.profile_pic}
            />
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Pressable onPress={handleVideoClick} style={styles.videoContent}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{item?.user?.username}</Text>
              <Text style={styles.timeAgo}>
                {getTimeDuration(item?.createdAt)}
              </Text>
            </View>
            <Text style={styles.messageText}>{item?.message}</Text>
            {item?.message?.includes('comments') && (
              <View style={styles.replyButton}>
                <AntDesign
                  name="message1"
                  size={12}
                  color="#555"
                  style={styles.replyIcon}
                />
                <Text style={styles.replyText}>{t('Reply')}</Text>
              </View>
            )}
          </Pressable>
          {item?.video?.thum && (
            <Pressable
              onPress={handleVideoClick}
              style={styles.thumbnailContainer}>
              <Image
                source={{
                  uri: `https://dpcst9y3un003.cloudfront.net/${item?.video?.thum}`,
                }}
                style={styles.thumbnail}
              />
              <View style={styles.playIconContainer}>
                <AntDesign name="playcircleo" size={20} color="#fff" />
              </View>
            </Pressable>
          )}
        </>
      );
    }

    return defaultContent;
  };

  return (
    <Pressable
      onPress={handleProfileClick}
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}>
      <View style={styles.notificationItemInner}>
        {renderContent()}
        {renderActionButton()}
        {(type === 'profile' || type === 'system') && (
          <Entypo name="chevron-right" size={20} color="#888" />
        )}
      </View>
      <View style={styles.itemDivider} />
    </Pressable>
  );
};

const UnifiedNotificationScreen: React.FC<Props> = ({route}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const my_data = useAppSelector(selectMyProfileData);

  // Get notification type from route params
  const notificationType = route.params?.initialTab || 'following';
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      switch (notificationType) {
        case 'following':
          result = await notificationApi.getAllFollowingNotification(
            my_data?.auth_token,
          );
          break;
        case 'gifts':
          result = await notificationApi.getAllYourGiftNotification(
            my_data?.auth_token,
          );
          break;
        case 'profile':
          result = await notificationApi.getAllYourProfileNotification(
            my_data?.auth_token,
          );
          break;
        case 'videos':
          result = await notificationApi.getAllVideosNotification(
            my_data?.auth_token,
          );
          break;
        case 'system':
          result = await notificationApi.getAllSystemNotification(
            my_data?.auth_token,
          );
          break;
      }
      console.log('Notification data:', result);

      setData(result.payload);
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [notificationType, my_data?.auth_token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getHeaderTitle = () => {
    switch (notificationType) {
      case 'following':
        return t('Following Notifications');
      case 'gifts':
        return t('Gift Notifications');
      case 'profile':
        return t('Profile Notifications');
      case 'videos':
        return t('Activities');
      case 'system':
        return t('System Notifications');
      default:
        return t('Notifications');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
      <View style={styles.headerRight} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <MaterialIcons name="notifications-none" size={56} color="#CCC" />
      </View>
      <Text style={styles.emptyText}>{t('You are all caught up')}!</Text>
      <Text style={styles.emptySubText}>
        {t('No new notifications at the moment')}
      </Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={fetchNotifications}
        activeOpacity={0.7}>
        <MaterialIcons
          name="refresh"
          size={18}
          color="#FFFFFF"
          style={styles.refreshIcon}
        />
        <Text style={styles.refreshText}>{t('Refresh')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>
            {t('Loading notifications')}...
          </Text>
        </View>
      );
    }

    if (!data?.length) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <NotificationItem
            item={item}
            type={notificationType}
            auth_token={my_data?.auth_token}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchNotifications}
        refreshing={loading}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default UnifiedNotificationScreen;
