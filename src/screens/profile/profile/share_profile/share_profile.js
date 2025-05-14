import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React from 'react';
import Header from '../components/Header';

const share_profile = () => {
  return (
    <View style={styles.container}>
      <Text>share_profile</Text>
    </View>
  );
};

export default share_profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
});
