import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import paymentsApi from '../../apis/paymentsApi';
import WebView from 'react-native-webview';
import queryString from 'query-string';

const Payments = () => {
  const [access_token, setAccess_token] = useState(null);
  const [paypal_url, setPaypal_url] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const makePayments = async () => {
    try {
      const token = await paymentsApi.generateToken();
      setAccess_token(token);
      const res = await paymentsApi.createOrder(token);
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
      const res = paymentsApi.capturePayment(id, access_token);
      console.log('capturePayment res++++', res);
      alert('Payment sucessfull...!!!');
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
    <View>
      <Text>Payments</Text>
      <TouchableOpacity
        onPress={makePayments}
        style={{
          backgroundColor: 'green',
          width: 180,
          height: 30,
          padding: 10,
          margin: 50,
        }}>
        <Text>Make your payments</Text>
      </TouchableOpacity>

      <Modal visible={showModal}>
        <View style={{flex: 1}}>
          <WebView
            source={{uri: paypal_url}}
            onNavigationStateChange={onUrlChange}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({});
