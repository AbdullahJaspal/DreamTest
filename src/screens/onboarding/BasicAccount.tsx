import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {BasicAccountNavigationProps} from '../../navigations/types/OnboardingNavigationAndRoute';
import ChoosingAccountType from './components/ChoosingAccountType';
import {useTranslation} from 'react-i18next';
import {selectMyProfileData} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';
import {images} from '../../assets/images';
const BasicAccount: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<BasicAccountNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  function handleNextPress(): void {
    navigation.navigate('BottomSheetSocialAuth');
  }

  return (
    <ChoosingAccountType
      onPress={handleNextPress}
      description={`${t('Unlock essential features that help')} \n ${t(
        'you get started and connect with others.',
      )} \n${t(
        'With the Basic Account, you’ll enjoy exclusive access to essential tools designed for smooth interactions.',
      )} \n${t(
        'As you grow, you can always upgrade to explore more professional features and make the most out of your experience.',
      )}`}
      HeaderText={t('Basic Account')}
      descrptionHeader={t('Hi, Welcome to Basic Account')}
      image={
        my_data?.profile_pic ? {uri: my_data?.profile_pic} : images.profilePic
      }
    />
  );
};

export default React.memo(BasicAccount);
