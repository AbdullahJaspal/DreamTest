import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {icons} from '../../assets/icons';
const {width} = Dimensions.get('screen');

const PaymentSelectionHeader: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.upper_container}>
      <Text style={styles.recharge_text}>Payments Method</Text>

      <Pressable
        style={styles.question_mark_view}
        onPress={() => setShowInfo(true)}>
        <Image source={icons.questionMark} style={{width: 20, height: 20}} />
      </Pressable>
      {/* <InfoModal
        show_model={showInfo}
        setShowModel={setShowInfo}
        title="Payment Method Info"
      /> */}
    </View>
  );
};

export default PaymentSelectionHeader;

const styles = StyleSheet.create({
  upper_container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    padding: 15,
    flexDirection: 'row',
  },
  recharge_text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
  question_mark_view: {
    position: 'absolute',
    right: 15,
  },
});
