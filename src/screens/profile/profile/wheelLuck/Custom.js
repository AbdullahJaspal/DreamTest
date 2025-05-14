import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import Header from '../components/Header';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const Custom = () => {
  const {t, i18n} = useTranslation();

  const [inputValue, setInputValue] = useState('1500');
  const textInputRef = useRef(null);
  const [minutevalue, setminutevalue] = useState('5');
  const minuteInputRef = useRef(null);

  return (
    <View style={styles.main_conatainer}>
      <Header headertext={t('Custom')} />
      <View
        style={[
          styles.topsection,
          {borderBottomWidth: 0, marginTop: height * 0.023, padding: 3},
        ]}>
        <Text style={{fontSize: 13}}>
          {t(
            'Spin the wheel of fortune with your gift and encourage the viewers',
          )}
        </Text>
      </View>
      <View style={styles.topsection}>
        <View style={{width: width * 0.3, paddingLeft: width * 0.023}}>
          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            value={inputValue}
            onChangeText={text => setInputValue(text)}
            keyboardType="numeric"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: width * 0.3,
            paddingLeft: width * 0.023,
            alignItems: 'center',
          }}>
          <Image
            source={icons.diamond}
            style={{width: 30, height: 30, marginRight: 10}}
          />
          <Text style={styles.textsection}>{t('Coins')}</Text>
        </View>
      </View>

      <View style={styles.topsection}>
        <View style={{width: width * 0.3, paddingLeft: width * 0.023}}>
          <TextInput
            ref={minuteInputRef}
            value={minutevalue}
            onChangeText={text => setInputValue(text)}
            keyboardType="numeric"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: width * 0.3,
            paddingLeft: width * 0.023,
            alignItems: 'center',
          }}>
          <Image
            source={icons.diamond}
            style={{width: 30, height: 30, marginRight: 10}}
          />
          <Text style={styles.textsection}>{t('Minute')}</Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: width * 0.41,
          borderWidth: 2,
          borderColor: '#e31409',
          borderRadius: 18,
          backgroundColor: '#000',
          marginTop: 20,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 18,
            width: width * 0.4,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#1d9acc',
          }}>
          <Text style={{color: '#e0b712', fontWeight: 800, fontSize: 14}}>
            {t('Send')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Custom;

const styles = StyleSheet.create({
  main_conatainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#ffff',
  },
  topsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: width * 0.05,
    marginLeft: width * 0.05,
    width: width * 0.9,
    borderBottomWidth: 1,
    borderColor: '#cadae0',
    alignItems: 'center',
    padding: 7,
    // opacity:0.4,
    marginTop: height * 0.033,
  },
  textsection: {
    fontSize: 17,
    fontWeight: 800,
    color: '#000',
  },
});
