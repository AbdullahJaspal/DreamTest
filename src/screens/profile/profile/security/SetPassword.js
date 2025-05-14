import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  useWindowDimensions,
  Switch,
  Pressable,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import ReactNativeBiometrics, {
//   Biometrics,
//   BiometryTypes,
// } from 'react-native-biometrics';

import {useTranslation} from 'react-i18next';

const SetPin = () => {
  const {t, i18n} = useTranslation();

  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();

  const [show_password, setShow_password] = useState(false);
  const styles = StyleSheet.create({
    main_container: {
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      backgroundColor: '#fff',
      flex: 1,
      alignItems: 'center',
    },
    lock_security: {
      flexDirection: 'row',
      width: width,
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      marginVertical: 25,
      alignItems: 'center',
    },
    text: {
      fontSize: 14,
      width: width,
      textAlign: 'center',
      paddingHorizontal: 20,
      marginTop: 20,
      color: 'rgba(0, 0, 0, 0.5)',
    },
    text1: {
      fontSize: 16,
      width: width,
      paddingHorizontal: 20,
      textAlign: 'center',
      color: '#020202',
      fontWeight: '500',
      marginTop: 10,
    },
    text_input: {
      borderBottomColor: 'blue',
      paddingHorizontal: width * 0.1,
      fontSize: 20,
      width: width * 0.6,
    },
    radio_button_group: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
    },
    button_view: {
      width: width,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginTop: 40,
    },
    button: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      paddingVertical: 12,
    },
    button_text: {
      color: 'red',
      fontSize: 18,
    },
    text_input_view: {
      flexDirection: 'row',
      alignItems: 'center',
      width: width * 0.8,
      justifyContent: 'center',
      borderBottomWidth: 0.5,
      marginTop: 20,
    },
  });

  const change_security = () => {
    setShow_password(p => !p);
  };

  // const rnBiometrics = new ReactNativeBiometrics({
  //   allowDeviceCredentials: true,
  // });

  // const fingerprints = async () => {
  //   console.log('pressed');
  //   const {biometryType} = await rnBiometrics.isSensorAvailable();
  //   console.log(biometryType);
  //   rnBiometrics
  //     .simplePrompt({promptMessage: 'Confirm fingerprint'})
  //     .then(resultObject => {
  //       const {success} = resultObject;

  //       if (success) {
  //         console.log('successful biometrics provided');
  //       } else {
  //         console.log('user cancelled biometric prompt');
  //       }
  //     })
  //     .catch(() => {
  //       console.log('biometrics failed');
  //     });
  // };

  return (
    <View style={styles.main_container}>
      <Header headertext={'Set Password'} />

      <Text style={styles.text}>
        {t(
          "Remember this Password. If you forget it, you'll need to reset your account and all data will be erased in Dream.",
        )}
      </Text>

      <Text style={styles.text1}>
        {t(
          'Your Password must contain at least 4 characters, including at least 1 letter',
        )}
      </Text>

      <View style={styles.text_input_view}>
        <TextInput
          style={styles.text_input}
          secureTextEntry={!show_password}
          // keyboardType='visible-password'
        />
        <Pressable onPress={change_security}>
          <Ionicons
            name={!show_password ? 'eye' : 'eye-off'}
            size={25}
            color={'#020202'}
          />
        </Pressable>
      </View>

      <View style={styles.button_view}>
        {/* <Pressable style={styles.button} onPress={fingerprints}>
          <Text style={styles.button_text}>{t('Cancel')}</Text>
        </Pressable> */}

        <Pressable style={styles.button}>
          <Text style={styles.button_text}>{t('Continue')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SetPin;
