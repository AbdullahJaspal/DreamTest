import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {COLOR} from '../../../configs/styles';
import {useNavigation} from '@react-navigation/native';
import {icons} from '../../../assets/icons';

interface CloseButtonProps {
  icon?: ImageProps;
  containerStyle?: ViewStyle;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  icon = icons.close,
  containerStyle,
}) => {
  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity
      onPress={handleGoBack}
      style={[styles.container, containerStyle]}>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
  );
};

export default React.memo(CloseButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: COLOR.WHITE,
  },
});
