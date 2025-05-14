import React, {
  useCallback,
  useImperativeHandle,
  useState,
  forwardRef,
  ReactNode,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  LayoutChangeEvent,
} from 'react-native';
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
import {BORDER, COLOR, SPACING} from '../../configs/styles';
import {HEIGHT} from '../../configs/constant';

import {Container} from '..';

interface BottomSheetProps {
  HeaderComponent?: ReactNode;
  FooterComponent?: ReactNode;
  children?: ReactNode;
  onCloseBottomSheet?: () => void;
}

export interface BottomSheetRef {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
  heightLayoutCurrent: () => number;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({HeaderComponent, FooterComponent, children, onCloseBottomSheet}, ref) => {
    const [heightLayout, setHeightLayout] = useState<number>(0);

    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue<{y: number}>({y: 0});

    const scrollTo = useCallback(
      (destination: number) => {
        'worklet';
        active.value = destination !== 0;

        translateY.value = withTiming(destination);

        if (destination === 0 && onCloseBottomSheet) {
          runOnJS(onCloseBottomSheet)();
        }
      },
      [onCloseBottomSheet],
    );

    const isActive = useCallback(() => active.value, []);

    const heightLayoutCurrent = useCallback(() => heightLayout, [heightLayout]);

    useImperativeHandle(
      ref,
      () => ({
        scrollTo,
        isActive,
        heightLayoutCurrent,
      }),
      [scrollTo, isActive, heightLayoutCurrent],
    );

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = {y: translateY.value};
      })
      .onUpdate(e => {
        translateY.value = e.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, -heightLayout);
      })
      .onEnd(() => {
        if (translateY.value > -heightLayout + heightLayout / 3) {
          scrollTo(0);
        } else {
          scrollTo(-heightLayout);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
      transform: [{translateY: translateY.value}],
    }));

    const rBottomSheetContainerStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        translateY.value,
        [-heightLayout, 0],
        ['#00000080', COLOR.TRANSPARENT],
      ),
      zIndex: interpolate(translateY.value, [-heightLayout, 0], [100, -1]),
    }));

    const getHeightLayout = useCallback((e: LayoutChangeEvent) => {
      const {height} = e.nativeEvent.layout;
      setHeightLayout(height);
    }, []);

    return (
      <Animated.View style={[styles.container, rBottomSheetContainerStyle]}>
        <Pressable onPress={() => scrollTo(0)}>
          <Container width="100%" height="100%" />
        </Pressable>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <GestureDetector gesture={gesture}>
            <View onLayout={getHeightLayout}>
              {HeaderComponent}
              {children}
              {FooterComponent}
            </View>
          </GestureDetector>
        </Animated.View>
      </Animated.View>
    );
  },
);

export default React.memo(BottomSheet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bottomSheetContainer: {
    backgroundColor: COLOR.WHITE,
    borderTopLeftRadius: BORDER.MEDIUM,
    borderTopRightRadius: BORDER.MEDIUM,
    overflow: 'hidden',
    position: 'absolute',
    top: HEIGHT,
    left: 0,
    right: 0,
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
