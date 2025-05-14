import {StyleSheet, View, Image, Dimensions, Modal, Alert} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import Screenone from './Screenone';
import Screentwo from './Screentwo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {follow} from '../../apis/userApi';
import PremiumModal from './components/PremiumModal';
import MessagePriceList from './components/MessagePriceList';
import {Portal} from 'react-native-paper';
import * as userApi from '../../apis/userApi';
import UserPicturePost from './components/UserPicturePost';
import WheelLuckMainModel from '../live_stream/luckyWheel/WheelLuckMainModel';
import UserShareSheet from './components/UserShareSheet';
import ShareProfile from './components/ShareProfile';
import {
  UserProfileMainPageScreenNavigationProps,
  UserProfileMainPageScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {UserProfile} from '../../types/UserProfileData';
import * as videoApi from '../../apis/video.api';
import FastImage from '@d11/react-native-fast-image';
import {CountryData, User, VideoData} from './types/VideoData';
import * as likeApi from '../../apis/like.api';
import * as shareApi from '../../apis/share';
import Header from './components/Header';
import {selectMyProfileData} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';
import Screenthree from './Screenthree';
import {PicturePost} from '../picture_feed/types/picturePost';
import {use} from 'i18next';
import {gifs} from '../../assets/gifs';
import {icons} from '../../assets/icons';

const {width, height} = Dimensions.get('screen');

const UserProfileMainPage: React.FC = () => {
  const route = useRoute<UserProfileMainPageScreenRouteProps>();
  const navigation = useNavigation<UserProfileMainPageScreenNavigationProps>();
  const [user_id, setUser_id] = useState<number>(route?.params?.user_id ?? -1);
  const share_profile_token = route?.params?.share_profile_token;
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const [user_data, setUser_data] = useState<UserProfile>();
  const [country_data, setCountry_data] = useState<CountryData>();
  const [followers, setFollowers] = useState<User[]>();
  const [following, setFollowing] = useState<User[]>();
  const [uploaded_video, setUploaded_video] = useState<VideoData[]>();
  const [uploaded_feed, setUploaded_feed] = useState<PicturePost[]>();
  const [liked_video, setLiked_video] = useState<VideoData[]>();

  const isIdPresent = useMemo(() => {
    return followers?.some(item => item.id === my_data?.id) ?? false;
  }, [followers, my_data?.id]);

  const [isFollowing, setIsFollowing] = useState<boolean>(isIdPresent);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showMessageList, setShowMessageList] = useState(false);
  const [show_picture_post, setShow_picture_post] = useState(false);
  const [luckyWheel, setLuckyWheel] = useState(false);
  const [show_share_model, setShow_share_model] = useState(false);
  const [total_like, setTotal_like] = useState<number>(0);

  useEffect(() => {
    if (user_id !== route.params.user_id && route.params.user_id) {
      setUser_id(route.params.user_id);
    }
  }, [route.params.user_id]);

  const handleProfileShareToken = useCallback(async () => {
    if (share_profile_token) {
      const result = await shareApi.getUserIdFromUserShareToken(
        share_profile_token,
      );
      setUser_id(result?.payload?.shared_user_id);
      handleGettingAllData();
    }
  }, [share_profile_token]);

  useEffect(() => {
    handleProfileShareToken();
  }, [handleProfileShareToken]);

  /**
   * set following
   */
  useEffect(() => {
    setIsFollowing(isIdPresent);
  }, [isIdPresent]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const addProfileVisit = useCallback(async () => {
    try {
      const data = {
        visitor_user_id: my_data?.id,
        visited_user_id: user_id,
      };
      await userApi.addProfileVisit(data, my_data?.auth_token);
    } catch (error) {
      console.log('Error generated while adding profile view', error);
    }
  }, [user_id]);

  /**
   * getting user info
   */
  const getUserShortInfo = useCallback(async () => {
    try {
      const data = await userApi.getShortUserInfo(route.params.user_id);
      setUser_data(data?.payload);
    } catch (error) {
      console.log('error', error);
    }
  }, [user_id, route.params.user_id]);

  /**
   * Get user country details
   */
  const getUserCountryDetails = useCallback(async () => {
    try {
      const result = await userApi.getUserCountryByUserID(route.params.user_id);
      setCountry_data(result.payload);
    } catch (error) {
      console.log('error', error);
    }
  }, [user_id, route.params.user_id]);

  /**
   * Get Followers
   */
  const getAllFollowers = useCallback(async () => {
    try {
      const result = await userApi.getFollowersDetails(route.params.user_id);
      setFollowers(result?.Followers);
    } catch (error) {
      console.log('Error generated while geting followers', error);
    }
  }, [user_id, route.params.user_id]);

  /**
   * Get Followings
   */
  const getAllFollowings = useCallback(async () => {
    try {
      const result = await userApi.getFollowingsDetails(user_id);
      setFollowing(result?.Following);
    } catch (error) {
      console.log('Error generated while getting followings', error);
    }
  }, [user_id]);

  /**
   * Get user uploaded videos
   */
  const getUserUplodedVideos = useCallback(async () => {
    try {
      const videos = await videoApi.getUserUploadedVideos(
        my_data?.auth_token,
        user_id,
      );
      setUploaded_video(videos?.payload);
    } catch (error) {
      console.log('Error: generated while getting uploaded videos', error);
    }
  }, [user_id]);

  const getUserUploadedFeeds = useCallback(async () => {
    try {
      const feeds = await videoApi.getUserUploadedFeeds(
        my_data.auth_token,
        user_id,
      );
      console.log('feeds', feeds);
      // if (feeds?.posts) {
      //   setUploaded_feed(feeds.posts);
      // }
    } catch (error) {
      console.error('Error while getting uploaded feeds:', error);
    }
  }, [user_id, my_data?.auth_token]);

  /**
   * Get user liked video
   */
  const getUserLikedVideos = useCallback(async () => {
    try {
      const videos = await videoApi.getUserLikedVideos(
        my_data?.auth_token,
        user_id,
      );
      setLiked_video(videos?.payload);
    } catch (error) {
      console.log('Error: generated while getting liked videos', error);
    }
  }, [user_id]);

  /**
   * Get no of likes
   */
  const getUserAllLikes = useCallback(async () => {
    try {
      const result = await likeApi.getUserAllLike(user_id);
      setTotal_like(result?.no_of_likes);
    } catch (error) {
      console.log('Error: generated while getting no of likes', error);
    }
  }, [user_id]);

  const handleGettingAllData = useCallback(() => {
    getUserLikedVideos();
    getUserUplodedVideos();
    // getUserUploadedFeeds();
    getAllFollowings();
    getAllFollowers();
    getUserCountryDetails();
    getUserShortInfo();
    getUserAllLikes();
    addProfileVisit();
  }, [
    getUserLikedVideos,
    getUserUplodedVideos,
    // getUserUploadedFeeds,
    getAllFollowings,
    getAllFollowers,
    getUserCountryDetails,
    getUserShortInfo,
    getUserAllLikes,
    addProfileVisit,
    user_id,
  ]);

  /**
   * handle unfollow by long pressing
   */
  const handleLongPress = useCallback(() => {
    Alert.alert(
      'Confirm Unfollow',
      'Are you sure you want to unfollow this user?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Unfollow cancelled'),
          style: 'cancel',
        },
        {
          text: 'Unfollow',
          onPress: async () => {
            try {
              const data = {receiver_id: user_id};
              setIsFollowing(false);
              await userApi.unfollow(data, my_data?.auth_token);
              console.log('Successfully unfollowed');
            } catch (error) {
              console.error('Error unfollowing user:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  }, [user_id, my_data?.auth_token]);

  /**
   * handle follow press
   */
  const followThisGuy = useCallback(async () => {
    const data = {
      receiver_id: user_id,
      way_of_following: 'user_profile',
    };
    await follow(data, my_data?.auth_token);
  }, [user_id, my_data]);

  // function for handleing the button of message and follow
  const handleMessageSend = async () => {
    if (isFollowing) {
      const isUserFollowed = following?.some(item => item.id === my_data?.id);

      if (isUserFollowed) {
        navigation.navigate('ChatScreen', {user_data});
      } else {
        setModalVisible(true);
      }
    } else {
      try {
        setIsFollowing(true);
        await followThisGuy();
      } catch (error) {
        console.error('Error while following the user:', error);
        setIsFollowing(false);
      }
    }
  };

  const premiumHandler = () => {
    setModalVisible(false);
    setShowMessageList(true);
  };

  const handleWheelPress = () => {
    setLuckyWheel(true);
  };

  const header1 = () => {
    return (
      <Header
        user_data={user_data}
        country_data={country_data}
        user_id={user_id}
        handleLongPress={handleLongPress}
        handleWheelPress={handleWheelPress}
        following={following}
        followers={followers}
        total_like={total_like}
        handleMessageSend={handleMessageSend}
        isFollowing={isFollowing}
      />
    );
  };

  return (
    <View onLayout={handleGettingAllData} style={styles.main_container}>
      {!user_data && (
        <View style={styles.loader_container}>
          <FastImage source={gifs.tiktokLoader} style={styles.loader} />
        </View>
      )}

      <Tabs.Container renderHeader={header1} revealHeaderOnScroll={true}>
        <Tabs.Tab
          label={() => (
            <Image source={icons.stack} style={{width: 20, height: 20}} />
          )}
          name={'stackA'}>
          <Screenone data={uploaded_video} />
        </Tabs.Tab>

        {/* <Tabs.Tab
          label={() => (
            <Image source={icons.swap} style={{width: 25, height: 25}} />
          )}
          name={'stackC'}>
          <Screenthree data={uploaded_feed} />
        </Tabs.Tab> */}

        <Tabs.Tab
          label={() => (
            <Image source={icons.love} style={{width: 25, height: 25}} />
          )}
          name={'stackB'}>
          <Screentwo data={liked_video} />
        </Tabs.Tab>
      </Tabs.Container>

      <Portal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <PremiumModal
            setModalVisible={setModalVisible}
            premiumHandler={premiumHandler}
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showMessageList}
          onRequestClose={() => {
            setShowMessageList(false);
          }}>
          <MessagePriceList
            setShowMessageList={setShowMessageList}
            user_data={user_data}
          />
        </Modal>
      </Portal>

      <UserPicturePost
        visible={show_picture_post}
        setShow_picture_post={setShow_picture_post}
        user_data={user_data}
      />

      <WheelLuckMainModel
        setLuckyWheel={setLuckyWheel}
        luckyWheel={luckyWheel}
        user_id={user_data?.id ?? -1}
      />

      <UserShareSheet
        show_share_model={show_share_model}
        setShow_share_model={setShow_share_model}
      />
      <ShareProfile />
    </View>
  );
};

export default React.memo(UserProfileMainPage);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader_container: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 40,
    height: 40,
  },
});
