// AddSoundModel.tsx
import React, {memo, useCallback} from 'react';
import {StyleSheet, Modal, View, Dimensions, Pressable} from 'react-native';
import {COLOR, TEXT} from '../../../configs/styles/index';
import ModelHeader from '../../live_stream/component/ModelHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import DreamSoundScreen from './sound_tab/DreamSoundScreen';
import DeviceSoundScreen from './sound_tab/DeviceSoundScreen';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('screen');
const Tab = createMaterialTopTabNavigator();

interface AddSoundModelProps {
  isModelVisible: boolean;
  setIsModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSoundModel: React.FC<AddSoundModelProps> = memo(
  ({isModelVisible, setIsModelVisible}) => {
    const {t} = useTranslation();
    const closeModal = useCallback(
      () => setIsModelVisible(false),
      [setIsModelVisible],
    );

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={closeModal}
        visible={isModelVisible}>
        <Pressable style={styles.outer_container} onPress={closeModal} />
        <View style={styles.soundModelContainer}>
          <ModelHeader
            showLeftIcon
            headerText={t('Select Sound')}
            showRightIcon
            leftIconPress={closeModal}
          />

          <Tab.Navigator screenOptions={tabScreenOptions}>
            <Tab.Screen
              name="DreamSound"
              component={DreamSoundScreen}
              options={{tabBarLabel: t('Dream')}}
              initialParams={{closeModal}}
            />
            <Tab.Screen
              name="DeviceSound"
              component={DeviceSoundScreen}
              options={{tabBarLabel: t('Device')}}
              initialParams={{closeModal}}
            />
          </Tab.Navigator>
        </View>
      </Modal>
    );
  },
);

const tabScreenOptions = {
  tabBarLabelStyle: {
    fontSize: 14,
    fontFamily: TEXT.REGULAR.fontFamily,
    lineHeight: TEXT.REGULAR.lineHeight,
    letterSpacing: TEXT.REGULAR.letterSpacing,
    textTransform: 'none' as const,
    padding: 0,
    marginTop: -19,
  },
  tabBarItemStyle: {
    maxHeight: 30,
    width: width / 2,
  },
  tabBarActiveTintColor: COLOR.BLACK,
  tabBarInactiveTintColor: COLOR.GRAY,
  tabBarScrollEnabled: true,
  tabBarStyle: {
    elevation: 0,
  },
  tabBarIndicatorStyle: {
    backgroundColor: COLOR.DANGER,
    height: 3,
  },
  tabBarBounces: true,
  tabBarPressColor: COLOR.TRANSPARENT,
};

const styles = StyleSheet.create({
  soundModelContainer: {
    width,
    backgroundColor: COLOR.WHITE,
    height: height * 0.7,
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  outer_container: {
    flex: 1,
  },
  sceneContainer: {
    backgroundColor: COLOR.WHITE,
  },
});

export default React.memo(AddSoundModel);
