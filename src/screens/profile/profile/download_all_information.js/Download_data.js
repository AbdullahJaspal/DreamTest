import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const Download_data = () => {
  const {t, i18n} = useTranslation();

  const DownloadApis = require('../../../../apis/userApi');
  const my_data = useAppSelector(selectMyProfileData);

  const handleDownload = async () => {
    try {
      const user_id = my_data.id;
      const response = await DownloadApis.downloadUserData(my_data?.auth_token);

      console.log('response', response);
    } catch (error) {
      console.error('Error during download:', error.message);
    }
  };

  return (
    <View style={styles.main_container}>
      <TouchableOpacity style={styles.txt} onPress={handleDownload}>
        <Text>{t('Download User Information')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Download_data;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  txt: {
    backgroundColor: 'red',
  },
});
