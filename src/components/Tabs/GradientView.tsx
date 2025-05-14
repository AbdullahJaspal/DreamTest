import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  style: StyleProp<ViewStyle>[];
}
const DreamGradient = (props: Props) => {
  return (
    <View style={props.style}>
      <LinearGradient
        colors={['#000000', '#ff0050']}
        start={{x: 0.6, y: 0.9}}
        end={{x: 0.6, y: 0.1}}
        style={props.style}>
        {props.children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});

export default DreamGradient;
