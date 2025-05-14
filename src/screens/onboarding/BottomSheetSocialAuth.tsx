import React, {useMemo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  ImageProps,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';
import {onGoogleButtonPress} from '../../auth/google.auth';
import {onAppleButtonPress} from '../../auth/apple.auth';
import {signIn} from '../../apis/auth.api';
import * as authApi from '../../apis/auth.api';

import {setBottomSheetSignIn} from '../../store/slices/ui/indexSlice';
import {
  add_my_profile_data,
  addIsLogin,
} from '../../store/slices/user/my_dataSlice';
import {selectBottomSheetSignIn} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';

import Container from '../../components/Container';
import Icon from '../../components/Icon';
import CText from '../../components/CText';
import FormSignUp from '../../components/bottomSheets/FormSignUp';
import FormSignIn from '../../components/bottomSheets/FormSignIn';
import InfoModal from '../../components/infoButtonModal';

import {BottomSheetSocialAuthNavigationProps} from '../../navigations/types/OnboardingNavigationAndRoute';
import {icons} from '../../assets/icons';

import Animated, {
  LightSpeedInRight,
  LightSpeedInLeft,
  LightSpeedOutRight,
  LightSpeedOutLeft,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

interface SocialIconProps {
  icon: ImageProps;
  using: string;
  color?: string;
  onPress?: () => void;
  index: number | 0;
}

const save_data = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

const BottomSheetSocialAuth: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<BottomSheetSocialAuthNavigationProps>();

  const [currentForm, setCurrentForm] = useState(0);

  const [dataSocial, setDataSocial] = useState([]);

  const bottomSheetSignIn = useAppSelector(selectBottomSheetSignIn);
  const [showInfo, setShowInfo] = useState(false);
  const faqData = [
    {
      question: t('Forgot Password'),
      answer: `${t(
        'If you have forgotten your password, follow these steps:',
      )}\n\n ${t('If you are not logged in:')}\n- ${t(
        'On the login screen, tap "Forgot Password".',
      )}\n- ${t('Choose to reset via email or phone number.')}\n- ${t(
        'Follow the instructions sent to your email or phone to create a new password.',
      )}\n\n ${t('If you are logged in:')}\n- ${t(
        'Navigate to Profile at the bottom of your screen.',
      )}\n-${t('Tap "Settings" in the top-right corner.')}\n- ${t(
        'Select Account Settings > Change Password.',
      )}\n- ${t(
        'Enter your current password, then set a new one.',
      )}\n\nNote:\n${t(
        'If your account was created through a third-party login (e.g., Google, Facebook), reset your password directly on the linked platform.',
      )}`,
    },
    {
      question: t('Suspended Account'),
      answer: `${t(
        'Dream prioritizes a safe and enjoyable experience for all users. Accounts found violating our Community Guidelines may be temporarily suspended.',
      )}\n\n ${t('Check your account status:')}\n- ${t(
        'Go to Support Center via the app.',
      )}\n- ${t(
        'Select "Suspended Account" and follow the prompts to view your account details.',
      )}\n\n ${t('For appeals or further inquiries, contact Dream Support.')}`,
    },
    {
      question: t('Managing Multiple Accounts'),
      answer: `Dream allows you to easily switch between multiple accounts.\n\nTo add or switch accounts:\n- Open your Profile.\n- Tap the dropdown menu next to your username.\n- Select "Add Account" or choose an existing account to switch.\n\nAlternative method:\n- Go to Settings in the top-right corner of your Profile.\n- Scroll to Account Management.\n- Tap "Switch Account".\n\nImportant:\n- A single email or phone number can only be linked to one account.\n- You can manage up to (5) accounts on one device.`,
    },
    {
      question: t('Account Logged Out Automatically'),
      answer: `If you've been logged out unexpectedly, this could be due to:\n- Security updates.\n- Unauthorized changes to your account.\n\nWhat to do:\n- Reset your password immediately via the Forgot Password option.\n- Report suspicious activity to Dream Support.`,
    },
    {
      question: t('Need More Help?'),
      answer: `${t(
        'If your issue does not match any of the above categories:',
      )}\n\n- ${t('Navigate to Support Center in the app.')}\n- ${t(
        `Tap 'Other Issues'.`,
      )}\n- ${t(
        'Provide detailed information and upload screenshots for quicker assistance.',
      )}`,
    },
    {
      question: t('Other Issues'),
      answer: `${t(
        'Each section is designed to offer seamless navigation and effective solutions to your concerns.',
      )}\n\n${t('Let me know if you did like any further customization!')}`,
    },
  ];

  // useEffect(() => {
  //   if (bottomSheetSignIn) {
  //     const heightLayout = bottomSheetRef?.current?.heightLayoutCurrent();
  //     bottomSheetRef?.current?.scrollTo(-heightLayout);
  //     setTimeout(() => {
  //       setDataSocial(dataSignInWithSocial);
  //     }, 300);
  //   }
  // }, [bottomSheetSignIn, dataSignInWithSocial]);

  const handleClickClose = () => {
    navigation.goBack();
  };

  const onCloseBottomSheet = () => {
    dispatch(setBottomSheetSignIn(false));
    setDataSocial([]);
  };

  const handleClickText = () => {
    setCurrentForm(currentForm === 1 ? 2 : 1);
  };

  const handleGoogleSignIn = async () => {
    try {
      const r = await onGoogleButtonPress();
      const {displayName, email, uid, photoURL} = r.user;

      const signInResponse = await signIn(email);

      if (signInResponse.data.message === 'user not found') {
        try {
          const signUpResponse = await authApi.signUp(
            displayName,
            email,
            uid,
            photoURL,
          );

          if (signUpResponse.data.message === 'user created successfully') {
            dispatch(add_my_profile_data(signUpResponse.data.payload));
            await save_data('user', signUpResponse.data.payload);
            dispatch(addIsLogin(true));
          }
        } catch (signUpError: any) {
          console.error('Sign up error:', signUpError.message);
        }
      } else {
        dispatch(add_my_profile_data(signInResponse.data.payload));
        await save_data('user', signInResponse.data.payload);
        dispatch(addIsLogin(true));
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error.message);
    }
  };

  const handleWithPhoneAndEmail = () => {
    setDataSocial([]);
    setCurrentForm(2);
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await onAppleButtonPress();
      const {displayName, email, uid, photoURL} = result.user;
      const signInResponse = await signIn(email);

      if (signInResponse.data.message === 'user not found') {
        try {
          const signUpResponse = await authApi.signUp(
            displayName,
            email,
            uid,
            photoURL,
          );

          if (signUpResponse.data.message === 'user created successfully') {
            dispatch(add_my_profile_data(signUpResponse.data.payload));
            await save_data('user', signUpResponse.data.payload);
            dispatch(addIsLogin(true));
          }
        } catch (signUpError: any) {
          console.error('Sign up error:', signUpError.message);
        }
      } else {
        dispatch(add_my_profile_data(signInResponse.data.payload));
        await save_data('user', signInResponse.data.payload);
        dispatch(addIsLogin(true));
      }
    } catch (error) {
      console.log('Apple sign-in error:', error);
    }
  };

  const dataSignInWithSocial: SocialIconProps[] = useMemo(() => {
    const socialOptions: SocialIconProps[] = [
      {
        icon: icons.user,
        using: t('Use email'),
        color: COLOR.BLACK,
        index: 0,
        onPress: handleWithPhoneAndEmail,
      },
      {
        icon: icons.google,
        using: t('Continue with Google'),
        index: 2,
        onPress: handleGoogleSignIn,
      },
    ];

    // Add Apple sign-in only for iOS
    if (Platform.OS === 'ios') {
      socialOptions.push({
        icon: icons.appleLogo,
        index: 4,
        using: 'Continue with Apple',
        onPress: handleAppleSignIn,
      });
    }

    return socialOptions;
  }, []);

  const ItemSignIn: React.FC<SocialIconProps> = ({
    index,
    icon,
    using,
    color,
    onPress,
  }) => {
    return (
      <Animated.View
        entering={
          index % 2
            ? LightSpeedInRight.duration(1000)
            : LightSpeedInLeft.duration(1000)
        }
        exiting={
          index % 2
            ? LightSpeedOutRight.duration(1000)
            : LightSpeedOutLeft.duration(1000)
        }>
        <Pressable onPress={onPress}>
          <Container
            flexDirection="row"
            borderRadius={BORDER.SMALL}
            borderWidth={1}
            borderColor={COLOR.LIGHT_GRAY}
            justifyContent="center"
            alignItems="center"
            padding={SPACING.S2}
            marginVertical={SPACING.S2}>
            <Icon source={icon} tintColor={color} />
            <Container flexGrow={1} justifyContent="center" alignItems="center">
              <CText text={TEXT.STRONG} fontSize={16}>
                {t(using)}
              </CText>
            </Container>
          </Container>
        </Pressable>
      </Animated.View>
    );
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  function backToScreenSocial(): void {
    // throw new Error('Function not implemented.');
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <Container paddingTop={SPACING.S2} flex={1}>
        <Container
          paddingHorizontal={SPACING.S4}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Icon source={icons.close} onPress={handleClickClose} />
          <Pressable onPress={() => setShowInfo(true)}>
            <CText
              width={20}
              height={20}
              borderRadius={BORDER.PILL}
              color={COLOR.GRAY}
              borderWidth={1}
              borderColor={COLOR.GRAY}
              justifyContent="center"
              alignItems="center"
              textAlign="center">
              ?
            </CText>
          </Pressable>
        </Container>

        <Container
          paddingHorizontal={SPACING.S5}
          marginTop={SPACING.S4}
          marginBottom={SPACING.S4}
          flexDirection="column"
          justifyContent="space-between">
          {currentForm === 0 ? (
            <Animated.View
              entering={FadeIn.duration(600)}
              exiting={FadeOut.duration(600)}>
              <Container height={'100%'}>
                <Container>
                  <CText
                    text={TEXT.H1}
                    textAlign="center"
                    marginVertical={SPACING.S2}>
                    {t('Sign up for Dream')}
                  </CText>
                  <CText
                    text={TEXT.REGULAR}
                    color={COLOR.GRAY}
                    textAlign="center"
                    marginVertical={SPACING.S2}>
                    {t(
                      'Create profiles, follow other accounts, record videos your own and many more.',
                    )}
                  </CText>
                </Container>
                <Container marginTop={SPACING.S2} marginBottom={SPACING.S3}>
                  {dataSignInWithSocial.map((item, index) => {
                    return (
                      <ItemSignIn
                        onPress={item.onPress}
                        index={index}
                        key={index.toString()}
                        icon={item.icon}
                        using={item.using}
                        color={item.color}
                      />
                    );
                  })}
                </Container>
                <Container marginBottom={0}>
                  <CText textAlign="center" color={COLOR.GRAY} fontSize={13}>
                    {t('By continuing, you agree to Dream’s')}
                    <CText text={TEXT.STRONG} fontSize={13}>
                      Terms of Service
                    </CText>{' '}
                    {t('and confirm that you have read Dream’s')}
                    <CText
                      onPress={handlePrivacyPolicy}
                      text={TEXT.STRONG}
                      fontSize={13}>
                      Privacy Policy.
                    </CText>
                  </CText>
                </Container>
              </Container>
            </Animated.View>
          ) : currentForm === 1 ? (
            <FormSignIn
              setCurrentForm={setCurrentForm}
              handleClickClose={handleClickClose}
              backToScreenSocial={backToScreenSocial}
            />
          ) : (
            <FormSignUp
              setCurrentForm={setCurrentForm}
              backToScreenSocial={backToScreenSocial}
            />
          )}
        </Container>
        <Container
          backgroundColor={COLOR.LIGHT_GRAY2}
          padding={SPACING.S6}
          position="absolute"
          bottom={0}
          left={0}
          right={0}>
          <CText textAlign="center" fontSize={16}>
            {currentForm === 1
              ? t("You don't have an account yet?")
              : t('You already have an account?')}{' '}
            <CText
              text={TEXT.STRONG}
              color={COLOR.DANGER2}
              fontSize={18}
              onPress={handleClickText}>
              {currentForm === 1 ? t('Register') : t('Log in')}
            </CText>
          </CText>
        </Container>
      </Container>
      <InfoModal
        show_model={showInfo}
        setShowModel={setShowInfo}
        faqData={faqData}
        title={t('Account Assistance')}
      />
    </SafeAreaView>
  );
};

export default React.memo(BottomSheetSocialAuth);

const styles = StyleSheet.create({
  main_container: {
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
});
