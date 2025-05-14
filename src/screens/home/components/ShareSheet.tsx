import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ProfileImage from '../../../components/ProfileImage';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import * as userApi from '../../../apis/userApi';
import {useNavigation} from '@react-navigation/native';
import {truncateText} from '../../../utils/truncateText';
import {RadioButton} from 'react-native-paper';
import {
  setShareSheet,
  setShareContent,
  addFavouriteUser,
} from '../../../store/slices/ui/indexSlice';
import * as videoApi from '../../../apis/video.api';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReactNativeBlobUtil from 'react-native-blob-util';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import * as shareApi from '../../../apis/share';
import {HomeScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {
  selectMyProfileData,
  selectShareContent,
  selectShareSheet,
  selectProfileShareContent,
} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

interface ShareSheetProps {}

interface RenderUsersProps {
  item: any;
  index: number;
}

const ShareSheet: React.FC<ShareSheetProps> = () => {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const my_data = useAppSelector(selectMyProfileData);
  const modalVisible = useAppSelector(selectShareSheet);
  const video_details = useAppSelector(selectShareContent);
  const user_details = useAppSelector(selectProfileShareContent);
  const [users, setUsers] = React.useState<any>([]);
  const [textinput, setTextinput] = React.useState<string>('');
  const [share_user_id, setShare_user_id] = useState<number[]>([]);
  const [isInterested, setInterested] = useState(true);
  const [searched_user, setSearched_user] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isFavUser, setIsFavUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [video_delete_loading, setVideo_delete_loading] = useState(false);
  const [video_download_loading, setVideo_download_loading] = useState(false);
  const idVideo = video_details?.id;
  const user_id = user_details?.id;
  const caption = 'Check out this awesome post!';
  const shares_url = `https://dreamlived.com/Index/MainScreen/Home/Followings/${idVideo}`;

  const socialApps = [
    {
      name: 'Whatsapp',
      packageName: 'com.whatsapp',
      url: 'https://play.google.com/store/apps/details?id=com.whatsapp',
      dataShareUrl: `whatsapp://send?text=${encodeURIComponent(
        caption + '\n' + shares_url,
      )}`,
      generateShareUrl: async () => {
        const result = await shareApi.addVideoShare(
          my_data?.auth_token,
          video_details?.user_id,
          idVideo,
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
      packageName: 'com.facebook.katana',
      url: 'https://www.facebook.com/',
      dataShareUrl: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
        caption,
      )}&u=${encodeURIComponent(shares_url)}`,
      generateShareUrl: async () => {
        const result = await shareApi.addVideoShare(
          my_data?.auth_token,
          video_details?.user_id,
          idVideo,
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
      packageName: 'com.twitter.android',
      url: 'https://play.google.com/store/apps/details?id=com.twitter.android',
      dataShareUrl: `twitter://post?message=${encodeURIComponent(
        caption,
      )}&url=${encodeURIComponent(shares_url)}`,
      generateShareUrl: async () => {
        const result = await shareApi.addVideoShare(
          my_data?.auth_token,
          video_details?.user_id,
          idVideo,
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
      packageName: 'com.instagram.android',
      url: 'https://play.google.com/store/apps/details?id=com.instagram.android',
      dataShareUrl: `instagram://stories?text=${encodeURIComponent(
        caption,
      )}&media=${encodeURIComponent(shares_url)}`,
      generateShareUrl: async () => {
        const result = await shareApi.addVideoShare(
          my_data?.auth_token,
          video_details?.user_id,
          idVideo,
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

  // const handleSearch = async (e: any) => {
  //   setTextinput(e);
  //   if (e.length > 0) {
  //     const foundUsers = users.filter(
  //       (user: any) =>
  //         user.nickname.toLowerCase().includes(e.toLowerCase()) ||
  //         user.username.toLowerCase().includes(e.toLowerCase()),
  //     );
  //     setSearched_user(foundUsers);
  //   } else {
  //     Toast.show('Please Enter at least 1 characters to search', Toast.SHORT);
  //   }
  // };

  const closeModal = () => {
    dispatch(setShareContent(''));
    setShare_user_id([]);
    setSearched_user([]);
    dispatch(setShareSheet(false));
    setShowUserInfo(false);
  };
  const handleSearch = (e: string) => {
    // console.log('Search Query:', e);

    setTextinput(e);

    if (e.trim().length > 0) {
      const foundUsers = users?.filter(
        (user: any) =>
          user?.nickname?.toLowerCase().includes(e.toLowerCase()) ||
          user?.username?.toLowerCase().includes(e.toLowerCase()),
      );

      // console.log('Filtered Users:', foundUsers);
      setSearched_user(foundUsers);
    } else {
      Toast.show('Please Enter at least 1 characters to search', Toast.SHORT);
    }
  };

  const getfollowers = async () => {
    const response = await userApi.getFollowersDetails(my_data?.id);
    setUsers(response?.Followers);
  };

  const handleSharepress = async () => {
    const data = {
      user_ids: share_user_id,
      video_id: video_details?.id,
      shared_people_id: video_details?.user?.id,
    };
    closeModal();
    await videoApi.shareVideo(my_data?.auth_token, data);
    Toast.show('Sending...', Toast.LONG);
  };

  const navigationHandler = () => {
    navigation.navigate('ShareReportScreen', {idVideo: video_details.id});

    closeModal();
  };

  const VideoNotInterestedHandler = async () => {
    try {
      const result = await videoApi.makeVideoNotInterested(
        my_data?.auth_token,
        idVideo,
      );
      Alert.alert('Info', result?.message);
    } catch (error) {
      console.log('error', error);
    }
  };

  const VideoInterested = async () => {
    try {
      const result = await videoApi.makeVideoInterested(
        my_data?.auth_token,
        idVideo,
      );
      Alert.alert('Info', result?.message);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handlePressIcon = async (socialData: any) => {
    const url = await socialData?.generateShareUrl();
    await Linking.openURL(url);
  };

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
        <View style={styles.follwers_main_container}>
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

  const getSocialAppImageSource = (appName: any) => {
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
  };

  const toggleUserInfoVisibility = () => {
    setShowUserInfo(!showUserInfo);
  };

  const handleDeletePress = async () => {
    try {
      if (video_details.user.id === my_data.id) {
        setVideo_delete_loading(true);
        const result = await videoApi.deleteVideo(
          my_data?.auth_token,
          video_details.id,
        );
        Toast.show('Successfully deleted', Toast.LONG);
        setVideo_delete_loading(false);
      }
    } catch (error) {
      setVideo_delete_loading(false);
      console.log('error', error);
    }
  };

  const handleFavouritePress = async () => {
    try {
      if (video_details.user) {
        const userData = {
          userId: Date.now(),
          user: {
            id: video_details.user.id,
            profile_pic: video_details.user.profile_pic,
            nickname: video_details.user.nickname,
            username: video_details.user.username,
          },
        };
        const data = {
          favourite_user_id: video_details.user.id,
        };
        const res = await userApi.addFavouriteUser(data, my_data?.auth_token);
        setIsFavUser(true);
        if (res.data[1] === true) {
          dispatch(addFavouriteUser(userData));
          Toast.show('User Added to Favourites', Toast.LONG);
          setIsFavUser(false);
        } else {
          Toast.show('User already added to Favourites', Toast.LONG);
          setIsFavUser(false);
        }
      }
    } catch (error) {
      console.error('Error adding favorite user:', error);
    }
  };

  const getPermissions = async () => {
    await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]);
  };

  const handleDownloadPress = async () => {
    try {
      await getPermissions();
      Toast.show('Downloading video', Toast.LONG);
      setVideo_download_loading(true);
      const url = `https://dpcst9y3un003.cloudfront.net/${video_details?.video}`;

      const downLoadDir = RNFS.DownloadDirectoryPath;

      const path = `${downLoadDir}/${video_details?.video}`;

      const response = await ReactNativeBlobUtil.config({
        path: path,
      }).fetch('GET', url);

      if (response.respInfo.status === 200) {
        console.log('File downloaded to:', response.path());
        Toast.show('Successfully Downloded', Toast.LONG);
        setVideo_download_loading(false);
      } else {
        console.error('Failed to download file');
        Toast.show('Unable to download this video', Toast.LONG);
        setVideo_download_loading(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  async function handleUserBlock(): Promise<void> {
    try {
      const result = await userApi.addBlockedUser(
        {
          blocked_user_id: user_id,
        },
        my_data?.auth_token,
      );
      console.log('API Response:', result);
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

  if (!modalVisible) {
    return null;
  }

  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        onShow={getfollowers}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.modalContainer,
            {height: showUserInfo ? '83%' : '40%'},
          ]}>
          <View style={styles.header}>
            <ProfileImage uri={my_data?.profile_pic} />
            <View style={styles.search_view}>
              <Feather name="search" size={20} />
              <TextInput
                placeholder={t('Search')}
                value={textinput}
                // onChangeText={handleSearch}
                onChangeText={text => {
                  handleSearch(text);
                  setShowUserInfo(true); // Expand when typing
                }}
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
              <Text style={styles.share_txt}>Share</Text>
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

          <View style={{flexDirection: 'row', marginLeft: 0}}>
            <View style={{width: '20%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={navigationHandler}>
                <Ionicons name="flag" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Report')}</Text>
            </View>

            <View style={{width: '20%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={VideoNotInterestedHandler}
                disabled={!isInterested}>
                <FontAwesome5 name="heart-broken" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Not')}</Text>

              <Text style={styles.txt}>{t('Interested')}</Text>
            </View>

            <View style={{width: '20%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={VideoInterested}>
                <Ionicons name="heart" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Interested')}</Text>
            </View>

            <View style={{width: '20%'}}>
              {video_download_loading ? (
                <View style={styles.iconback}>
                  <ActivityIndicator size={'small'} color={'#000'} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.iconback}
                  onPress={handleDownloadPress}>
                  <MaterialCommunityIcons
                    name="arrow-collapse-down"
                    size={20}
                  />
                </TouchableOpacity>
              )}

              <Text style={styles.txt}>{t('Download')}</Text>
            </View>

            <View style={{width: '20%'}}>
              {isFavUser ? (
                <View style={styles.iconback}>
                  <ActivityIndicator size={'small'} color={'#000'} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.iconback}
                  disabled={isFavUser}
                  onPress={handleFavouritePress}>
                  <MaterialCommunityIcons name="account-circle" size={20} />
                </TouchableOpacity>
              )}

              <Text style={styles.txt}>{t('Favourite')}</Text>
            </View>

            {/* Displaying only when the video belong to the current login account */}
            {video_details?.user?.id === my_data?.id ? (
              <View style={{width: '20%'}}>
                {video_delete_loading ? (
                  <View style={styles.iconback}>
                    <ActivityIndicator size={'small'} color={'#000'} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.iconback}
                    onPress={handleDeletePress}>
                    <Image
                      source={icons.settingDelete}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                )}

                <Text style={styles.txt}>{t('Delete')}</Text>
              </View>
            ) : null}
            <View style={{width: '20%'}}>
              <TouchableOpacity
                style={styles.iconback}
                onPress={confirmBlockUser}>
                <Entypo name="block" size={20} />
              </TouchableOpacity>

              <Text style={styles.txt}>{t('Block')}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ShareSheet;

const styles = StyleSheet.create({
  iconHeart: {
    position: 'absolute',
    width: 33,
    height: 33,
    top: -1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '83%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  socialIcon: {
    width: '100%',
    justifyContent: 'space-around',
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
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
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
  follwers_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
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
  share_txt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
