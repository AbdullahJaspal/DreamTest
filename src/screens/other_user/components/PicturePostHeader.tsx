import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';

import {useTranslation} from 'react-i18next';

const PicturePostHeader = ({setShow_picture_post}) => {
  const {t, i18n} = useTranslation();

  const {width, height} = useWindowDimensions();
  const styles = StyleSheet.create({
    main_conatiner: {
      width: width,
      height: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    header_text: {
      color: '#000',
      left: 20,
      fontSize: 20,
    },
    yourPicture: {
      width: width * 0.9,
      alignItems: 'center',
      height: height * 0.05,
      justifyContent: 'center',
    },
    icon: {
      right: 10,
    },
  });
  return (
    <View style={styles.main_conatiner}>
      <View style={styles.yourPicture}>
        <Text style={styles.header_text}>{t('Post')}</Text>
      </View>
      <TouchableOpacity style={styles.icon} onPress={setShow_picture_post}>
        <Entypo name="cross" size={30} color={'black'} />
      </TouchableOpacity>
    </View>
  );
};

export default PicturePostHeader;
