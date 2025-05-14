import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  FlatList,
  Switch,
} from 'react-native';
import React, {useState} from 'react';
import {Checkbox} from 'react-native-paper';
const {width, height} = Dimensions.get('screen');

import {useNavigation} from '@react-navigation/native';
import Myheader from '../components/Myheader';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../assets/icons';

const Back_up_data = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();
  const [selectAll, setSelectAll] = useState(false);

  const [data, setData] = useState([
    {
      id: 0,
      name: t('All videos'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingVideos,
      switch_button: false,
    },
    {
      id: 1,
      name: t('Voice call'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingMic,
      switch_button: false,
    },
    {
      id: 2,
      name: t('Promotions'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingSpeakers,
      switch_button: false,
    },
    {
      id: 3,
      name: t('Notification'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingNotification,
      switch_button: false,
    },
    {
      id: 4,
      name: t('Phone dream calls'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingPhone,
      switch_button: false,
    },
    {
      id: 5,
      name: t('Comments'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingComments,
      switch_button: false,
    },
    {
      id: 6,
      name: t('All shares'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingTransfer,
      switch_button: false,
    },
    {
      id: 7,
      name: t('Friend Active'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingFriends,
      switch_button: false,
    },
    {
      id: 8,
      name: t('Private message'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingNotes,
      switch_button: false,
    },

    {
      id: 9,
      name: t('All Like'),
      bottom_text: t('Auto backup turned off'),
      image: icons.settingNotification,
      switch_button: false,
    },
  ]);

  const toggleSwitch = itemId => {
    // Find the item in the data array and toggle its switch_button value
    const updatedData = data.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          switch_button: !item.switch_button,
        };
      }
      return item;
    });

    setData(updatedData);
  };
  const toggleAllSwitches = () => {
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);

    const updatedData = data.map(item => ({
      ...item,
      switch_button: updatedSelectAll,
    }));

    setData(updatedData);
  };

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
      <View style={{width: width * 0.4}}>
        <Text style={{color: '#000', fontWeight: 500, fontSize: 16}}>
          {t(item.name)}
        </Text>
        <Text style={{opacity: 0.4}}>{t(item.bottom_text)}</Text>
      </View>
      <View style={{width: width * 0.3}}>
        <Switch
          value={item.switch_button}
          onValueChange={() => toggleSwitch(item.id)}
          thumbColor={item.switch_button ? 'red' : 'white'}
          trackColor={{false: 'grey', true: 'red'}} // Grey track color
        />
      </View>
    </View>
  );
  return (
    <View style={styles.main_conatiner}>
      <Myheader headertext={t('Back Up data')} righttext={t('Next')} />
      <View
        style={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
          marginLeft: width * 0.05,
          marginRight: width * 0.06,
          alignItems: 'center',
        }}>
        <Text>{t('Use All')}</Text>
        <Checkbox
          status={selectAll ? 'checked' : 'unchecked'}
          onPress={toggleAllSwitches}
          color="red"
          uncheckedColor="black"
        />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default Back_up_data;

const styles = StyleSheet.create({
  box_list: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    marginTop: 5,
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
