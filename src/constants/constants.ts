// import {Dimensions, Platform, StatusBar} from 'react-native';

// const Visibility = Object.freeze({
//   Hidden: 0,
//   Visible: 1,
// });

// const TESTING_PIC_URL = 'https://avatars.githubusercontent.com/u/129264144';

// const SERVER_DOMAIN = 'https://api.dreamlived.com';
// const SERVER_API_URL = 'https://api.dreamlived.com';

// const LIVE_STREAM_URL = 'rtmp://192.168.29.68';

// const AGORA_APP_ID = '317633f93b81adc8a92fc623c4917f5';

// const KEY_STORAGE = Object.freeze({
//   TOKEN: 'token',
//   ID_USER: 'id_user',
//   SEARCH_HIS: 'search_his',
// });

// const {width: WIDTH, height: HEIGHT} = Dimensions.get('screen');
// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

// const BOTTOM_NAVIGATOR_HEIGHT = HEIGHT - Dimensions.get('window').height;

// export {
//   Visibility,
//   SERVER_API_URL,
//   SERVER_DOMAIN,
//   KEY_STORAGE,
//   WIDTH,
//   HEIGHT,
//   STATUSBAR_HEIGHT,
//   BOTTOM_NAVIGATOR_HEIGHT,
//   LIVE_STREAM_URL,
//   AGORA_APP_ID,
//   TESTING_PIC_URL,
// };

import {Dimensions, Platform, StatusBar} from 'react-native';

const Visibility = Object.freeze({
  Hidden: 0,
  Visible: 1,
});

const TESTING_PIC_URL = 'https://avatars.githubusercontent.com/u/129264144';

const SERVER_DOMAIN = 'https://api.dreamlived.com';
const SERVER_API_URL = 'https://api.dreamlived.com';

const LIVE_STREAM_URL = 'rtmp://192.168.29.68';

const AGORA_APP_ID = '317633f93b81adc8a92fc623c4917f5';

const KEY_STORAGE = Object.freeze({
  TOKEN: 'token',
  ID_USER: 'id_user',
  SEARCH_HIS: 'search_his',
});

const {width: WIDTH, height: HEIGHT} = Dimensions.get('screen');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const BOTTOM_NAVIGATOR_HEIGHT = HEIGHT - Dimensions.get('window').height;
export {
  Visibility,
  SERVER_API_URL,
  SERVER_DOMAIN,
  KEY_STORAGE,
  WIDTH,
  HEIGHT,
  STATUSBAR_HEIGHT,
  BOTTOM_NAVIGATOR_HEIGHT,
  LIVE_STREAM_URL,
  AGORA_APP_ID,
  TESTING_PIC_URL,
};
