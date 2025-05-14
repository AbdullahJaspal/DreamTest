import {Modal, Pressable, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CText from '../CText';
import Container from '../Container';
import {COLOR, SPACING} from '../../configs/styles';
import {useDispatch} from 'react-redux';
import {
  setBottomSheetLogout,
  setBottomSheetSignIn,
} from '../../store/slices/ui/indexSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addIsLogin,
  add_my_profile_data,
} from '../../store/slices/user/my_dataSlice';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {selectBottomSheetLogout} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';

const BottomSheetLogout: React.FC = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetLogout = useAppSelector(selectBottomSheetLogout);

  const closeBottomSheet = () => {
    dispatch(setBottomSheetLogout(false));
  };

  const handleCancelLogout = () => {
    dispatch(addIsLogin(false));
    dispatch(add_my_profile_data(null));
    closeBottomSheet();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await auth().signOut();
      await GoogleSignin.signOut();
      handleCancelLogout();
    } catch (error) {
      console.log('Error genrated while logout', error);
    }
  };

  function handleSwitchAccount(): void {
    dispatch(setBottomSheetSignIn(true));
    handleLogout();
  }

  if (!bottomSheetLogout) {
    return null;
  }

  return (
    <View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={bottomSheetLogout}
        onRequestClose={closeBottomSheet}>
        <Pressable style={{flex: 1}} onPress={closeBottomSheet} />
        <Container
          backgroundColor={COLOR.WHITE}
          zIndex={1}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          paddingTop={SPACING.S4}>
          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <Container
              paddingVertical={SPACING.S3}
              justifyContent="center"
              flexDirection="row"
              alignItems="center">
              <CText
                marginLeft={SPACING.S2}
                textAlign="center"
                color={COLOR.GRAY}>
                {t('Are you sure you want to log out?')}
              </CText>
            </Container>
          </Container>

          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <TouchableOpacity onPress={handleSwitchAccount}>
              <Container
                paddingVertical={SPACING.S3}
                justifyContent="center"
                flexDirection="row"
                alignItems="center">
                <CText marginLeft={SPACING.S2} textAlign="center">
                  {t('Switch accounts')}
                </CText>
              </Container>
            </TouchableOpacity>
          </Container>

          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <TouchableOpacity onPress={handleLogout}>
              <Container
                paddingVertical={SPACING.S3}
                justifyContent="center"
                flexDirection="row"
                alignItems="center">
                <CText
                  marginLeft={SPACING.S2}
                  textAlign="center"
                  color={COLOR.DANGER}>
                  {t('Log out')}
                </CText>
              </Container>
            </TouchableOpacity>
          </Container>

          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <Container height={10} backgroundColor={COLOR.LIGHT_GRAY} />
            <TouchableOpacity onPress={closeBottomSheet}>
              <Container
                paddingVertical={SPACING.S3}
                justifyContent="center"
                flexDirection="row"
                alignItems="center">
                <CText
                  marginLeft={SPACING.S2}
                  textAlign="center"
                  color={COLOR.GRAY}>
                  {t('Cancel')}
                </CText>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </Modal>
    </View>
  );
};

export default React.memo(BottomSheetLogout);
