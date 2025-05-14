import React, {useState, useCallback} from 'react';
import {Alert, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import CText from '../CText';
import CInput from '../CInput';
import Container from '../Container';
import ModalLoading from '../modal/ModalLoading';

import {COLOR, SPACING, TEXT, BORDER} from '../../configs/styles';

import * as authApi from '../../apis/auth.api';
import {save_data} from '../../utilis2/AsyncStorage/Controller';

import {
  addIsLogin,
  add_my_profile_data,
} from '../../store/slices/user/my_dataSlice';
import {
  setModalSignIn,
  setBottomSheetSignIn,
  setBottomSheetLogout,
} from '../../store/slices/ui/indexSlice';
import {icons} from '../../assets/icons';

const {width, height} = Dimensions.get('screen');

const BottomSheetSignIn = ({
  handleClickClose,
  setCurrentForm,
  backToScreenSocial,
}) => {
  const {t, i18n} = useTranslation();

  const [txtEmail, setTxtEmail] = useState(null);
  const [txtPassword, setTxtPassword] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [isFaliure_invalid, setIsFailure_invalid] = useState(false);
  const navigation = useNavigation();
  const handleShowBottomSheetSignIn = useCallback(() => {
    dispatch(setModalSignIn(false));
    dispatch(setBottomSheetSignIn(false));
    dispatch(setBottomSheetLogout(false));
  }, [dispatch]);

  const handleClickLogin = () => {
    setIsEmpty(false);
    setIsFailure(false);
    setIsFailure_invalid(false);
    setShowModal(true);
    setTimeout(async () => {
      if (txtEmail && txtPassword) {
        try {
          auth()
            .signInWithEmailAndPassword(txtEmail, txtPassword)
            .then(res => {
              const result = authApi.signIn(res.user.email);
              result
                .then(res => {
                  setShowModal(false);
                  if (res.data.success) {
                    setShowModal(false);
                    dispatch(addIsLogin(true));
                    dispatch(add_my_profile_data(res.data.payload));
                    save_data('user', res.data.payload);
                    // console.log('login something to here')
                    // navigation.reset()
                  } else {
                    Alert.alert(
                      'Confirmation',
                      'Your account deletion is scheduled. Do you want to reactivate it?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Deletion canceled'),
                          style: 'cancel',
                        },
                        {
                          text: 'Re-Activate',
                          onPress: async () => {
                            setShowModal(true);
                            const result =
                              await authApi.cancelAccountDeletionProgress(
                                res.data.payload.auth_token,
                              );
                            if (result.success) {
                              // navigation.navigate('Me')
                              dispatch(addIsLogin(true));
                              dispatch(add_my_profile_data(res.data.payload));
                              save_data('user', res.data.payload);
                            }
                            setShowModal(false);
                          },
                        },
                      ],
                    );
                  }
                })
                .catch(err => {
                  console.log('server error:', err);
                });
            })
            .catch(err => {
              console.log(
                'error generated while login from firebase:',
                err.message,
              );
              setIsFailure(true);
              setShowModal(false);
            });
        } catch (error) {
          Alert.alert(error.message);
          setShowModal(false);
        }
      } else {
        setIsEmpty(true);
        setShowModal(false);
      }
    }, 2000);
  };

  const handleForgetPassword = () => {
    if (txtEmail) {
      auth()
        .sendPasswordResetEmail(txtEmail)
        .then(r => {
          console.log(r);
          Toast.show('Passoword reset link successfully sent on your email');
        })
        .catch(error => {
          const errorMessage = error.message.replace(/\[.*?\]/, '');
          Toast.show(errorMessage, Toast.LONG);
        });
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(300)}
      exiting={FadeOut.duration(300).delay(300)}>
      <Container
        backgroundColor={COLOR.WHITE}
        alignItems="center"
        height={height}
        justifyContent="flex-start">
        {showModal && (
          <ModalLoading visible={showModal} setVisible={setShowModal} />
        )}
        <CText text={TEXT.H1} textAlign="center" marginVertical={SPACING.S1}>
          {t('Dream')}
        </CText>
        <CText
          text={TEXT.H3}
          textAlign="center"
          marginVertical={SPACING.S2}
          color={COLOR.GRAY}>
          {t('Log in with email and password')}
        </CText>
        <Container marginVertical={SPACING.S1} width="100%">
          <CInput
            iconLeft={icons.mailOutline}
            placeholder={t('Email')}
            onChangeText={text => setTxtEmail(text)}
            keyboardType="email-address"
          />
        </Container>
        <Container marginVertical={SPACING.S2} width="100%">
          <CInput
            secureTextEntry={secureTextEntry}
            placeholder={t('Password')}
            iconLeft={icons.lockOutline}
            onChangeText={(text: string) => setTxtPassword(text)}
            iconRight={secureTextEntry ? icons.eye : icons.closeEye}
            onPressIconRight={() => setSecureTextEntry(!secureTextEntry)}
          />
        </Container>

        <Container padding={SPACING.S1}>
          <CText color={COLOR.DANGER}>
            {isEmpty
              ? t('You must enter all fields')
              : isFailure
              ? t('Wrong Email or Password')
              : isFaliure_invalid
              ? t('Email are badly formated')
              : ''}
          </CText>
        </Container>

        <Container
          marginTop={SPACING.S2}
          borderRadius={BORDER.SMALL}
          padding={SPACING.S3}
          backgroundColor={COLOR.DANGER2}
          width="100%">
          <TouchableOpacity onPress={handleClickLogin}>
            <CText
              color={COLOR.WHITE}
              text={TEXT.STRONG}
              width="100%"
              textAlign="center"
              fontSize={16}>
              {t('Log in')}
            </CText>
          </TouchableOpacity>
        </Container>

        <Container width="100%" paddingTop={SPACING.S4}>
          <TouchableOpacity onPress={handleForgetPassword}>
            <CText
              textAlign="center"
              padding={SPACING.S2}
              text={TEXT.STRONG}
              borderRadius={BORDER.SMALL}
              onPress={handleForgetPassword}>
              {t('Forget password')}
            </CText>
          </TouchableOpacity>
        </Container>

        <Container width="100%" paddingTop={SPACING.S4}>
          <TouchableOpacity onPress={() => setCurrentForm(0)}>
            <CText
              textAlign="center"
              padding={SPACING.S2}
              // color={COLOR.WHITE}
              text={TEXT.STRONG}
              borderRadius={BORDER.SMALL}
              // backgroundColor={COLOR.DANGER2}
              onPress={() => {
                setCurrentForm(0);
                backToScreenSocial();
              }}>
              {t('Log in with another way')}
            </CText>
          </TouchableOpacity>
        </Container>
      </Container>
    </Animated.View>
  );
};

export default React.memo(BottomSheetSignIn);

const styles = StyleSheet.create({});
