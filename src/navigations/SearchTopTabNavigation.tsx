import {StyleSheet} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Top from '../screens/discover/tab/Top';
import User from '../screens/discover/tab/User';
import Video from '../screens/discover/tab/Video';
import Audio from '../screens/discover/tab/Audio';
import Hashtag from '../screens/discover/tab/Hashtag';
import {COLOR, TEXT} from '../configs/styles';
import {SearchTopTabParamsList} from './types/SearchTopTabParamsList';
import {useTranslation} from 'react-i18next';

const SearchTopTab = createMaterialTopTabNavigator<SearchTopTabParamsList>();

const SearchTopTabNavigation: React.FC = () => {
  const {t, i18n} = useTranslation();

  return (
    <SearchTopTab.Navigator
      initialRouteName="Top"
      screenOptions={{
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarActiveTintColor: COLOR.BLACK,
        tabBarInactiveTintColor: COLOR.GRAY,
        tabBarScrollEnabled: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarBounces: true,
        tabBarPressColor: COLOR.TRANSPARENT,
      }}>
      <SearchTopTab.Screen
        name="Top"
        component={Top}
        options={{tabBarLabel: t('Top')}}
      />
      <SearchTopTab.Screen
        name="User"
        component={User}
        options={{tabBarLabel: t('User')}}
      />
      <SearchTopTab.Screen
        name="Video"
        component={Video}
        options={{tabBarLabel: t('Video')}}
      />
      <SearchTopTab.Screen
        name="Audio"
        component={Audio}
        options={{tabBarLabel: t('Audio')}}
      />
      <SearchTopTab.Screen
        name="Hashtag"
        component={Hashtag}
        options={{tabBarLabel: t('Hashtag')}}
      />
    </SearchTopTab.Navigator>
  );
};

export default React.memo(SearchTopTabNavigation);

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    textTransform: 'none',
    padding: 0,
    marginTop: -14,
    ...TEXT.REGULAR,
    fontSize: 14,
  },
  tabBarItemStyle: {
    maxHeight: 35,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    elevation: 0,
  },
  tabBarIndicatorStyle: {
    backgroundColor: COLOR.DANGER,
  },
});
