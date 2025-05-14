import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface InputHeaderProps {
  headertext?: string;
}

const InputHeader: React.FC<InputHeaderProps> = ({headertext}) => {
  return (
    <View style={styles.main_container}>
      <Text style={styles.txt}>{headertext}</Text>
    </View>
  );
};

export default InputHeader;

const styles = StyleSheet.create({
  main_container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  txt: {
    fontSize: 20,
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
  },
});
