import React, {useEffect, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigationState} from '@react-navigation/native';

import FastImage from '@d11/react-native-fast-image';

import DiscoverScreen from '../screens/discover/DiscoverScreen';
import HomeScreen from '../screens/home/HomeScreen';
import NewVideoStackNavigation from './NewVideoStackNavigation';
import ProfileStackNavigation from './ProfileStackNavigation';
import InboxStackNavigation from './InboxStackNavigation';

import {COLOR, TEXT} from '../configs/styles';
import {formatNumber} from '../utils/formatNumber';
import {BottomTabParamsList} from './types/BottomTabParamsList';
import {selectUnreadNotification} from '../store/selectors';
import {useAppSelector} from '../store/hooks';
import {icons} from '../assets/icons';
import {gifs} from '../assets/gifs';

const BottomTab = createBottomTabNavigator<BottomTabParamsList>();

interface TabBarIconProps {
  focused: boolean;
}

const TabIcons = {
  Home: {active: gifs.home, inactive: icons.home},
  Discover: {active: gifs.shoppingCart, inactive: icons.shoppingCart},
  NewVideo: {single: icons.uploadVideo},
  Inbox: {active: gifs.messageGif, inactive: icons.message},
  Profile: {active: gifs.profileRotating, inactive: icons.profileOutline},
};

const TabBarIcon: React.FC<{
  type: keyof typeof TabIcons;
  props: TabBarIconProps;
}> = ({type, props}) => {
  const {focused} = props;
  const source =
    type === 'NewVideo'
      ? TabIcons[type].single
      : focused
      ? TabIcons[type].active
      : TabIcons[type].inactive;
  const style =
    type === 'NewVideo' ? styles.newVideoTabIcon : styles.bottomTabIcon;
  return <FastImage source={source} style={style} />;
};

const BottomTabNavigation: React.FC = () => {
  const theme = 'dart';
  const unreadNotification = useAppSelector(selectUnreadNotification);

  const tabBarBadge = useMemo(() => {
    return unreadNotification ? formatNumber(unreadNotification) : undefined;
  }, [unreadNotification]);

  const currentRoute = useNavigationState(state => {
    const route = state.routes[state.index];
    if (!route) return undefined;

    if (route.state && Array.isArray(route.state.routes)) {
      const nestedRoute = route.state.routes[route.state.index ?? 0];

      if (nestedRoute.state && Array.isArray(nestedRoute.state.routes)) {
        const nestedStackRoute =
          nestedRoute.state.routes[nestedRoute.state.index ?? 0];
        return nestedStackRoute?.name || nestedRoute.name;
      }

      return nestedRoute.name;
    }
    return route.name;
  });
  const hiddenScreens = [
    'NewVideoStackNavigation',
    'PreviewVideoScreen',
    'PostVideoScreen',
    'PostPictureScreen',
    'MediaPickupScreen',
    'CoverPicScreen',
    'SelectingCitiesScreen',
    'SelectingLocationScreen',
    'TrimVideo',
    'VideoCall',
    'AudioCall',
    'ChatScreen',
    'ContactList',
    'FollowingNotification',
    'GiftNotification',
    'SystemNotification',
    'VideosNotification',
    'YourProfileNotification',
    'EditProfile',
    'ProfileCity',
    'ProfileCountry',
    'Avatar',
    'Hobbies',
    'Industries',
    'Making_friend_intention',
    'MasteryOfLanguage',
    'Occupation',
  ];
  const tabBarStyle = hiddenScreens.includes(currentRoute || '')
    ? styles.hiddenTab
    : styles.tabBar;

  const screenOptions = {
    tabBarStyle: tabBarStyle,
    tabBarShowLabel: false,
    tabBarLabelStyle: styles.tabBarLabel,
    headerShown: false,
    tabBarActiveTintColor: theme === 'dart' ? COLOR.WHITE : COLOR.GRAY,
    tabBarInactiveTintColor: theme === 'dart' ? COLOR.WHITE : COLOR.GRAY,
  };

  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={screenOptions}>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: props => <TabBarIcon type="Home" props={props} />,
        }}
      />
      <BottomTab.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={{
          tabBarIcon: props => <TabBarIcon type="Discover" props={props} />,
        }}
      />
      <BottomTab.Screen
        name="NewVideoStackNavigation"
        component={NewVideoStackNavigation}
        options={{
          tabBarIcon: props => <TabBarIcon type="NewVideo" props={props} />,
        }}
      />
      <BottomTab.Screen
        name="InboxStackNavigation"
        component={InboxStackNavigation}
        options={{
          tabBarIcon: props => <TabBarIcon type="Inbox" props={props} />,
          tabBarBadge: tabBarBadge,
        }}
      />
      <BottomTab.Screen
        name="ProfileStackNavigation"
        component={ProfileStackNavigation}
        options={{
          tabBarIcon: props => <TabBarIcon type="Profile" props={props} />,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default React.memo(BottomTabNavigation);

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 30,
    height: 30,
  },
  newVideoTabIcon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  tabBar: {
    backgroundColor: COLOR.BLACK,
    borderTopColor: '#000',
    paddingTop: 5,
    // left: -15,
    // right: -15,
  },
  tabBarLabel: {
    ...TEXT.SMALL_STRONG,
    fontSize: 10,
  },
  hiddenTab: {
    display: 'none',
  },
});
