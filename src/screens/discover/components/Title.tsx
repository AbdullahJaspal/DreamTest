import React from 'react';
import {StyleSheet} from 'react-native';
import CText from '../../../components/CText';
import {SPACING, TEXT} from '../../../configs/styles';

interface TitleProps {
  label: string;
}

const Title: React.FC<TitleProps> = ({label}) => {
  return (
    <CText text={TEXT.STRONG} fontSize={16} marginVertical={SPACING.S1}>
      {label}
    </CText>
  );
};

export default Title;

const styles = StyleSheet.create({});
