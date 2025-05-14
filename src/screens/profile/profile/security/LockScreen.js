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

const LockScreen = () => {
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
      fontSize: 16,
      color: '#020202',
      width: width * 0.7,
      textAlign: 'left',
    },
    text1: {
      fontSize: 12,
      width: width * 0.7,
      color: 'rgba(0, 0, 0, 0.5)',
    },
  });
  return (
    <View style={styles.main_container}>
      <Header headertext={t('Lock Screen')} />

      <Pressable
        style={styles.lock_security}
        onPress={() => {
          navigation.navigate('ScreenLockType');
        }}>
        <View>
          <Text style={styles.text}>{t('Screen Lock type in Dream')}</Text>
          <Text style={styles.text1}>{t('Pattern, Fingerprints, Pin')}</Text>
        </View>
        <AntDesign name="right" size={20} color={'#020202'} />
      </Pressable>

      <Pressable
        style={styles.lock_security}
        onPress={() => {
          navigation.navigate('LockScreen');
        }}>
        <View>
          <Text style={styles.text}>
            {t('Security Lock Settings In Dream')}
          </Text>
          <Text style={styles.text1}>
            {t(
              'Set Your secure Lock function, such as Auto lock Instantly with Power key',
            )}{' '}
          </Text>
        </View>
        <AntDesign name="right" size={20} color={'#020202'} />
      </Pressable>
    </View>
  );
};

export default LockScreen;
