import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MuteAudio: React.FC = () => {
  return (
    <View style={styles.overlay}>
      {/* <Text style={styles.watermarkText}>
        Audio Muted Due to Copyright Restrictions
      </Text> */}
    </View>
  );
};

export default React.memo(MuteAudio);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  watermarkText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    transform: [{rotate: '-30deg'}],
    opacity: 0.3,
    letterSpacing: 2,
  },
});
