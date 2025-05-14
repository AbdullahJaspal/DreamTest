import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../profile/profile/components/Header';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import {storePayments} from '../../../apis/userApi';
import paymentsApi from '../../../apis/paymentsApi';
import {update_wallet_diamond} from '../../../store/slices/user/my_dataSlice';

const PremiumPaymentsPreviewScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [access_token, setAccess_token] = useState(null);
  const [paypal_url, setPaypal_url] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricingData = [
    {id: 1, duration: '1 Month', price: '$10'},
    {id: 2, duration: '6 Months', price: '$60'},
    {id: 3, duration: '1 Year', price: '$100'},
  ];

  const handleSelectOption = optionId => {
    setSelectedOption(optionId);
  };

  const handleProceedToPayment = () => {
    if (selectedOption) {
      const selectedPricingOption = pricingData.find(
        option => option.id === selectedOption,
      );
      // Add navigation logic or any action you want to perform when proceeding to payment
      console.log('Proceeding to payment for:', selectedPricingOption.price);
      makePayments(selectedPricingOption.price);
    } else {
      console.log('Please select a pricing option');
    }
  };

  const makePayments = async selectedPrice => {
    try {
      const token = await paymentsApi.generateToken();
      setAccess_token(token);
      const price = parseFloat(selectedPrice.replace(/[^0-9.]/g, ''));
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
    <LinearGradient
      colors={['#000000', '#2c3e50']}
      style={styles.gradientBackground}>
      <View style={styles.mainContainer}>
        <Header headertext={''} />
        <Text style={styles.title}>Choose a Premium Plan:</Text>
        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerText]}>Duration</Text>
            <Text style={[styles.cell, styles.priceText]}>Price</Text>
          </View>
          {pricingData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.row,
                selectedOption === item.id && styles.selectedRow,
              ]}
              onPress={() => handleSelectOption(item.id)}>
              <Text style={styles.cell}>{item.duration}</Text>
              <Text style={[styles.cell, styles.priceText]}>{item.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleProceedToPayment}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal}>
        <View style={{flex: 1, zIndex: 2000}}>
          <WebView
            source={{uri: paypal_url}}
            onNavigationStateChange={onUrlChange}
          />
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    height: '90%',
  },
  mainContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#ffffff', // White text color
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    borderWidth: 1,
    borderColor: '#ecf0f1', // Light gray border
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ecf0f1', // Light gray border
    paddingVertical: 10,
    backgroundColor: '#3498db', // Blue background for the header row
  },
  headerText: {
    color: '#fff', // White text color for the header
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ecf0f1', // Light gray border
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedRow: {
    backgroundColor: '#e74c3c', // Red background for selected row
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#2c3e50', // Dark gray text color
  },
  priceText: {
    fontWeight: 'bold',
    color: '#27ae60', // Green text color for price
  },
  button: {
    backgroundColor: '#e74c3c', // Red background for the button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text color for the button
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PremiumPaymentsPreviewScreen;
