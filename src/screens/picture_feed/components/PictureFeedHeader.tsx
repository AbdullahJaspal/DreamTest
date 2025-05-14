import {
  Dimensions,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {PicturePost} from '../types/picturePost';
import ProfileImage from '../../../components/ProfileImage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {truncateText} from '../../../utils/truncateText';
import {getTimeDuration} from '../../../utils/getTimeDuration';
import {useNavigation} from '@react-navigation/native';
import {PictureFeedScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {useDispatch} from 'react-redux';
import {
  setPostData,
  toggleShowMoreOptions,
} from '../../../store/slices/content/pictureSlice';
import Badge from '../../../components/Badge';
import {icons} from '../../../assets/icons';

interface PictureFeedHeaderProps {
  item: PicturePost;
  index?: number;
}
const {width} = Dimensions.get('screen');

const PictureFeedHeader: React.FC<PictureFeedHeaderProps> = ({item}) => {
  const navigation = useNavigation<PictureFeedScreenNavigationProps>();
  const dispatch = useDispatch();

  function handleClickMoreOption(_event: GestureResponderEvent): void {
    dispatch(setPostData(item));
    dispatch(toggleShowMoreOptions());
  }

  function handleProfilePress(): void {
    navigation.navigate('UserProfileMainPage', {user_id: item.user.id});
  }

  return (
    <View style={styles.main_container}>
      {/* First Container */}
      <ProfileImage onPress={handleProfilePress} uri={item.user.profile_pic} />

      {/* Second Container */}
      <View style={styles.second_container}>
        <View style={styles.nested_second_container}>
          <Text style={styles.nickname}>
            {truncateText(item?.user?.nickname, 10)}
          </Text>
          <Badge user_data={item?.user} />
          <Text style={styles.username}>
            @{truncateText(item?.user?.username, 10)}
          </Text>
        </View>

        <View style={styles.place_view}>
          {item.location_name && (
            <>
              <Image source={icons.locationOutline} style={styles.place_img} />
              <Text style={styles.location_name_txt}>{item.location_name}</Text>
            </>
          )}
          <Text style={styles.created_txt}>
            {' '}
            .{getTimeDuration(item.createdAt)}
          </Text>
        </View>
      </View>

      {/* Third Container */}
      <TouchableOpacity onPress={handleClickMoreOption}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={20}
          color={'#020202'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PictureFeedHeader;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  second_container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 15,
  },
  username: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 10,
  },
  nickname: {
    color: '#020202',
    fontSize: 14,
    textAlign: 'left',
  },
  nested_second_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  place_img: {
    width: 15,
    height: 15,
  },
  place_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location_name_txt: {
    fontSize: 12,
  },
  created_txt: {
    fontSize: 12,
    color: '#000',
  },
  verified_img: {
    width: 20,
    height: 20,
  },
});
