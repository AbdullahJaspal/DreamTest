import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {getMedia} from '../../../apis/mediaAPIs';
import * as userAPi from '../../../apis/userApi';
import {useAppSelector} from '../../../store/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  selectChatThemeColor,
  selectMyProfileData,
} from '../../../store/selectors';
import {icons} from '../../../assets/icons';

const UserProfileScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const userData = route.params?.userData;

  const myData = useAppSelector(selectMyProfileData);
  const chatThemeColor = useAppSelector(selectChatThemeColor);

  const [isOnline] = useState(false);
  const [userLinks, setUserLinks] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Media filtering
  const [activeMediaFilter, setActiveMediaFilter] = useState('all');
  const filteredMedia = useCallback(() => {
    switch (activeMediaFilter) {
      case 'photos':
        return mediaItems.filter(item => item.type === 'image');
      case 'videos':
        return mediaItems.filter(item => item.type === 'video');
      default:
        return mediaItems;
    }
  }, [mediaItems, activeMediaFilter]);

  // Handlers
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCallUser = () => {
    navigation.navigate('AudioCall', {user_data: userData});
  };

  const handleVideoCall = () => {
    navigation.navigate('VideoCall', {user_data: userData});
  };

  const handleSendMessage = () => {
    navigation.navigate('ChatScreen', {user_data: userData});
  };

  const handleMediaPress = item => {};

  const handleOpenLink = url => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open this URL');
        }
      });
    } else {
      Alert.alert('Invalid URL', 'The link appears to be invalid');
    }
  };

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(prev => !prev);
  };

  useEffect(() => {
    fetchMedia();
    extractUserLinks();
  }, []);

  const extractUserLinks = () => {
    // Check if user has any social links or website links
    const links = [];

    if (userData?.website) {
      links.push({
        id: 'website',
        icon: 'language',
        label: t('Website'),
        url: ensureHttps(userData.website),
      });
    }

    if (userData?.social_links?.facebook) {
      links.push({
        id: 'facebook',
        icon: 'facebook',
        label: 'Facebook',
        url: userData.social_links.facebook,
      });
    }

    if (userData?.social_links?.twitter) {
      links.push({
        id: 'twitter',
        icon: 'twitter',
        label: 'Twitter',
        url: userData.social_links.twitter,
      });
    }

    if (userData?.social_links?.instagram) {
      links.push({
        id: 'instagram',
        icon: 'instagram',
        label: 'Instagram',
        url: userData.social_links.instagram,
      });
    }

    // Add default dreamlived link for demo purposes
    links.push({
      id: 'dreamlived',
      icon: 'video-library',
      label: 'DreamLived',
      url: 'https://dreamlived.com/share/video/eb26a77e-4ac4-4870-9d05-ad7bb8556821',
    });

    setUserLinks(links);
  };

  const ensureHttps = url => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await getMedia(userData.id, myData.auth_token);
      console.log('Media response:', response);

      if (!response.media || !Array.isArray(response.media.all)) {
        console.error('Invalid media response format:', response);
        setIsLoading(false);
        return;
      }

      const validMediaItems = response.media.all
        .filter(item => item.mediaUrl && item.mediaType) // Filter out items with null values
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map(item => ({
          _id: item._id,
          id: item._id,
          type: item.mediaType,
          uri: item.mediaUrl,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          duration: item.mediaType === 'video' ? '0:30' : undefined,
          sender: item.sender,
          createdAt: item.createdAt || new Date().toISOString(),
        }));

      console.log('Valid media items:', validMediaItems);
      setMediaItems(validMediaItems);

      // Store formatted data for the "See All" screen
      const categorizedMedia = {
        all: validMediaItems,
        images: validMediaItems.filter(item => item.type === 'image'),
        videos: validMediaItems.filter(item => item.type === 'video'),
        documents: [],
        audio: [],
      };

      global.fullMediaData = categorizedMedia;
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Renders
  const renderMediaItem = ({item}) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => handleMediaPress(item)}
      activeOpacity={0.8}>
      <Image
        source={{uri: item.uri}}
        style={styles.mediaImage}
        resizeMode="cover"
      />
      {item.type === 'video' && (
        <View style={styles.videoBadge}>
          <Ionicons name="play-circle" size={30} color="#fff" />
          {item.duration && (
            <Text style={styles.videoDuration}>{item.duration}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMediaFilterButton = (label, filterName) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeMediaFilter === filterName && {backgroundColor: chatThemeColor},
      ]}
      onPress={() => setActiveMediaFilter(filterName)}>
      <Text
        style={[
          styles.filterButtonText,
          activeMediaFilter === filterName && styles.activeFilterText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLinkItem = item => (
    <TouchableOpacity
      key={item.id}
      style={styles.linkItem}
      onPress={() => handleOpenLink(item.url)}>
      <MaterialIcons name={item.icon} size={24} color={chatThemeColor} />
      <Text style={styles.linkText}>{item.label}</Text>
      <MaterialIcons name="open-in-new" size={20} color="#888" />
    </TouchableOpacity>
  );

  const onPressAll = () => {
    const validMediaItems = mediaItems.filter(item => item.type && item.uri);

    const mediaDataToPass = {
      all: validMediaItems.map(item => ({
        _id: item.id,
        id: item.id,
        type: item.type,
        mediaType: item.type,
        uri: item.uri,
        mediaUrl: item.uri,
        sender: item.sender,
        createdAt: new Date().toISOString(),
      })),
      images: validMediaItems
        .filter(item => item.type === 'image')
        .map(item => ({
          _id: item.id,
          id: item.id,
          type: item.type,
          mediaType: item.type,
          uri: item.uri,
          mediaUrl: item.uri,
          sender: item.sender,
          createdAt: new Date().toISOString(),
        })),
      videos: validMediaItems
        .filter(item => item.type === 'video')
        .map(item => ({
          _id: item.id,
          id: item.id,
          type: item.type,
          mediaType: item.type,
          uri: item.uri,
          mediaUrl: item.uri,
          sender: item.sender,
          createdAt: new Date().toISOString(),
        })),
      documents: [],
      audio: [],
      links: userLinks.map((link, index) => ({
        _id: `link-${index}`,
        url: link.url,
        text: link.label,
        createdAt: new Date().toISOString(),
        source: userData?.nickname || 'User',
      })),
    };

    console.log('Sending media data to gallery:', mediaDataToPass);

    navigation.navigate('MediaGalleryScreen', {
      userData: userData,
      initialTab: activeMediaFilter,
      mediaData: mediaDataToPass,
    });
  };

  async function handleUserBlock(): Promise<void> {
    try {
      const result = await userAPi.addBlockedUser(
        {
          blocked_user_id: userData.id,
        },
        myData?.auth_token,
      );
      console.log('API Response:', result);
      Toast.show('Blocked successfully', Toast.SHORT);
    } catch (error) {
      console.log('error', error);
    }
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: chatThemeColor,
          },
        ]}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Contact Info')}</Text>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={toggleOptionsMenu}>
          <MaterialIcons name="more-vert" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.profileCircle,
              {
                borderColor: chatThemeColor,
              },
            ]}>
            <Image
              source={
                userData?.profile_pic ? {uri: userData.profile_pic} : icons.user
              }
              style={styles.profileImage}
            />
            {isOnline && <View style={styles.onlineIndicator} />}
          </View>

          <Text style={styles.userName}>{userData?.nickname || 'User'}</Text>
          <Text style={styles.userHandle}>
            @{userData?.username || 'username'}
          </Text>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                isOnline ? styles.onlineStatus : styles.offlineStatus,
              ]}
            />
            <Text style={styles.statusText}>
              {isOnline ? t('Online now') : t('Last seen today at 19:11')}
            </Text>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: chatThemeColor,
                },
              ]}
              onPress={handleSendMessage}>
              <MaterialIcons name="chat" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>{t('Message')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: chatThemeColor,
                },
              ]}
              onPress={handleCallUser}>
              <Ionicons name="call" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>{t('Call')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: chatThemeColor,
                },
              ]}
              onPress={handleVideoCall}>
              <Ionicons name="videocam" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>{t('Video')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {userLinks.length > 0 && (
          <View style={styles.infoSection}>
            <View style={styles.infoHeaderRow}>
              <MaterialIcons name="link" size={22} color={chatThemeColor} />
              <Text style={styles.infoHeaderText}>{t('Links')}</Text>
            </View>

            {userLinks.map(link => renderLinkItem(link))}
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoHeaderRow}>
            <MaterialIcons
              name="photo-library"
              size={22}
              color={chatThemeColor}
            />
            <Text style={styles.infoHeaderText}>{t('Media')}</Text>

            <TouchableOpacity style={styles.seeAllButton} onPress={onPressAll}>
              <Text style={[styles.seeAllText, {color: chatThemeColor}]}>
                {t('See all')}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={chatThemeColor}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            {renderMediaFilterButton(t('All'), 'all')}
            {renderMediaFilterButton(t('Photos'), 'photos')}
            {renderMediaFilterButton(t('Videos'), 'videos')}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={chatThemeColor} />
            </View>
          ) : (
            <FlatList
              data={filteredMedia()}
              renderItem={renderMediaItem}
              keyExtractor={item => item.id.toString()}
              numColumns={3}
              scrollEnabled={false}
              style={styles.mediaGrid}
              ListEmptyComponent={() => (
                <View style={styles.emptyMedia}>
                  <Text style={styles.emptyMediaText}>
                    {t('No media available')}
                  </Text>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeaderRow}>
            <MaterialIcons name="settings" size={22} color={chatThemeColor} />
            <Text style={styles.infoHeaderText}>{t('Settings')}</Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color="#888"
            />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t('Notifications')}</Text>
              <Text style={styles.settingSubtitle}>{t('On')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleUserBlock}>
            <MaterialIcons name="block" size={22} color="#888" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>{t('Block user')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="report" size={22} color="#ff5252" />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: '#ff5252'}]}>
                {t('Report user')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{height: 50}} />
      </ScrollView>

      {showOptionsMenu && (
        <View style={styles.optionsMenu}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowOptionsMenu(false);
              Toast.show(t('Share contact coming soon'), Toast.SHORT);
            }}>
            <MaterialIcons name="share" size={20} color="#FFF" />
            <Text style={styles.optionText}>{t('Share contact')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowOptionsMenu(false);
              Toast.show(t('Edit contact coming soon'), Toast.SHORT);
            }}>
            <MaterialIcons name="edit" size={20} color="#FFF" />
            <Text style={styles.optionText}>{t('Edit contact')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowOptionsMenu(false);
              Toast.show(t('Add to favorites coming soon'), Toast.SHORT);
            }}>
            <MaterialIcons name="star" size={20} color="#FFF" />
            <Text style={styles.optionText}>{t('Add to favorites')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.fab, {backgroundColor: chatThemeColor}]}
        onPress={handleSendMessage}>
        <MaterialIcons name="chat" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default UserProfileScreen;
