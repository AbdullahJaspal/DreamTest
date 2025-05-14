import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
const {width, height} = Dimensions.get('screen');
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Backup_following = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: width * 0.1,
        marginRight: width * 0.1,
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.toptext}>
          {t('Do you want to back up the Following')}
          {'\n'}
          {t('functions?')}
        </Text>
      </View>
      <View>
        <Text
          style={[
            styles.toptext,
            {opacity: 0.4, fontSize: 14, fontWeight: 300, lineHeight: 18},
          ]}>
          {t(
            'Please mark on all the jobs you need to backup  by activating the buttons',
          )}
          .{' '}
        </Text>
      </View>
      <View>
        <Text style={{fontSize: 14, fontWeight: 500, color: '#cc1f2d'}}>
          {t('We will send you the backup to the email you specified ')}{' '}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          padding: 10,
          borderRadius: 7,
          backgroundColor: '#000',
          alignItems: 'center',
          opacity: 0.6,
        }}
        onPress={() => {
          Navigation.navigate('Backup_successfuly');
        }}>
        <Text style={{color: '#ffffff', fontSize: 16, fontWeight: '600'}}>
          Backup
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Backup_following;

const styles = StyleSheet.create({
  toptext: {
    fontSize: 17,
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 24,
  },
});
