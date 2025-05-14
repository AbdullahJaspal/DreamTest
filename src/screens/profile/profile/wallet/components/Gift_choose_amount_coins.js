import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  FlatList,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import queryString from 'query-string';

import {UserFriendDiamond} from '../../../../../apis/Gift_Information_Record';
import {storePayments} from '../../../../../apis/userApi';
import paymentsApi from '../../../../../apis/paymentsApi';
import {update_wallet_diamond} from '../../../../../store/slices/user/my_dataSlice';

import Header from '../../components/Header';
import {selectMyProfileData} from '../../../../../store/selectors';
import {useAppSelector} from '../../../../../store/hooks';
import {icons} from '../../../../../assets/icons';

const Gift_choose_amount_coins = () => {
  const {t, i18n} = useTranslation();

  const priceDetails = [
    {
      id: 1,
      coin: 1,
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
    {
      id: 7,
      coin: 5000,
      price: '$ 35',
    },
    {
      id: 8,
      coin: 7500,
      price: '$ 55',
    },
    {
      id: 9,
      coin: 9000,
      price: '$ 65',
    },
  ];

  const route = useRoute();
  const my_data_show = route.params?.my_data;
  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(0);

  const [selected_price, setSelected_price] = useState('');
  const [access_token, setAccess_token] = useState(null);
  const [paypal_url, setPaypal_url] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const selectedCoin = priceDetails[selected_price];
    console.log(selectedCoin, 'selectedCoin');
    const reciever_id = route.params?.selectedUserId;
    const senderId = my_data?.id;
    console.log(reciever_id, senderId, 'hhvjhbjhbfrompayent');

    // Check if the receiver_id is the same as the senderId
    if (reciever_id === senderId) {
      // Display an alert message indicating that the user cannot send diamonds to themselves
      Alert('You cannot send diamonds to yourself');
      return;
    } else if (my_data?.wallet >= selectedCoin.coin) {
      setLoading(true);
      const diamonds = selectedCoin.coin;
      const token = my_data?.auth_token;
      const data = {
        diamonds,
        reciever_id,
        senderId,
      };
      UserFriendDiamond(data, token)
        .then(r => {
          console.log(r.newWalletBalance, 'hgfjdfhgf');
          dispatch(update_wallet_diamond(r?.newWalletBalance));
          setLoading(false);
          //   forceUpdate((prev) => prev + 1);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else {
      makePayments();
    }
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
    <View style={styles.container}>
      <Header headertext={t('Choose Amount of Coins')} />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <View style={styles.userInfoContainer}>
        <Image
          source={{uri: my_data_show.profile_pic}}
          style={styles.profilePic}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{my_data_show.username}</Text>
        </View>
      </View>

      <View style={styles.walletContainer}>
        <Image
          source={icons.diamond}
          style={styles.diamondIcon}
          resizeMode="cover"
        />
        <Text style={styles.walletText}>{my_data?.wallet}</Text>
      </View>
      <View style={styles.walletContainer}>
        <FontAwesome name="dollar" size={25} color={'green'} />
        <Text style={styles.walletText}>
          {(my_data?.wallet / 120).toFixed(2)}
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
      <View style={{paddingVertical: 50}}>
        <Pressable
          onPress={handlePayments}
          style={{
            width: width * 0.5,
            height: 50,
            backgroundColor: 'red',
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            alignSelf: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
            {t('SEND')}
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

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 26,
    color: 'black',
    fontWeight: '600',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  diamondIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  walletText: {
    fontSize: 35,
    padding: 15,
    color: 'black',
    fontWeight: '600',
  },
  separator: {
    borderBottomWidth: 0.3,
    padding: 10,
    marginBottom: 25,
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
});

export default Gift_choose_amount_coins;
