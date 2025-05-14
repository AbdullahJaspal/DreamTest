import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {SharedValue, runOnJS, useDerivedValue} from 'react-native-reanimated';
import {gifs} from '../assets/gifs';

const {width, height} = Dimensions.get('screen');

interface FullScreenLoaderProps {
  sharedLoader: SharedValue<boolean>;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({sharedLoader}) => {
  const [loading, setLoading] = useState<boolean>(false);

  useDerivedValue(() => {
    runOnJS(setLoading)(sharedLoader.value);
  }, [sharedLoader]);

  if (!loading) {
    return null;
  } else {
    return (
      <View style={styles.loader}>
        <Image source={gifs.tiktokLoader} style={styles.loader_img} />
      </View>
    );
  }
};

export default React.memo(FullScreenLoader);

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 1000000,
  },
  loader_img: {
    width: 50,
    height: 50,
  },
});
