import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ChoosingAccountType from '../../ChoosingAccountType';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {images} from '../../../../../assets/images';

const BusinessAccount2 = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  return (
    <ChoosingAccountType
      onPress={() => {
        navigation.navigate('BusinessAccount3');
      }}
      description={t(
        'Yes, the business account includes Continuous Promotion On the Dream app 23 hours a day \n \n in addition to all the features of the Premium \n account',
      )}
      HeaderText={t('Business Account')}
      descrptionHeader={t(
        'Is there a free Promotion for a Business \n account?',
      )}
      image={images.profilePic}
    />
  );
};

export default BusinessAccount2;

const styles = StyleSheet.create({});
