import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Octicons';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {height, width} = Dimensions.get('screen');

const Userblocked = () => {
  const getUserBlockedMeUser = require('../../../../apis/userApi');
  const {t, i18n} = useTranslation();
  const Navigation = useNavigation();
  const my_data = useAppSelector(selectMyProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [blockedUsersData, setBlockedUsersData] = useState([]);

  const fetchBlockedUsers = async () => {
    try {
      const userId = my_data.id;
      const blockedUsersData = await getUserBlockedMeUser.getBlockedMeUser(
        userId,
      );
      // console.log(blockedUsersData,"blockedUsersDataew")
      if (response.user_data) {
        setBlockedUsersData([response.user_data]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const iconColor = 'lightgray';

  return (
    <View style={styles.mainContainer}>
      <Header headertext={t('Blocked list')} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={blockedUsersData}
          keyExtractor={item => item.username}
          renderItem={({item}) => (
            <View style={styles.userContainer}>
              <Image
                source={{uri: item.profile_pic}}
                style={styles.profilePic}
              />
              <View>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.noUserContainer}>
              <Icon name="comment-discussion" size={150} color={iconColor} />
              <Text style={styles.noUserText}>No user has blocked you</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.4,
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: width,
    borderBottomWidth: 0.2,
    height: height * 0.1,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  email: {
    color: '#000',
    fontWeight: '500',
  },
  noUserContainer: {
    paddingVertical: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUserText: {
    color: '#000',
  },
});

export default Userblocked;
