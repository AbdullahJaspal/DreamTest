import React, {useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {CText} from '../../components';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {useAppSelector} from '../../store/hooks';
import ItemChoose from './components/ItemChoose';
import ChooseCategories from './ChooseCategories';
import Container from '../../components/Container';
import * as imagePost from '../../apis/imagePost';
import TaggingUser from './components/TaggingUser';
import {openSettings} from 'react-native-permissions';
import ItemAddCaption from './components/ItemAddCaption';
import Header from '../profile/profile/components/Header';
import {selectMyProfileData} from '../../store/selectors';
import {BORDER, COLOR, SPACING} from '../../configs/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import ModalLoading from '../../components/modal/ModalLoading';
import {useNavigation, useRoute} from '@react-navigation/native';
import PostPictureInputBox from './components/PostPictureInputBox';
import SelectedPictureMedia from './components/SelectedPictureMedia';
import PrivacyTypelSelection from './components/PrivacyTypelSelection';
import {requestLocationPermission} from '../../utils/externalFileReadPermission';
import {getLocationInformationFromOSM} from '../../utils/getLocationInformationFromOSM';

import {
  PostPictureScreenScreenNavigationProps,
  PostPictureScreenScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
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

interface EditPostPictureScreenRouteParams {
  postData: any;
  pictureURLs: Array<{
    id: string;
    img_url: string;
  }>;

  newImages?: Array<{
    id?: string;
    uri: string;
  }>;
}
const {width, height} = Dimensions.get('screen');

const PostPictureScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<PostPictureScreenScreenNavigationProps>();
  const routes = useRoute<PostPictureScreenScreenRouteProps>();
  const route = useRoute();
  const params = route.params as EditPostPictureScreenRouteParams;
  const my_data = useAppSelector(selectMyProfileData);
  const [postPrivacy, setPostPrivacy] = useState<PrivacyType>(
    PrivacyType.public,
  );
  const [privacyVisible, setPrivacyVisible] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [commentAllowed, setCommentAllowed] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<string>();
  const [showTagModel, setShowTagModel] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const privacyPositionRef = useRef<PrivacyPos>({top: 0, left: 0});
  const currentLocationRef = useRef<CurrentLocation>({lat: 0, long: 0});
  const taggerUserIds = useRef<number[]>([]);
  const countriesIDs = useRef<number[]>([]);
  const citiesIDs = useRef<number[]>([]);
  const postTopic = useRef<string>('');
  const hashTag = useRef<string[]>([]);

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
            Toast.show('Successfully taged your location', Toast.LONG);
            const osmResult = await getLocationInformationFromOSM(
              longitude,
              latitude,
            );
            setCurrentLocation(
              `${osmResult.address.city} ${osmResult.address.country}`,
            );
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

  console.log('Picture URLs:', params.pictureURLs);

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

  // TO DO
  function handleDraftVideoPress(event: GestureResponderEvent): void {
    // throw new Error('Function not implemented.')
  }

  // TO DO
  function handlePromotePress(event: GestureResponderEvent): void {
    // throw new Error('Function not implemented.')
  }

  // It's time to collect all data
  async function handlePostVideo(): Promise<void> {
    try {
      setLoading(true);
      const data = new FormData();

      data.append('description', description);
      data.append('privacy_type', postPrivacy);
      data.append('allow_comment', commentAllowed);
      data.append('location', JSON.stringify(currentLocationRef.current));
      data.append('country_ids', countriesIDs.current);
      data.append('cities_ids', citiesIDs.current);
      data.append('hastag', hashTag.current);
      data.append('tag_user_ids', taggerUserIds.current);
      data.append('post_topic', postTopic.current);
      data.append('current_Location', currentLocation);

      routes.params.pictureURLs.forEach(item => {
        data.append('image', {
          uri: item,
          name: `${item?.split('/').reverse()[0]}.png`,
          type: 'image/png',
        });
      });

      console.log('post with data:', data);

      await imagePost.createPicturePost(my_data.auth_token, data);
      navigation.navigate('Index');
    } catch (error) {
      console.log('Error generated while creating picture post', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header headertext={t('Picture Post')} />
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
        <SelectedPictureMedia pictureURLs={routes.params?.pictureURLs || []} />

        <View style={styles.actionBottom}>
          <Pressable
            style={[styles.button, {backgroundColor: COLOR.WHITE}]}
            onPress={handleDraftVideoPress}>
            <CText>{t('Draft')}</CText>
          </Pressable>

          <Pressable
            style={[styles.button, {backgroundColor: COLOR.DANGER2}]}
            onPress={handlePromotePress}>
            <CText color={COLOR.WHITE}>{t('Promote')}</CText>
          </Pressable>

          <Pressable
            style={[styles.button, {backgroundColor: COLOR.DANGER2}]}
            onPress={handlePostVideo}>
            <CText color={COLOR.WHITE}>{t('Post')}</CText>
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

      <TaggingUser onClose={handleTagUserClose} showTagModel={showTagModel} />

      <ChooseCategories
        showCategories={showCategories}
        setShowCategories={setShowCategories}
        postTopic={postTopic}
      />
    </SafeAreaView>
  );
};

export default React.memo(PostPictureScreen);

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
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    paddingVertical: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLOR.WHITE,
    zIndex: 1000,
  },
});
