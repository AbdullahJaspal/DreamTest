import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {modify_notification_number} from '../../../utils/notification_number';
import {NotificationItem} from '.';

interface RenderNotificationDataProps {
  item: NotificationItem;
  index: number;
}

const {width} = Dimensions.get('screen');

const RenderNotificationData: React.FC<RenderNotificationDataProps> = ({
  item,
}) => {
  const hasNewNotification = item.new_notification > 0;

  return (
    <TouchableOpacity
      onPress={item.onPress}
      style={[
        styles.container,
        hasNewNotification && styles.containerHighlighted,
      ]}
      activeOpacity={0.7}>
      {/* Left section with icon and text */}
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Image source={item.profile_pic} style={styles.profileImage} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.notificationName}>{item.notification_name}</Text>
        </View>
      </View>

      {/* Right section with counter and chevron */}
      <View style={styles.rightSection}>
        {hasNewNotification && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              {modify_notification_number(item.new_notification)}
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

export default memo(RenderNotificationData);

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
  containerHighlighted: {
    backgroundColor: '#F0F8FF',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  profileImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#FF3B30',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  chevron: {
    marginLeft: 4,
  },
});
