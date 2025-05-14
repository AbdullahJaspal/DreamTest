import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import Svg, {Rect, Path} from 'react-native-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

interface MicModelProps {
  modalvisable: boolean;
  setmodalvisible: (visible: boolean) => void;
  recognizedText: string;
  islistner: boolean;
  volume: number;
  toglemodal: () => void;
  setVolume: (volume: number) => void;
}

const Mic_model: React.FC<MicModelProps> = ({
  modalvisable,
  setmodalvisible,
  recognizedText,
  islistner,
  volume,
  toglemodal,
  setVolume,
}) => {
  const onSpeechVolumeChangedHandler = (event: {value: number}) => {
    setVolume(event.value);
  };

  const DotAnimation = () => {
    const renderComponents = Array.from({length: 7}).map((_, index) => {
      const adjustedVolume = Math.max(volume, 0);
      let customHeight: number;
      let customWidth: number;
      if (adjustedVolume <= 0) {
        customHeight = 4;
        customWidth = 4;
      } else {
        customHeight = 10 + index * adjustedVolume;
        customWidth = 4;
      }

      const animatedCustomStyle = useAnimatedStyle(() => {
        let adjustedHeight: number;
        let adjustedWidth = customWidth;
        if (adjustedVolume <= 0) {
          adjustedHeight = 4;
        } else {
          adjustedHeight = customHeight > 40 ? 40 : customHeight;
          if (index === 2 || index === 4) {
            adjustedHeight += 24;
            adjustedWidth += 1;
          }
        }

        return {
          height: adjustedHeight,
          width: adjustedWidth,
        };
      });

      return (
        <Animated.View key={index} style={[styles.box, animatedCustomStyle]} />
      );
    });

    return <View style={styles.container}>{renderComponents}</View>;
  };

  return (
    <SafeAreaView>
      <Modal animationType="slide" visible={modalvisable} transparent={true}>
        <View style={styles.modelcontainer}>
          <View style={styles.model_wrap}>
            <TouchableOpacity
              onPress={toglemodal}
              style={{paddingHorizontal: 8}}>
              <Image source={icons.close} style={styles.modelclosestyle} />
            </TouchableOpacity>
            <Svg width={width} height={height * 0.19}>
              <Rect
                x="0"
                y="69"
                width={width}
                height={height * 0.19}
                fill="white"
              />

              <Path
                d={`M 0,75
                A ${width / 3},50 0 0 1 ${width},77`}
                fill="white"
              />

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 27,
                }}>
                <View>
                  <Text style={{color: '#000', fontSize: 15}}>
                    {islistner ? recognizedText : 'Listening..'}
                  </Text>
                </View>
                <View>{islistner ? <DotAnimation /> : null}</View>
              </View>
            </Svg>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Mic_model;

const styles = StyleSheet.create({
  modelcontainer: {
    flex: 1,
    width: width,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  model_wrap: {
    width: width,
    height: height * 0.19,
    position: 'absolute',
    bottom: 0,
  },
  modelclosestyle: {
    width: width * 0.06,
    height: width * 0.04,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  box: {
    backgroundColor: '#b58df1',
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
