import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Container, CText, Icon} from '../../../components';
import {BORDER, COLOR, SPACING, TEXT} from '../../../configs/styles';
import {useTranslation} from 'react-i18next';
import {images} from '../../../assets/images';

interface NotFoundDataProps {
  onPress: () => void;
}

const NotFoundData: React.FC<NotFoundDataProps> = ({onPress}) => {
  const {t, i18n} = useTranslation();

  return (
    <Container flex={1} justifyContent="center" alignItems="center">
      <Icon
        source={images.wifi}
        width={120}
        height={120}
        // tintColor={COLOR.GRAY}
        marginBottom={SPACING.S2}
      />
      <CText text={TEXT.STRONG} color={COLOR.WHITE} fontSize={16}>
        {t('Internet connection is not stable')}
      </CText>
      <CText text={TEXT.REGULAR} color={COLOR.LIGHT_GRAY}>
        {t('Connect to the internet and try again')}
      </CText>
      <TouchableOpacity onPress={onPress}>
        <Container
          marginTop={200}
          width={230}
          padding={SPACING.S2}
          backgroundColor={COLOR.GRAY}
          borderRadius={BORDER.SMALL}>
          <CText text={TEXT.REGULAR} textAlign="center" color={COLOR.WHITE}>
            {t('Retry')}
          </CText>
        </Container>
      </TouchableOpacity>
    </Container>
  );
};

export default React.memo(NotFoundData);

const styles = StyleSheet.create({});
