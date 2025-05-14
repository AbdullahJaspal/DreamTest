import {StyleSheet, View} from 'react-native';
import React from 'react';
import {COLOR, TEXT} from '../../../configs/styles/index';

const Effect: React.FC = () => {
  return <View style={styles.container}></View>;
};

export default React.memo(Effect);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  icon: {
    width: 41,
    height: 41,
  },
  text: {
    ...TEXT.SMALL,
    color: COLOR.WHITE,
  },
});
