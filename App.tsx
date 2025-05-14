import React, {useEffect, useState, useRef} from 'react';
import 'intl-pluralrules';
import i18n from './src/locals/i18n';
import {useDispatch} from 'react-redux';
import {useAppSelector} from './src/store/hooks';
import {PaperProvider} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import RNBootSplash from 'react-native-bootsplash';
import * as RNLocalize from 'react-native-localize';
import {MyProfileData} from './src/store/selectors';
import * as userPrivacy from './src/apis/user_privacy';
import * as notification from './src/apis/notification';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {setMyPrivacy} from './src/store/slices/user/privacySlice';
import {SocketProvider} from './src/socket/SocketProvider';
import {RootStackParamList} from './src/types/navigation';
import {StripeProvider} from '@stripe/stripe-react-native';
import {get_data} from './src/utilis2/AsyncStorage/Controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {setFollowing} from './src/store/slices/user/followDetailsSlice';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {setHidden, setNavigationBarColor} from 'react-native-system-navigation';
import RootStackNavigation from './src/navigations/RootStackNavigation';
import OnboardingNavigation from './src/navigations/OnboardingNavigation';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import {
  Platform,
  Linking,
  StatusBar,
  SafeAreaView,
  AppState,
  I18nManager,
} from 'react-native';
import {
  addUserInteractionTime,
  getUserInfo,
  createDeviceinfo,
  updateProfile,
  getAllFollowingsUsers,
} from './src/apis/userApi';
import {
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
import {
  addNotificationData,
  addUnreadNotification,
} from './src/store/slices/common/notificationSlice';

import {
  addIsLogin,
  add_my_profile_data,
} from './src/store/slices/user/my_dataSlice';
import {supportedLanguages} from './src/constants/appConfig';

// Configuration constants
const GOOGLE_WEB_CLIENT_ID =
  '549099161334-vcrplrh8dmpv3cuij8rmj0m9bf8q44g3.apps.googleusercontent.com';
const STRIPE_PUBLISHABLE_KEY =
  'pk_live_51PegKjAi5MvqbCeiDNxDUBg12EagJ7tMTV6rtjCbYEP6uA6oKS0BlJQudI20upoYlQWzJVsjBcpJVgdKfxPsFiZO00NcJx8Sgh';
const STRIPE_MERCHANT_ID = 'merchant.com.dream';

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [interactionStartTime, setInteractionStartTime] = useState(null);

  const dispatch = useDispatch();
  const {my_profile_data: my_data, isLogin} = useAppSelector(MyProfileData);

  // Tracking permission
  useEffect(() => {
    const getTrackingPermission = async () => {
      try {
        const status = await requestTrackingPermission();
        console.log('Tracking permission status:', status);
      } catch (error) {
        console.log('Tracking permission error:', error);
      }
    };

    getTrackingPermission();
  }, []);

  // Notification handling
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type !== EventType.PRESS && type !== EventType.ACTION_PRESS) return;

      const notificationData = detail.notification?.data || {};

      if (
        type === EventType.PRESS &&
        detail?.pressAction?.id === 'click-picture'
      ) {
        const pictureLink = notificationData?.pictureLink;
        if (pictureLink) {
          Linking.openURL(String(pictureLink)).catch(err =>
            console.error('Failed to open picture link:', err),
          );
        }
      }

      if (
        type === EventType.ACTION_PRESS &&
        detail?.pressAction?.id === 'click-button'
      ) {
        const buttonLink = notificationData.buttonLink;
        if (buttonLink) {
          Linking.openURL(String(buttonLink)).catch(err =>
            console.error('Failed to open button link:', err),
          );
        }
      }
    });

    return unsubscribe;
  }, []);

  // In-app purchase initialization
  useEffect(() => {
    const init = async () => {
      try {
        await initConnection();
        if (Platform.OS === 'android') {
          await flushFailedPurchasesCachedAsPendingAndroid();
        }
      } catch (error) {
        console.error('IAP initialization error:', error.message);
      }
    };

    init();
    return () => {
      endConnection();
    };
  }, []);

  // App state change handling for user interaction tracking
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // App comes to foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setInteractionStartTime(new Date());
      }

      // App goes to background
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        if (interactionStartTime && my_data?.auth_token) {
          const interactionEndTime = new Date();
          const interacted_time = interactionEndTime - interactionStartTime;
          const data = {
            interaction_start: interactionStartTime,
            interacted_time: interacted_time,
          };

          addUserInteractionTime(data, my_data.auth_token)
            .then(r => console.log('Interaction time logged'))
            .catch(err =>
              console.error('Failed to log interaction time:', err),
            );
        }
        setInteractionStartTime(null);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [interactionStartTime, my_data]);

  // Deep linking configuration
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
      'dream://',
      'https://dreamlived.com',
      'https://*.dreamlived.com',
    ],
    config: {
      screens: {
        Index: {
          screens: {
            Home: 'home',
            Discover: 'discover',
            NewVideo: 'new-video',
            Inbox: 'inbox',
            Profile: 'profile',
          },
        },
        WatchProfileVideo: 'share/video/:respected_action_data',
        UserProfileMainPage: 'share/profile/:share_profile_token',
      },
    },
  };

  // User authentication and data loading
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user_data = await get_data('user');

        if (!user_data) {
          RNBootSplash.hide({fade: true});
          return;
        }

        dispatch(addIsLogin(true));

        // Fetch user info
        const user_info = await getUserInfo(user_data?.auth_token);
        dispatch(add_my_profile_data(user_info.payload));

        // Get and update device token
        const token = await getDeviceToken();
        if (token) {
          await updateProfile(user_info.payload?.auth_token, {
            name: 'device_token',
            value: token,
          });
        }

        // Fetch following users
        const followings = await getAllFollowingsUsers(user_data?.auth_token);
        if (followings?.payload?.[0]?.Following) {
          dispatch(setFollowing(followings.payload[0].Following));
        }

        // Fetch user privacy settings
        const user_privacy = await userPrivacy.getUserPrivacy(
          user_info.payload?.auth_token,
        );
        if (user_privacy?.result) {
          dispatch(setMyPrivacy(user_privacy.result));
        }

        RNBootSplash.hide({fade: true});
      } catch (error) {
        console.error('Error loading user data:', error);
        RNBootSplash.hide({fade: true});
      }
    };

    loadUserData();
  }, [dispatch]);

  // Device token for push notifications
  const getDeviceToken = async () => {
    try {
      if (Platform.OS === 'android') {
        await messaging().registerDeviceForRemoteMessages();
      }

      const authStatus = await messaging().requestPermission();
      const isPermissionGranted =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isPermissionGranted) {
        return await messaging().getToken();
      }
      return null;
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  };

  // Fetch notifications
  useEffect(() => {
    const getAllNotifications = async () => {
      if (!my_data?.auth_token) return;

      try {
        const result = await notification.getAllNotification(
          my_data.auth_token,
        );

        if (result?.payload) {
          const notification_data = result.payload.notification_data || [];
          const unique_chated_user = result.payload.unique_chated_user || [];

          dispatch(
            addNotificationData([...notification_data, ...unique_chated_user]),
          );

          if (result.payload.unreadCount !== undefined) {
            dispatch(addUnreadNotification(result.payload.unreadCount));
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    getAllNotifications();
  }, [my_data, dispatch]);

  // Device info collection
  useEffect(() => {
    const fetchDeviceDetails = async () => {
      if (!my_data?.auth_token) return;

      try {
        const deviceInfo = {
          deviceBrand: DeviceInfo.getBrand(),
          deviceModel: DeviceInfo.getModel(),
          osVersion: DeviceInfo.getSystemVersion(),
          deviceName: await DeviceInfo.getDeviceName(),
        };

        await createDeviceinfo(my_data.auth_token, deviceInfo);
        console.log('Device info updated');
      } catch (error) {
        console.error('Failed to update device info:', error);
      }
    };

    fetchDeviceDetails();
  }, [my_data]);

  // Language initialization
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Get device's default language
        const locales = RNLocalize.getLocales();
        const deviceLanguage = locales[0]?.languageCode || 'en';

        // Check if the device language is supported
        const newLanguage = supportedLanguages.includes(deviceLanguage)
          ? deviceLanguage
          : 'en';

        // Apply language
        i18n.changeLanguage(newLanguage);

        // Save the device language in AsyncStorage
        await AsyncStorage.setItem(
          'selectedLanguage',
          JSON.stringify(newLanguage),
        );

        // Ensure UI remains in LTR mode
        I18nManager.allowRTL(false);
      } catch (error) {
        console.error('Language initialization error:', error);
      }
    };

    initializeLanguage();
  }, []);

  const renderScreen = () =>
    isLogin ? <RootStackNavigation /> : <OnboardingNavigation />;

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier={STRIPE_MERCHANT_ID}>
      <SafeAreaView style={{flex: 1}}>
        <PaperProvider>
          <SocketProvider>
            <NavigationContainer
              onReady={() => {
                if (Platform.OS === 'android') {
                  setNavigationBarColor('#000000');
                  setHidden(true);
                  StatusBar.setHidden(true);
                } else if (Platform.OS === 'ios') {
                  StatusBar.setHidden(true);
                }
              }}
              linking={linking}>
              {renderScreen()}
            </NavigationContainer>
          </SocketProvider>
        </PaperProvider>
      </SafeAreaView>
    </StripeProvider>
  );
};

export default App;
