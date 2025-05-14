import {StyleSheet} from 'react-native';
import React from 'react';
import ChoosingAccountType from '../../ChoosingAccountType';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {images} from '../../../../../assets/images';

const BusinessAccount3 = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  return (
    <ChoosingAccountType
      onPress={() => {
        navigation.navigate('BusinessAccount');
      }}
      description={t(
        'You can obtain a commented account in one of the two \n Ways:- \n 1. 5% discount on each Sale Without Promoting \n the account \n 2. Monthly Subscription of $450 24 uh everyday \n Promotion ans Premium account features',
      )}
      HeaderText={t('Business Account')}
      descrptionHeader={t(
        'How do i get the Possibility to own a Business account?',
      )}
      image={images.handshake}
    />
  );
};

export default BusinessAccount3;

const styles = StyleSheet.create({});
