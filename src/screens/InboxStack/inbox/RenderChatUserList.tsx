import React, {memo} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {InboxScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import ProfileImage from '../../../components/ProfileImage';
import {capitalize} from '../../../utils/captalize';
import {ChatUser} from '../InboxScreen';

interface RenderChatUserListProps {
  item: ChatUser;
  index: number;
}

const {width} = Dimensions.get('screen');

const RenderChatUserList: React.FC<RenderChatUserListProps> = ({item}) => {
  const navigation = useNavigation<InboxScreenNavigationProps>();

  const handlePress = () => {
    if (item?.read === undefined) {
      navigation.navigate('ChatScreen', {user_data: item});
    }
  };

  // Check if this is an unread message
  const isUnread = item?.unread_messages > 0;

  console.log(item);

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={handlePress}
      activeOpacity={0.7}>
      {/* Left section - Avatar and user info */}
      <View style={styles.leftSection}>
        <View style={styles.avatarContainer}>
          <ProfileImage uri={item?.profile_pic} size={48} />
          {item?.online && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.nickname} numberOfLines={1}>
            {capitalize(item?.nickname || '')}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            {item?.username || ''}
          </Text>
        </View>
      </View>

      {/* Right section - Time and chevron */}
      <View style={styles.rightSection}>
        {item?.last_message_time && (
          <Text style={styles.timeText}>{item.last_message_time}</Text>
        )}

        {isUnread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {item.unread_messages > 99 ? '99+' : item.unread_messages}
            </Text>
          </View>
        )}

        <MaterialIcons
          name="chevron-right"
          size={22}
          color="#BDBDBD"
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderChatUserList);

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 70,
    backgroundColor: '#FFFFFF',
  },
  unreadContainer: {
    backgroundColor: '#F0F8FF',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
    color: '#757575',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 4,
  },
});
