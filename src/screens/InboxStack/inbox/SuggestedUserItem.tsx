import React, {memo, useState} from 'react';
import {SuggestedUser} from '.';
import * as userApi from '../../../apis/userApi';
import {useNavigation} from '@react-navigation/native';
import ProfileImage from '../../../components/ProfileImage';
import {selectMyProfileData} from '../../../store/selectors';
import * as notificationApi from '../../../apis/notification';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {InboxScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {useAppSelector} from '../../../store/hooks';

interface SuggestedUserItemProps {
  item: SuggestedUser;
}

const SuggestedUserItem: React.FC<SuggestedUserItemProps> = ({item}) => {
  const navigation = useNavigation<InboxScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  const [friend, setFriend] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  const checkIsFollowOrNot = async () => {
    try {
      const isFollowData = await userApi.checkIsUserFriendOrNot(
        my_data?.auth_token,
        item?.user?.id,
      );
      setFriend(isFollowData.message);
      if (!item.read) {
        await notificationApi.readNotification(my_data?.auth_token, [item?.id]);
      }
    } catch (error) {
      console.log('Error checking follow status:', error);
    }
  };
  const handlePress = () => {
    // Navigate to user profile or appropriate screen
    // Assuming there's a ProfileScreen navigation route
    navigation.navigate('UserProfileMainPage', {user_id: item.id});
  };

  const handleFollowPress = async () => {
    try {
      const data = {
        sender_id: my_data?.id,
        receiver_id: item.id,
      };
      if (!friend) {
        setloading(true);
        const res = await userApi.follow(data, my_data?.auth_token);
        console.log('Response', res);

        setFriend(true);
        setloading(false);
      }
    } catch (error) {
      console.log('Error following user:', error);
    }
  };

  return (
    <TouchableOpacity
      onLayout={checkIsFollowOrNot}
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <ProfileImage uri={item?.profile_pic} size={60} />
      </View>

      <Text style={styles.username} numberOfLines={1}>
        {item?.username || 'User'}
      </Text>

      <TouchableOpacity
        style={[
          styles.followButton,
          {backgroundColor: friend ? '#54AD7A' : '#007AFF'},
        ]}
        onPress={handleFollowPress}
        activeOpacity={0.7}>
        <Text style={styles.followText}>
          {loading ? 'Wait' : friend ? 'Friend' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default memo(SuggestedUserItem);

const styles = StyleSheet.create({
  container: {
    width: 85,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    marginBottom: 8,
  },
  username: {
    fontSize: 13,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
    width: '100%',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  followText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
