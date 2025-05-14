import {Platform, StatusBar} from 'react-native';
import {setHidden} from 'react-native-system-navigation';

export const hideStatusBar = () => {
  if (Platform.OS === 'android') {
    setHidden(true);
  } else if (Platform.OS === 'ios') {
    StatusBar.setHidden(true);
  }
};

export const showStatusBar = () => {
  if (Platform.OS === 'android') {
    setHidden(false);
  } else if (Platform.OS === 'ios') {
    StatusBar.setHidden(false);
  }
};
