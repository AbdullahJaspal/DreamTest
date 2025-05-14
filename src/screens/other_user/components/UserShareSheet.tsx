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

import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../../store/hooks';

import * as userApi from '../../../apis/userApi';
import * as videoApi from '../../../apis/video.api';
import * as searchApi from '../../../apis/searchApi';
import {truncateText} from '../../../utils/truncateText';

import {RadioButton} from 'react-native-paper';
import Toast from 'react-native-simple-toast';

import ProfileImage from '../../../components/ProfileImage';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  setShareSheet,
  setShareContent,
} from '../../../store/slices/ui/indexSlice';

import {
  selectMyProfileData,
  selectShareContent,
} from '../../../store/selectors';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

interface UserShareSheetProps {
  show_share_model: boolean;
  setShow_share_model: any;
}

const UserShareSheet: React.FC<UserShareSheetProps> = ({
  show_share_model,
  setShow_share_model,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const my_data = useAppSelector(selectMyProfileData);
  const video_details = useAppSelector(selectShareContent);
  const [users, setUsers] = React.useState<any>([]);
  const [textinput, setTextinput] = React.useState<string>('');
  const [share_user_id, setShare_user_id] = useState([]);
  const [isInterested, setInterested] = useState(true);
  const [searched_user, setSearched_user] = useState([]);

  const socialApps = [
    {
      name: 'whatsapp',
      packageName: 'com.whatsapp',
      url: 'whatsapp://send?text=',
    },
    {
      name: 'facebook',
      packageName: 'com.facebook.katana',
      url: 'https://www.facebook.com',
    },
    {
      name: 'twitter',
      packageName: 'com.twitter.android',
      url: 'https://twitter.com',
    },
    {
      name: 'instagram',
      packageName: 'com.instagram.android',
      url: 'https://www.instagram.com',
    },
  ];

  const handleSearch = async e => {
    setTextinput(e);
    if (e.length > 2) {
      const result = await searchApi.searchOnlyUser(e);
      setSearched_user(result?.data);
    } else {
      Toast.show('Please Enter at least 3 characters to search', Toast.SHORT);
    }
  };

  const closeModal = () => {
    dispatch(setShareContent(''));
    setShare_user_id('');
    setSearched_user([]);
    dispatch(setShareSheet(false));
    setShow_share_model(false);
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

  const openApp = async (url: any) => {
    try {
      await Linking.openURL(url);
      closeModal();
    } catch (error: any) {
      console.error('Error while opening app:', error.message);
    }
  };

  const navigationHandler = () => {
    navigation.navigate('ShareReportScreen', {idVideo: idVideo});
  };

  const VideoNotInterestedHandler = () => {
    setInterested(false);
    showAlert(
      'Not Interested',
      'You have indicated that you are not interested in this video.',
    );
  };

  const VideoInterested = () => {
    if (isInterested) {
      showAlert(
        'Already Interested',
        'You have already indicated that you are interested in this video.',
      );
    } else {
      // User is indicating interest for the first time
      setInterested(true);
      showAlert('Interested', 'Thank you for showing interest');
    }
  };

  const showAlert = (title: string, message: string) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const RenderUsers = ({item, index}) => {
    const [idPresent, setIdPresent] = useState(
      share_user_id?.includes(item?.id),
    );

    const handleRadioPress = async () => {
      if (!share_user_id.includes(item.id)) {
        setShare_user_id(prevIds => [...prevIds, item.id]);
        setIdPresent(true);
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 10,
        }}>
        <View style={styles.users_left_view}>
          <ProfileImage uri={item?.profile_pic} onPress={handleProfileClick} />
          <View style={styles.text_view}>
            <Text style={styles.username_text}>
              {truncateText(item?.username, 5)}
            </Text>
            <Text style={styles.nickname_text}>{item?.nickname}</Text>
          </View>
        </View>

        <RadioButton.Item
          value={true}
          status={idPresent ? 'checked' : 'unchecked'}
          onPress={handleRadioPress}
        />
      </View>
    );
  };

  const renderSocialApp = (socialApp: any) => (
    <TouchableOpacity
      style={{width: '20%', height: '45%', marginTop: '2%'}}
      key={socialApp.name}
      onPress={() =>
        openApp(
          `${socialApp.url}${encodeURIComponent(
            'Check out this awesome app!',
          )} https://dreamlived.com/Index/MainScreen/Home/Followings/${idVideo}`,
        )
      }>
      <View>
        <Image
          source={getSocialAppImageSource(socialApp.name)}
          style={{
            width: 45,
            height: 45,
            alignSelf: 'center',
            marginBottom: 5,
          }}
        />
        <Text
          style={[
            styles.iconText,
            {
              color: '#000',
              alignSelf: 'center',
            },
          ]}>
          {socialApp.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getSocialAppImageSource = (appName: any) => {
    switch (appName) {
      case 'whatsapp':
        return icons.whatsapp;
      case 'facebook':
        return icons.facebook;
      case 'twitter':
        return icons.xLogo;
      case 'instagram':
        return icons.instagram;
      default:
        return DEFAULT_ICON;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show_share_model}
      onRequestClose={closeModal}
      onShow={getfollowers}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <ProfileImage uri={my_data?.profile_pic} />
          <View style={styles.search_view}>
            <Feather name="search" size={20} />
            <TextInput
              placeholder="Search"
              value={textinput}
              onChangeText={handleSearch}
              style={styles.textinput}
            />
          </View>
        </View>

        <View style={styles.users_list}>
          {users?.length > 0 ? (
            <FlatList
              data={searched_user?.length ? searched_user : users}
              keyExtractor={item => item?.id}
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

        <View style={styles.IconContainer}>
          {socialApps.map(socialApp => renderSocialApp(socialApp))}
        </View>

        <View style={{flexDirection: 'row', marginLeft: 3}}>
          <View style={{width: '20%'}}>
            <TouchableOpacity
              style={styles.iconback}
              onPress={navigationHandler}>
              <Ionicons name="flag" size={20} />
            </TouchableOpacity>

            <Text style={styles.txt}>Report</Text>
          </View>

          <View style={{width: '20%'}}>
            <TouchableOpacity
              style={styles.iconback}
              onPress={VideoNotInterestedHandler}
              disabled={!isInterested}>
              <FontAwesome5 name="heart-broken" size={20} />
            </TouchableOpacity>

            <Text style={styles.txt}>Not</Text>

            <Text style={styles.txt}>Interested</Text>
          </View>

          <View style={{width: '20%'}}>
            <TouchableOpacity style={styles.iconback} onPress={VideoInterested}>
              <Ionicons name="heart" size={20} />
            </TouchableOpacity>

            <Text style={styles.txt}>Interested</Text>
          </View>

          <View style={{width: '20%'}}>
            <TouchableOpacity
              style={styles.iconback}
              onPress={navigationHandler}>
              <MaterialCommunityIcons name="arrow-collapse-down" size={20} />
            </TouchableOpacity>

            <Text style={styles.txt}>Download</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserShareSheet;

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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
});
