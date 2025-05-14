import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign.js';

const {width, height} = Dimensions.get('screen');
import {useNavigation} from '@react-navigation/native';
import Myheader from '../components/Myheader';
import {useTranslation} from 'react-i18next';

const Backup_and_restore = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();
  return (
    <View style={styles.main_conatiner}>
      <Myheader headertext={t('Backup and restore')} />
      <TouchableWithoutFeedback
        onPress={() => {
          Navigation.navigate('Back_up_data');
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dfebed',
            marginLeft: width * 0.05,
            marginRight: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.015,
            padding: 17,
            borderRadius: 14,
          }}>
          <View style={{width: width * 0.7, paddingLeft: width * 0.06}}>
            <Text style={{fontSize: 16, fontWeight: 500, color: '#000'}}>
              {t('Back Up data')}
            </Text>
            <Text>{t('Use your Dream account to back up your data')}</Text>
          </View>
          <View
            style={{
              width: width * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="right" color="black" size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          Navigation.navigate('Restore_data');
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dfebed',
            marginLeft: width * 0.05,
            marginRight: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.015,
            padding: 17,
            borderRadius: 14,
          }}>
          <View style={{width: width * 0.7, paddingLeft: width * 0.06}}>
            <Text style={{fontSize: 16, fontWeight: 500, color: '#000'}}>
              {t('Restore data')}
            </Text>
            <Text>{t('Use your account to restore your backup data')}</Text>
          </View>
          <View
            style={{
              width: width * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="right" color="black" size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          Navigation.navigate('Backup_dream_account');
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dfebed',
            marginLeft: width * 0.05,
            marginRight: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.015,
            padding: 17,
            borderRadius: 14,
          }}>
          <View style={{width: width * 0.7, paddingLeft: width * 0.06}}>
            <Text style={{fontSize: 16, fontWeight: 500, color: '#000'}}>
              {t('Backup Account')}
            </Text>
            <Text style={{color: 'red'}}>subhandevloper@gmail.com </Text>
          </View>
          <View
            style={{
              width: width * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="right" color="black" size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        onPress={() => {
          Navigation.navigate('Switchpermission');
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dfebed',
            marginLeft: width * 0.05,
            marginRight: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.015,
            padding: 17,
            borderRadius: 14,
          }}>
          <View style={{width: width * 0.7, paddingLeft: width * 0.06}}>
            <Text style={{fontSize: 16, fontWeight: 500, color: '#000'}}>
              {t('External storage transfer')}
            </Text>
            <Text>
              {t('Back up your data to an SD card or USB storage device')}{' '}
            </Text>
          </View>
          <View
            style={{
              width: width * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="right" color="black" size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          Navigation.navigate('Backup_my_data');
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dfebed',
            marginLeft: width * 0.05,
            marginRight: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.015,
            padding: 17,
            borderRadius: 14,
          }}>
          <View style={{width: width * 0.7, paddingLeft: width * 0.06}}>
            <Text style={{fontSize: 16, fontWeight: 500, color: '#000'}}>
              {t('Back up my data')}
            </Text>
            <Text style={{color: 'red'}}>{t('on')} </Text>
          </View>
          <View
            style={{
              width: width * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AntDesign name="right" color="black" size={20} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Backup_and_restore;

const styles = StyleSheet.create({
  main_conatiner: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
});
