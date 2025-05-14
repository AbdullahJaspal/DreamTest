import React, {useRef, useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  type GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {CText} from '../../components';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import ItemChoose from './components/ItemChoose';
import Container from '../../components/Container';
import ChooseCategories from './ChooseCategories';
import * as imagePost from '../../apis/video.api';
import TaggingUser from './components/TaggingUser';
import {MediaType} from '../newVideo/enum/MediaType';
import {openSettings} from 'react-native-permissions';
import Header from '../profile/profile/components/Header';
import ItemAddCaption from './components/ItemAddCaption';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BORDER, COLOR, SPACING} from '../../configs/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geolocation from '@react-native-community/geolocation';
import ModalLoading from '../../components/modal/ModalLoading';
import {useNavigation, useRoute} from '@react-navigation/native';
import PostPictureInputBox from './components/PostPictureInputBox';
import PrivacyTypelSelection from './components/PrivacyTypelSelection';
import EditSelectedPictureMedia from './components/EditSelectedPictureMedia';
import {requestLocationPermission} from '../../utils/externalFileReadPermission';
import {getLocationInformationFromOSM} from '../../utils/getLocationInformationFromOSM';

import {selectMyProfileData} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';
import {icons} from '../../assets/icons';

const listAddress = [
  'Kuwait',
  'Arabian Gulf',
  'Türkey',
  'Europe',
  'Americas',
  'Canada',
];

export enum PrivacyType {
  public = 'Public',
  private = 'Private',
  friends = 'Friends',
}

interface PrivacyPos {
  top: number;
  left: number;
}

interface CurrentLocation {
  long: number;
  lat: number;
}

interface ImageData {
  id: string;
  img_url: string;
}

interface EditPostPictureScreenRouteParams {
  postData: any;
  pictureURLs: Array<{
    id: string;
    img_url: string;
  }>;

  newImages?: Array<{
    id: string;
    img_url: string;
  }>;
}

const {width} = Dimensions.get('screen');

const EditPostPictureScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as EditPostPictureScreenRouteParams;
  const my_data = useAppSelector(selectMyProfileData);
  const [commentAllowed, setCommentAllowed] = useState<boolean>(true);
  const [description, setDescription] = useState<string>('');
  const [postPrivacy, setPostPrivacy] = useState<PrivacyType>(
    PrivacyType.public,
  );
  const [privacyVisible, setPrivacyVisible] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<string>();
  const [showTagModel, setShowTagModel] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>('');
  const [images, setImages] = useState<Array<{id: string; img_url: string}>>(
    params?.pictureURLs || [],
  );
  const currentLocationRef = useRef<CurrentLocation>({lat: 0, long: 0});
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const privacyPositionRef = useRef<PrivacyPos>({top: 0, left: 0});
  const taggerUserIds = useRef<number[]>([]);
  const countriesIDs = useRef<number[]>([]);
  const citiesIDs = useRef<number[]>([]);
  const postTopic = useRef<string>('');
  const hashTag = useRef<string[]>([]);

  // Load post data when component mounts
  useEffect(() => {
    if (params?.postData) {
      const postData = params.postData;
      setPostId(postData.id.toString());

      const initialImages =
        params.pictureURLs ||
        postData.images?.map((img: any) => ({
          id: img.id,
          img_url: img.url,
        })) ||
        [];
      setImages(initialImages);

      // Set form fields with existing post data
      setDescription(postData.description || '');
      setCommentAllowed(
        postData.allow_comments !== undefined ? postData.allow_comments : true,
      );

      // Set privacy type
      if (postData.privacy_type) {
        setPostPrivacy(postData.privacy_type as PrivacyType);
      }

      // Set location if available
      if (postData.location_name) {
        setCurrentLocation(postData.location_name);
      }

      // Set location coordinates if available
      if (postData.location && typeof postData.location === 'object') {
        currentLocationRef.current = {
          lat: postData.location.lat || 0,
          long: postData.location.long || 0,
        };
      }

      // Set post topic if available
      if (postData.post_topic) {
        postTopic.current = postData.post_topic;
      }

      // Set tagged users if available
      if (postData.tag_user_ids && Array.isArray(postData.tag_user_ids)) {
        taggerUserIds.current = postData.tag_user_ids;
      }

      // Log picture URLs to debug
      console.log('new URLs:', params.newImages);
    }
  }, [params, route.params]);

  /**
   * deal with the location
   */
  const handleTagCurrentLocation = async () => {
    const result = await requestLocationPermission();
    if (result) {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          if (currentLocationRef.current) {
            currentLocationRef.current.long = longitude;
            currentLocationRef.current.lat = latitude;
          }
          try {
            const osmResult = await getLocationInformationFromOSM(
              longitude,
              latitude,
            );
            setCurrentLocation(
              `${osmResult.address.city} ${osmResult.address.country}`,
            );
            Toast.show('Successfully tagged your location', Toast.LONG);
          } catch (error) {
            console.error('Error fetching location information:', error);
            Alert.alert('Error', 'Unable to fetch location information.');
          }
        },
        error => {
          console.log('Error getting location: ', error);
          Alert.alert(
            'Error',
            'Unable to get your current location. Please try again.',
          );
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } else {
      Alert.alert(
        'Location Permission Denied',
        'We need access to your location. Would you like to retry or open settings?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Retry',
            onPress: handleTagCurrentLocation,
          },
          {
            text: 'Open Settings',
            onPress: () => openSettings(),
          },
        ],
      );
    }
  };

  // handle tagging followers
  const handleTagYourFollowers = () => {
    setShowTagModel(true);
  };

  // handle followers close
  function handleTagUserClose(userIDs: number[]): void {
    taggerUserIds.current = userIDs;
    setShowTagModel(false);
  }

  // handle region selection
  const handleRegionInWherePostIsAllowedCalled = () => {
    navigation.navigate('SelectingLocationScreen', {
      countries: countriesIDs,
      cities: citiesIDs,
    });
  };

  const handleChooseCategories = () => {
    setShowCategories(true);
  };

  const handleChosePostPrivacy = (event: GestureResponderEvent) => {
    privacyPositionRef.current.top = event.nativeEvent.pageY;
    privacyPositionRef.current.left = event.nativeEvent.pageX;
    setPrivacyVisible(true);
  };

  const handleClickAddress = (e: string) => {
    const flagMap: {[key: string]: string} = {
      Kuwait: '🇰🇼',
      'Arabian Gulf': '🇸🇦',
      Türkey: '🇹🇷',
      Europe: '🇪🇺',
      Americas: '🇺🇸',
      Canada: '🇨🇦',
    };

    if (flagMap[e]) {
      setDescription(p =>
        p !== null ? p + flagMap[e] + ' ' : flagMap[e] + ' ',
      );
    }
  };

  function onPrivacySelect(item: string): void {
    setPostPrivacy(item as PrivacyType);
    setPrivacyVisible(false);
  }

  const handleCommentPrivacy = (p: boolean) => {
    setCommentAllowed(p);
  };

  // Handle image removal
  const handleRemoveImage = (imageId: string) => {
    setRemovedImageIds(prev => [...prev, imageId]);
    setRemovedImageUrls(prev => [...prev, imageId]);
  };

  const handleAddMoreImages = () => {
    navigation.navigate(
      'BottomTabNavigation' as never,
      {
        screen: 'NewVideoStackNavigation',
        params: {
          screen: 'MediaPickupScreen',
          params: {
            mediaType: MediaType.Photo,
            fromEditScreen: true,
            currentImages: images,
            postData: params?.postData || {},
          },
        },
      } as never,
    );
  };

  // Update the post
  async function handleUpdatePost(): Promise<void> {
    try {
      setLoading(true);

      const updateData = {
        description,
        privacy_type: postPrivacy.toLowerCase() as
          | 'public'
          | 'private'
          | 'friends',
        allow_comment: commentAllowed,
        location: JSON.stringify(currentLocationRef.current),
        current_location: currentLocation,
        removed_image_ids: removedImageIds.join(','),
        post_topic: postTopic.current,
        // new_images: params.newImages,
      };

      console.log('Updating post with data:', updateData);
      await imagePost.editPicturePost(postId, updateData, my_data.auth_token);

      Toast.show(t('Post updated successfully'), Toast.SHORT);
      navigation.navigate('Index', {params: {postId}});
    } catch (error) {
      console.log('Error updating picture post:', error);
      Toast.show(t('Failed to update post'), Toast.SHORT);
    } finally {
      setLoading(false);
    }
  }

  // Cancel editing
  function handleCancel(): void {
    Alert.alert(
      t('Cancel Editing'),
      t('Are you sure you want to cancel? Your changes will not be saved.'),
      [
        {
          text: t('No'),
          style: 'cancel',
        },
        {
          text: t('Yes'),
          onPress: () => navigation.goBack(),
        },
      ],
    );
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header headertext={t('Edit Picture Post')} />
        <ModalLoading visible={loading} setVisible={undefined} />

        {/* Container for taking the description */}
        <View style={styles.des_view}>
          <PostPictureInputBox
            setDescription={setDescription}
            description={description}
          />

          <ItemChoose
            iconLeft={icons.user}
            name={t('Tag your followers')}
            iconRight={icons.right}
            onPress={handleTagYourFollowers}
          />

          <ItemChoose
            iconLeft={icons.locationOutline}
            name={t('Tag current location')}
            type={currentLocation}
            iconRight={icons.right}
            onPress={handleTagCurrentLocation}
          />

          <ItemChoose
            iconLeft={icons.locationOutline}
            name={t('Region in which post is allowed')}
            iconRight={icons.right}
            onPress={handleRegionInWherePostIsAllowedCalled}
          />

          <ItemChoose
            iconLeft={icons.hash}
            name={t('Choose Categories')}
            type={postTopic.current}
            iconRight={icons.right}
            onPress={handleChooseCategories}
          />

          <Container marginBottom={SPACING.S2}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollToOverflowEnabled={true}>
              {listAddress.map((e, i) => {
                return (
                  <ItemAddCaption
                    name={e}
                    key={i}
                    onPress={() => {
                      handleClickAddress(e);
                    }}
                  />
                );
              })}
            </ScrollView>
          </Container>

          <ItemChoose
            iconLeft={icons.lockOutline}
            name={t('Who can watch this post')}
            iconRight={icons.right}
            type={postPrivacy}
            onPress={handleChosePostPrivacy}
          />
          <ItemChoose
            iconLeft={icons.messageRound}
            name={t('Comments are allowed')}
            value={commentAllowed}
            type={commentAllowed ? 'Allowed' : 'Not Allowed'}
            initValue={commentAllowed}
            onChange={handleCommentPrivacy}
          />
        </View>

        {/* Container for displaying the selected media */}
        <EditSelectedPictureMedia
          pictureURLs={images.filter(img => !removedImageIds.includes(img.id))}
          onRemoveImage={handleRemoveImage}
          removedImageIds={removedImageIds}
        />

        <View style={styles.addMoreImagesContainer}>
          <Pressable
            style={styles.addMoreImagesButton}
            onPress={handleAddMoreImages}>
            <AntDesign name="plus" size={20} color={COLOR.WHITE} />
            <CText color={COLOR.WHITE} style={styles.addButtonText}>
              {t('Add More Images')}
            </CText>
          </Pressable>
        </View>

        <View style={styles.actionBottom}>
          <Pressable
            style={[styles.button, {backgroundColor: COLOR.WHITE}]}
            onPress={handleCancel}>
            <CText>{t('Cancel')}</CText>
          </Pressable>

          <Pressable
            style={[styles.button, {backgroundColor: COLOR.DANGER2}]}
            onPress={handleUpdatePost}>
            <CText color={COLOR.WHITE}>{t('Update')}</CText>
          </Pressable>
        </View>
      </ScrollView>

      <PrivacyTypelSelection
        privacyVisible={privacyVisible}
        setPrivacyVisible={setPrivacyVisible}
        top={privacyPositionRef.current.top}
        onSelect={onPrivacySelect}
        left={privacyPositionRef.current.left}
      />

      <TaggingUser
        onClose={() => handleTagUserClose}
        showTagModel={showTagModel}
      />

      <ChooseCategories
        showCategories={showCategories}
        setShowCategories={setShowCategories}
        postTopic={postTopic}
      />
    </SafeAreaView>
  );
};

export default React.memo(EditPostPictureScreen);

const styles = StyleSheet.create({
  des_view: {
    marginHorizontal: 2,
  },
  des_txt_view: {
    width: width * 0.9,
    textAlign: 'left',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER.SMALL,
    borderWidth: 1,
    borderColor: COLOR.LIGHT_GRAY,
  },
  actionBottom: {
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
    zIndex: 1000,
  },
  addMoreImagesContainer: {
    padding: 15,
    alignItems: 'center',
  },
  addMoreImagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.DANGER2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER.SMALL,
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
});
