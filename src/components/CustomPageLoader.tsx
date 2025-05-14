import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import FastImage from '@d11/react-native-fast-image';
import {gifs} from '../assets/gifs';

interface CustomPageLoaderProps {
  isLoading: boolean;
}

const {width, height} = Dimensions.get('screen');

const CustomPageLoader: React.FC<CustomPageLoaderProps> = ({isLoading}) => {
  return isLoading ? (
    <View style={styles.main_container}>
      <FastImage source={gifs.tiktokLoader} style={styles.loader} />
    </View>
  ) : null;
};

export default React.memo(CustomPageLoader);

const styles = StyleSheet.create({
  main_container: {
    width: width,
    height: height,
    zIndex: 100000,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 40,
    height: 40,
  },
});
