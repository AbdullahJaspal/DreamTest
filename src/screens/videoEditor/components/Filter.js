import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';

const Filter = ({setShowFilter, setEnable_editing}) => {
  const {t, i18n} = useTranslation();

  const filter_data = [
    {
      id: 1,
      name: t('none'),
      onPress: () => {},
    },
    {
      id: 2,
      name: t('Warm'),
      onPress: () => {},
    },
    {
      id: 3,
      name: t('Vivid'),
      onPress: () => {},
    },
    {
      id: 4,
      name: t('Mono'),
      onPress: () => {},
    },
    {
      id: 5,
      name: t('Low Saturation'),
      onPress: () => {},
    },
    {
      id: 6,
      name: t('Cold'),
      onPress: () => {},
    },
    {
      id: 7,
      name: t('Basic'),
      onPress: () => {},
    },
  ];

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={() => {
            setShowFilter(false);
            setEnable_editing(true);
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
          {'Filter'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.main_container}>
      <RenderHeader />
      <FlatList
        data={filter_data}
        renderItem={({item, index}) => (
          <View style={styles.view_container}>
            <Text style={styles.text}>{item.name}</Text>
            <Entypo name="chevron-small-right" size={20} color={'white'} />
          </View>
        )}
      />
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  main_container: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
  },
  upper_goback: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 250,
    height: 40,
    paddingLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  text: {
    color: '#FAF9F6',
    marginTop: 3,
    fontSize: 14,
  },
  upper_icon_view: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 50,
  },
  view_container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginLeft: 10,
    paddingHorizontal: 5,
  },
});
