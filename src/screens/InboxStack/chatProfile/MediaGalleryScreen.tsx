import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {getMedia} from '../../../apis/mediaAPIs';
import {useAppSelector} from '../../../store/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BubbleMediaViewer from '../chat/components/BubbleMedia';
import {useNavigation, useRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  selectChatThemeColor,
  selectMyProfileData,
} from '../../../store/selectors';

const {width} = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - 40) / COLUMN_COUNT;

const MediaGalleryScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const userData = route.params?.userData;
  const initialTab = route.params?.initialTab || 'all';
  const passedMediaData = route.params?.mediaData;

  const chatThemeColor = useAppSelector(selectChatThemeColor);
  const myData = useAppSelector(selectMyProfileData);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [mediaData, setMediaData] = useState({
    all: [],
    images: [],
    videos: [],
    documents: [],
    audio: [],
    links: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showMediaViewer, setShowMediaViewer] = useState({
    visible: false,
    uri: '',
    type: 'image',
    sender: '',
    timestamp: '',
    messageId: null,
  });

  useEffect(() => {
    setupMediaData();
  }, []);

  const setupMediaData = async () => {
    try {
      setIsLoading(true);

      // Use passed media data if available
      if (passedMediaData) {
        console.log('Using passed media data:', passedMediaData);

        // Check if the data is valid
        if (
          Array.isArray(passedMediaData.all) &&
          passedMediaData.all.length > 0
        ) {
          // Make sure all items have _id property
          const validatedData = {
            ...passedMediaData,
            all: passedMediaData.all.map(item => ({
              ...item,
              _id: item._id || item.id, // Use existing _id or fallback to id
            })),
            images: (passedMediaData.images || []).map(item => ({
              ...item,
              _id: item._id || item.id,
            })),
            videos: (passedMediaData.videos || []).map(item => ({
              ...item,
              _id: item._id || item.id,
            })),
          };

          // Extract links if not already included
          if (!validatedData.links || validatedData.links.length === 0) {
            const links = extractLinksFromData(validatedData);
            validatedData.links = links;
          }

          setMediaData(validatedData);
        } else {
          console.warn('Passed media data is empty or invalid');
          // Set empty state but with links
          const links = extractLinksFromData(passedMediaData);
          setMediaData({
            all: [],
            images: [],
            videos: [],
            documents: [],
            audio: [],
            links: links,
          });
        }

        setIsLoading(false);
        return;
      }

      // Check if we have data from global state
      if (global.fullMediaData) {
        console.log('Using global media data:', global.fullMediaData);

        // Ensure the data structure is correct
        const formattedData = {
          all: global.fullMediaData.all || [],
          images: global.fullMediaData.images || [],
          videos: global.fullMediaData.videos || [],
          documents: global.fullMediaData.documents || [],
          audio: global.fullMediaData.audio || [],
        };

        // Extract links if needed
        const links =
          formattedData.links || extractLinksFromData(formattedData);

        setMediaData({
          ...formattedData,
          links: links,
        });

        setIsLoading(false);
        return;
      }

      // If no data is passed or in global state, fetch it
      console.log('Fetching media data from API');
      const response = await getMedia(userData.id, myData.auth_token);
      console.log('API fetched media:', response);

      // Process media data correctly
      let processedData;

      // Handle different response formats
      if (response.media && Array.isArray(response.media.all)) {
        // Format from UserProfileScreen API response
        const validMediaItems = response.media.all
          .filter(item => item.mediaUrl && item.mediaType)
          .map(item => ({
            _id: item._id,
            id: item._id,
            type: item.mediaType,
            uri: item.mediaUrl,
            mediaUrl: item.mediaUrl,
            mediaType: item.mediaType,
            createdAt: item.createdAt || new Date().toISOString(),
            sender: item.sender,
          }));

        processedData = {
          all: validMediaItems,
          images: validMediaItems.filter(item => item.type === 'image'),
          videos: validMediaItems.filter(item => item.type === 'video'),
          documents: [],
          audio: [],
        };
      } else {
        // Direct API response format
        processedData = {
          all: Array.isArray(response.all) ? response.all : [],
          images: Array.isArray(response.images) ? response.images : [],
          videos: Array.isArray(response.videos) ? response.videos : [],
          documents: Array.isArray(response.documents)
            ? response.documents
            : [],
          audio: Array.isArray(response.audio) ? response.audio : [],
        };
      }

      // Extract links
      const links = extractLinksFromData(processedData);

      setMediaData({
        ...processedData,
        links: links,
      });
    } catch (error) {
      console.error('Error setting up media data:', error);
      // Set empty state
      setMediaData({
        all: [],
        images: [],
        videos: [],
        documents: [],
        audio: [],
        links: [
          {
            _id: 'demo-link-1',
            url: 'https://dreamlived.com/share/video/eb26a77e-4ac4-4870-9d05-ad7bb8556821',
            text: 'DreamLived Video Link',
            createdAt: new Date().toISOString(),
            source: 'Demo',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractLinksFromData = data => {
    // Process all text content to extract links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const linksSet = new Set();
    const links = [];

    // Process all media items to extract links from text
    const allMedia = data.all || data.media?.all || [];

    if (Array.isArray(allMedia)) {
      allMedia.forEach(item => {
        if (item.text) {
          const matches = item.text.match(urlRegex);
          if (matches) {
            matches.forEach(url => {
              if (!linksSet.has(url)) {
                linksSet.add(url);
                links.push({
                  _id: `link-${links.length}`,
                  url: url,
                  text: url,
                  createdAt: item.createdAt || new Date().toISOString(),
                  source: item.sender?.name || 'Unknown',
                });
              }
            });
          }
        }
      });
    }

    // Add demo link if none found
    if (links.length === 0) {
      links.push({
        _id: 'demo-link-1',
        url: 'https://dreamlived.com/share/video/eb26a77e-4ac4-4870-9d05-ad7bb8556821',
        text: 'DreamLived Video Link',
        createdAt: new Date().toISOString(),
        source: 'Demo',
      });
    }

    return links;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleMediaPress = item => {
    setShowMediaViewer({
      visible: true,
      uri: item.uri,
      type: item.type,
      sender: item.sender._id,
      timestamp: item.createdAt,
      messageId: item?.id,
    });
  };

  const handleOpenLink = url => {
    // Validate URL before opening
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(t('Error'), t('Cannot open this URL'));
        }
      });
    } else {
      Alert.alert(t('Invalid URL'), t('The link appears to be invalid'));
    }
  };

  const renderMediaItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.mediaItem}
        onPress={() => handleMediaPress(item)}
        activeOpacity={0.8}>
        <Image
          source={{uri: item.mediaUrl || item.uri}}
          style={styles.mediaImage}
          resizeMode="cover"
        />
        {(item.mediaType === 'video' || item.type === 'video') && (
          <View style={styles.videoBadge}>
            <Ionicons name="play-circle" size={30} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderLinkItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.linkItem}
        onPress={() => handleOpenLink(item.url)}
        activeOpacity={0.7}>
        <View style={styles.linkIconContainer}>
          <MaterialIcons name="link" size={24} color="#fff" />
        </View>
        <View style={styles.linkContent}>
          <Text style={styles.linkUrl} numberOfLines={1}>
            {item.text}
          </Text>
          <Text style={styles.linkSource}>
            {item.source} • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <MaterialIcons name="open-in-new" size={20} color={chatThemeColor} />
      </TouchableOpacity>
    );
  };

  const renderTabButton = (label, tabName, iconName = null) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabName && {backgroundColor: chatThemeColor},
      ]}
      onPress={() => setActiveTab(tabName)}>
      {iconName && (
        <MaterialIcons
          name={iconName}
          size={16}
          color={activeTab === tabName ? '#fff' : '#666'}
          style={styles.tabIcon}
        />
      )}
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tabName && styles.activeTabText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {activeTab === 'links' ? (
        <>
          <MaterialIcons name="link-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('No links available')}</Text>
        </>
      ) : (
        <>
          <MaterialIcons name="photo-library" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{t('No media available')}</Text>
        </>
      )}
    </View>
  );

  const getCurrentTabData = () => {
    if (!mediaData) return [];
    return mediaData[activeTab] || [];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>{t('Media Gallery')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {renderTabButton(t('All'), 'all', 'apps')}
        {renderTabButton(t('Photos'), 'images', 'photo')}
        {renderTabButton(t('Videos'), 'videos', 'videocam')}
        {renderTabButton(t('Links'), 'links', 'link')}
        {renderTabButton(t('Docs'), 'documents', 'description')}
        {renderTabButton(t('Audio'), 'audio', 'audiotrack')}
      </View>

      {/* Media Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={chatThemeColor} />
        </View>
      ) : (
        <>
          {/* Media FlastList - only visible when not in Links tab */}
          {activeTab !== 'links' && (
            <FlatList
              data={getCurrentTabData()}
              renderItem={renderMediaItem}
              keyExtractor={item => item._id.toString()}
              numColumns={COLUMN_COUNT}
              contentContainerStyle={styles.mediaGrid}
              ListEmptyComponent={renderEmptyState}
            />
          )}

          {/* Links FlatList - only visible in Links tab */}
          {activeTab === 'links' && (
            <FlatList
              data={mediaData.links}
              renderItem={renderLinkItem}
              keyExtractor={item => item._id.toString()}
              numColumns={1}
              contentContainerStyle={styles.linksList}
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </>
      )}
      <BubbleMediaViewer
        visible={showMediaViewer.visible}
        uri={showMediaViewer.uri}
        type={showMediaViewer.type}
        onClose={() => setShowMediaViewer(prev => ({...prev, visible: false}))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexWrap: 'wrap',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 3,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 4,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  mediaGrid: {
    padding: 5,
    flexGrow: 1,
  },
  linksList: {
    padding: 0,
  },
  mediaItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 5,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a86f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
    marginRight: 10,
  },
  linkUrl: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  linkSource: {
    fontSize: 12,
    color: '#888',
  },
});

export default MediaGalleryScreen;
