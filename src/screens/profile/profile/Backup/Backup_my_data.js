import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  StatusBar,
  Switch,
} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Myheader from '../components/Myheader';
const {width, height} = Dimensions.get('screen');

const Back_up_data = () => {
  const {t, i18n} = useTranslation();

  const [switchStates, setSwitchStates] = useState([false]);

  const onToggleSwitch = index => {
    const newswitch = [...switchStates];
    newswitch[index] = !newswitch[index];
    setSwitchStates(newswitch);
  };

  return (
    <View style={styles.main_conatiner}>
      <Myheader headertext={t('Back up my data')} />
      <View style={styles.switchcontainer}>
        <View style={{flexDirection: 'row', width: width * 0.6}}>
          <Text
            style={[
              styles.textwraper,
              {paddingLeft: height * 0.01, color: '#fff'},
            ]}>
            {switchStates[0] ? 'On' : 'Off'}
          </Text>
        </View>

        <View style={{width: width * 0.2}}>
          <Switch
            value={switchStates[0]}
            onValueChange={() => {
              onToggleSwitch(0);
            }}
            color="#ed2415"
          />
        </View>
      </View>
      <View style={{marginLeft: width * 0.05, marginRight: width * 0.04}}>
        <View style={{width: width * 1, marginTop: height * 0.029}}>
          <Text style={{fontSize: 17, fontWeight: 800, color: '#000'}}>
            {t(
              'Automatically back up your account data in the Dream app (such as comments,video likes,promotions,Voice messages,etc.)',
            )}
            .
          </Text>
        </View>
        <View style={{width: width * 1, marginTop: height * 0.017}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#000',
              opacity: 0.3,
            }}>
            {t(
              'When activating this option,you will have a backup copy of all the functions that you will choose ,such as messages, and so on.you can download all this data to your mobile phone or tablet,and you can also transfer it to an SD card or USB,anytime you want',
            )}
          </Text>
        </View>
        <View style={{marginTop: height * 0.014}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#e3091b',
              textAlign: 'center',
            }}>
            {t(
              'This option is only activated for premium or business accounts.',
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Back_up_data;

const styles = StyleSheet.create({
  main_conatiner: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  switchcontainer: {
    flexDirection: 'row',
    backgroundColor: 'red',
    padding: 10,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginTop: height * 0.023,
    height: height * 0.09,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
