import React, {useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import CText from '../../components/CText';
import CButton from '../CButton';
import ProfileImage from '../ProfileImage';

import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';
import * as userApi from '../../apis/userApi';

import {DiscoverScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {useAppSelector} from '../../store/hooks';
import {selectMyProfileData} from '../../store/selectors';

const ItemUser = ({item}) => {
  const {t, i18n} = useTranslation();
  const navigate = useNavigation<DiscoverScreenNavigationProps>();
  const {avatar, name, userName, follow, numVideo, _id} = item;
  const my_data = useAppSelector(selectMyProfileData);
  const isIdPresent = item?.Followers?.some(
    (item: {id: number | undefined}) => item.id === my_data?.id,
  );
  const [isFollowing, setIsFollowing] = useState(isIdPresent);

  const handleFollow = async () => {
    const receiver_id = item?.id;
    if (isFollowing) {
      try {
        setIsFollowing(false);
        const res = await userApi.unfollow({receiver_id}, my_data?.auth_token);
      } catch (error) {
        console.log('error while unfollowing the user', error);
      }
    } else if (!isFollowing) {
      setIsFollowing(true);
      try {
        setIsFollowing(true);
        const res = await userApi.follow({receiver_id}, my_data?.auth_token);
      } catch (error) {
        console.log('error while following the person', error);
      }
    }
  };

  function handleProfilePress(): void {
    navigate.navigate('UserProfileMainPage', {user_id: item?.id});
  }

  return (
    <Pressable onPress={handleProfilePress}>
      <View style={styles.container}>
        <ProfileImage uri={avatar} onPress={handleProfilePress} />
        <View style={styles.content}>
          <CText text={TEXT.STRONG} numberOfLines={1}>
            {name}
          </CText>
          <CText text={TEXT.SUBTITLE} numberOfLines={1} color={COLOR.GRAY}>
            @{userName}
          </CText>
          <CText text={TEXT.SUBTITLE} color={COLOR.GRAY}>
            {item?.Followers?.length || 0} {t('Followers')} -{' '}
            {item?.Following?.length || 0} {t('Followings')}
          </CText>
        </View>
        <View>
          <CButton
            lable={isFollowing ? t('Following') : t('Follow')}
            onPress={handleFollow}
            width={100}
            backgroundColor={isFollowing ? 'grey' : 'red'}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default React.memo(ItemUser);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.S1,
    alignItems: 'center',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: BORDER.PILL,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.S3,
  },
});
