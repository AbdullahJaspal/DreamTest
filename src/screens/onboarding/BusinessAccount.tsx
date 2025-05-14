import React from 'react';
import {useAppSelector} from '../../store/hooks';
import {useNavigation} from '@react-navigation/native';
import {selectMyProfileData} from '../../store/selectors';
import ChoosingAccountType from './components/ChoosingAccountType';
import {BusinessAccountNavigationProps} from '../../navigations/types/OnboardingNavigationAndRoute';
import {images} from '../../assets/images';

const BusinessAccount: React.FC = () => {
  const navigation = useNavigation<BusinessAccountNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  function handleNextButtonPress(): void {
    navigation.navigate('BusinessPaymentsPreviewScreen');
  }

  return (
    <ChoosingAccountType
      onPress={handleNextButtonPress}
      description={
        'With the business Account, You will \n  get business features in Premium \n suite it includes more than 30 \n Professional Features'
      }
      HeaderText={'Business Account'}
      descrptionHeader={'Hello here to the business account'}
      image={
        my_data?.profile_pic ? {uri: my_data?.profile_pic} : images.profilePic
      }
    />
  );
};

export default React.memo(BusinessAccount);
