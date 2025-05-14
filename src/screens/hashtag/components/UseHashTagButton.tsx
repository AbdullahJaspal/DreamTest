import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '../../../assets/icons';

const colors = [
  '#0c65f2',
  '#4287f5',
  '#6f9fd5',
  '#9cb7eb',
  '#c9d0f2',
  '#f6f7f8',
];
const {width} = Dimensions.get('screen');

interface UseHashTagButtonProps {
  handleUseHashtagPress: () => void;
}
const UseHashTagButton: React.FC<UseHashTagButtonProps> = ({
  handleUseHashtagPress,
}) => {
  return (
    <View style={styles.bottom_button}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient_view}
        colors={colors}>
        <Pressable
          onPress={handleUseHashtagPress}
          style={[styles.original_view]}>
          <Text style={styles.sound_txt}>Use Hashtag</Text>
          <Image source={icons.hashtag} style={styles.fav_image} />
        </Pressable>
      </LinearGradient>
    </View>
  );
};

export default React.memo(UseHashTagButton);

const styles = StyleSheet.create({
  sound_txt: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
  },
  bottom_button: {
    width: 250,
    position: 'absolute',
    bottom: 50,
    left: (width - 250) / 2,
    zIndex: 10,
    elevation: 100,
    alignItems: 'center',
  },
  gradient_view: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 130,
    height: 45,
  },
  original_view: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fav_image: {
    width: 20,
    height: 20,
    tintColor: 'rgba(0, 0, 0, 0.7)',
  },
});
