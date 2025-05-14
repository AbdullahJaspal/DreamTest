import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  View,
  Pressable,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  setBottomSheetLogout,
  setBottomSheetSettingProfile,
} from '../../store/slices/ui/indexSlice';
import Container from '../Container';
import Icon from '../Icon';
import CText from '../CText';
import {useTranslation} from 'react-i18next';
import {COLOR, SPACING} from '../../configs/styles';
import Entypo from 'react-native-vector-icons/Entypo';
import {SettingCompositeNavigationProp} from '../../navigations/types/SettingStackNavigationAndRoute';
import {selectBottomSheetSettingProfile} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';
import {icons} from '../../assets/icons';

const BottomSettingProfile: React.FC = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const bottomSheetSettingProfile = useAppSelector(
    selectBottomSheetSettingProfile,
  );
  const navigation = useNavigation<SettingCompositeNavigationProp>();

  const closeBottomSheet = () => {
    dispatch(setBottomSheetSettingProfile(false));
  };

  const handleLogout = () => {
    closeBottomSheet();
    dispatch(setBottomSheetLogout(true));
  };

  if (!bottomSheetSettingProfile) {
    return null;
  }

  function handleEditProfilePress(): void {
    closeBottomSheet();
    navigation.navigate('SettingStackNavigation', {
      screen: 'AccountScreen',
    });
  }

  function handleAnalyticsPress(): void {
    closeBottomSheet();
    navigation.navigate('SettingStackNavigation', {
      screen: 'MainInsightScreen',
    });
  }

  return (
    <View>
      <Modal
        transparent={true}
        statusBarTranslucent={true}
        visible={bottomSheetSettingProfile}
        animationType="slide"
        onRequestClose={closeBottomSheet}>
        <Pressable style={{flex: 1}} onPress={closeBottomSheet} />
        <Container
          backgroundColor={COLOR.WHITE}
          zIndex={100}
          padding={SPACING.S4}
          paddingBottom={SPACING.S8}
          borderTopLeftRadius={10}
          borderTopRightRadius={10}>
          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <TouchableWithoutFeedback onPress={closeBottomSheet}>
              <TouchableOpacity onPress={handleEditProfilePress}>
                <Container
                  paddingVertical={SPACING.S3}
                  flexDirection="row"
                  alignItems="center">
                  <Icon source={icons.setting} />
                  <CText marginLeft={SPACING.S2}>
                    {t('Edit profile and setting')}
                  </CText>
                </Container>
              </TouchableOpacity>
            </TouchableWithoutFeedback>
          </Container>

          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <TouchableOpacity onPress={handleAnalyticsPress}>
              <Container
                paddingVertical={SPACING.S3}
                flexDirection="row"
                alignItems="center">
                <Entypo name="area-graph" size={20} />
                <CText marginLeft={SPACING.S2}>{t('Analytics')}</CText>
              </Container>
            </TouchableOpacity>
          </Container>

          <Container
            borderBottomWidth={0.2}
            borderBottomColor={COLOR.LIGHT_GRAY}>
            <TouchableOpacity onPress={handleLogout}>
              <Container
                paddingVertical={SPACING.S3}
                flexDirection="row"
                alignItems="center">
                <Icon source={icons.logout} />
                <CText marginLeft={SPACING.S2}>{t('Log out')}</CText>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </Modal>
    </View>
  );
};

export default React.memo(BottomSettingProfile);
