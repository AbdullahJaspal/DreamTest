import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {DateTime} from 'luxon';

const {width} = Dimensions.get('screen');

interface UpdateTimersProps {
  endtime: string;
  selected_time_frame: number;
}

const UpdateTimers: React.FC<UpdateTimersProps> = ({
  endtime,
  selected_time_frame,
}) => {
  const [updatedCountdown, setUpdatedCountdown] = useState<string>();

  const calculateLastDT = (selected_time_frame: number) => {
    let endTimeDate;
    switch (selected_time_frame) {
      case 1:
        endTimeDate = DateTime.fromISO(endtime).plus({months: 1});
        break;
      case 2:
        endTimeDate = DateTime.fromISO(endtime).plus({weeks: 1});
        break;
      case 3:
        endTimeDate = DateTime.fromISO(endtime).plus({days: 1});
        break;
      case 4:
        endTimeDate = DateTime.fromISO(endtime).plus({hours: 1});
        break;
      default:
        throw new Error('Invalid selected_time_frame value provided');
    }
    return endTimeDate;
  };

  const updateCountdown = useCallback(() => {
    try {
      if (endtime && selected_time_frame) {
        const currentTime = DateTime.local();
        const endTimeDate = calculateLastDT(selected_time_frame);
        const difference = endTimeDate.diff(currentTime);
        const formattedTime = difference.toFormat('d:hh:mm:ss');
        setUpdatedCountdown(formattedTime);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [endtime, selected_time_frame]);

  useEffect(() => {
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [updateCountdown]);

  return (
    <View style={styles.countdown_main_container}>
      <Text style={styles.countdown_update_txt}>Update After :</Text>
      <Text style={styles.countdown_time_txt}>{updatedCountdown}</Text>
    </View>
  );
};

export default React.memo(UpdateTimers);

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
