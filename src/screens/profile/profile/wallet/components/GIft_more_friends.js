import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import {getFollowingsDetails} from '../../../../../apis/userApi';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../../store/hooks';
import {selectMyProfileData} from '../../../../../store/selectors';

const GIft_more_friends = () => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const [data, setData] = useState([]);
  const my_data = useAppSelector(selectMyProfileData);
  const user_id = my_data.id;

  const getDetails = () => {
    getFollowingsDetails(user_id)
      .then(r => {
        const simplifiedData = r.Following.filter(
          user => user.UserRelationship.receiver_id !== user_id,
        ) // Filter out items where receiver_id is equal to user_id
          .map(user => ({
            key: user.id.toString(),
            username: user.username,
            profile_pic: user.profile_pic,
            receiver_id: user.UserRelationship.receiver_id,
          }));
        setData(simplifiedData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDetails();
  }, []);

  const handleSelect = selectedUserId => {
    // Perform actions with the selected user ID
    console.log('Selected User ID:', selectedUserId);

    // Navigate to a different screen (replace 'YourScreenName' with the actual screen name)
    navigation.navigate('Gift_choose_amount_coins', {
      selectedUserId,
      user_id,
      my_data,
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={{width: width * 0.2}}>
        <Image source={{uri: item.profile_pic}} style={styles.profilePic} />
      </View>
      <View
        style={{
          width: width * 0.45,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15, color: '#000', fontWeight: '500'}}>
          {item.username}
        </Text>
      </View>
      <View style={{width: width * 0.29, height: height * 0.06, marginTop: 5}}>
        <TouchableOpacity
          onPress={() => handleSelect(item.key)}
          style={{
            backgroundColor: '#e85548',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: 100,
            borderRadius: 5,
          }}>
          <Text style={{fontSize: 14, color: 'white'}}>{t('Select')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Header headertext={'Buy Gifts For a Friend'} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  itemContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default GIft_more_friends;
