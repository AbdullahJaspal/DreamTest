import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import styles from '../styles/chatHeaderStyles';
import {icons} from '../../../../assets/icons';
import Text from '../../../../components/Text';

const ChatHeader = ({
  userData,
  isOnline = false,
  typing = false,
  onContactShare,
  themeColor,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [showMenu, setShowMenu] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const statusText = useMemo(() => {
    if (typing) return t('typing...');
    return isOnline ? t('Online') : t('Offline');
  }, [isOnline, typing, t]);

  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: showMenu ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showMenu, menuAnimation]);

  // Navigation handlers
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUserProfile = useCallback(() => {
    if (userData?.id) {
      navigation.navigate('UserProfileScreen', {
        userData: userData,
        isOnline: isOnline,
      });
    }
  }, [navigation, userData, isOnline]);

  const handleAudioCall = useCallback(() => {
    navigation.navigate('AudioCall', {user_data: userData});
  }, [navigation, userData]);

  const handleVideoCall = useCallback(() => {
    navigation.navigate('VideoCall', {user_data: userData});
  }, [navigation, userData]);

  // Toggle menu handler
  const toggleMenu = () => {
    setShowMenu(prev => !prev);
  };

  // Updated menu options to match the screenshot
  const menuOptions = [
    {
      id: 'view_contact',
      label: t('View contact'),
      onPress: () => {
        setShowMenu(false);
        handleUserProfile();
      },
    },
    {
      id: 'search',
      label: t('Search'),
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('Search feature coming soon'), Toast.SHORT);
      },
    },
    {
      id: 'add_to_list',
      label: t('Add to list'),
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('Add to list coming soon'), Toast.SHORT);
      },
    },
    {
      id: 'media',
      label: t('Media, links, and docs'),
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('Media gallery coming soon'), Toast.SHORT);
      },
    },
    {
      id: 'mute',
      label: t('Mute notifications'),
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('Mute notifications coming soon'), Toast.SHORT);
      },
    },
    {
      id: 'disappearing',
      label: t('Disappearing messages'),
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('Disappearing messages coming soon'), Toast.SHORT);
      },
    },
    {
      id: 'theme',
      label: t('Chat theme'),
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('Chat theme coming soon'), Toast.SHORT);
      },
    },
    {
      id: 'more',
      label: t('More'),
      hasChevron: true,
      onPress: () => {
        setShowMenu(false);
        Toast.show(t('More options coming soon'), Toast.SHORT);
      },
    },
  ];

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: themeColor,
          },
        ]}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={handleGoBack}
            style={styles.backButton}
            activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUserProfile}
            style={styles.userInfoContainer}
            activeOpacity={0.7}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  userData?.profile_pic
                    ? {uri: userData.profile_pic}
                    : icons.user
                }
                style={styles.userImage}
              />
              {isOnline && <View style={styles.onlineBadge} />}
            </View>

            <View style={styles.userTextContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {userData?.nickname || userData?.username || t('User')}
              </Text>
              <Text style={styles.userStatus}>{statusText}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={handleAudioCall}
            style={styles.headerButton}
            activeOpacity={0.7}>
            <Ionicons name="call" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVideoCall}
            style={styles.headerButton}
            activeOpacity={0.7}>
            <Ionicons name="videocam" size={22} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleMenu}
            style={styles.headerButton}
            activeOpacity={0.7}>
            <MaterialIcons name="more-vert" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {showMenu && (
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuBackdrop}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.menuContainer,
                  {
                    transform: [
                      {
                        translateY: menuAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-50, 0],
                        }),
                      },
                    ],
                    opacity: menuAnimation,
                  },
                ]}>
                {menuOptions.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}>
                    <Text style={styles.menuItemText}>{item.label}</Text>
                    {item.hasChevron && (
                      <MaterialIcons
                        name="chevron-right"
                        size={22}
                        color="#666"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};

export default ChatHeader;
