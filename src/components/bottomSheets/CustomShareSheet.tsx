import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageProps,
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
import {Image} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {UserFollowers} from '../../screens/other_user/types/VideoData';
import {selectMyProfileData, selectShareContent} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';
import {icons} from '../../assets/icons';
import ProfileImage from '../../components/ProfileImage';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {truncateText} from '../../utils/truncateText';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as userApi from '../../apis/userApi';
import * as videoApi from '../../apis/video.api';
import * as shareApi from '../../apis/share';

// Import icons
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface CustomShareSheetProps {
  visible: boolean;
  onClose: () => void;
  onShare?: () => void;
}

interface SocialItem {
  id: number;
  name: string;
  icons_name: ImageProps;
  packageName: string;
  url: string;
  dataShareUrl: string;
  generateShareUrl: () => Promise<string>;
}

interface RenderUsersProps {
  item: any;
  index: number;
}

const {width, height} = Dimensions.get('screen');

const CustomShareSheet: React.FC<CustomShareSheetProps> = ({
  visible,
  onClose,
  onShare,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const my_data = useAppSelector(selectMyProfileData);
  const video_details = useAppSelector(selectShareContent);

  const [users, setUsers] = useState<UserFollowers[]>([]);
  const [textinput, setTextinput] = useState<string>('');
  const [share_user_id, setShare_user_id] = useState<number[]>([]);
  const [isInterested, setInterested] = useState(true);
  const [searched_user, setSearched_user] = useState([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isFavUser, setIsFavUser] = useState(false);
  const [video_delete_loading, setVideo_delete_loading] = useState(false);
  const [video_download_loading, setVideo_download_loading] = useState(false);
  const [idPresentMap, setIdPresentMap] = useState<{[key: number]: boolean}>(
    {},
  );

  const idVideo = video_details?.id;
  const caption = 'Check out this awesome post!';
  const shares_url = `https://dreamlived.com/Index/MainScreen/Home/Followings/${idVideo}`;

  const socialApps: SocialItem[] = [
    {
      id: 1,
      name: 'Whatsapp',
      icons_name: icons.whatsapp,
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
      id: 2,
      name: 'Facebook',
      icons_name: icons.facebook,
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
      id: 3,
      name: 'Facebook Stories',
      icons_name: icons.facebook,
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
      id: 4,
      name: 'Twitter',
      icons_name: icons.xLogo,
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
      id: 5,
      name: 'Instagram',
      icons_name: icons.instagram,
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

  const getfollowers = async () => {
    try {
      const response = await userApi.getFollowersDetails(my_data?.id);
      setUsers(response?.Followers);
    } catch (error) {
      console.log('Error getting followers details', error);
    }
  };

  const handleSearch = (e: string) => {
    setTextinput(e);

    if (e.trim().length > 0) {
      const foundUsers = users?.filter(
        (user: any) =>
          user?.nickname?.toLowerCase().includes(e.toLowerCase()) ||
          user?.username?.toLowerCase().includes(e.toLowerCase()),
      );
      setSearched_user(foundUsers);
    } else {
      Toast.show('Please Enter at least 1 characters to search', Toast.SHORT);
    }
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
    if (onShare) {
      onShare();
    }
  };

  const closeModal = () => {
    setShare_user_id([]);
    setSearched_user([]);
    setShowUserInfo(false);
    onClose();
  };

  const toggleUserInfoVisibility = () => {
    setShowUserInfo(!showUserInfo);
  };

  const handlePressIcon = async (socialData: SocialItem) => {
    try {
      const url = await socialData.generateShareUrl();
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening URL:', error);
      Toast.show('Could not open app', Toast.SHORT);
    }
  };

  const RenderUsers: React.FC<RenderUsersProps> = React.memo(
    ({item, index}) => {
      const userId = item?.id;
      const idPresent = idPresentMap[userId] || false;

      const handleRadioPress = async () => {
        if (!share_user_id.includes(item.id)) {
          if (share_user_id.length <= 20) {
            setShare_user_id(prevIds => [...prevIds, item.id]);
            setIdPresentMap(prevMap => ({...prevMap, [userId]: true}));
          } else {
            Toast.show('You can select max of 20 person at a time', Toast.LONG);
          }
        } else {
          const filteredIds = share_user_id.filter(id => id !== item.id);
          setShare_user_id(filteredIds);
          setIdPresentMap(prevMap => ({...prevMap, [userId]: false}));
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

  const renderSocialApp = (socialApp: SocialItem) => (
    <TouchableOpacity
      style={styles.social_media_icon}
      key={socialApp.id}
      onPress={() => handlePressIcon(socialApp)}>
      <View>
        <Image source={socialApp.icons_name} style={styles.social_media_img} />
        <Text style={styles.social_media_text}>{socialApp.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
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
                placeholder="Search"
                value={textinput}
                onChangeText={text => {
                  handleSearch(text);
                  setShowUserInfo(true);
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  textinput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
  },
  users_list: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: width,
    height: height * 0.4,
  },
  follwers_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  users_left_view: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 3,
  },
  text_view: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 10,
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
  loader_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  IconContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '18%',
    paddingVertical: 15,
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
});

export default React.memo(CustomShareSheet);
