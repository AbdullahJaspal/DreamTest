import {Image, StyleSheet, StatusBar} from 'react-native';
import React, {useMemo, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLOR, TEXT} from '../../configs/styles';

import HomeScreen from '../home/HomeScreen';

import DiscoverScreen from '../discover/DiscoverScreen';
import NewVideoScreen from '../newVideo/NewVideoScreen';
import InboxScreen from '../InboxStack/inbox';
import ProfileScreen from '../profile/ProfileScreen';

import BoxCreateVideo from './components/BoxCreateVideo';

import {useDispatch} from 'react-redux';
import {setCurrentBottomTab} from '../../store/slices/ui/indexSlice';
import BottomSheetComment from './components/BottomSheetComment';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {MainScreenScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {formatNumber} from '../../utils/formatNumber';
import {useAppSelector} from '../../store/hooks';
import {
  selectCurrentBottomTab,
  selectUnreadNotification,
} from '../../store/selectors';
import {icons} from '../../assets/icons';
import {gifs} from '../../assets/gifs';

const Bottom = createBottomTabNavigator();

const MainScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<MainScreenScreenNavigationProps>();
  const currentBottomTab = useAppSelector(selectCurrentBottomTab);
  const unread_notification = useAppSelector(selectUnreadNotification);

  const {t, i18n} = useTranslation();
  const [theme, setTheme] = useState('dart');

  const handleTapPress = (myTheme: React.SetStateAction<string>) => {
    if (theme !== myTheme) {
      setTheme(myTheme);
    }
  };

  const handleCurrentBottomTab = (tabName: string) => {
    if (currentBottomTab !== tabName) {
      dispatch(setCurrentBottomTab(tabName));
    }
  };

  const handleTabBarBadge = useMemo((): string | number | undefined => {
    if (unread_notification) {
      return formatNumber(unread_notification);
    } else {
      return undefined;
    }
  }, [unread_notification]);

  return (
    <>
      <Bottom.Navigator
        initialRouteName="Home"
        screenOptions={{
          freezeOnBlur: true,
          tabBarStyle: {
            backgroundColor: COLOR.BLACK,
            position: 'absolute',
            elevation: 0,
            left: -15,
            borderTopColor: '#000',
            right: -15,
            paddingTop: 5,
          },
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            ...TEXT.SMALL_STRONG,
            fontSize: 10,
          },
          headerShown: false,
          tabBarActiveTintColor: theme === 'dart' ? COLOR.WHITE : COLOR.GRAY,
          tabBarInactiveTintColor: theme === 'dart' ? COLOR.WHITE : COLOR.GRAY,
        }}>
        <Bottom.Screen
          name={t('Home')}
          component={HomeScreen}
          options={{
            tabBarIcon: ({color, focused}) => {
              return (
                <Image
                  source={focused ? gifs.home : icons.home}
                  style={styles.bottomTabIcon}
                />
              );
            },
          }}
          listeners={{
            focus: () => {
              handleTapPress('dart');
              StatusBar.setBarStyle('light-content');
            },
            tabPress: e => {
              handleTapPress('dart');
              handleCurrentBottomTab('Home');
            },
          }}
        />
        <Bottom.Screen
          name={t('Discover')}
          component={DiscoverScreen}
          options={{
            tabBarIcon: ({color, focused}) => {
              return (
                <Image
                  source={focused ? gifs.shoppingCart : icons.shoppingCart}
                  style={styles.bottomTabIcon}
                />
              );
            },
          }}
          listeners={{
            focus: () => {
              StatusBar.setBarStyle('dark-content');
            },
            tabPress: e => {
              handleTapPress('light');
              handleCurrentBottomTab('Discover');
            },
          }}
        />
        <Bottom.Screen
          name="NewVideo"
          component={NewVideoScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => {
              return (
                <Image
                  source={icons.uploadVideo}
                  style={styles.newVideoTabIcon}
                />
              );
            },
          }}
          listeners={{
            focus: () => {
              StatusBar.setBarStyle('dark-content');
            },
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('NewVideoScreen');
            },
          }}
        />
        <Bottom.Screen
          name={t('Inbox')}
          component={InboxScreen}
          options={{
            tabBarBadge: handleTabBarBadge,
            tabBarIcon: ({color, focused}) => {
              return (
                <Image
                  source={focused ? gifs.messageGif : icons.message}
                  style={styles.bottomTabIcon}
                />
              );
            },
          }}
          listeners={{
            focus: () => {
              StatusBar.setBarStyle('dark-content');
            },
            tabPress: e => {
              handleTapPress('light');
              handleCurrentBottomTab('Inbox');
            },
          }}
        />
        <Bottom.Screen
          name={'Me'}
          component={ProfileScreen}
          initialParams={{showHeader: false}}
          options={{
            tabBarIcon: ({color, focused}) => {
              return (
                <Image
                  source={focused ? gifs.profileRotating : icons.profileOutline}
                  style={styles.bottomTabIcon}
                />
              );
            },
          }}
          listeners={{
            focus: () => {
              StatusBar.setBarStyle('dark-content');
            },
            tabPress: e => {
              handleTapPress('light');
              handleCurrentBottomTab('Me');
            },
          }}
        />
      </Bottom.Navigator>
      <BottomSheetComment />
      <BoxCreateVideo />
      {/* <BottomSettingProfile />
      <BottomSheetLogout /> */}
    </>
  );
};

export default React.memo(MainScreen);

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
  buttonLeft: {
    marginLeft: 10,
  },
  buttonRight: {
    marginRight: 10,
  },
});
