import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import React, {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Slider} from '@miblanchard/react-native-slider';
import paymentsApi from '../../apis/paymentsApi';
import {useTranslation} from 'react-i18next';
import {icons} from '../../assets/icons';

const window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const PromoteScreen = () => {
  const {t, i18n} = useTranslation();

  const [audience, setAudience] = useState(true);
  const [budget, setBuget] = useState(1);
  const [promotion_time, setPromotion_time] = useState(1);
  const [access_token, setAccess_token] = useState(null);
  const [paypal_url, setPaypal_url] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleBudgetChange = value => {
    setBuget(value);
  };

  const handleTimeChange = value => {
    setPromotion_time(value);
  };

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
    <View style={styles.main_containers}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: window.width * 0.9,
          marginTop: 10,
          borderBottomWidth: 1,
          paddingBottom: 10,
          paddingHorizontal: window.width * 0.05,
          borderColor: 'rgba(0, 0, 0, 0.4)',
        }}>
        <Image source={icons.back} />
        <Text style={{fontSize: 20, color: '#000000'}}>{t('Promote')}</Text>
        <Image source={icons.questionMark} />
      </View>

      <View
        style={{width: window.width * 0.9, marginTop: window.height * 0.02}}>
        <Text style={{color: '#000000', fontSize: 16}}>
          {t('Define Your audience')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: window.height * 0.02,
          }}>
          <Text>{t('Default audience ( Dream app choose for you )')}</Text>
          <RadioButton
            status={audience ? 'checked' : 'unchecked'}
            onPress={() => {
              setAudience(pre => !pre);
            }}
            color="#FA3E60"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: window.height * 0.02,
          }}>
          <Text>{t('Custom')}</Text>
          <TouchableOpacity>
            <Image
              source={icons.back}
              style={{width: 20, height: 20, transform: [{rotate: '180deg'}]}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{width: window.width * 0.9, marginTop: window.height * 0.03}}>
        <Text style={{color: '#000000', fontSize: 16}}>
          {t('Buget and duration')}
        </Text>

        <View />

        <View style={{marginTop: window.height * 0.03}}>
          <Text style={{fontSize: 16}}>
            {t('What is your per day budget?')}
          </Text>
          <Slider
            value={budget}
            onValueChange={handleBudgetChange}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#FA3E60"
            maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
            thumbTintColor="#C9B5B5"
            renderThumbComponent={() => <CustomThumb value={budget} />}
          />
        </View>

        <View style={{marginTop: window.height * 0.03}}>
          <Text style={{fontSize: 16}}>
            {t('How long would you like to promote?')}
          </Text>
          <Slider
            value={promotion_time}
            onValueChange={handleTimeChange}
            minimumValue={0}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#FA3E60"
            maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
            thumbTintColor="#C9B5B5"
            renderThumbComponent={() => <CustomThumb value={promotion_time} />}
          />
        </View>
      </View>
      <View
        style={{
          width: window.width * 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: window.width * 0.1,
          alignItems: 'center',
          position: 'absolute',
          bottom: 20,
        }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            padding: 7,
            borderRadius: 3,
          }}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: 500}}>
            $ {budget * promotion_time}
          </Text>
        </View>
        <TouchableOpacity onPress={makePayments} style={styles.gift_button}>
          <Text style={{color: 'white', fontSize: 15}}>{t('Buy')}</Text>
        </TouchableOpacity>
      </View>
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

const CustomThumb = ({value}) => {
  return (
    <View style={styles.thumbContainer}>
      <View style={styles.thumb}>
        <Text style={styles.thumbText}>{value}</Text>
      </View>
    </View>
  );
};

export default PromoteScreen;

const styles = StyleSheet.create({
  main_containers: {
    backgroundColor: '#ffffff',
    width: window.width * 1,
    height: window.height * 0.7,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  gift_button: {
    backgroundColor: '#F42020',
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width * 0.25,
    padding: 10,
    borderRadius: 5,
  },
  thumbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumb: {
    backgroundColor: '#C9B5B5',
    borderRadius: 13,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    zIndex: 1,
  },
});
