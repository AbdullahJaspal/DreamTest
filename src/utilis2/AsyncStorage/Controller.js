import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const get_data = async key => {
  try {
    const userInfo = await AsyncStorage.getItem(key);
    const data = JSON.parse(userInfo);
    return data;
  } catch (e) {
    console.log('Failed to fetch the data from storage');
  }
};

const save_data = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

const Logout = ({navigation}) => {
  AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });
      Toast.show('Successfully Sign Out', Toast.LONG);
    });
};
const TokenExpire = ({navigation}) => {
  AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });
      Toast.show('Token Expired Please Login Again', Toast.LONG);
    });
};
export {save_data, get_data, Logout, TokenExpire};
