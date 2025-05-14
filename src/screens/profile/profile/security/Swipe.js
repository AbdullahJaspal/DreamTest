import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  useWindowDimensions,
  Switch,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../components/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const Swipe = () => {
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
    text: {
      fontSize: 18,
      color: '#020202',
      width: width,
      textAlign: 'center',
      fontWeight: '600',
      paddingHorizontal: 20,
      marginTop: 30,
    },
    text1: {
      fontSize: 20,
      color: '#020202',
      width: width,
      textAlign: 'left',
      fontWeight: '400',
      marginVertical: 22,
      paddingHorizontal: 20,
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
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      paddingVertical: 15,
    },
    button_text: {
      color: 'red',
      fontSize: 18,
    },
  });

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Swipe')} />

      <Text style={styles.text}>
        {t('Change to a non-secure screen lock type?')}
      </Text>

      <Text style={styles.text1}>
        {t('Your fingerprints will we removed for you security')}
      </Text>

      <View style={styles.button_view}>
        <Pressable style={styles.button}>
          <Text style={styles.button_text}>{t('Cancel')}</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.button_text}>{t('Remove data')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Swipe;
