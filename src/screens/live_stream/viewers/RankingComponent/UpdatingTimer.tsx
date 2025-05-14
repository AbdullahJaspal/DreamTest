import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('screen');

interface UpdatingTimerProps {
  selectedTimeFrame: number;
}

const UpdatingTimer: React.FC<UpdatingTimerProps> = ({selectedTimeFrame}) => {
  return (
    <View style={styles.countdown_main_container}>
      <Text style={styles.countdown_update_txt}>Update After :</Text>
      <Text style={styles.countdown_time_txt}>{updatedCountdown}</Text>
    </View>
  );
};

export default UpdatingTimer;

const styles = StyleSheet.create({
  countdown_main_container: {
    width: width,
    paddingHorizontal: 10,
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdown_update_txt: {
    color: '#000',
    fontWeight: '500',
    marginRight: 5,
    fontSize: 14,
  },
  countdown_time_txt: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '700',
    fontSize: 14,
  },
});
