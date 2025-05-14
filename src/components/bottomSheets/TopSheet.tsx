import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useImperativeHandle, useState} from 'react';
import {BORDER, COLOR, SPACING} from '../../configs/styles';
import {HEIGHT} from '../../configs/constant';

import {Container} from '..';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const TopSheet = React.forwardRef(
  ({HeaderComponent, FooterComponent, children, onCloseTopSheet}, ref) => {
    const [heightLayout, setHeightLayout] = useState(0);

    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({y: 0});

    const scrollTo = useCallback(destination => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withTiming(-destination);

      if (destination === 0 && onCloseTopSheet) {
        runOnJS(onCloseTopSheet)();
      }
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    const heightLayoutCurrent = useCallback(() => {
      return heightLayout;
    }, [heightLayout]);

    useImperativeHandle(
      ref,
      () => ({scrollTo, isActive, heightLayoutCurrent}),
      [scrollTo, isActive, heightLayoutCurrent],
    );

    const gesture = Gesture.Pan()
      .onStart(e => {
        context.value = {y: translateY.value};
      })
      .onUpdate(e => {
        translateY.value = e.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, 0);
      })
      .onEnd(() => {
        if (translateY.value < heightLayout - heightLayout / 3) {
          scrollTo(0);
        } else {
          scrollTo(heightLayout);
        }
      });

    const rTopSheetStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateY: translateY.value}],
      };
    }, []);

    const rTopSheetContainerStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          translateY.value,
          [0, heightLayout],
          [COLOR.TRANSPARENT, '#00000080'],
        ),
        zIndex: interpolate(translateY.value, [0, heightLayout], [-1, 100]),
      };
    }, []);

    const getHeightLayout = useCallback(e => {
      const {height} = e.nativeEvent.layout;
      setHeightLayout(height);
    }, []);

    return (
      <Animated.View style={[styles.container, rTopSheetContainerStyle]}>
        <Pressable onPress={() => scrollTo(0)}>
          <Container width={'100%'} height={'100%'} />
        </Pressable>
        <Animated.View style={[styles.topSheetContainer, rTopSheetStyle]}>
          <GestureHandlerRootView>
            <GestureDetector gesture={gesture}>
              <View onLayout={getHeightLayout}>
                {HeaderComponent}
                {children}
                {FooterComponent}
              </View>
            </GestureDetector>
          </GestureHandlerRootView>
        </Animated.View>
      </Animated.View>
    );
  },
);

export default TopSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  topSheetContainer: {
    backgroundColor: COLOR.WHITE,
    // borderBottomLeftRadius: BORDER.MEDIUM,
    // borderBottomRightRadius: BORDER.MEDIUM,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: -250,
  },
  inputComment: {
    flexGrow: 1,
    paddingLeft: SPACING.S2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    backgroundColor: COLOR.TRANSPARENT,
  },
});
