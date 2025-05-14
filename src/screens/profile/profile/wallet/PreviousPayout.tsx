import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

const PreviousPayout = () => {
  const {t, i18n} = useTranslation();

  return (
    <View>
      <Text>{t('PreviousPayout')}</Text>
    </View>
  );
};

export default PreviousPayout;

const styles = StyleSheet.create({});
