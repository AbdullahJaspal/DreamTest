import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {FastIconCustomType} from '../utils/interfaceStyles';
import FastImage from '@d11/react-native-fast-image';

const FastImageIcon = (props: FastIconCustomType) => {
  const {
    source,
    height = 24,
    width = 24,
    onPress,
    style,
    activeOpacity = 0.5,
    tintColor,
  } = props;

  const initStyles = StyleSheet.create({
    icon: {
      height,
      width,
      tintColor,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity}>
      <FastImage source={source} style={[initStyles.icon, style as any]} />
    </TouchableOpacity>
  );
};

export default FastImageIcon;
