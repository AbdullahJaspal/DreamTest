import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TextInput,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getFollowingsDetails} from '../../../../../apis/userApi';
import {useTranslation} from 'react-i18next';

import Gift_choose_amount_coins from './Gift_choose_amount_coins';
import {useAppSelector} from '../../../../../store/hooks';
import {selectMyProfileData} from '../../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const Gift_for_friend = () => {
  const {t, i18n} = useTranslation();

  const checkavailabilty = require('../../../../../apis/Gift_Information_Record');
  const my_data = useAppSelector(selectMyProfileData);
  const user_id = my_data.id;
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);
  console.log(data, 'data');

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

  const addMoreHandler = () => {
    navigation.navigate('GIft_more_friends');
  };

  const handleSelect = selectedUserId => {
    console.log('Selected User ID:', selectedUserId);
    navigation.navigate('Gift_choose_amount_coins', {
      selectedUserId,
      user_id,
      my_data,
    });
  };

  const checkAvailabilityHandler = async () => {
    try {
      const usernameResponse = await checkavailabilty.Check_Username_Email(
        username,
        null,
      );
      const emailResponse = await checkavailabilty.Check_Username_Email(
        null,
        email,
      );
      console.log(usernameResponse, emailResponse, 'frontendresponse');

      if (usernameResponse.available && emailResponse.available) {
        const selectedUserId = null;
        navigation.navigate('Gift_choose_amount_coins', {
          selectedUserId,
          user_id,
          my_data,
        });
      } else {
        Alert.alert(
          'Error',
          'Username or email does not exist. Please check and try again.',
        );
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.profile_with_name}
        onPress={() => handleSelect(item.key)}>
        <Image source={{uri: item.profile_pic}} style={styles.profilePic} />
        <Text style={{fontSize: 15, color: '#000', fontWeight: '500'}}>
          {item.username}
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.main_container}>
      <Header headertext={'Buy Gifts For a Friend'} />
      <View style={styles.top_txt}>
        <Text style={styles.txt}>
          {t('Recharge a credit to your friends, via email with ease')}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Add email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Text style={{marginTop: 20, color: 'black', marginLeft: 20}}>and</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000"
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.flatlist}>
        <FlatList
          data={data.slice(Math.max(data.length - 8, 0))}
          renderItem={renderItem}
          keyExtractor={item => item.key}
          horizontal={true}
        />
      </View>

      <View style={styles.addmore_txt}>
        <Pressable style={styles.ViewMore}>
          <AntDesign
            name="search1"
            size={25}
            color={'black'}
            onPress={addMoreHandler}
          />
        </Pressable>
        <Text style={{alignSelf: 'center', color: '#000', marginTop: 4}}>
          {t('More')}
        </Text>
      </View>
      <TouchableOpacity style={styles.next} onPress={checkAvailabilityHandler}>
        <Text style={{color: 'white', fontSize: 17}}>{t('NEXT')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  top_txt: {
    width: width * 0.8,
    marginLeft: width * 0.1,
    paddingVertical: 20,
  },
  txt: {
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    marginTop: 20,
    paddingLeft: 10,
    borderRadius: 25,
    fontSize: 15,
    fontWeight: 'bold',
  },
  ViewMore: {
    backgroundColor: '#a8a7a7',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  addmore_txt: {
    width: width * 0.2,
    padding: 10,
    marginLeft: 10,
  },

  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  itemContainer: {
    flex: 1,
    marginTop: 25,
    padding: 6,
  },
  profile_with_name: {
    alignItems: 'center', // Center items within each cell
    width: width * 0.21, // Set width to 25% of the screen width
  },
  next: {
    backgroundColor: '#ff471a',
    width: width * 0.45,
    alignSelf: 'center',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 17,
  },
});

export default Gift_for_friend;
