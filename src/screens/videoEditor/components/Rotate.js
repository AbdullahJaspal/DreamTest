import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../assets/icons';

const Rotate = ({
  setEnable_editing,
  setShow_rotation,
  rotateVideo,
  rotateAntiClockwiseVideo,
  mirroringHorizontally,
  mirroringVertically,
}) => {
  const {t, i18n} = useTranslation();

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={() => {
            setShow_rotation(false);
            setEnable_editing(true);
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
          {t('Rotate/Mirroring')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.main_container}>
      <RenderHeader />

      <View style={{padding: 10}}>
        <Text style={styles.text}>{t('Mirroring')}</Text>
        <View style={styles.first_container}>
          <TouchableOpacity onPress={mirroringHorizontally}>
            <View style={styles.icon_view}>
              <Image source={icons.mirroring} style={styles.image_view} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={mirroringVertically}>
            <View style={styles.icon_view}>
              <Image
                source={icons.mirroring}
                style={[styles.image_view, {transform: [{rotate: '90deg'}]}]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{padding: 10}}>
        <Text style={styles.text}>{t('Rotate')}</Text>
        <View style={styles.first_container}>
          <TouchableOpacity onPress={rotateVideo} style={styles.icon_view}>
            <MaterialCommunityIcons
              name="rotate-left"
              size={20}
              color={'#fff'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={rotateAntiClockwiseVideo}>
            <View style={styles.icon_view}>
              <MaterialCommunityIcons
                name="rotate-right"
                size={20}
                color={'#fff'}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Rotate;

const styles = StyleSheet.create({
  main_container: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'flex-start',
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
  icon_view: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  image_view: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  first_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
