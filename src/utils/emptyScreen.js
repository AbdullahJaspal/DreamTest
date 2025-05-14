import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const EmptyScreen = ({
  message,
  imageSource,
  imageStyle,
  textStyle,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={imageSource} style={[styles.image, imageStyle]} />
      <Text style={[styles.text, textStyle]}>{message}</Text>
    </View>
  );
};

export default EmptyScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  image: {
    width: 70,
    height: 70,
    marginBottom: 20,
    resizeMode: 'contain',
    tintColor: 100,
  },
  text: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
