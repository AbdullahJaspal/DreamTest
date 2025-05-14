import React, {useState, useEffect} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Pic from 'react-native-vector-icons/FontAwesome5';
import Sticker from 'react-native-vector-icons/MaterialCommunityIcons';

const Layeranimation = () => {
  const [buttonOpacity] = useState(new Animated.Value(0));
  const [buttonTranslate] = useState(new Animated.Value(100));
  const [modal, setModal] = useState(false);

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderButtons = () => {
    {
      return (
        <>
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{translateY: buttonTranslate}],
              },
            ]}>
            <TouchableOpacity>
              <Pic name="photo-video" color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{translateY: buttonTranslate}],
              },
            ]}>
            {/* <Button
              title="Button 2"
              onPress={() => console.log('Button 2 pressed')}
            /> */}
            <TouchableOpacity>
              <Sticker name="sticker-plus" color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{translateY: buttonTranslate}],
              },
            ]}>
            {/* <Button
              title="Button 3"
              onPress={() => console.log('Button 3 pressed')}
            /> */}
            <TouchableOpacity>
              <Pic name="paint-brush" color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{translateY: buttonTranslate}],
              },
            ]}>
            {/* <Button
              title="Button 4"
              onPress={() => console.log('Button 4 pressed')}
            /> */}
            <TouchableOpacity>
              <Sticker name="format-text" color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonOpacity,
                transform: [{translateY: buttonTranslate}],
              },
            ]}>
            {/* <Button
              title="Button 5"
              onPress={() => console.log('Button 5 pressed')}
            /> */}
            <TouchableOpacity>
              <Pic name="photo-video" color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>
        </>
      );
    }
    // return null;
  };

  return (
    <View style={styles.container}>
      {renderButtons()}
      {startAnimation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    shadowColor: 'white',
  },
  buttonContainer: {
    marginBottom: 10,
    top: 10,
    opacity: 0,
    transform: [{translateY: 100}],
  },
});
export default Layeranimation;
