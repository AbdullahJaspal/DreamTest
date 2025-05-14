import {Alert, Dimensions, Linking, StyleSheet, Text, View} from 'react-native';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {externalFileReadPermission} from '../../utils/externalFileReadPermission';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../profile/profile/components/Header';
import SelectedMediaDisplay from './components/SelectedMediaDisplay';
import MediaTypeSelection from './components/MediaTypeSelection';
import Entypo from 'react-native-vector-icons/Entypo';
import MediaListing from './components/MediaListing';
import {MediaType} from './enum/MediaType';
import Toast from 'react-native-simple-toast';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  MediaPickupScreenNavigationProps,
  MediaPickupScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {hideStatusBar} from '../../utils/statusBar';
import {copyVideoToLocalPath} from './utils/copyVideoToLocalPath';
import FullScreenLoader from '../../components/FullScreenLoader';
import {useSharedValue} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
const mediaItems = Object.values(MediaType);
const {width} = Dimensions.get('screen');

const MediaPickupScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<MediaPickupScreenNavigationProps>();
  const route = useRoute<MediaPickupScreenRouteProps>();
  const [isPermissionGranted, setIsPermissionGranted] =
    useState<boolean>(false);
  const media = useRef<PhotoIdentifier[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<PhotoIdentifier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const copyLoader = useSharedValue<boolean>(false);
  const [mediaType, setMediaType] = useState<MediaType>(route.params.mediaType);

  // get devices media
  const fetchVideos = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const media_result = await CameraRoll.getPhotos({
        first: 2000,
        assetType: mediaType,
        include: ['playableDuration', 'location'],
      });
      media.current = media_result.edges;
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [isPermissionGranted, mediaType]);

  useEffect(() => {
    if (isPermissionGranted) {
      fetchVideos();
    }
  }, [fetchVideos]);

  const handleFirstMediaSelection = useCallback(() => {
    if (media.current?.length > 0) {
      setSelectedMedia([media.current[0]]);
    }
  }, [media]);
  useEffect(() => {
    handleFirstMediaSelection();
  }, [loading]);

  /**
   * handle permissions
   */
  const requestPermission = useCallback(async () => {
    const result = await externalFileReadPermission();
    if (result) {
      setIsPermissionGranted(true);
    } else {
      Alert.alert(
        'Permission Denied',
        'You need to grant permission to access media files.',
        [
          {
            text: 'Try Again',
            onPress: () => requestPermission(),
          },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  }, []);

  useEffect(() => {
    if (!isPermissionGranted) {
      requestPermission();
    }
  }, [isPermissionGranted, requestPermission]);

  /**
   * handle next button press
   */
  async function handleNextPress(): Promise<void> {
    if (selectedMedia.length === 0) {
      Toast.show('Select at least one media', Toast.LONG);
      return;
    }
    const firstSelectedMedia = selectedMedia[0]?.node;
    const isSelectedMediaVideo =
      firstSelectedMedia?.type.startsWith('video') ?? false;
    const filePath = firstSelectedMedia?.image.uri ?? '';
    const fileExtension = firstSelectedMedia.image.extension ?? '';

    if (isSelectedMediaVideo) {
      try {
        copyLoader.value = true;
        const videoURL = await copyVideoToLocalPath(filePath, fileExtension);
        navigation.navigate('PreviewVideoScreen', {
          pathVideo: `${videoURL}`,
        });
      } catch (error) {
        console.log('Error while coping file to local');
      } finally {
        copyLoader.value = false;
      }
      return;
    }
    const pictureURLs = selectedMedia
      .map(item => item.node.image.uri)
      .filter(Boolean);
    navigation.navigate('PostPictureScreen', {
      pictureURLs,
    });
  }
  /**
   * handle media selection
   */
  const isItemSelected = (item: PhotoIdentifier) => {
    return selectedMedia.some(
      selectedItem => selectedItem.node.id === item.node.id,
    );
  };

  const handleMediaSelection = (item: PhotoIdentifier) => {
    const isVideo = item?.node?.type.startsWith('video');
    const isFirstImg =
      selectedMedia.length > 0 &&
      selectedMedia[0]?.node.type.startsWith('image');

    if (isVideo) {
      setSelectedMedia([item]);
      return;
    }

    if (isItemSelected(item)) {
      setSelectedMedia(prevSelected =>
        prevSelected.filter(
          selectedItem => selectedItem.node.id !== item.node.id,
        ),
      );
      return;
    }

    if (isFirstImg && selectedMedia.length < 10) {
      setSelectedMedia(prevSelected => [...prevSelected, item]);
      return;
    }

    setSelectedMedia([item]);
  };

  function handleDropDown(selectedItem: MediaType): void {
    setMediaType(selectedItem);
  }

  function dropDownContent(selectedValue: string): ReactNode {
    return (
      <View style={styles.dropdown_view}>
        <Text style={styles.dropdown_txt}>{selectedValue}</Text>
        <Entypo name="chevron-small-down" size={20} color={'#fff'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.main_container} onLayout={hideStatusBar}>
      {/* Display header */}
      <Header
        headertext={t('Select Media')}
        thirdButton={true}
        thirdButtonText={t('Next')}
        onPress={handleNextPress}
      />

      {/* Not allowed permission view */}
      {!isPermissionGranted && (
        <View style={styles.container}>
          <Text style={styles.not_permited_txt}>
            {t('Media access is needed')}. {'\n'}
            {t('Please enable it in your settings')}.
          </Text>
        </View>
      )}

      {/* Display selected media */}
      <SelectedMediaDisplay selectedMedia={selectedMedia[0]} />

      {/* Display drop down for media type selection */}
      <View style={styles.media_type_selection_view}>
        <MediaTypeSelection
          items={mediaItems}
          dropdownStyle={styles.dropdown_main_view}
          dropdownContent={dropDownContent}
          onSelect={handleDropDown}
        />
      </View>

      {/* List all media */}
      <MediaListing
        loading={loading}
        selectedMedia={selectedMedia}
        handleMediaSelection={handleMediaSelection}
        media={media.current}
      />
      <FullScreenLoader sharedLoader={copyLoader} />
    </SafeAreaView>
  );
};

export default React.memo(MediaPickupScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  not_permited_txt: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '500',
  },
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  media_type_selection_view: {
    width: width,
    height: 40,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  dropdown_view: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    width: 120,
  },
  dropdown_main_view: {
    width: 120,
    height: 35,
    backgroundColor: '#000',
    borderRadius: 5,
    marginLeft: 2,
  },
  dropdown_txt: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});
