import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import WebView from 'react-native-webview';
import queryString from 'query-string';

import {storePayments} from '../../../../../apis/userApi';
import paymentsApi from '../../../../../apis/paymentsApi';

import {update_wallet_diamond} from '../../../../../store/slices/user/my_dataSlice';

import Header from '../../components/Header';
import {useAppSelector} from '../../../../../store/hooks';
import {selectMyProfileData} from '../../../../../store/selectors';
import {icons} from '../../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const Gift_recharge_sheet = () => {
  const {t, i18n} = useTranslation();

  const priceDetails = [
    {
      id: 1,
      coin: 60,
      price: '$ 0.5',
    },
    {
      id: 2,
      coin: 150,
      price: '$ 1.25',
    },
    {
      id: 3,
      coin: 450,
      price: '$ 3.50',
    },
    {
      id: 4,
      coin: 700,
      price: '$ 5.50',
    },
    {
      id: 5,
      coin: 1300,
      price: '$ 10',
    },
    {
      id: 6,
      coin: 2750,
      price: '$ 20',
    },
  ];
  const [selected_price, setSelected_price] = useState('');
  const [access_token, setAccess_token] = useState(null);
  const [paypal_url, setPaypal_url] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const my_data = useAppSelector(selectMyProfileData);

  const renderItem = ({item, index}) => (
    <Pressable
      onPress={() => {
        setSelected_price(index);
      }}
      style={[
        styles.coin_main_container,
        {borderColor: selected_price == index ? 'red' : 'black'},
      ]}>
      <View style={styles.coin_view}>
        <Image source={icons.diamond} style={{width: 20, height: 20}} />
        <Text style={styles.txt}>{item.coin}</Text>
      </View>
      <Text>{item.price}</Text>
    </Pressable>
  );

  const handlePayments = () => {
    makePayments();
  };

  const makePayments = async () => {
    try {
      const token = await paymentsApi.generateToken();
      setAccess_token(token);
      const price = parseFloat(
        priceDetails[selected_price].price.replace(/[^0-9.]/g, ''),
      );
      const res = await paymentsApi.createOrder(token, price);

      if (res?.links) {
        const findUrl = res.links.find(data => data?.rel === 'approve');
        setPaypal_url(findUrl.href);
        setShowModal(true);
        console.log('response after calling create order:', findUrl.href);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUrlChange = webviewState => {
    console.log('web view state change :', webviewState.url);
    if (webviewState.url.includes('https://example.com/cancel')) {
      clearPaypalState();
      return;
    }
    if (webviewState.url.includes('https://example.com/return')) {
      // setloading(true)
      const urlValues = queryString.parseUrl(webviewState.url);
      // console.log("my urls value", urlValues)
      const {token} = urlValues.query;
      if (token) {
        paymentSucess(token);
      }
    }
  };

  const paymentSucess = async id => {
    try {
      paymentsApi
        .capturePayment(id, access_token)
        .then(res => {
          const {id, links, payer, payment_source, purchase_units, status} =
            res;
          const {address, email_address, name, payer_id} = payer;
          const {account_id, account_status} = payment_source.paypal;
          const [purchase_unit] = purchase_units;
          const {payments, reference_id, shipping} = purchase_unit;

          const link = links[0]?.href;
          const country_code = address?.country_code;
          const first_name = name?.given_name;
          const last_name = name?.surname;

          const amount_value = payments?.captures[0]?.amount.value;
          const currency_code = payments?.captures[0]?.amount.currency_code;
          const {address_line_1, admin_area_1, admin_area_2, postal_code} =
            shipping?.address;
          const dimanond_value = priceDetails[selected_price]?.coin;
          const payment_id = id;
          const data = {
            payment_id,
            link,
            country_code,
            email_address,
            first_name,
            last_name,
            payer_id,
            account_id,
            account_status,
            amount_value,
            currency_code,
            reference_id,
            status,
            address_line_1,
            admin_area_1,
            admin_area_2,
            postal_code,
            dimanond_value,
          };
          storePayments(data, my_data?.auth_token)
            .then(r => {
              console.log(r);
              const wallet = r?.wallet;
              console.log(wallet);
              dispatch(update_wallet_diamond(wallet));
              setloading(false);
            })
            .catch(err => {
              console.log(err.message);
            });
        })
        .catch(err => {
          console.log(err);
        });
      clearPaypalState();
    } catch (error) {
      console.log('error raised in payment capture', error);
    }
  };

  const clearPaypalState = () => {
    setPaypal_url(null);
    setAccess_token(null);
    setShowModal(false);
  };

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Recharge')} />

      <View style={styles.watermarkContainer}>
        <Image
          source={icons.diamond}
          style={styles.diamondIcon}
          resizeMode="cover"
        />
      </View>
      <View style={styles.coinbalance}>
        <Text style={{color: 'black', fontSize: 17}}>{t('Coins Balance')}</Text>
      </View>
      <View style={styles.diamond_txt}>
        <Image
          source={icons.diamond}
          style={styles.diamondSmallIcon}
          resizeMode="cover"
        />
        <Text style={{fontSize: 32, fontWeight: '800', color: 'black'}}>
          {my_data.wallet}
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.flatlist}>
        <FlatList
          data={priceDetails}
          numColumns={3}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      <View style={{top: 320}}>
        <Pressable
          onPress={handlePayments}
          style={{
            width: width,
            height: 50,
            backgroundColor: 'red',
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
            {t('GO CHARGE')}
          </Text>
        </Pressable>
      </View>
      <Modal visible={showModal}>
        <View style={{flex: 1, zIndex: 2000}}>
          <WebView
            source={{uri: paypal_url}}
            onNavigationStateChange={onUrlChange}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Gift_recharge_sheet;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  watermarkContainer: {
    position: 'absolute',
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,

    alignItems: 'center',
    opacity: 0.15, // Set the opacity as needed
  },
  diamondIcon: {
    width: 300,
    height: 500,
    marginRight: 10,
  },
  coinbalance: {
    top: 310,
    height: height * 0.05,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondSmallIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  diamond_txt: {
    top: 305,
    flexDirection: 'row',
    width: width * 0.88,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    borderBottomWidth: 0.3,
    top: 310,
  },
  coin_main_container: {
    width: width * 0.3,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    margin: width * 0.016,
    borderRadius: 10,
  },
  coin_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginLeft: 3,
  },
  flatlist: {
    top: 310,
  },
});
