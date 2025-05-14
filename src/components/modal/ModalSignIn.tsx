import React, {useCallback} from 'react';
import {Modal, Pressable} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Container, CText, Icon} from '..';
import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  setBottomSheetSignIn,
  setModalSignIn,
} from '../../store/slices/ui/indexSlice';
import {selectModalSignIn} from '../../store/selectors';
import {icons} from '../../assets/icons';

const ModalSignIn = () => {
  const modalSignIn = useAppSelector(selectModalSignIn);
  const dispatch = useAppDispatch();
  const {t, i18n} = useTranslation();
  const handleClickClose = () => {
    dispatch(setModalSignIn(false));
  };

  const handleShowBottomSheetSignIn = () => {
    dispatch(setModalSignIn(false));
    dispatch(setBottomSheetSignIn(true));
  };

  if (!modalSignIn) {
    return null;
  }

  return (
    <Modal visible={modalSignIn} transparent={true}>
      <Container
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor={COLOR.setOpacity(COLOR.BLACK, 0.6)}>
        <Container
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          backgroundColor={COLOR.WHITE}
          padding={SPACING.S3}
          borderRadius={BORDER.MEDIUM}
          width={'80%'}>
          <Container alignSelf="flex-end">
            <Icon source={icons.close} onPress={handleClickClose} />
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
            {t('Log in to follow the account')} {'\n'} and like or comment on
            {'\n'}
            video
          </CText>
          <CText
            text={TEXT.SUBTITLE}
            color={COLOR.GRAY}
            marginVertical={SPACING.S1}
            textAlign="center"
            fontSize={13}>
            The Dream experience is more enjoyable when you {'\n'} follow and
            share with friends.
          </CText>
          <Container
            width={'100%'}
            borderRadius={BORDER.SMALL}
            backgroundColor={COLOR.DANGER2}
            padding={SPACING.S2}
            justifyContent="center"
            alignItems="center"
            marginTop={SPACING.S3}>
            <Pressable onPress={handleShowBottomSheetSignIn}>
              <CText color={COLOR.WHITE}>Sign in or Register</CText>
            </Pressable>
          </Container>
        </Container>
      </Container>
    </Modal>
  );
};

export default React.memo(ModalSignIn);
