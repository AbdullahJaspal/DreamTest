import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  PressableProps,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import {icons} from '../../../assets/icons';

interface ProfileImageProps extends PressableProps {
  uri?: string;
  width?: number;
  height?: number;
  containerStyle?: ViewStyle;
  pictureStyle?: ImageStyle;
  coverStyle?: ImageStyle;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  uri,
  width = 35,
  height = 35,
  onPress,
  containerStyle,
  pictureStyle,
  coverStyle,
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
      width: 70,
      height: 70,
      borderColor: '#020202',
      position: 'absolute',
      top: -14,
      left: -15,
      ...coverStyle,
    },
  });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        source={uri ? {uri: uri} : icons.userFilled}
        style={styles.profile_image}
      />
    </Pressable>
  );
};

export default ProfileImage;
