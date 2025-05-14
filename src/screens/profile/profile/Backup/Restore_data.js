import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('screen');
import {useNavigation} from '@react-navigation/native';
import Myheader from '../components/Myheader';

const Restore_data = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();
  return (
    <View style={styles.main_conatiner}>
      <Myheader headertext={t('Restore data')} />
      <View
        style={{
          marginRight: width * 0.05,
          marginLeft: width * 0.05,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 15, fontWeight: 500, color: '#000'}}>
            {t('No backups')}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            padding: 18,
            borderRadius: 7,
            backgroundColor: '#d91f16',
            alignItems: 'center',
            opacity: 0.8,
            marginTop: height * 0.02,
          }}
          onPress={() => {
            Navigation.navigate('Backup_successfuly');
          }}>
          <Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>
            {t('Backup this Account')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Restore_data;

const styles = StyleSheet.create({
  main_conatiner: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
});
