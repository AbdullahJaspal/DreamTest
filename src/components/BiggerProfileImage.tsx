import {
  StyleSheet,
  Image,
  Pressable,
  ImageStyle,
  ImageProps,
} from 'react-native';
import React from 'react';
import {ViewStyle} from 'react-native';
import {icons} from '../assets/icons';

interface BiggerProfileImageProps {
  uri: string;
  width?: number;
  height?: number;
  onPress?: () => void;
  containerStyle?: ViewStyle | undefined;
  pictureStyle?: ImageStyle | undefined;
  coverStyle?: ImageStyle | undefined;
  coverPic?: ImageProps;
}

const BiggerProfileImage: React.FC<BiggerProfileImageProps> = ({
  uri,
  width = 60,
  height = 60,
  onPress,
  containerStyle,
  pictureStyle,
  coverStyle,
  coverPic,
}) => {
  const styles = StyleSheet.create({
    container: {
      ...containerStyle,
    },
    profile_image: {
      width: width,
      height: height,
      borderRadius: 35,
      borderColor: '#020202',
      ...pictureStyle,
    },
    cover_images: {
      width: 110,
      height: 110,
      borderColor: '#020202',
      position: 'absolute',
      top: -26,
      left: -26,
      ...coverStyle,
    },
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={uri ? {uri: uri} : icons.userFilled}
        style={styles.profile_image}
      />

      {coverPic && <Image source={coverPic} style={styles.cover_images} />}
    </Pressable>
  );
};

export default React.memo(BiggerProfileImage);
