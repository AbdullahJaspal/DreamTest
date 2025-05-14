import React, {useState, useEffect} from 'react';
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
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {selectMyPrivacy} from '../../../../store/selectors';
import {useAppSelector} from '../../../../store/hooks';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const Viewlist = () => {
  const {t, i18n} = useTranslation();
  const [selected, setSelected] = useState(0);
  const myDataPrivacy = useAppSelector(selectMyPrivacy);
  console.log(myDataPrivacy, 'myDataPrivacy');

  const data = [
    {
      id: 0,
      name: t('Disable'),
    },
    {
      id: 1,
      name: t('Everyone'),
    },
    {
      id: 2,
      name: t('only Followings each other'),
    },
  ];

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Who can message me')} />
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              setSelected(index);
            }}
            style={styles.box_list}>
            <Text style={styles.txt}>{item?.name}</Text>
            {selected === index && (
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
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
});
