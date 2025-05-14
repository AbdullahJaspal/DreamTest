import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  getUserAllLikeById,
  follow,
  unfollow,
  getFollowingsDetails,
} from '../../../../apis/userApi';
import ProfileImage from '../../../../components/ProfileImage';
import Header from '../components/Header';
import CInput from '../../../../components/CInput';
import {
  LikesHistoryScreenNavigationProps,
  LikesHistoryScreenRouteProps,
} from '../../../../types/screenNavigationAndRoute';
import Badge from '../../../../components/Badge';
import {badgeStyle} from '../../../../configs/styles/badge.style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const {width} = Dimensions.get('screen');

interface VideoUser {
  id: number;
  nickname: string;
  username: string;
  profile_pic: string;
}

interface LikedVideo {
  sender: VideoUser;
  [key: string]: any;
}

const LikesHistory: React.FC = () => {
  const [data, setData] = useState<LikedVideo[]>([]);
  const [followStatus, setFollowStatus] = useState<{[key: number]: boolean}>(
    {},
  );
  const route = useRoute<LikesHistoryScreenRouteProps>();
  const [followingList, setFollowingList] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState<number | null>(null);
  const [txtSearch, setTxtSearch] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const my_data = useAppSelector(selectMyProfileData);
  const navigation = useNavigation<LikesHistoryScreenNavigationProps>();

  const getDetails = useCallback(async () => {
    try {
      const response = await getUserAllLikeById(route.params.user_id);
      setData(response?.data || []);
    } catch (error) {
      console.log('Error fetching liked videos:', error);
    }
  }, [route.params.user_id]);

  const getFollowingList = useCallback(async () => {
    try {
      const myFollowers = await getFollowingsDetails(my_data?.id);
      const following = myFollowers.Following || [];
      const followingIds = following.map((user: any) => user.id);
      setFollowingList(followingIds);
    } catch (error) {
      console.log('Error fetching following list:', error);
    } finally {
      setLoading(false);
    }
  }, [my_data?.auth_token]);

  useEffect(() => {
    getDetails();
    getFollowingList();
  }, [getDetails, getFollowingList]);

  const handleFollow = useCallback(
    async (sender: VideoUser) => {
      const receiver_id = sender?.id;

      if (!receiver_id) return;

      const isFollowing =
        followStatus[receiver_id] || followingList.includes(receiver_id);
      const newFollowStatus = !isFollowing;

      // Optimistically update the follow status in the UI
      setFollowStatus(prev => ({
        ...prev,
        [receiver_id]: newFollowStatus,
      }));
      setFollowLoading(receiver_id);

      try {
        if (newFollowStatus) {
          // Follow the user
          await follow(
            {sender_id: my_data?.id, receiver_id},
            my_data?.auth_token,
          );
          setFollowingList(prevList => [...prevList, receiver_id]);
        } else {
          // Unfollow the user
          await unfollow(
            {sender_id: my_data?.id, receiver_id},
            my_data?.auth_token,
          );
          setFollowingList(prevList =>
            prevList.filter(id => id !== receiver_id),
          );
        }
      } catch (error) {
        console.log('Error following/unfollowing:', error);
        // Revert the follow status in case of an error
        setFollowStatus(prev => ({
          ...prev,
          [receiver_id]: isFollowing, // Revert to the previous status
        }));
      } finally {
        setFollowLoading(null); // Remove loader after the action is completed
      }
    },
    [followStatus, my_data?.auth_token, followingList, my_data?.id],
  );

  const handleProfileVisit = useCallback(
    (user_id: number) => {
      navigation.navigate('UserProfileMainPage', {user_id: user_id});
    },
    [navigation],
  );

  const uniqueUsers = useMemo(() => {
    return data.reduce<LikedVideo[]>((acc, item) => {
      const userId = item?.sender?.id;
      if (userId && !acc.some(video => video?.sender?.id === userId)) {
        acc.push(item);
      }
      return acc;
    }, []);
  }, [data]);

  // Filter users based on txtSearch
  const filteredUsers = useMemo(() => {
    return uniqueUsers.filter(user =>
      user.sender.username.toLowerCase().includes(txtSearch.toLowerCase()),
    );
  }, [uniqueUsers, txtSearch]);

  const renderItem = useCallback(
    ({item}: {item: LikedVideo}) => {
      const {sender} = item;
      const isFollowing =
        followStatus[sender?.id] || followingList.includes(sender?.id);

      return (
        <View style={styles.user_main_container}>
          <Pressable
            style={styles.left_container}
            onPress={() => handleProfileVisit(sender?.id)}>
            <ProfileImage uri={sender?.profile_pic} />
            <View style={styles.name_container}>
              <View style={badgeStyle.badge_view}>
                <Badge user_data={sender} />
                <Text style={styles.txt}>{sender?.nickname || 'Unknown'}</Text>
              </View>
              <Text style={styles.txt}>{sender?.username || 'Unknown'}</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => handleFollow(sender)}
            style={[
              styles.follow_button,
              {backgroundColor: isFollowing ? 'rgba(0, 0, 0, 0.2)' : 'red'},
            ]}>
            <Text
              style={[
                styles.follow_txt,
                {color: isFollowing ? 'black' : '#fff'},
              ]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </View>
      );
    },
    [
      followStatus,
      followingList,
      followLoading,
      handleFollow,
      handleProfileVisit,
    ],
  );

  return (
    <SafeAreaView style={styles.main_container}>
      <Header headertext={`Likes History (${filteredUsers?.length || 0})`} />

      <View style={styles.searchBar}>
        <Animated.View style={styles.searchInput}>
          <CInput
            onFocus={() => setIsFocus(true)}
            iconLeft={icons.search}
            placeholder={'Search'}
            value={txtSearch}
            iconColor={'#000000'}
            onChangeText={text => setTxtSearch(text)}
            returnKeyType={'search'}
          />
        </Animated.View>
      </View>

      {loading ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item =>
            item?.sender?.id?.toString() || item.id.toString()
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image source={icons.userFilled} style={styles.empty_image} />
              <Text style={styles.emptyText}>No Profiles available!</Text>
            </View>
          }
          contentContainerStyle={{paddingBottom: 20}}
          ListFooterComponent={<View style={styles.footer_view} />}
        />
      )}
    </SafeAreaView>
  );
};

export default React.memo(LikesHistory);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flexGrow: 1,
    borderRadius: 24,
  },
  user_main_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  left_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    color: '#020202',
    fontSize: 14,
    textAlign: 'left',
  },
  follow_button: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 35,
    borderRadius: 5,
  },
  follow_txt: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  name_container: {
    justifyContent: 'center',
    marginLeft: 15,
    width: width - 200,
  },
  footer_view: {
    height: 10,
  },
  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  empty_image: {
    width: 70,
    height: 70,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});
