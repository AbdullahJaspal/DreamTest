import React, {useState} from 'react';
import {View, StyleSheet, PanResponder, Animated} from 'react-native';

const CustomSlider = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const pan = useState(new Animated.ValueXY({x: 0, y: 0}))[0];

  const panResponder = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        const totalWidth = 300; // Replace with your desired width
        const value = pan.x._value / totalWidth;
        setSliderValue(value);
      },
    }),
  )[0];

  return (
    <View style={styles.container}>
      <View style={styles.sliderTrack} />
      <Animated.View
        style={[styles.sliderThumb, {transform: pan.getTranslateTransform()}]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 250,
    justifyContent: 'center',
    // alignItems: 'center'
  },
  sliderTrack: {
    height: 3,
    backgroundColor: '#fff',
  },
  sliderThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
  },
});

export default CustomSlider;
