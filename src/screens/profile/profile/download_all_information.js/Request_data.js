import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const Request_data = () => {
  const {t, i18n} = useTranslation();

  const addUserDetails = require('../../../../apis/userApi');
  const my_data = useAppSelector(selectMyProfileData);

  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const handleDataRequest = async () => {
    try {
      const user_id = my_data.id;

      // Disable the button to prevent multiple requests
      setButtonDisabled(true);

      const response = await addUserDetails.addDataUser(user_id);

      // Display a success message to the user
      Alert.alert(
        t('Data Requested'),
        t(
          'Your data request has been initiated. It may take some time to process.',
        ),
      );

      // Enable the button after a successful request
    } catch (error) {
      console.error('Error initiating data request:', error);
      // Display an error message to the user
      Alert.alert(
        'Error',
        'An error occurred while processing your request. Please try again.',
      );

      // Enable the button in case of an error
      setButtonDisabled(false);
    }
  };

  return (
    <View style={styles.main_container}>
      <View style={styles.upper_container}>
        <Text style={styles.upper_txt}>
          {t(
            'You can download the data from here. It will take time to process.',
          )}
        </Text>
        <Text style={styles.informatio_txt}>
          {t('What all the Information you can download.')}
        </Text>
      </View>

      <View style={styles.icon_profile}>
        <MaterialCommunityIcons name="account" size={20} color={'#000'} />
        <Text style={styles.profile_txt}>{t('Your Profile')}</Text>
      </View>
      <View style={styles.inner_content}>
        <Text style={styles.inner_content_txt}>
          {t(
            'It contains the data related to the profile. Username, profile photo, profile description.',
          )}
        </Text>
      </View>

      <View style={styles.icon_profile}>
        <AntDesign name="profile" size={20} />
        <Text style={styles.profile_txt}>{t('Your Activity')}</Text>
      </View>
      <View style={styles.inner_content}>
        <Text style={styles.inner_content_txt}>
          {t(
            'It contains the videos, comment history, like history, favourites.',
          )}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.touchOpacity_txt,
          {backgroundColor: isButtonDisabled ? 'gray' : 'red'},
        ]}
        onPress={handleDataRequest}
        disabled={isButtonDisabled} // Disable the button if isButtonDisabled is true
      >
        <Text style={styles.request_txt}>{t('REQUEST DATA')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Request_data;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  icon_profile: {
    flexDirection: 'row',
    padding: 10,
  },
  upper_container: {
    width: width * 0.95,
    alignSelf: 'center',
    marginVertical: 15,
    height: height * 0.1,
  },
  upper_txt: {
    fontSize: 15,
    color: '#000',
  },
  informatio_txt: {
    marginTop: 14,
    color: 'grey',
    fontSize: 14,
    fontWeight: '500',
  },
  profile_txt: {
    color: '#000',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  inner_content: {
    width: width * 0.95,
    alignSelf: 'center',
    paddingVertical: 8,
  },
  inner_content_txt: {
    fontSize: 16,
    color: '#000',
    padding: 4,
  },
  touchOpacity_txt: {
    backgroundColor: 'red',
    width: width * 0.8,
    alignSelf: 'center',
    height: height * 0.055,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 50,
  },
  request_txt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
