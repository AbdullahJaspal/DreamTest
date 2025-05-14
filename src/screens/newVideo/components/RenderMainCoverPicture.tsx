import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

interface RenderMainCoverPictureProps {
  item: string;
  index: number;
}

const {width, height} = Dimensions.get('screen');

const RenderMainCoverPicture: React.FC<RenderMainCoverPictureProps> = ({
  item,
  index,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      let newScale = savedScale.value * e.scale;
      newScale = Math.max(0.5, Math.min(newScale, 3));
      scale.value = newScale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View style={styles.bigger_cover_view}>
        <Animated.Image
          resizeMode="contain"
          source={{uri: `file://${item}`}}
          style={[{width: width * 0.9, height: height * 0.7}, animatedStyle]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default RenderMainCoverPicture;

const styles = StyleSheet.create({
  bigger_cover_view: {
    width: width,
    height: height * 0.76,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
