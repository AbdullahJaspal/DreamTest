import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../utils/colors';

const {width} = Dimensions.get('window');

interface DownloadAndUseSoundProps {
  handleUseSoundPress: () => void;
  getSound: () => void;
  download_loading: boolean;
}

const DownloadAndUseSound: React.FC<DownloadAndUseSoundProps> = ({
  handleUseSoundPress,
  getSound,
  download_loading,
}) => {
  return (
    <View style={styles.bottom_button}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient_view}
        colors={colors}>
        <Pressable
          onPress={handleUseSoundPress}
          style={[styles.original_view, {flexDirection: 'row'}]}>
          <Text style={styles.sound_txt}>Use sound</Text>
          <Feather name="video" size={20} color={'#000'} />
        </Pressable>
      </LinearGradient>

      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.gradient_view]}
        colors={colors}>
        {download_loading ? (
          <ActivityIndicator size={'small'} color={'#000'} />
        ) : (
          <Pressable
            onPress={!download_loading ? getSound : undefined}
            style={[styles.original_view]}>
            <Text style={styles.sound_txt}>Download</Text>
          </Pressable>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom_button: {
    width: 300,
    position: 'absolute',
    bottom: 50,
    left: (width - 300) / 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    elevation: 100,
  },
  original_view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sound_txt: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
  },
  gradient_view: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 130,
    height: 45,
  },
});

export default React.memo(DownloadAndUseSound);
