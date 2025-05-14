import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Myheader from '../components/Myheader';
import {t} from 'i18next';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const data = [
  {
    id: 0,
    name: t('Promotion'),
    bottom_text: t('use to promote your dream account'),
    image: icons.settingSpeaker,
  },
  {
    id: 1,
    name: t('Microphone'),
    bottom_text:
      'used to contact to Device and tablets using high-frequency audio',
    image: icons.settingMicrophone,
  },
  {
    id: 2,
    name: t('Call logs'),
    bottom_text: 'Used to transfer call history',
    image: icons.settingPhone,
  },
  {
    id: 3,
    name: t('Notification'),
    bottom_text: 'used to send user interactive notificaton',
    image: icons.settingNotification,
  },
  {
    id: 4,
    name: t('Videos'),
    bottom_text: 'Use your videos to upload',
    image: icons.settingVideo,
  },
  {
    id: 5,
    name: t('Like'),
    bottom_text: 'Used to send all reaction of likes',
    image: icons.settingNotification,
  },
  {
    id: 6,
    name: t('Chatting'),
    bottom_text: 'Used to send private message information',
    image: icons.settingChat,
  },
];

const Switchpermission = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();
  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        marginLeft: width * 0.05,
        marginRight: width * 0.05,
      }}>
      <View style={{width: width * 0.17}}>
        <Image
          source={item.image}
          style={{width: 30, height: 30, marginRight: 10}}
        />
      </View>
      <View style={{width: width * 0.7}}>
        <Text style={{color: '#000', fontWeight: 500, fontSize: 16}}>
          {t(item.name)}
        </Text>
        <Text style={{opacity: 0.4}}>{t(item.bottom_text)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.main_conatiner}>
      <Myheader headertext={t('Switch Permission')} />
      <View
        style={{
          marginLeft: width * 0.1,
          marginRight: width * 0.1,
          marginTop: height * 0.023,
        }}>
        <Text>{t('Required permissions')}</Text>
      </View>
      <View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: width * 0.1,
          marginRight: width * 0.1,
          marginTop: height * 0.1,
        }}>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: '#000',
            opacity: 0.5,
            borderRadius: 18,
            width: width * 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#000', fontWeight: 800, fontSize: 14}}>
            {t('Deny')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: 'red',
            borderRadius: 18,
            width: width * 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontWeight: 800, fontSize: 14}}>
            {t('Allow')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Switchpermission;

const styles = StyleSheet.create({
  main_conatiner: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  switchcontainer: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginTop: height * 0.023,
    height: height * 0.09,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
