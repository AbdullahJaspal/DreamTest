import React from 'react';
import {useAppSelector} from '../../store/hooks';
import {useNavigation} from '@react-navigation/native';
import {selectMyProfileData} from '../../store/selectors';
import ChoosingAccountType from './components/ChoosingAccountType';
import {PremiumAccountNavigationProps} from '../../navigations/types/OnboardingNavigationAndRoute';
import {images} from '../../assets/images';

const PremiumAccount: React.FC = () => {
  const navigation = useNavigation<PremiumAccountNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);

  function handleNextPress(): void {
    navigation.navigate('PremiumPaymentsPreviewScreen');
  }

  return (
    <ChoosingAccountType
      onPress={handleNextPress}
      description={
        'With the Premium Account, you will \n unlock a suite of over 30 professional features. \nEnjoy exclusive tools designed to elevate your experience, optimize your workflow, and empower your \n connections. Upgrade to Premium and experience \n the best we have to offer!'
      }
      HeaderText={'Premium Account'}
      descrptionHeader={'Welcome to Premium Account'}
      image={
        my_data?.profile_pic ? {uri: my_data?.profile_pic} : images.profilePic
      }
    />
  );
};

export default React.memo(PremiumAccount);
