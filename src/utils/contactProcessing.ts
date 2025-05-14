import {PermissionsAndroid, Platform} from 'react-native';
import Contact from 'react-native-contacts';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import * as suggestedApi from '../apis/suggested_account';

const requestContactPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This app would like to view your contacts.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.CONTACTS);
    return result === RESULTS.GRANTED;
  }
  return false;
};

export const getAllContact = async (token: string) => {
  const permissionGranted = await requestContactPermission();

  if (!permissionGranted) {
    console.log('Permission denied');
    return;
  }

  try {
    const result = await Contact.getAll();

    if (result.length > 0) {
      suggestedApi.syncUserContact(token, result);
    } else {
      throw new Error('contact not found');
    }
  } catch (error) {
    console.error('Error fetching contacts', error);
  }
};
