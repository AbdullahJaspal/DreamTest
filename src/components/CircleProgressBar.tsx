import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

interface CircleProgressBarProps {
  progress: number;
  radius: number;
  strokeWidth: number;
}

const CircleProgressBar: React.FC<CircleProgressBarProps> = ({
  progress,
  radius,
  strokeWidth,
}) => {
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke="lightgray"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          stroke={'orange'}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.text}>{progress}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
  },
  text: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CircleProgressBar;
