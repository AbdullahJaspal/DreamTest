import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ChoosingAccountType from '../../ChoosingAccountType';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {images} from '../../../../../assets/images';

const BusinessAccount1 = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  return (
    <ChoosingAccountType
      onPress={() => {
        navigation.navigate('BusinessAccount2');
      }}
      description={t(
        'Earn a lot of customers Who are waiting to come \n to you to buy Your Products',
      )}
      HeaderText={t('Business Account')}
      descrptionHeader={t(
        'Do You want to sell Your Produncts in a \n live Stream?',
      )}
      image={images.profilePic}
    />
  );
};

export default BusinessAccount1;

const styles = StyleSheet.create({});
