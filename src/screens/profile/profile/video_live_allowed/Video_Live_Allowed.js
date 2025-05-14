import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  FlatList,
  Switch,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Header';

const {width, height} = Dimensions.get('screen');
import {useTranslation} from 'react-i18next';

const Video_Live_Allowed = () => {
  const {t, i18n} = useTranslation();

  const [data, setData] = useState([
    {id: '1', title: t('Gifts'), switchValue: false},
    {id: '2', title: t('Likes'), switchValue: false},
    {id: '3', title: t('Shares'), switchValue: false},
    {id: '4', title: t('Comments'), switchValue: false},
    {id: '5', title: t('Screenshot'), switchValue: false},
    {id: '6', title: t('Luck Wheel'), switchValue: false},
    {id: '7', title: t('Screen Recorder'), switchValue: false},
  ]);

  const handleSwitchChange = (itemId, value) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === itemId ? {...item, switchValue: value} : item,
      ),
    );
  };
  const renderItem = ({item}) => (
    <View style={styles.listItem}>
      <Text style={styles.list_txt}>{t(item.title)}</Text>
      <Switch
        value={item.switchValue}
        onValueChange={value => handleSwitchChange(item.id, value)}
        trackColor={{false: '#ccc', true: 'red'}}
        thumbColor={item.switchValue ? 'red' : 'white'}
      />
    </View>
  );

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Video Live Allowed')} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default Video_Live_Allowed;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  list_txt: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
});
