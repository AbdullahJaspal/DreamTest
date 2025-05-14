import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {CButton} from '../../../components';
import {formatNumber} from '../../../utils/formatNumber';
import Badge from '../../../components/Badge';
import ProfileImage from '../../../components/ProfileImage';
import StarIcon from '../StarIcon';
import {UserProfile} from '../../../types/UserProfileData';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CountryData, User} from '../types/VideoData';
import {UserProfileMainPageScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  setProfileShareContent,
  showProfileShareSheet,
} from '../../../store/slices/ui/indexSlice';
import {useTranslation} from 'react-i18next';
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
import {I18nManager} from 'react-native';
import {icons} from '../../../assets/icons';

interface HeaderProps {
  user_data?: UserProfile;
  country_data?: CountryData;
  user_id: number;
  handleLongPress: () => void;
  handleWheelPress: () => void;
  following?: User[];
  followers?: User[];
  total_like: number;
  handleMessageSend: () => void;
  isFollowing: boolean;
}

const {width, height} = Dimensions.get('screen');

const Header: React.FC<HeaderProps> = ({
  user_data,
  country_data,
  user_id,
  handleLongPress,
  handleWheelPress,
  followers,
  following,
  total_like,
  handleMessageSend,
  isFollowing,
}) => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation<UserProfileMainPageScreenNavigationProps>();
  const dispatch = useDispatch();
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);

  const handleShareClick = async () => {
    dispatch(showProfileShareSheet(true));
    dispatch(setProfileShareContent(user_data));
  };

  const handleNotificationClick = () => {
    setNotificationEnabled(p => !p);
  };

  const handleYouTubeClick = () => {
    Linking.openURL(`https://www.youtube.com/@${user_data?.you_tube}`);
  };

  const handleFacebookClick = () => {
    Linking.openURL(`https://www.facebook.com/${user_data?.facebook}`);
  };

  const handleInstagramClick = () => {
    Linking.openURL(`https://www.instagram.com/${user_data?.instagram}`);
  };

  const handleTwitterClick = () => {
    Linking.openURL(`https://twitter.com/${user_data?.twitter}`);
  };

  const handleFollowingPress = useCallback(() => {
    navigation.navigate('Followings', {user_id: user_id});
  }, [user_id]);

  const handleFollowersPress = useCallback(() => {
    navigation.navigate('Followers', {user_id: user_id});
  }, [user_id]);

  const handleLikeHistoryPress = useCallback(() => {
    navigation.navigate('LikesHistory', {user_id: user_id});
  }, [user_id]);

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Index');
    }
  }, [navigation]);

  const handleProfilePress = useCallback(
    (profile_pic: string | undefined) => {
      navigation.navigate('ProfileBigPicScreen', {profile_pic: profile_pic});
    },
    [user_data?.profile_pic],
  );

  /**
   * calculate no of star
   */
  const {no_of_star, show_yellow_icon} = useMemo(() => {
    const coin = user_data?.wallet;

    if (!coin) return {no_of_star: 0, show_yellow_icon: false};

    if (coin < 200000) return {no_of_star: 0, show_yellow_icon: false};
    if (coin >= 200000 && coin < 400000)
      return {no_of_star: 1, show_yellow_icon: false};
    if (coin >= 400000 && coin < 600000)
      return {no_of_star: 2, show_yellow_icon: false};
    if (coin >= 600000 && coin < 800000)
      return {no_of_star: 3, show_yellow_icon: false};
    if (coin >= 800000 && coin < 1000000)
      return {no_of_star: 4, show_yellow_icon: false};
    if (coin >= 1000000 && coin < 2000000)
      return {no_of_star: 5, show_yellow_icon: false};
    return {no_of_star: 5, show_yellow_icon: true};
  }, [user_data]);

  return (
    <ImageBackground
      source={
        user_data?.profile_pic
          ? {uri: user_data?.profile_pic}
          : {uri: 'https://'}
      }>
      <LinearGradient style={{flex: 1}} colors={colors}>
        <View style={styles.container}>
          <View style={styles.topbar}>
            <View style={styles.topbar_wraper}>
              <TouchableOpacity
                style={{position: 'absolute', left: 15}}
                onPress={handleGoBack}>
                <AntDesign
                  // name="arrowleft"
                  name={I18nManager.isRTL ? 'arrowright' : 'arrowleft'} // Only changes the icon
                  size={25}
                  color={'#020202'}
                />
              </TouchableOpacity>

              {!country_data?.hide_location_in_profile && (
                <View style={styles.country_view}>
                  <Image
                    style={styles.country_flag}
                    source={{uri: country_data?.flagurl}}
                  />
                  <Text style={styles.country_name}>
                    {country_data?.country_name}
                  </Text>
                </View>
              )}

              <Text style={styles.top_text}>{user_data?.nickname}</Text>
              <View style={styles.header_left_view}>
                <TouchableOpacity onPress={handleWheelPress}>
                  <Image
                    source={icons.luckyWheel}
                    style={{width: 25, height: 25}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNotificationClick}>
                  <Image
                    source={
                      notificationEnabled
                        ? icons.notificationOff
                        : icons.notificationOn
                    }
                    style={{width: 25, height: 25}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShareClick}>
                  <Image
                    source={icons.shareOutline}
                    style={{width: 25, height: 25}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.profilesection}>
              <StarIcon
                no_of_star={no_of_star}
                show_yellow_icon={show_yellow_icon}
              />
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ProfileImage
                  onPress={() => {
                    handleProfilePress(user_data?.profile_pic);
                  }}
                  uri={user_data?.profile_pic}
                />
                <View style={styles.username_view}>
                  <Text style={styles.username_txt}>
                    @{user_data?.username}
                  </Text>
                  <Badge user_data={user_data} />
                </View>
              </View>
            </View>
          </View>

          {/* Follow Details */}
          <View style={styles.follow_details}>
            {/* Following Details */}
            <Pressable
              onPress={handleFollowingPress}
              style={styles.follwer_wraper}>
              <Text style={styles.follwertext}>
                {formatNumber(following?.length || 0)}
              </Text>
              <Text style={styles.text}>{t('Followings')}</Text>
            </Pressable>
            {/* Followers Details */}
            <Pressable
              onPress={handleFollowersPress}
              style={styles.follwer_wraper}>
              <Text style={styles.follwertext}>
                {formatNumber(followers?.length || 0)}
              </Text>
              <Text style={styles.text}>{t('Followers')}</Text>
            </Pressable>

            {/* Like Details */}
            <Pressable
              onPress={handleLikeHistoryPress}
              style={styles.follwer_wraper}>
              <Text style={styles.follwertext}>{formatNumber(total_like)}</Text>
              <Text style={styles.text}>{t('Likes')}</Text>
            </Pressable>
          </View>

          <View style={styles.bio_view}>
            {user_data?.bio && (
              <Text style={styles.user_bio_txt}>{user_data?.bio}</Text>
            )}
            {user_data?.website && (
              <Text style={styles.website_txt}>{user_data?.website}</Text>
            )}
          </View>
          <View style={styles.three_button_view}>
            <TouchableOpacity>
              <Image
                source={icons.webPage}
                style={{width: 20, height: 20, marginRight: 10}}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                style={{width: 20, height: 20, marginTop: 4}}
                source={icons.qnaColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              //   onPress={() => {
              //     setShow_picture_post(true);
              //   }}
              style={{marginLeft: 10}}>
              <Image
                source={icons.videoReel}
                style={{width: 20, height: 20, marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.social_wraper}>
          <View style={styles.message_container}>
            <View style={styles.msgbutton}>
              <CButton
                lable={isFollowing ? t('Message') : t('Follow')}
                backgroundColor={isFollowing ? 'grey' : 'red'}
                onPress={handleMessageSend}
                onLongPress={handleLongPress}
              />
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={handleYouTubeClick}>
                <Image source={icons.youtube} style={styles.you_tube_icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleFacebookClick}>
                <Image source={icons.facebook} style={styles.you_tube_icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleInstagramClick}>
                <Image source={icons.instagram} style={styles.you_tube_icon} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleTwitterClick}>
                <Image source={icons.xLogo} style={styles.twitter_icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    paddingVertical: 15,
  },
  topbar: {
    width: width,
    top: 0,
  },
  topbar_wraper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },
  top_text: {
    fontWeight: '600',
    fontSize: 16,
    color: '#020202',
  },
  profilesection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  follwer_wraper: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  follwertext: {
    color: '#020202',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  social_wraper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 25,
    alignItems: 'center',
  },
  msgbutton: {
    width: '47%',
    marginLeft: 15,
  },
  follow_details: {
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  message_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  you_tube_icon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    marginRight: 8,
  },
  text: {
    color: '#020202',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  header_left_view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    justifyContent: 'space-between',
    position: 'absolute',
    right: 5,
  },
  user_bio_txt: {
    fontSize: 16,
    color: '#020202',
    textAlign: 'center',
    width: width * 0.6,
  },
  website_txt: {
    fontSize: 16,
    color: '#020202',
    width: width * 0.6,
  },
  country_view: {
    position: 'absolute',
    zIndex: 1000,
    left: 60,
    top: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  country_name: {
    color: '#000',
    fontWeight: '600',
    textShadowColor: '#fff',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
    elevation: 1,
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  country_flag: {
    width: 18,
    height: 18,
  },
  bio_view: {
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  username_txt: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
  },
  username_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  three_button_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  twitter_icon: {
    width: 42,
    height: 42,
  },
});
