import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from '@d11/react-native-fast-image';
import Clipboard from '@react-native-clipboard/clipboard';

import {setBottomSheetSettingProfile} from '../../store/slices/ui/indexSlice';
import {formatNumber} from '../../utils/formatNumber';
import {ProfileScreenNavigationProps} from '../../types/screenNavigationAndRoute';

import Body from '../../components/Body/Body.components';
import ProfileImage from '../../components/ProfileImage';
import Badge from '../../components/Badge';
import CustomPageLoader from '../../components/CustomPageLoader';
import CircleProgressBar from '../../components/CircleProgressBar';
import BottomSettingProfile from '../../components/bottomSheets/BottomSettingProfile';
import BottomSheetLogout from '../../components/bottomSheets/BottomSheetLogout';

import PicPost from './profile/screen/PicPost';
import LikedPost from './profile/screen/LikedPost';
import FavouritePost from './profile/screen/FavouritePost';
import PrivatePost from './profile/screen/PrivatePost';
import VideoPost from './profile/screen/VideoPost';
import DraftVideosScreen from './profile/screen/DraftVideoScreen';

import * as VideoApi from '../../apis/video.api';
import * as userApi from '../../apis/userApi';
import * as likeApi from '../../apis/like.api';
import * as videoApi from '../../apis/video.api';

import WheelLuckMainModel from '../live_stream/luckyWheel/WheelLuckMainModel';

import {VideoData} from '../other_user/types/VideoData';
import {
  selectMyProfileData,
  selectPostProgressValue,
  selectShowUploadingInfo,
} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';
import {icons} from '../../assets/icons';
import {Tabs} from 'react-native-collapsible-tab-view';

const {width} = Dimensions.get('screen');

