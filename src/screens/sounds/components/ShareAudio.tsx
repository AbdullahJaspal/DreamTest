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
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {RadioButton} from 'react-native-paper';
import * as userApi from '../../../apis/userApi';
import * as videoApi from '../../../apis/video.api';
import {useAppSelector} from '../../../store/hooks';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {truncateText} from '../../../utils/truncateText';
import ProfileImage from '../../../components/ProfileImage';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  selectMyProfileData,
  selectShowSoundShareSheet,
  selectSoundShareContent,
} from '../../../store/selectors';

import {
  setShareContent,
  showSoundShareSheet,
} from '../../../store/slices/ui/indexSlice';

import {icons} from '../../../assets/icons';
const {width, height} = Dimensions.get('screen');

interface ShareSheetProps {}

interface RenderUsersProps {
  item: any;
  index: number;
}

const ShareAudio: React.FC<ShareSheetProps> = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const my_data = useAppSelector(selectMyProfileData);
  const modalVisible = useAppSelector(selectShowSoundShareSheet);
  const video_details = useAppSelector(selectSoundShareContent);
  const [users, setUsers] = React.useState<any>([]);
  const [textinput, setTextinput] = React.useState<string>('');
  const [share_user_id, setShare_user_id] = useState([]);
  const [searched_user, setSearched_user] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const idVideo = video_details?.id;
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
    },
    {
      name: 'Facebook',
      packageName: 'com.facebook.katana',
      url: 'https://www.facebook.com/',
      dataShareUrl: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
        caption,
      )}&u=${encodeURIComponent(shares_url)}`,
    },
    {
      name: 'Twitter',
      packageName: 'com.twitter.android',
      url: 'https://play.google.com/store/apps/details?id=com.twitter.android',
      dataShareUrl: `twitter://post?message=${encodeURIComponent(
        caption,
      )}&url=${encodeURIComponent(shares_url)}`,
    },
    {
      name: 'Instagram',
      packageName: 'com.instagram.android',
      url: 'https://play.google.com/store/apps/details?id=com.instagram.android',
      dataShareUrl: `instagram://stories?text=${encodeURIComponent(
        caption,
      )}&media=${encodeURIComponent(shares_url)}`,
    },
  ];
  //Handle Search Implementaion Saurav Change
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

  const closeModal = () => {
    dispatch(setShareContent(''));
    setShare_user_id('');
    setSearched_user([]);
    dispatch(showSoundShareSheet(false));
    setShowUserInfo(false);
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

  const handlePressIcon = async (socialData: any) => {
    Linking.canOpenURL(socialData?.dataShareUrl)
      .then(supported => {
        if (!supported) {
          Alert.alert(
            `${socialData?.name} not installed`,
            `${socialData?.name} app is required to share this content. Do you want to install it?`,
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Install',
                onPress: () => Linking.openURL(socialData?.url),
              },
            ],
          );
        } else {
          Linking.openURL(socialData?.dataShareUrl);
        }
      })
      .catch(err => console.error('An error occurred', err));
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

        <Text style={styles.social_media_text}>{socialApp.name}</Text>
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
        return icons.dreamLogo;
    }
  };

  const toggleUserInfoVisibility = () => {
    setShowUserInfo(!showUserInfo); //Show User Information By Saurav
    setSearched_user(users);
  };

  return (
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
        style={[styles.modalContainer, {height: showUserInfo ? '63%' : '20%'}]}>
        <View style={styles.header}>
          <ProfileImage uri={my_data?.profile_pic} />
          <View style={styles.search_view}>
            <Feather name="search" size={20} />
            <TextInput
              placeholder="Search"
              value={textinput}
              onChangeText={text => {
                handleSearch(text);
                setShowUserInfo(true); // Expand when typing By Saurav
              }}
              style={styles.textinput}
            />
          </View>
        </View>

        {showUserInfo && (
          <View style={styles.users_list}>
            {users?.length > 0 ? (
              searched_user?.length > 0 ? (
                <FlatList
                  data={searched_user}
                  keyExtractor={item => item?.id}
                  windowSize={7}
                  maxToRenderPerBatch={5}
                  renderItem={({item, index}) => (
                    <RenderUsers item={item} index={index} />
                  )}
                />
              ) : (
                <View style={styles.no_users_view}>
                  <Text style={styles.no_users_text}>No Users Found</Text>
                </View>
              )
            ) : (
              <View style={styles.loader_view}>
                <ActivityIndicator size={'large'} color={'#000'} />
              </View>
            )}
          </View>
        )}

        {share_user_id?.length > 0 && (
          <Pressable
            onPress={handleSharepress}
            style={{
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
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
              }}>
              Share
            </Text>
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
      </View>
    </Modal>
  );
};

export default ShareAudio;

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
  follwers_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
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

  no_users_view: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  no_users_text: {
    fontSize: 16,
    color: 'gray',
  },
});
