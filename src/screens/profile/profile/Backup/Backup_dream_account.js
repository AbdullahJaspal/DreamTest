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
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
const {width, height} = Dimensions.get('screen');

import {useNavigation} from '@react-navigation/native';
import Myheader from '../components/Myheader';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../assets/icons';

const Backup_dream_account = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();
  const [selected, setSelected] = useState(0);
  const toggleIcon1 = () => {
    setShowIcon1(!showIcon1);
  };

  const data = [
    {
      id: 0,
      name: 'diwakarkumar@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 1,
      name: 'raj@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 2,
      name: 'shubham@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 3,
      name: 'pratikesh@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 4,
      name: 'niraj@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 5,
      name: 'shubham@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 6,
      name: 'Gaurav@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 7,
      name: 'diwkarkumar@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 8,
      name: 'diwkarkumar@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 9,
      name: 'diwkarkumar@gmail.com',
      image: icons.settingProfile,
    },
    {
      id: 10,
      name: 'diwkarkumar@gmail.com',
      image: icons.settingProfile,
    },
  ];

  const renderItem = ({item, index}) => (
    <Pressable
      onPress={() => {
        setSelected(index);
      }}
      style={styles.box_list}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          marginLeft: width * 0.05,
          marginRight: width * 0.05,
        }}>
        <View style={{width: width * 0.14}}>
          <Image source={item.image} style={{width: 35, height: 35}} />
        </View>
        <View style={{width: width * 0.6, alignSelf: 'center'}}>
          <Text
            style={{
              color: '#000',
              fontWeight: 500,
              fontSize: 16,
              marginRight: width * 0.04,
            }}>
            {item.name}
          </Text>
        </View>
        <View style={{width: width * 0.2, alignItems: 'center'}}>
          {selected == index && (
            <Image
              source={icons.greenTick}
              style={{width: 15, height: 15}}
              resizeMode="cover"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
  return (
    <View style={styles.main_conatiner}>
      <Myheader
        headertext={t('Choose back up account')}
        righttext={t('Next')}
        navigationScreen={'Backup_following'}
      />
      <View
        style={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
          marginLeft: width * 0.05,
          marginRight: width * 0.06,
          alignItems: 'center',
        }}
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Backup_dream_account;

const styles = StyleSheet.create({
  box_list: {
    width: width,
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'space-between',
    // marginTop: 2
  },
  txt: {
    fontSize: 14,
    color: '#000',
  },
  main_conatiner: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
});
