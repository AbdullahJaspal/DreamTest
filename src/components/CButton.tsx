import React from 'react';
import {StyleSheet, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import {BORDER, COLOR, SPACING, TEXT} from '../configs/styles';
import CText from '../components/CText';

interface CButtonProps {
  children?: React.ReactNode;
  activeOpacity?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  lable?: string;
  colorLabel?: string;
  sizeLabel?: number;
  width?: number;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  onLongPress?: () => void;
}

const CButton: React.FC<CButtonProps> = ({
  children,
  activeOpacity = 0.8,
  onPress,
  style,
  lable,
  colorLabel = COLOR.WHITE,
  sizeLabel,
  width,
  height,
  borderRadius = BORDER.SMALL,
  backgroundColor = COLOR.DANGER2,
  onLongPress,
}) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius,
      padding: SPACING.S2,
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      width,
      height,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={activeOpacity}
      onPress={onPress}
      onLongPress={onLongPress}>
      {lable ? (
        <CText text={TEXT.REGULAR} color={colorLabel} fontSize={sizeLabel}>
          {lable}
        </CText>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default CButton;
