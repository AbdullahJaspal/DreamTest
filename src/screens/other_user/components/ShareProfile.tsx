import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {RadioButton} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import ProfileImage from '../../../components/ProfileImage';

import * as videoApi from '../../../apis/video.api';
import * as userApi from '../../../apis/userApi';
import * as shareApi from '../../../apis/share';

import {truncateText} from '../../../utils/truncateText';

import {
  showProfileShareSheet,
  setProfileShareContent,
} from '../../../store/slices/ui/indexSlice';

import {UserProfileMainPageScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

import {useAppSelector} from '../../../store/hooks';
import {
  selectMyProfileData,
  selectProfileShareContent,
  selectShowProfileShareSheet,
} from '../../../store/selectors';

import Toast from 'react-native-simple-toast';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

interface ShareSheetProps {}

interface RenderUsersProps {
  item: any;
  index: number;
}

const ShareProfile: React.FC<ShareSheetProps> = () => {
  const navigation = useNavigation<UserProfileMainPageScreenNavigationProps>();
  const dispatch = useDispatch();
  const my_data = useAppSelector(selectMyProfileData);
  const modalVisible = useAppSelector(selectShowProfileShareSheet);
  const user_details = useAppSelector(selectProfileShareContent);
  const [users, setUsers] = React.useState<any>([]);
  const [textinput, setTextinput] = React.useState<string>('');
  const [share_user_id, setShare_user_id] = useState<number[]>([]);
  const [isInterested, setInterested] = useState(true);
  const [searched_user, setSearched_user] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const user_id = user_details?.id;
  const caption = 'Check out this awesome user!';
  const {t, i18n} = useTranslation();
  const socialApps = [
    {
      name: 'Whatsapp',
      generateShareUrl: async () => {
        const result = await shareApi.addProfileShare(
          my_data?.auth_token,
          user_id,
          'whatsapp',
          'android',
        );
        const whatsappShareUrl = `whatsapp://send?text=${encodeURIComponent(
          result?.video_share_link,
        )}`;
        return whatsappShareUrl;
      },
    },
    {
      name: 'Facebook',
      generateShareUrl: async () => {
        const result = await shareApi.addProfileShare(
          my_data?.auth_token,
          user_id,
          'facebook',
          'android',
        );
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          result?.video_share_link,
        )}`;
        return facebookShareUrl;
      },
    },
    {
      name: 'Twitter',
      generateShareUrl: async () => {
        const result = await shareApi.addProfileShare(
          my_data?.auth_token,
          user_id,
          'twitter',
          'android',
        );
        const twitterShareURL = `twitter://post?message=${encodeURIComponent(
          caption,
        )}&url=${encodeURIComponent(result?.video_share_link)}`;

        return twitterShareURL;
      },
    },
    {
      name: 'Instagram',
      generateShareUrl: async () => {
        const result = await shareApi.addProfileShare(
          my_data?.auth_token,
          user_id,
          'instagram',
          'android',
        );
        const instagramShareUrl = `instagram://stories?text=${encodeURIComponent(
          caption,
        )}&media=${encodeURIComponent(result?.video_share_link)}`;
        return instagramShareUrl;
      },
    },
  ];

  const handleSearch = async (e: any) => {
    setTextinput(e);
    if (e.length > 0) {
      const foundUsers = users.filter(
        (user: any) =>
          user.nickname.toLowerCase().includes(e.toLowerCase()) ||
          user.username.toLowerCase().includes(e.toLowerCase()),
      );
      setSearched_user(foundUsers);
    } else {
      Toast.show('Please Enter at least 1 characters to search', Toast.SHORT);
    }
  };

  const closeModal = () => {
    dispatch(setProfileShareContent(''));
    setShare_user_id([]);
    setSearched_user([]);
    dispatch(showProfileShareSheet(false));
    setShowUserInfo(false);
  };

  /**
   * Get followers
   */
  const getfollowers = useCallback(async () => {
    const response = await userApi.getFollowersDetails(my_data?.id);
    setUsers(response?.Followers);
  }, []);

  /**
   * Handle share button
   */
  const handleSharepress = async () => {
    const data = {
      user_ids: share_user_id,
      video_id: user_details?.id,
      shared_people_id: user_details?.user?.id,
    };
    closeModal();
    await videoApi.shareVideo(my_data?.auth_token, data);
    Toast.show('Sending...', Toast.LONG);
  };

  /**
   * Handle report button
   */
  const handleReportClick = () => {
    navigation.navigate('ProfileReportListSelectionScreen', {
      profile_id: user_details.id,
    });
    closeModal();
  };

  /**
   * Add profile not inerested
   */
  const makeProfileNotInterested = async () => {
    try {
      const result = await shareApi.addProfileNotInterested(
        my_data?.auth_token,
        user_id,
      );
      Alert.alert('Info', result?.message);
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   * Add profile inerested
   */
  const makeProfileInterested = async () => {
    try {
      const result = await shareApi.addProfileInterested(
        my_data?.auth_token,
        user_id,
      );
      Alert.alert('Info', result?.message);
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   * Handle social icon
   */
  const handlePressIcon = async (socialData: any) => {
    const url = await socialData?.generateShareUrl();
    await Linking.openURL(url);
  };

  /**
   * Followers list
   */
  const RenderUsers: React.FC<RenderUsersProps> = React.memo(
    ({item, index}) => {
      const [idPresent, setIdPresent] = useState(
        share_user_id?.includes(item?.id),
      );

      const handleRadioPress = async () => {
        if (!share_user_id.includes(item.id)) {
          if (share_user_id.length <= 20) {
            setShare_user_id(prevIds => [...prevIds, item.id]);
            setIdPresent(true);
          } else {
            Toast.show('You can select max of 20 person at a time', Toast.LONG);
          }
        } else {
          const filteredIds = share_user_id.filter(id => id !== item.id);
          setShare_user_id(filteredIds);
          setIdPresent(false);
        }
      };

      const handleProfileClick = () => {
        navigation.navigate('UserProfileMainPage', {user_id: item?.id});
      };

      return (
        <View style={styles.profile_main_container}>
          <View style={styles.users_left_view}>
            <ProfileImage
              uri={item?.profile_pic}
              onPress={handleProfileClick}
            />
            <View style={styles.text_view}>
              <Text style={styles.username_text}>
                {truncateText(item?.username, 5)}
              </Text>
              <Text style={styles.nickname_text}>{item?.nickname}</Text>
            </View>
          </View>

          <RadioButton.Android
            value={'true'}
            status={idPresent ? 'checked' : 'unchecked'}
            onPress={handleRadioPress}
          />
        </View>
      );
    },
  );

  const renderSocialApp = (socialApp: any) => (
    <TouchableOpacity
      style={styles.social_media_icon}
      key={socialApp.name}
      onPress={() => handlePressIcon(socialApp)}>
      <View>
        <Image
          source={getSocialAppImageSource(socialApp.name)}
          style={styles.social_media_img}
        />
        <Text style={styles.social_media_text}>{t(socialApp.name)}</Text>
      </View>
    </TouchableOpacity>
  );

  const getSocialAppImageSource = useCallback((appName: any) => {
    switch (appName) {
      case 'Whatsapp':
        return icons.whatsapp;
      case 'Facebook':
        return icons.facebook;
      case 'Twitter':
        return icons.xLogo;
      case 'Instagram':
        return icons.instagram;
      default:
        return;
    }
  }, []);

  const toggleUserInfoVisibility = () => {
    setShowUserInfo(!showUserInfo);
  };

  if (!modalVisible) {
    return null;
  }

  async function handleUserBlock(): Promise<void> {
    try {
      const result = await userApi.addBlockedUser(
        {
          blocked_user_id: user_id,
        },
        my_data?.auth_token,
      );
      Toast.show('Blocked successfully', Toast.SHORT);
    } catch (error) {
      console.log('error', error);
    }
  }

  function confirmBlockUser() {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Block', onPress: handleUserBlock},
      ],
      {cancelable: true},
    );
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={closeModal}
        onShow={getfollowers}>
        <TouchableOpacity style={styles.overlay} onPress={closeModal} />

        <View
          style={[
            styles.modalContainer,
            {height: showUserInfo ? '78%' : '35%'},
          ]}>
          <View style={styles.header}>
            <ProfileImage uri={my_data?.profile_pic} />
            <View style={styles.search_view}>
              <Feather name="search" size={20} />
              <TextInput
                placeholder={t('Search')}
                value={textinput}
                onChangeText={handleSearch}
                style={styles.textinput}
              />
            </View>
          </View>

          {showUserInfo && (
            <View style={styles.users_list}>
              {users?.length > 0 ? (
                <FlatList
                  data={searched_user?.length ? searched_user : users}
                  keyExtractor={item => item?.id}
                  windowSize={7}
                  maxToRenderPerBatch={5}
                  renderItem={({item, index}) => (
                    <RenderUsers item={item} index={index} />
                  )}
                />
              ) : (
                <View style={styles.loader_view}>
                  <ActivityIndicator size={'large'} color={'#000'} />
                </View>
              )}
            </View>
          )}

          {share_user_id?.length > 0 && (
            <Pressable onPress={handleSharepress} style={styles.share_button}>
              <Text style={styles.share_button_txt}>{t('Share')}</Text>
            </Pressable>
          )}

          <View
            style={[
              styles.IconContainer,
              {height: showUserInfo ? '18%' : '38%'},
            ]}>
            {socialApps.map(socialApp => renderSocialApp(socialApp))}
            {showUserInfo === false && (
              <TouchableOpacity
                style={styles.share_toggl_container}
                onPress={toggleUserInfoVisibility}>
                <AntDesign name="down" color="#000" size={20} />
              </TouchableOpacity>
            )}
            {showUserInfo === true && (
              <TouchableOpacity
                style={styles.share_toggl_container}
                onPress={toggleUserInfoVisibility}>
                <AntDesign name="up" color="#000" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View style={{flexDirection: 'row', marginLeft: 3}}>
            <View style={{width: '25%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={handleReportClick}>
                <Ionicons name="flag" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Report')}</Text>
            </View>

            <View style={{width: '25%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={makeProfileNotInterested}
                disabled={!isInterested}>
                <FontAwesome5 name="heart-broken" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Not')}</Text>

              <Text style={styles.txt}>{t('Interested')}</Text>
            </View>

            <View style={{width: '25%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={makeProfileInterested}>
                <Ionicons name="heart" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Interested')}</Text>
            </View>

            <View style={{width: '25%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={confirmBlockUser}>
                <Entypo name="block" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>Block</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShareProfile;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width,
  },
  IconContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '18%',
    paddingVertical: 15,
  },
  iconback: {
    backgroundColor: '#f2f2f2',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  txt: {
    alignSelf: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textinput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
  },
  search_view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  users_left_view: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 3,
  },
  username_text: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'left',
  },
  nickname_text: {
    fontSize: 13,
    color: '#000',
    marginLeft: 10,
    textAlign: 'left',
  },
  text_view: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  users_list: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: width,
    height: height * 0.4,
  },
  loader_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  share_toggl_container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
    height: 35,
    width: 65,
    marginLeft: 12,
    top: -18,
  },
  social_media_icon: {
    width: '20%',
    height: '45%',
    marginTop: '2%',
  },
  social_media_img: {
    width: 45,
    height: 45,
    alignSelf: 'center',
    marginBottom: 5,
  },
  social_media_text: {
    color: '#000',
    alignSelf: 'center',
  },
  share_button: {
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 215,
    right: (width - width * 0.35) / 2,
    width: width * 0.3,
    marginHorizontal: width * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1000,
    borderRadius: 10,
  },
  share_button_txt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profile_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});
