import {LogBox} from 'react-native';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import {onMessageReceived} from './src/utils/notification';
import {AdEventType, TestIds, AppOpenAd} from 'react-native-google-mobile-ads';
import mobileAds from 'react-native-google-mobile-ads';
import {enableFreeze, enableScreens} from 'react-native-screens';

// Configure development mode logging
if (__DEV__) {
  LogBox.ignoreLogs([
    'Require cycle:',
    'Remote debugger',
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
  ]);
  console.log('Development mode enabled');
}

// App open ad configuration
const AD_UNIT_ID = __DEV__
  ? TestIds.APP_OPEN
  : 'ca-app-pub-4615570259788732/2241078275';

// Set up messaging handlers
messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

// Enable React Native Screens optimizations
enableFreeze(true);
enableScreens(true);

/**
 * Initialize mobile ads SDK
 */
const initializeAds = async () => {
  try {
    const adapterStatuses = await mobileAds().initialize();
    console.log('Mobile ads initialized:', adapterStatuses);

    // Uncomment to enable app open ad
    /*
    const appOpenAd = AppOpenAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    
    const unsubscribe = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      appOpenAd.show();
    });
    
    appOpenAd.addAdEventListener(AdEventType.ERROR, error => {
      console.error('Ad failed to load:', error);
    });
    
    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      unsubscribe();
    });
    
    appOpenAd.load();
    */
  } catch (error) {
    console.error('Failed to initialize ads:', error);
  }
};

// Initialize ads
initializeAds();

const AppWithRedux = () => (
  <GestureHandlerRootView style={{flex: 1}}>
    <Provider store={store}>
      <App />
    </Provider>
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => AppWithRedux);

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => async remoteMessage => {
    try {
      await onMessageReceived(remoteMessage);
    } catch (error) {
      console.error('Error handling background message:', error);
    }
  },
);
