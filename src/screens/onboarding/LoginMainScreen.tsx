import {Dimensions, Pressable} from 'react-native';
import React from 'react';
import {Container, Icon, CText} from '../../components';
import {COLOR, SPACING, BORDER, TEXT} from '../../configs/styles';
import {useNavigation} from '@react-navigation/native';
import {LoginMainScreenNavigationProps} from '../../navigations/types/OnboardingNavigationAndRoute';
import {useTranslation} from 'react-i18next';
import {icons} from '../../assets/icons';
const {width, height} = Dimensions.get('screen');

const LoginMainScreen: React.FC = () => {
  const navigation = useNavigation<LoginMainScreenNavigationProps>();
  const {t, i18n} = useTranslation();
  function handleSignInPress(): void {
    navigation.navigate('BasicAccount');
  }

  function handleGoBack(): void {
    try {
      navigation.goBack();
    } catch (error) {
      console.log('Error generated while going back', error);
    }
  }

  return (
    <Container
      flex={1}
      alignItems="center"
      justifyContent="center"
      style={{
        width: width,
        height: height,
      }}
      backgroundColor={COLOR.WHITE}>
      <Container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor={COLOR.WHITE}
        padding={SPACING.S3}
        borderRadius={BORDER.MEDIUM}
        width={'80%'}>
        <Container alignSelf="flex-end">
          <Icon source={icons.close} onPress={handleGoBack} />
        </Container>
        <Icon
          source={icons.dreamLogo}
          width={80}
          height={95}
          marginBottom={SPACING.S3}
        />
        <CText
          text={TEXT.H3}
          color={COLOR.BLACK}
          marginVertical={SPACING.S1}
          textAlign="center">
          {t('Log in to follow the account')} {'\n'}{' '}
          {t('and like or comment on')}
          {'\n'}
          {t('video')}
        </CText>
        <CText
          text={TEXT.SUBTITLE}
          color={COLOR.GRAY}
          marginVertical={SPACING.S1}
          textAlign="center"
          fontSize={13}>
          {t('The Dream experience is more enjoyable when you')}
          {'\n'} {t('follow and share with friends.')}
        </CText>
        <Pressable onPress={handleSignInPress}>
          <Container
            width={width * 0.7}
            borderRadius={BORDER.SMALL}
            backgroundColor={COLOR.DANGER2}
            padding={SPACING.S2}
            justifyContent="center"
            alignItems="center"
            marginTop={SPACING.S3}>
            <CText color={COLOR.WHITE}>{t('Sign in or Register')}</CText>
          </Container>
        </Pressable>
      </Container>
    </Container>
  );
};

export default React.memo(LoginMainScreen);
