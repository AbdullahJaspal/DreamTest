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

const Myheader = ({headertext, righttext, navigationScreen}) => {
  const navigation = useNavigation();
  const nextTextHandler = () => {
    console.log('hello');
  };
  return (
    <View style={styles.main_container}>
      <TouchableOpacity
        style={{width: width * 0.1}}
        onPress={() => {
          navigation.goBack();
        }}>
        <AntDesign name="arrowleft" color={'#020202'} size={25} />
      </TouchableOpacity>
      <View
        style={{
          width: width * 0.7,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.txt}>{headertext}</Text>
      </View>
      <View style={{width: width * 0.1}}>
        <Text style={styles.righttxt} onPress={nextTextHandler}>
          {righttext}
        </Text>
      </View>
    </View>
  );
};

export default Myheader;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    // marginRight:width*0.05,
    // marginLeft:width*0.05,

    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 0,
    alignItems: 'center',
    zIndex: 1000,
    borderBottomWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  // arrow_button: {
  //     position: 'absolute',
  //     left: 15
  // },
  txt: {
    fontSize: 20,
    color: '#020202',
  },
  //     rightside:{
  // position: 'absolute',
  // left: width*0.85,
  // paddingVertical:13
  // },
  righttxt: {
    fontSize: 16,
    color: '#cc1f2d',
  },
});