const colors = [
  'rgba(255, 255, 255, 0.1)',
  'rgba(255, 255, 255, 0.15)',
  'rgba(255, 255, 255, 0.2)',
  'rgba(255, 255, 255, 0.25)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(255, 255, 255, 0.35)',
  'rgba(255, 255, 255, 0.4)',
  'rgba(255, 255, 255, 0.45)',
  'rgba(255, 255, 255, 0.5)',
  'rgba(255, 255, 255, 0.55)',
  'rgba(255, 255, 255, 0.6)',
  'rgba(255, 255, 255, 0.65)',
  'rgba(255, 255, 255, 0.7)',
  'rgba(255, 255, 255, 0.75)',
  'rgba(255, 255, 255, 0.8)',
  'rgba(255, 255, 255, 0.85)',
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 255, 255, 0.95)',
  'rgba(255, 255, 255, 1)',
];

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProps>();
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const show_uploading_info = useAppSelector(selectShowUploadingInfo);
  const video_uploading_progress = useAppSelector(selectPostProgressValue);
  const my_data = useAppSelector(selectMyProfileData);
  const [luckyWheel, setLuckyWheel] = useState(false);
  const [show_draft, setShow_draft] = useState(false);
  const [loading, setIsLoading] = useState<boolean>(true);
  const [liked_videos, setLiked_videos] = useState<VideoData[]>();
  const [private_videos, setPrivate_videos] = useState<VideoData[]>();
  const [uploaded_videos, setUploaded_videos] = useState<VideoData[]>();
  const [draft_videos, setDraft_videos] = useState<VideoData[]>();
  const [followings, setFollowings] = useState<number>(0);
  const [followers, setFollowers] = useState<number>(0);
  const [picture_post, setPicture_post] = useState();
  const [total_like, setTotal_like] = useState<number>(0);

  const getAllFollowers = useCallback(async () => {
    try {
      const result = await userApi.getFollowersDetails(my_data?.id);
      setFollowers(result?.Followers?.length);
    } catch (error) {
      console.log('Error generated while geting followers', error);
    }
  }, [my_data]);

  const getAllFollowings = useCallback(async () => {
    try {
      const result = await userApi.getFollowingsDetails(my_data?.id);
      setFollowings(result?.Following?.length);
    } catch (error) {
      console.log('Error generated while getting followings', error);
    }
  }, [my_data]);

  /**
   * Get user uploaded videos
   */
  const getUserUplodedVideos = useCallback(async () => {
    try {
      const videos = await videoApi.getUserUploadedVideos(
        my_data?.auth_token,
        my_data?.id,
      );
      setUploaded_videos(videos?.payload);
    } catch (error) {
      console.log('Error: generated while getting uploaded videos', error);
    }
  }, [my_data]);

  /**
   * Get user liked video
   */
  const getUserLikedVideos = useCallback(async () => {
    try {
      const videos = await videoApi.getUserLikedVideos(
        my_data?.auth_token,
        my_data?.id,
      );
      setLiked_videos(videos?.payload);
    } catch (error) {
      console.log('Error: generated while getting liked videos', error);
    } finally {
      setIsLoading(false);
    }
  }, [my_data]);

  /**
   * Get private videos
   */
  const getUserPrivateVideos = useCallback(async () => {
    try {
      const videos = await videoApi.getUserPrivateVideos(my_data?.auth_token);
      setPrivate_videos(videos?.payload);
    } catch (error) {
      console.log('Error: generated while getting private videos', error);
    }
  }, [my_data]);

  /**
   * Get drafted videos
   */
  const getUserDraftedVideos = useCallback(async () => {
    try {
      const draft_videos = await VideoApi.getAllDraftVideoOfUser(
        my_data?.auth_token,
      );
      setDraft_videos(draft_videos?.payload);
    } catch (error) {
      console.log('Error: generated while getting drafted videos', error);
    }
  }, [my_data]);

  /**
   * Get picture post
   */
  const getUserAllPicturePost = useCallback(async () => {
    try {
      const picture_post = await VideoApi.getAllPicturePost(my_data?.id);
      setPicture_post(picture_post?.payload);
    } catch (error) {
      console.log('Error: generated while getting picture post', error);
    }
  }, []);

  /**
   * Get no of likes
   */
  const getUserAllLikes = useCallback(async () => {
    try {
      const result = await likeApi.getUserAllLike(my_data?.id);
      setTotal_like(result?.no_of_likes);
    } catch (error) {
      console.log('Error: generated while getting no of likes', error);
    }
  }, [my_data]);

  /**
   * All api call once
   */
  const callAllApi = useCallback(() => {
    getAllFollowers();
    getAllFollowings();
    getUserUplodedVideos();
    getUserLikedVideos();
    getUserPrivateVideos();
    getUserDraftedVideos();
    getUserAllPicturePost();
    getUserAllLikes();
  }, [
    getAllFollowers,
    getAllFollowings,
    getUserUplodedVideos,
    getUserLikedVideos,
    getUserPrivateVideos,
    getUserDraftedVideos,
    getUserAllPicturePost,
    getUserAllLikes,
  ]);

  const handleProfilePress = useCallback((profile_pic: string | undefined) => {
    navigation.navigate('ProfileBigPicScreen', {profile_pic: profile_pic});
  }, []);

  const handleClickMoreOption = useCallback(() => {
    dispatch(setBottomSheetSettingProfile(true));
  }, [dispatch]);

  const copyToClipboard = (content: any) => {
    Clipboard.setString(content);
  };

  const handleVideoPress = () => {
    console.log('video prsessed');
  };

  const handleLuckyWheelPress = () => {
    setLuckyWheel(true);
  };

  const handleFollowingPress = useCallback(() => {
    navigation.navigate('Followings', {user_id: my_data?.id});
  }, [my_data]);

  const handleFollowersPress = useCallback(() => {
    navigation.navigate('Followers', {user_id: my_data?.id});
  }, [my_data]);

  const handleLikeHistoryPress = useCallback(() => {
    navigation.navigate('LikesHistory', {user_id: my_data?.id});
  }, [my_data]);

  const handleEditProfilePress = useCallback(() => {
    navigation.navigate('EditProfile');
  }, []);

  const LikedPostLabel = React.memo(() => (
    <FastImage
      source={icons.love}
      style={styles.icon_size}
      resizeMode={FastImage.resizeMode.contain}
    />
  ));

  const FavouritePostLebel = React.memo(() => (
    <FastImage
      source={icons.bookmark}
      style={styles.icon_size}
      resizeMode={FastImage.resizeMode.contain}
    />
  ));

  const PicPostLabal = React.memo(() => (
    <FastImage
      source={icons.swap}
      style={styles.icon_size}
      resizeMode={FastImage.resizeMode.contain}
    />
  ));

  const PrivatePostLabel = React.memo(() => (
    <FastImage
      source={icons.lock}
      style={styles.icon_size}
      resizeMode={FastImage.resizeMode.contain}
    />
  ));

  const VideoPostLabel = React.memo(() => (
    <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
      <FastImage source={icons.stack} style={styles.icon_size} />
      <TouchableOpacity
        onPress={() => {
          setShow_draft(p => !p);
        }}>
        <AntDesign
          style={{paddingLeft: 5, paddingRight: 10, paddingTop: 10}}
          name={show_draft ? 'down' : 'up'}
          size={10}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  ));

  const renderVideoContent = useCallback(() => {
    return show_draft ? (
      <DraftVideosScreen data={draft_videos} />
    ) : (
      <VideoPost data={uploaded_videos} />
    );
  }, [show_draft, draft_videos, uploaded_videos]);

  const RenderProfile = () => {
    return (
      <Body applyPadding={false} style={styles.mainContainer}>
        <ImageBackground
          source={
            my_data?.profile_pic
              ? {uri: my_data?.profile_pic}
              : {uri: 'https://'}
          }
          resizeMode="cover"
          style={{width: width, height: 250}}>
          <LinearGradient style={{flex: 1}} colors={colors}>
            {show_uploading_info && (
              <View style={styles.progress_bar}>
                <CircleProgressBar
                  strokeWidth={3}
                  progress={video_uploading_progress}
                  radius={20}
                />
                <Text style={styles.uplaoding_txt}>
                  {t('Uploading video')}...
                </Text>
              </View>
            )}

            <Body applyPadding={false} style={styles.blurContainer}>
              {/* top container */}
              <Body applyPadding={false} style={styles.topContainer}>
                <Body applyPadding={false} style={styles.iconContainer}>
                  <FastImage
                    source={icons.diamond}
                    style={{width: 30, height: 30}}
                  />
                  <Text style={styles.text}>{my_data?.wallet}</Text>
                </Body>

                <TouchableOpacity onPress={handleLuckyWheelPress}>
                  <Body applyPadding={false} style={styles.iconContainer}>
                    <FastImage
                      source={icons.luckyWheel}
                      style={{width: 20, height: 20}}
                    />
                    <Text style={styles.text}>{t('Lucky Wheel')}</Text>
                  </Body>
                </TouchableOpacity>

                <Body applyPadding={false} style={styles.iconContainer}>
                  <TouchableOpacity onPress={handleClickMoreOption}>
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={30}
                      color={'#020202'}
                    />
                  </TouchableOpacity>
                </Body>
              </Body>

              {/* middle container  */}
              <Body applyPadding={false} style={styles.middleContainer}>
                <Body applyPadding={false} style={styles.profileImageContainer}>
                  <ProfileImage
                    onPress={() => {
                      handleProfilePress(my_data?.profile_pic);
                    }}
                    uri={my_data?.profile_pic}
                  />

                  <Text
                    onLongPress={() => {
                      copyToClipboard(my_data?.username);
                    }}
                    style={styles.username_txt}>
                    @{my_data?.username}
                  </Text>
                  <View style={styles.badge_view}>
                    <Text
                      onLongPress={() => {
                        copyToClipboard(my_data?.nickname);
                      }}
                      style={styles.nickname_TXT}>
                      {my_data?.nickname}
                    </Text>
                    <Badge user_data={my_data} />
                  </View>
                </Body>
              </Body>

              {/* Bottom container */}

              <Body applyPadding={false} style={styles.bottomContainer}>
                <Pressable
                  onPress={handleFollowingPress}
                  style={styles.followSection}>
                  <Text style={styles.number_txt}>
                    {formatNumber(followings)}
                  </Text>
                  <Text style={styles.text}>{t('Followings')}</Text>
                </Pressable>

                <Pressable
                  onPress={handleFollowersPress}
                  style={styles.followSection}>
                  <Text style={styles.number_txt}>
                    {formatNumber(followers)}
                  </Text>
                  <Text style={styles.text}>{t('Followers')}</Text>
                </Pressable>

                <Pressable
                  onPress={handleLikeHistoryPress}
                  style={styles.followSection}>
                  <Text style={styles.number_txt}>
                    {formatNumber(total_like)}
                  </Text>
                  <Text style={styles.text}>{t('Likes')}</Text>
                </Pressable>
              </Body>
            </Body>
          </LinearGradient>
        </ImageBackground>

        {/* Edit profile section */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleEditProfilePress}>
          <Text style={styles.textButton}>{t('EditProfile')}</Text>
        </TouchableOpacity>

        {/* showing profile information */}
        <Body applyPadding={false} style={styles.aboutMainContainer}>
          {my_data?.bio && (
            <Text
              style={styles.text}
              onLongPress={() => {
                copyToClipboard(t('Description'));
              }}>
              {my_data?.bio}
            </Text>
          )}
          {my_data?.website && (
            <Text style={styles.text}>{my_data?.website}</Text>
          )}
          <Body applyPadding={false} style={styles.aboutContainer}>
            <TouchableOpacity>
              <FastImage
                style={{width: 20, height: 20}}
                source={icons.webPage}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <FastImage
                style={{width: 20, height: 20, marginTop: 4}}
                source={icons.qnaColor}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleVideoPress}>
              <FastImage
                style={{width: 20, height: 20}}
                source={icons.videoReel}
              />
            </TouchableOpacity>
          </Body>
        </Body>
      </Body>
    );
  };

  return (
    <>
      <View style={styles.main_container} onLayout={callAllApi}>
        <Tabs.Container
          revealHeaderOnScroll={true}
          renderHeader={RenderProfile}>
          <Tabs.Tab label={() => <LikedPostLabel />} name={'like post'}>
            <LikedPost data={liked_videos} />
          </Tabs.Tab>

          <Tabs.Tab
            label={() => <FavouritePostLebel />}
            name={'favourite post'}>
            <FavouritePost />
          </Tabs.Tab>

          <Tabs.Tab label={() => <PicPostLabal />} name={'pic post'}>
            <PicPost data={picture_post} />
          </Tabs.Tab>

          <Tabs.Tab label={() => <PrivatePostLabel />} name={'private post'}>
            <PrivatePost data={private_videos} />
          </Tabs.Tab>

          <Tabs.Tab label={() => <VideoPostLabel />} name={'video post'}>
            {renderVideoContent()}
          </Tabs.Tab>
        </Tabs.Container>
        <WheelLuckMainModel
          setLuckyWheel={setLuckyWheel}
          luckyWheel={luckyWheel}
          user_id={my_data?.id}
        />
        <CustomPageLoader isLoading={loading} />
      </View>
      <BottomSettingProfile />
      <BottomSheetLogout />
    </>
  );
};

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 2,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  middleContainer: {
    position: 'absolute',
    top: 60,
    width: width,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 5,
  },
  profileImageContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    top: 170,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: width,
    justifyContent: 'space-evenly',
    paddingHorizontal: width * 0.1,
  },
  followSection: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blurContainer: {
    width: width,
    height: 220,
    backgroundColor: 'transparent',
  },
  mainContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF2600',
    paddingVertical: 8,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginTop: 10,
  },
  textButton: {
    color: '#FFFFFF',
    fontSize: 19,
  },
  aboutMainContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  aboutContainer: {
    flexDirection: 'row',
    width: width * 0.25,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon_size: {
    width: 20,
    height: 20,
  },
  text: {
    color: '#020202',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  number_txt: {
    color: '#020202',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username_txt: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 10,
  },
  nickname_TXT: {
    color: '#020202',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  progress_bar: {
    width: 60,
    height: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    zIndex: 1,
    left: 5,
    top: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uplaoding_txt: {
    fontSize: 9,
    color: 'orange',
    fontWeight: '600',
    position: 'absolute',
    bottom: 5,
    textAlign: 'center',
  },
  main_container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  badge_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
