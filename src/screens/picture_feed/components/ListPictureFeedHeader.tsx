import React from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

import ProfileImage from '../../../components/ProfileImage';
import {capitalize} from '../../../utils/captalize';

import {PictureFeedScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {MediaType} from '../../newVideo/enum/MediaType';

import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const ListPictureFeedHeader: React.FC = () => {
  const my_data = useAppSelector(selectMyProfileData);
  const navigation = useNavigation<PictureFeedScreenNavigationProps>();
  const {t, i18n} = useTranslation();
  function handleHeaderPress(_event: GestureResponderEvent): void {
    navigation.navigate('BottomTabNavigation', {
      screen: 'NewVideoStackNavigation',
      params: {
        screen: 'MediaPickupScreen',
        params: {mediaType: MediaType.Photo},
      },
    });
  }

  function handleProfilePress(): void {
    navigation.navigate('Me');
  }

  return (
    <Pressable style={styles.header_container} onPress={handleHeaderPress}>
      <ProfileImage uri={my_data?.profile_pic} onPress={handleProfilePress} />
      <Text style={styles.prompt_text}>
        {t('What`s on your mind')}, {capitalize(my_data?.nickname)}?
      </Text>
      <MaterialIcons name="photo-album" size={30} color={'#000'} />
    </Pressable>
  );
};

export default React.memo(ListPictureFeedHeader);

const styles = StyleSheet.create({
  header_container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    marginBottom: 20,
    marginTop: 5,
  },
  prompt_text: {
    fontSize: 15,
    color: '#657786',
    lineHeight: 20,
    width: 'auto',
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingLeft: 20,
  },
});
