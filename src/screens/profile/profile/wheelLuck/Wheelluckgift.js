import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React from 'react';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Octicons';

const Wheelluckgift = () => {
  const {t, i18n} = useTranslation();

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Wheel Luck Gift')} />
      <View style={styles.content}>
        <Icon name="comment-discussion" size={150} color="#f2f2f2" />
        <Text style={styles.message}>{t('No Data Available')}</Text>
      </View>
    </View>
  );
};

export default Wheelluckgift;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#ffff',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
});
