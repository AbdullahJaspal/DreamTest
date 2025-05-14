import {useEffect, useCallback} from 'react';
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';

const useDiscAnimation = () => {
  const discAnimatedValue = useSharedValue(0);

  const startAnimation = useCallback(() => {
    discAnimatedValue.value = withRepeat(
      withTiming(360, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [discAnimatedValue]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const discAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${discAnimatedValue.value}deg`,
        },
      ],
    };
  });

  return discAnimatedStyle;
};

export default useDiscAnimation;
