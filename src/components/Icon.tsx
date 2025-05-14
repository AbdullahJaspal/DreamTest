import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {IconCustomType} from '../utils/interfaceStyles';

const Icon = (props: IconCustomType) => {
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
      <Image source={source} style={[initStyles.icon, style as any]} />
    </TouchableOpacity>
  );
};

export default Icon;
