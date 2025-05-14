import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useCallback, Dispatch, SetStateAction} from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';

import CText from '../CText';
import CInput from '../CInput';
import Container from '../Container';
import ModalLoading from '../modal/ModalLoading';

import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';

import * as authApi from '../../apis/auth.api';
import {icons} from '../../assets/icons';

import {
  add_my_profile_data,
  addIsLogin,
} from '../../store/slices/user/my_dataSlice';
import {
  setModalSignIn,
  setBottomSheetLogout,
  setBottomSheetSignIn,
} from '../../store/slices/ui/indexSlice';

const save_data = async (
  /** @type {string} */ key: string,
  /** @type {any} */ data: any,
) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

interface BottomSheetSignUpProps {
  setCurrentForm: Dispatch<SetStateAction<number>>;
  backToScreenSocial: () => void;
}

const BottomSheetSignUp: React.FC<BottomSheetSignUpProps> = ({
  setCurrentForm,
  backToScreenSocial,
}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const [txtName, setTxtName] = useState('');
  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [isFaliure_invalid, setIsFailure_invalid] = useState(false);
  const navigation = useNavigation();

  const handleShowBottomSheetSignIn = useCallback(() => {
    dispatch(setModalSignIn(false));
    dispatch(setBottomSheetSignIn(false));
    dispatch(setBottomSheetLogout(false));
  }, [dispatch]);

  const handleClickSignUp = () => {
    setIsEmpty(false);
    setIsFailure(false);
    setShowModal(true);
    setIsFailure_invalid(false);

    setTimeout(async () => {
      try {
        if (!txtName || !txtEmail || !txtPassword) {
          return setIsEmpty(true);
        }
        auth()
          .createUserWithEmailAndPassword(txtEmail, txtPassword)
          .then(async res => {
            const name = txtName;
            const email = res.user.email;
            const firebase_uid = res.user.uid;
            const profile_pic = '';
            const result = authApi.signUp(
              name,
              email,
              firebase_uid,
              profile_pic,
            );
            result
              .then(res => {
                if (res.data.message == 'user created successfully') {
                  dispatch(add_my_profile_data(res.data.payload));
                  save_data('user', res.data.payload);
                  dispatch(addIsLogin(true));
                }
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(error => {
            if (error.code == 'auth/invalid-email') {
              setIsFailure_invalid(true);
              console.log('email are badly formated');
              setShowModal(false);
            }
            if (error.code == 'auth/email-already-in-use') {
              setIsFailure(true);
              console.log('email already in use');
              setShowModal(false);
            }
          });
      } catch (error) {
        console.log('sing up erro ', error);
        setShowModal(false);
      }
    }, 3000);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(300)}
      exiting={FadeOut.duration(300).delay(300)}>
      <Container
        backgroundColor={COLOR.WHITE}
        justifyContent="center"
        alignItems="center">
        {showModal && (
          <ModalLoading visible={showModal} setVisible={undefined} />
        )}
        <CText text={TEXT.H1} textAlign="center" marginVertical={SPACING.S1}>
          {t('Dream')}
        </CText>
        <CText
          text={TEXT.H3}
          textAlign="center"
          marginVertical={SPACING.S2}
          color={COLOR.GRAY}
          marginBottom={SPACING.S4}>
          {t('Continue with email and password')}
        </CText>
        <CInput
          // @ts-ignore
          placeholder="Name"
          iconLeft={icons.user}
          onChangeText={(
            /** @type {React.SetStateAction<string>} */ text: React.SetStateAction<string>,
          ) => setTxtName(text)}
        />
        <Container marginVertical={SPACING.S2} width="100%">
          <CInput
            // @ts-ignore
            iconLeft={icons.mailOutline}
            placeholder={t('Email')}
            onChangeText={(
              /** @type {React.SetStateAction<string>} */ text: React.SetStateAction<string>,
            ) => setTxtEmail(text)}
            keyboardType="email-address"
          />
        </Container>
        <Container marginVertical={SPACING.S2} width="100%">
          <CInput
            // @ts-ignore
            secureTextEntry={secureTextEntry}
            placeholder={t('Password')}
            iconLeft={icons.lockOutline}
            onChangeText={(
              /** @type {React.SetStateAction<string>} */ text: React.SetStateAction<string>,
            ) => setTxtPassword(text)}
            iconRight={secureTextEntry ? icons.eye : icons.closeEye}
            onPressIconRight={() => setSecureTextEntry(!secureTextEntry)}
          />
        </Container>
        <Container padding={SPACING.S2}>
          <CText color={COLOR.DANGER}>
            {isEmpty
              ? t('You must enter all fields')
              : isFailure
              ? t('Email already exists')
              : isFaliure_invalid
              ? t('Email are badly formated')
              : ''}
          </CText>
        </Container>
        <Container
          borderRadius={BORDER.SMALL}
          padding={SPACING.S3}
          backgroundColor={COLOR.DANGER2}
          width="100%">
          <TouchableOpacity onPress={handleClickSignUp}>
            <CText
              color={COLOR.WHITE}
              text={TEXT.STRONG}
              width="100%"
              textAlign="center"
              fontSize={16}>
              {t('Register')}
            </CText>
          </TouchableOpacity>
        </Container>
        <Container padding={SPACING.S2} width="100%" paddingTop={SPACING.S4}>
          <TouchableOpacity onPress={() => setCurrentForm(0)}>
            <CText
              textAlign="center"
              onPress={() => {
                setCurrentForm(0);
                backToScreenSocial();
              }}>
              {t('Continue with another way')}
            </CText>
          </TouchableOpacity>
        </Container>
        {/* for back social screen */}
      </Container>
    </Animated.View>
  );
};

export default BottomSheetSignUp;

const styles = StyleSheet.create({});
