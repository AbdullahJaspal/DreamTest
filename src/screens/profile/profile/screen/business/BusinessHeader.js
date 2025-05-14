import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

const BusinessHeader = ({headertext}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.main_container}>
      <TouchableOpacity
        style={styles.arrow_button}
        onPress={() => {
          navigation.goBack();
        }}>
        <AntDesign name="arrowleft" color={'#020202'} size={25} />
      </TouchableOpacity>
      <View>
        <Text style={styles.txt}>{headertext}</Text>
      </View>
    </View>
  );
};

export default BusinessHeader;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 0,
    alignItems: 'center',
    zIndex: 1000,
    borderBottomWidth: 0.5,
    borderColor: 'red',
  },
  arrow_button: {
    position: 'absolute',
    left: 15,
  },
  txt: {
    fontSize: 20,
    color: '#020202',
    marginLeft: 50,
  },
});
