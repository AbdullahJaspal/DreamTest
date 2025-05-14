import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';

import Header from './Header';
import ProfileImage from '../../../../components/ProfileImage';
import Badge from '../../../../components/Badge';
import CInput from '../../../../components/CInput';

import * as userApi from '../../../../apis/userApi';

import {FollowersScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {UserRelationship} from '../../../other_user/types/VideoData';

import {truncateText} from '../../../../utils/truncateText';
import {badgeStyle} from '../../../../configs/styles/badge.style';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

import Animated from 'react-native-reanimated';
import {icons} from '../../../../assets/icons';

interface Followers_FollowingsProps {
  headertext: string;
  Loading: boolean;
  data: UserProfile[];
  followingList: any[];
}

interface RenderProfileProps {
  item: UserProfile;
  index: number;
}

interface UserProfile {
  UserRelationship: UserRelationship;
  badge: {
    Badge_type: string;
    createdAt: string;
    id: number;
    updatedAt: string;
    user_id: number;
    verified: boolean | null;
  };
  id: number;
  nickname: string;
  profile_pic: string;
  username: string;
  wallet: number;
}

const {width} = Dimensions.get('screen');

const Followers_Followings: React.FC<Followers_FollowingsProps> = ({
  headertext,
  Loading,
  data,
  followingList,
}) => {
  const navigation = useNavigation<FollowersScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  const {name} = useRoute();
  const [filteredUser, setFilteredUser] = useState<UserProfile[]>();

  const RenderProfile: React.FC<RenderProfileProps> = ({item}) => {
    const receiver = item?.UserRelationship?.receiver_id;
    const sender_id = item?.UserRelationship?.sender_id;

    function isIdAvailable(data: string | any[], id: any) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].UserRelationship.receiver_id === id) {
          return true;
        }
      }
      return false;
    }

    const isFollow = () => {
      if (name === 'Followers') {
        return isIdAvailable(followingList, sender_id);
      } else {
        return isIdAvailable(followingList, receiver);
      }
    };

    const [follow, setFollow] = useState(isFollow);

    const handleFollow = async () => {
      const receiver_id = name === 'Followers' ? sender_id : receiver;

      try {
        if (follow) {
          // User is currently following, so we'll unfollow them
          setFollow(false);
          const res = await userApi.unfollow(
            {receiver_id},
            my_data?.auth_token,
          );

          // Update the follow state only if the API call is successful
          // if (res?.status === 200) {
          //   // Assuming 200 status code for success
          //   setFollow(false); // Update the UI to show "Follow" button
          // }
        } else {
          setFollow(true);
          // User is not following, so we'll follow them
          const res = await userApi.follow({receiver_id}, my_data?.auth_token);

          // Update the follow state only if the API call is successful
          // if (res?.status === 200) {
          //   // Assuming 200 status code for success
          //   setFollow(true); // Update the UI to show "Following" button
          // }
        }
      } catch (error) {
        console.log('Error following/unfollowing:', error);
        // Optionally, show an error message to the user or handle error states
      }
    };

    const handleProfileVisit = () => {
      navigation.replace('UserProfileMainPage', {user_id: item?.id});
    };

    return (
      <View style={styles.user_main_container}>
        <Pressable style={styles.left_container}>
          <ProfileImage uri={item.profile_pic} onPress={handleProfileVisit} />
          <View style={styles.name_container}>
            <View style={badgeStyle.badge_view}>
              <Badge user_data={item} />
              <Text style={styles.txt}>{truncateText(item?.nickname, 20)}</Text>
            </View>

            <Text style={styles.txt}>{truncateText(item?.username, 20)}</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={handleFollow}
          style={[
            styles.follow_button,
            {backgroundColor: follow ? 'rgba(0, 0, 0, 0.2)' : 'red'},
          ]}>
          <Text style={[styles.follow_txt, {color: follow ? 'black' : '#fff'}]}>
            {follow ? 'following' : 'follow'}
          </Text>
        </Pressable>
      </View>
    );
  };

  function handleSearch(text: string): void {
    const lowerCaseText = text.toLowerCase();
    const filteredUsers = data.filter(
      user =>
        user?.username?.toLocaleLowerCase()?.includes(lowerCaseText) ||
        user?.nickname?.toLocaleLowerCase()?.includes(lowerCaseText),
    );
    setFilteredUser(filteredUsers);
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <Header headertext={headertext} />
      <View style={styles.searchBar}>
        <Animated.View style={styles.searchInput}>
          <CInput
            iconLeft={icons.search}
            placeholder={'Search'}
            iconColor={'#000000'}
            onChangeText={handleSearch}
            returnKeyType={'search'}
          />
        </Animated.View>
      </View>
      {Loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      ) : (
        <FlatList
          data={filteredUser ? filteredUser : data}
          keyExtractor={(_item, index) => index.toString()}
          ListFooterComponent={() => <View style={styles.footer_view} />}
          ListHeaderComponent={() => (
            <>
              {(!data || data.length === 0) && (
                <View style={styles.emptyContainer}>
                  <Image source={icons.userFilled} style={styles.empty_image} />
                  <Text style={styles.emptyText}>No Followers available!</Text>
                </View>
              )}
              <View style={styles.header} />
            </>
          )}
          renderItem={({item, index}) => (
            <RenderProfile item={item} index={index} />
          )}
          ListEmptyComponent={
            <View style={styles.empty_container}>
              <Text style={{fontSize: 16, color: '#999'}}>
                {/* No items available */}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default React.memo(Followers_Followings);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user_main_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#020202',
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
