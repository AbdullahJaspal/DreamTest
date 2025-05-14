import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactElement} from 'react';
import {DurationSelectionTabProps} from '../types/ranking';

function DurationSelectionTab(
  info: ListRenderItemInfo<DurationSelectionTabProps>,
): ReactElement | null {
  const {item, index} = info;

  function handleContainerPress(): void {
    // setSelected_time_frame(index);
    item.onPress();
  }

  return (
    <TouchableOpacity
      onPress={handleContainerPress}
      style={[
        styles.time_frame_view,
        {
          backgroundColor:
            selected_time_frame === index ? '#C8A7FF' : '#f1f1f1',
        },
      ]}>
      <Text style={styles.evaluation_txt}>{item?.name}</Text>
      <Text style={styles.time_frame_txt}>{item?.time_frame}</Text>
    </TouchableOpacity>
  );
}

export default DurationSelectionTab;

const styles = StyleSheet.create({
  time_frame_view: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
  evaluation_txt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  time_frame_txt: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
});
