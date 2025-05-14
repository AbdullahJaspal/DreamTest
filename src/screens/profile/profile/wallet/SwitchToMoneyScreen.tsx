import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {ProgressBar, MD3Colors} from 'react-native-paper';

import * as userApi from '../../../../apis/userApi';
import {calculateDiamonds} from '../../../../utils/calculatePrice';
import {
  SwitchToBalanceScreenScreenNavigationProps,
  SwitchToBalanceScreenScreenRouteProps,
} from '../../../../types/screenNavigationAndRoute';

import Header from '../components/Header';
import {selectMyProfileData} from '../../../../store/selectors';
import {useAppSelector} from '../../../../store/hooks';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const SwitchToMoneyScreen: React.FC = () => {
  const {t, i18n} = useTranslation();

  const [show_warning, setShow_warning] = useState<boolean>(false);
  const my_data = useAppSelector(selectMyProfileData);
  const [loading, setLoading] = useState(false);
  const navigation =
    useNavigation<SwitchToBalanceScreenScreenNavigationProps>();
  const {
    params: {us_dollar, local_currency},
  } = useRoute<SwitchToBalanceScreenScreenRouteProps>();

  const handleExchangePressed = async () => {
    if (dollarInNumber() > 100) {
      Alert.alert(
        t('Insufficient Balance'),
        t(
          'You need a minimum of $100 to transfer money to your bank account. Please wait until you reach the threshold.',
        ),
      );
      return;
    } else {
      try {
        setLoading(true);
        const result = await userApi.createRequestForPayoutMoney(
          my_data?.auth_token,
        );
        console.log('result', result);
      } catch (error) {
        console.log('Error generated while creating request for payout', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOkPress = () => {
    setShow_warning(false);
  };

  const diamonds = (): number | undefined => {
    const priceInDollar: number = Number(us_dollar?.split(' ')[0]);
    return calculateDiamonds(priceInDollar);
  };

  const dollarInNumber = (): number => {
    return Number(us_dollar?.split(' ')[0]);
  };

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Switch To Money')} thirdButton={false} />

      {/* Bottom Starting Container for displaying Diamonds details */}
      <View style={[styles.nested_container, {marginTop: height * 0.02}]}>
        <Text style={styles.text_header}>
          {t('The total balance of the Diamonds')}
        </Text>
        <Image source={icons.diamond} style={{width: 150, height: 150}} />

        <View style={styles.currency_view}>
          <Text style={styles.balance_txt}>{diamonds() || 0}</Text>
        </View>
      </View>
      {/* Bottom Ending Container for displaying Diamonds details */}

      {/* Top Starting Container for displaying currency details */}
      <View style={styles.nested_container}>
        <Text style={styles.text_header}>
          {t('The total balance of the price of')} {'\n'}{' '}
          {t('Diamonds in Cash')}
        </Text>
        <Image source={icons.dollar} style={styles.dollar_img} />

        <View style={styles.balance_view}>
          <Text style={styles.balance_txt}>{us_dollar}</Text>
          <Text style={styles.country_currency_txt}>
            {t('Your country currency')}
          </Text>

          <Text style={styles.balance_txt_local}>{local_currency}</Text>
        </View>
      </View>
      {/* Top Ending Container for displaying currency details */}

      {/* Progress bar */}
      <View style={styles.progress_bar}>
        <ProgressBar
          progress={dollarInNumber() / 100}
          color={MD3Colors.error50}
        />
        <View style={styles.progress_info_view}>
          <Text style={styles.progress_txt}>{us_dollar}</Text>
          <Text style={styles.progress_txt}>100 $</Text>
        </View>
      </View>

      <View style={styles.bottom_container}>
        <Text style={styles.text_header}>
          {t('Exchnage cash into Diamonds')}
        </Text>
        <Pressable
          style={styles.exchange_button}
          onPress={handleExchangePressed}>
          {loading ? (
            <ActivityIndicator size={'small'} color={'#000'} />
          ) : (
            <Text style={styles.exchange_txt}>{t('Exchange')}</Text>
          )}
        </Pressable>
      </View>

      {/* Start Warning container */}
      {show_warning && (
        <View style={styles.warning}>
          <Image source={icons.warning} style={styles.warning_img} />
          <Text style={styles.attention_txt}>{t('Attention please')}</Text>

          <Text style={styles.info_text}>
            {t('Identity must be proven ')}
            {'\n'} {t('and personal')} {'\n'} {t('verified')}
          </Text>

          <Text style={styles.ok_button} onPress={handleOkPress}>
            {t('Ok')}
          </Text>
        </View>
      )}
      {/* End Warning container */}
    </View>
  );
};

export default React.memo(SwitchToMoneyScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  nested_container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  currency_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchange_button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 35,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exchange_txt: {
    fontSize: 15,
    color: '#000',
    fontWeight: '800',
  },
  text_header: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    textAlign: 'center',
  },
  balance_txt: {
    fontSize: 25,
    fontWeight: '900',
    marginRight: 2,
    color: '#000',
  },
  balance_txt_local: {
    fontSize: 20,
    fontWeight: '900',
    marginRight: 2,
    color: 'red',
    marginBottom: height * 0.03,
  },
  balance_view: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01,
  },
  country_currency_txt: {
    fontSize: 14,
    marginVertical: height * 0.005,
  },
  bottom_container: {
    width: width,
    alignItems: 'center',
  },
  attention_txt: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
  },
  info_text: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 10,
  },
  ok_button: {
    color: '#000',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 30,
  },
  warning: {
    position: 'absolute',
    width: width * 0.9,
    backgroundColor: '#fff',
    height: width * 0.9,
    top: (height - width * 0.9) / 2,
    left: (width * 0.1) / 2,
    alignItems: 'center',
    borderWidth: 0.3,
    justifyContent: 'center',
    zIndex: 100000,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    elevation: 100,
  },
  dollar_img: {
    width: 180,
    height: 180,
    marginVertical: height * 0.003,
  },
  warning_img: {
    width: 70,
    height: 70,
  },
  progress_bar: {
    width: width * 0.9,
    marginBottom: 10,
  },
  progress_info_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  progress_txt: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '500',
  },
});
