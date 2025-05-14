import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  FlatList,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../assets/icons';
const {width, height} = Dimensions.get('screen');

const Viewlist = () => {
  const {t, i18n} = useTranslation();

  const Navigation = useNavigation();
  const [selected, setSelected] = useState(0);
  const toggleIcon1 = () => {
    setShowIcon1(!showIcon1);
  };
  const toggleIcon2 = () => {
    setShowIcon2(!showIcon2);
  };
  const data = [
    {
      id: 0,
      name: t('Followings each other'),
    },
    {
      id: 1,
      name: t('Everyone'),
    },
    {
      id: 2,
      name: t('only me'),
    },
  ];

  const toggleIcon4 = () => {
    setShowIcon4(!showIcon4);
  };
  return (
    <View style={styles.main_conatiner}>
      <Header headertext={t('Who can my like list')} />
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              setSelected(index);
            }}
            style={styles.box_list}>
            <Text style={styles.txt}>{item?.name}</Text>
            {selected == index && (
              <Image
                source={icons.greenTick}
                style={{width: 20, height: 20}}
                resizeMode="cover"
              />
            )}
          </Pressable>
        )}
      />
    </View>
  );
};

export default Viewlist;

const styles = StyleSheet.create({
  box_list: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
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
