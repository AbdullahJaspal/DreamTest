import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../components/Header';
import {DateTime} from 'luxon';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import * as userApi from '../../../../apis/userApi';
import {GiftRewardIntoCoinsScreenScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {UserCurrencyDataProps} from './types/userCurrency';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const GiftRewardIntoCoinsScreen: React.FC = () => {
  const {t, i18n} = useTranslation();

  const now = DateTime.local();
  const formattedDate = now.toFormat('dd/L/yyyy hh:mma').toLowerCase();
  const my_data = useAppSelector(selectMyProfileData);
  const navigation =
    useNavigation<GiftRewardIntoCoinsScreenScreenNavigationProps>();
  const [currency_data, setCurrecy_data] = useState<UserCurrencyDataProps>();

  // SwitchToBalanceScreen
  const handleExchangeDiamondsPress = () => {
    if (currency_data?.local_currency && currency_data.us_dollar) {
      navigation.navigate('SwitchToBalanceScreen', {
        local_currency: currency_data?.local_currency,
        us_dollar: currency_data?.us_dollar,
      });
    }
  };

  // SwitchToMoneyScreen
  const handleExchangeToMoneyPress = () => {
    if (currency_data?.local_currency && currency_data.us_dollar) {
      navigation.navigate('SwitchToMoneyScreen', {
        local_currency: currency_data?.local_currency,
        us_dollar: currency_data?.us_dollar,
      });
    }
  };

  const getCurrency_data = useCallback(async () => {
    const result = await userApi.sendUserGiftWalletCurrecyInDollarAndLocal(
      my_data?.auth_token,
    );
    setCurrecy_data(result?.payload);
  }, []);

  useEffect(() => {
    getCurrency_data();
  }, []);

  return (
    // <ScrollView>
    <View style={styles.main_container}>
      <Header headertext={t('Gift Coin Balance')} thirdButton={false} />

      <Text style={styles.current_date_txt}>Date: {formattedDate}</Text>

      <View style={styles.nested_container}>
        <Text style={styles.text_header}>
          {t('The total balance of diamonds in Gift wallet')}
        </Text>
        <Image
          source={icons.dollar}
          style={{width: 180, height: 180, marginVertical: height * 0.002}}
        />

        <View style={styles.balance_view}>
          {currency_data?.local_currency && currency_data.us_dollar ? (
            <>
              <Text style={styles.balance_txt}>{currency_data?.us_dollar}</Text>
              <Text style={styles.country_currency_txt}>
                {t('Your country currency')}
              </Text>
              <Text style={styles.balance_txt_local}>
                {currency_data?.local_currency}
              </Text>
            </>
          ) : (
            <ActivityIndicator size={'small'} color={'#000'} />
          )}
        </View>

        <Pressable
          style={styles.exchange_button}
          onPress={handleExchangeDiamondsPress}>
          <Text style={styles.exchange_txt}>{t('Exchange to Diamonds')}</Text>
        </Pressable>

        <Pressable
          style={styles.exchange_button}
          onPress={handleExchangeToMoneyPress}>
          <Text style={styles.exchange_txt}>{t('Convert to Money')}</Text>
        </Pressable>

        <View style={{position: 'absolute', bottom: 30}}>
          <View style={styles.history_info_view}>
            <Text>{t('The amount available for withdrawal')}</Text>
            <View style={styles.currency_view}>
              <Text>{currency_data?.us_dollar}</Text>
            </View>
          </View>

          <View style={styles.history_info_view}>
            <Text>{t('Last year total transactions')}</Text>
            <View style={styles.currency_view}>
              <Text>0</Text>
              <Feather name="dollar-sign" size={15} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottom_container}>
        <Text style={styles.previous_txt}>{t('Previous withdrawals')}</Text>
      </View>
    </View>
    // {/* </ScrollView> */}
  );
};

export default React.memo(GiftRewardIntoCoinsScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  current_date_txt: {
    fontSize: 14,
    color: 'red',
    fontWeight: '500',
    marginHorizontal: 10,
    marginTop: 20,
  },
  nested_container: {
    flex: 1,
    alignItems: 'center',
    marginTop: '5%',
  },
  text_header: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  balance_view: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
    height: 80,
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
  exchange_button: {
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: height * 0.02,
  },
  exchange_txt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  history_info_view: {
    flexDirection: 'row',
    width: width,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  currency_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottom_container: {
    bottom: 0,
    width: width,
    paddingHorizontal: 10,
    height: 120,
  },
  previous_txt: {
    color: 'red',
    textAlign: 'right',
  },
  country_currency_txt: {
    fontSize: 14,
    marginVertical: height * 0.01,
  },
});
