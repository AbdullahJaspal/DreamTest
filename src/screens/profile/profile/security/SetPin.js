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
import {useTranslation} from 'react-i18next';

const SetPin = () => {
  const {t, i18n} = useTranslation();

  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [isEnabled1, setIsEnabled1] = useState(false);
  const toggleSwitch1 = () => setIsEnabled1(previousState => !previousState);

  const styles = StyleSheet.create({
    main_container: {
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
      backgroundColor: '#fff',
      flex: 1,
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
      borderBottomWidth: 0.5,
      borderBottomColor: 'blue',
      marginHorizontal: width * 0.1,
      marginTop: 20,
      paddingHorizontal: width * 0.1,
      fontSize: 20,
      textAlign: 'center',
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
      marginTop: 30,
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
  });
  return (
    <View style={styles.main_container}>
      <Header headertext={'Set Pin'} />

      <Text style={styles.text}>
        {t(
          "Remember this PIN. If you forget it, you'll need to reset your account and all data will be erased in Dream.",
        )}
      </Text>

      <Text style={styles.text1}>
        {t('Pin must contain at least 4 digits.')}{' '}
      </Text>

      <TextInput style={styles.text_input} />

      <View style={styles.radio_button_group}>
        <RadioButton value={true} status="checked" onPress={{}} />
        <Text>{t('Confirm Pin without taping ok')}</Text>
      </View>

      <View style={styles.button_view}>
        <Pressable style={styles.button}>
          <Text style={styles.button_text}>{t('Cancel')}</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.button_text}>{t('Continue')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SetPin;
