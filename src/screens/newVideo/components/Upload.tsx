import {StyleSheet, Text, Pressable, Image} from 'react-native';
import React from 'react';
import {BORDER, COLOR, TEXT} from '../../../configs/styles/index';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NewVideoScreenNavigationProps} from '../../../navigations/types/NewVideoNavigationAndRoute';
import {MediaType} from '../enum/MediaType';
import {icons} from '../../../assets/icons';

const Upload: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<NewVideoScreenNavigationProps>();

  function handleClick(): void {
    navigation.navigate('MediaPickupScreen', {mediaType: MediaType.All});
  }

  return (
    <>
      <Pressable onPress={handleClick} style={styles.container}>
        <Image source={icons.image} style={styles.icon} />
        <Text style={styles.text}>{t('Upload')}</Text>
      </Pressable>
    </>
  );
};

export default React.memo(Upload);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  icon: {
    borderRadius: BORDER.SMALL,
    borderWidth: 2,
    borderColor: COLOR.WHITE,
    width: 40,
    height: 40,
  },
  text: {
    ...TEXT.SMALL,
    color: COLOR.WHITE,
    marginTop: 5,
  },
});
