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

const MainSecurity = () => {
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
  });
  return (
    <View style={styles.main_container}>
      <Header headertext={t('Security')} />
      <Pressable
        style={styles.lock_security}
        onPress={() => {
          navigation.navigate('LockScreen');
        }}>
        <Text style={styles.text}>{t('Lock Security to Dream')}</Text>
        <AntDesign name="right" size={20} color={'#020202'} />
      </Pressable>

      <View style={styles.lock_security}>
        <Text style={styles.text}>
          {t('Screenshots are not allowed')} {'\n'}{' '}
          {t('while the video is being shown')}
        </Text>
        <Switch
          trackColor={{false: '#767577', true: 'red'}}
          thumbColor={isEnabled ? 'red' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View style={styles.lock_security}>
        <Text style={styles.text}>
          {t('Screenshots are not allowed')}
          {'\n'}
          {t('while the video is being shown')}
        </Text>
        <Switch
          trackColor={{false: '#767577', true: 'red'}}
          thumbColor={isEnabled1 ? 'red' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch1}
          value={isEnabled1}
        />
      </View>
    </View>
  );
};

export default MainSecurity;
