import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../assets/icons';

const Trimmer = ({setShow_trimmer, setEnable_editing}) => {
  const {t, i18n} = useTranslation();

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={() => {
            setShow_trimmer(false);
            setEnable_editing(true);
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
          {t('Trim/Split')}
        </Text>
      </View>
    );
  };

  const trimming_data = [
    {
      id: 1,
      name: t('Trim Left'),
      icon_name: icons.videoTrim,
    },
    {
      id: 2,
      name: t('Trim Right'),
      icon_name: icons.videoTrim,
    },
  ];

  return (
    <View style={styles.main_container}>
      <RenderHeader />
      <FlatList
        data={trimming_data}
        renderItem={({item, index}) => (
          <View style={styles.view_container}>
            <TouchableOpacity
              onPress={item.onPress}
              style={styles.upper_icon_view}>
              <Image source={item.icon_name} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Trimmer;

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
    // justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginTop: 10,
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginLeft: 10,
  },
});
