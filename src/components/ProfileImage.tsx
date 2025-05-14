import {StyleSheet, Image, Pressable} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import React, {useMemo} from 'react';
import {icons} from '../assets/icons';

interface ProfileImageProps {
  uri?: string;
  width?: number;
  height?: number;
  onPress?: () => void;
  allowCover?: boolean;
  allowBorderRadius?: boolean;
  borderRadius?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  uri,
  width = 40,
  height = 40,
  onPress,
  allowBorderRadius = true,
  allowCover = true,
  borderRadius = 100,
}) => {
  const profileImageStyles = useMemo(
    () => ({
      width,
      height,
      borderRadius: allowBorderRadius ? borderRadius : 0,
    }),
    [width, height, allowBorderRadius],
  );

  const coverImageStyles = useMemo(
    () => ({
      width: width + 20,
      height: height + 20,
    }),
    [width, height],
  );

  return (
    <Pressable style={[styles.container, profileImageStyles]} onPress={onPress}>
      <FastImage
        source={uri ? {uri} : icons.userFilled}
        style={profileImageStyles}
        resizeMode={FastImage.resizeMode.cover}
      />
      {allowCover && (
        <FastImage
          source={icons.crown}
          style={[styles.coverImage, coverImageStyles]}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    position: 'absolute',
    zIndex: 1000,
  },
});

export default React.memo(ProfileImage);
