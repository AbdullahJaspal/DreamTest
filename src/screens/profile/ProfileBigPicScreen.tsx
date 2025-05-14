import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {ProfileBigPicScreenRouteProps} from '../../types/screenNavigationAndRoute';
import {Image} from 'react-native';
import Header from './profile/components/Header';
import {icons} from '../../assets/icons';

const {width, height} = Dimensions.get('screen');

const ProfileBigPicScreen: React.FC = () => {
  const route = useRoute<ProfileBigPicScreenRouteProps>();
  const profile_pic = route.params?.profile_pic;

  return (
    <View style={styles.main_container}>
      <View style={styles.header_view}>
        <Header headertext="Profile Picture" />
      </View>
      <Image
        source={profile_pic ? {uri: profile_pic} : icons.userFilled}
        resizeMode="contain"
        style={styles.image_view}
      />
    </View>
  );
};

export default ProfileBigPicScreen;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_view: {
    width: width,
    height: height,
  },
  header_view: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
