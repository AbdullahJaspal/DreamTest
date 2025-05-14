import {interpolate} from 'react-native-reanimated';
import {SERVER_DOMAIN} from '../constants/constants';

const getTranslateX = () => {
  const snapshot = 50;
  const radius = 30;
  const inputRangeX = [];
  const outputRangeX = [];
  for (let i = 0; i <= snapshot; ++i) {
    const value = i / snapshot;
    const move = -Math.sin((value * Math.PI) / 2) * radius;
    inputRangeX.push(value);
    outputRangeX.push(move);
  }

  return [inputRangeX, outputRangeX];
};

const getTranslateY = () => {
  const snapshot = 50;
  const radius = 100;
  const inputRangeY = [];
  const outputRangeY = [];
  for (let i = 0; i <= snapshot; ++i) {
    const value = i / snapshot;
    const move = -Math.cos(value * Math.PI * 2) * radius;
    inputRangeY.push(value);
    outputRangeY.push(move);
  }

  return [inputRangeY, outputRangeY];
};

const getMusicAnimated = (
  value: number,
  inputRange: readonly number[],
  outputRange: readonly number[],
) => {
  return {
    transform: [
      {
        translateX: interpolate(value, inputRange, outputRange),
      },
      {
        translateY: interpolate(value, [0, 1], [0, -48]),
      },
      {
        rotate: `${interpolate(value, [0, 1], [0, 45])}deg`,
      },
      {
        scale: interpolate(value, [0, 1], [0.5, 1]),
      },
    ],
    opacity: interpolate(value, [0, 0.8, 1], [0, 1, 0]),
  };
};

const urlSourceMedia = (url: any) => {
  return `${SERVER_DOMAIN}/${url}`;
};

export {getTranslateX, getTranslateY, getMusicAnimated, urlSourceMedia};
