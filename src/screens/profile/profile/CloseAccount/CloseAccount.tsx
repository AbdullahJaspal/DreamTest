import React from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import Header from '../components/Header';

import * as userApi from '../../../../apis/userApi';

import {
  add_my_profile_data,
  addIsLogin,
} from '../../../../store/slices/user/my_dataSlice';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width} = Dimensions.get('screen');

const CloseAccount = () => {
  const navigation = useNavigation();
  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const initiateAccountDeletion = async () => {
    try {
      const result = await userApi.createAccountDeletionProgress(
        my_data?.auth_token,
      );
      console.log('result', result);
      dispatch(addIsLogin(false));
      dispatch(add_my_profile_data(null));
      await AsyncStorage.clear();
      navigation.navigate('Me');
      Toast.show('Successfully initiated account deletion', Toast.LONG);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleCloseAccountPress = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          onPress: () => {
            initiateAccountDeletion();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.main_container}>
      <Header
        headertext={'Close Account'}
        onPress={handleBackPress}
        thirdButton={false}
      />

      <View style={styles.delete_account_text}>
        <Text style={styles.delete_txt}>Delete account</Text>
        <Text style={styles.delete_des}>
          When you choose to delete your Dream account, it's essential to
          understand that this action is permanent. Once initiated, your account
          won't be recoverable, and all the content or information you've shared
          on Dream will be irreversibly removed. This includes your main
          profile, messages, photos, videos, and any other data associated with
          your account.
        </Text>

        <Text style={styles.delete_des}>
          After you've initiated the account deletion process, there's typically
          a grace period of around 30 days before your account is permanently
          deleted. During this time, you may still have access to your account
          if you change your mind and decide to cancel the deletion process.
          However, once the 30-day period expires, your account will be fully
          and irreversibly removed from the Dream platform.
        </Text>

        <Text style={styles.delete_des}>
          It's important to carefully consider your decision before proceeding
          with deleting your account, as this action cannot be undone. Make sure
          to download any data or information you wish to keep before initiating
          the deletion process. Additionally, consider the implications of
          losing access to your account, such as connections with friends,
          access to groups or pages, and any other interactions you value on the
          platform.
        </Text>

        <Pressable
          onPress={handleCloseAccountPress}
          style={styles.delete_button}>
          <Text style={styles.button_txt}>Close Account</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CloseAccount;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    alignItems: 'center',
  },
  delete_account_text: {
    width: width * 0.95,
    borderWidth: 0.2,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderColor: '#000',
    marginTop: 10,
  },
  delete_txt: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    textAlign: 'left',
    marginVertical: 5,
  },
  delete_des: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '400',
    textAlign: 'left',
    marginVertical: 5,
  },
  delete_button: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 3,
    marginTop: 25,
    alignItems: 'center',
  },
  button_txt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
