import {Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {COLOR, TEXT} from '../../../configs/styles';
import TopVideoCoins from '../toptab/TopVideoCoins';
import TopVideoView from '../toptab/TopVideoView';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('screen');
const Tab = createMaterialTopTabNavigator();

const Top: React.FC = () => {
  const {t, i18n} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: 'none',
          padding: 0,
          ...TEXT.REGULAR,
          fontSize: 15,
        },
        tabBarItemStyle: {
          maxHeight: 50,
          top: 5,

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
        },
        tabBarBounces: true,
        tabBarPressColor: COLOR.TRANSPARENT,
      }}>
      <Tab.Screen
        name={t('TopVideoView')}
        component={TopVideoView}
        options={{
          tabBarLabel: t('Top Video Views'),
        }}
      />
      <Tab.Screen
        name={t('TopVideoCoins')}
        component={TopVideoCoins}
        options={{
          tabBarLabel: t('Top Video Coins'),
        }}
      />
    </Tab.Navigator>
  );
};

export default Top;

const styles = StyleSheet.create({});
