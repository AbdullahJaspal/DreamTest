import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {gradientColors} from '../../../constants/colors';

const {width} = Dimensions.get('screen');

const TimeAndDateButton: React.FC = () => {
  return (
    <View style={styles.selection_container}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient_selection_box}>
        <Text style={styles.gradient_text}>
          Time and Date
          {'\n'}
          Immediately
        </Text>
      </LinearGradient>
      <Text style={styles.box_info_txt}>Time and date</Text>
    </View>
  );
};

export default TimeAndDateButton;

const styles = StyleSheet.create({
  gradient_text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  selection_container: {
    // marginVertical: 15,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  box_info_txt: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 5,
  },
  gradient_selection_box: {
    // width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF005C',
    paddingHorizontal: 10,
  },
});
