import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../profile/profile/components/Header';
import {RadioButton, Checkbox} from 'react-native-paper';
import {useStripe} from '@stripe/stripe-react-native';
import {stripePaymentsCreateIntent} from '../../../apis/payments1Api';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const {width, height} = Dimensions.get('screen');

type PaymentMethod = 'paypal' | 'card' | 'online banking';

const BusinessPaymentsPreviewScreen: React.FC = () => {
  const [value, setValue] = useState<string>('first');
  const [paymentsMethod, setPaymentsMethod] = useState<PaymentMethod>('paypal');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState<boolean>(false);
  const myData = useAppSelector(selectMyProfileData);

  const initializePaymentSheet = async () => {
    const amount = 1099;
    const data = {amount};
    try {
      if (myData?.auth_token && myData?.nickname) {
        const {paymentIntent, ephemeralKey, customer, publishableKey} =
          await stripePaymentsCreateIntent(data, myData?.auth_token);
        const {error} = await initPaymentSheet({
          merchantDisplayName: myData?.nickname,
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: true,
        });
        if (!error) {
          setLoading(true);
        }
      }
    } catch (error) {
      console.error('Error initializing Payment Sheet:', error);
    }
  };

  const openPaymentSheet = async () => {
    try {
      await initializePaymentSheet();
      const {error} = await presentPaymentSheet();
      if (error) {
        console.error('Error during payment:', error);
      } else {
        console.log('Payment successful!');
      }
    } catch (error) {
      console.error('Error presenting Payment Sheet:', error);
    }
  };

  const handleNextPress = () => {
    setShowPaymentModal(prev => !prev);
  };

  function handlePaymentMethodChange(value: string): void {
    setPaymentsMethod(value as PaymentMethod);
  }

  return (
    <View style={styles.mainContainer}>
      <Header headertext={'Business Details'} />
      <ScrollView style={styles.container}>
        <Text style={styles.businessNameText}>Business Name</Text>
        <TextInput style={styles.businessTextInput} placeholder="Add a name" />
        <Text style={styles.businessNameDesc}>
          Enter your legal name if you don't have a business name
        </Text>

        <Text style={styles.businessNameText}>Business Address</Text>
        <Text style={styles.businessNameDesc}>
          The legal address registered with your government and tax agency. If
          you're not a registered business, enter your mailing address.
        </Text>
        <TextInput
          style={styles.businessTextInput}
          placeholder="Street Address 1"
        />
        <TextInput
          style={styles.businessTextInput}
          placeholder="Street Address 2"
        />
        <TextInput style={styles.businessTextInput} placeholder="City/town" />
        <View style={styles.addressRow}>
          <TextInput
            style={[styles.businessTextInput, styles.addressInput]}
            placeholder="State"
          />
          <TextInput style={styles.businessTextInput} placeholder="Zip code" />
        </View>

        <Text style={styles.businessNameText}>Advertising Purpose</Text>
        <RadioButton.Group onValueChange={setValue} value={value}>
          <View style={styles.radioButtonView}>
            <RadioButton value="first" />
            <Text style={styles.radioText}>
              Yes, I am buying ads for business purpose
            </Text>
          </View>
          <View style={styles.radioButtonView}>
            <RadioButton value="second" />
            <Text style={styles.radioText}>
              No, I am not buying ads for business purpose
            </Text>
          </View>
        </RadioButton.Group>

        <Text style={styles.businessNameText}>Add Payment Method</Text>
        <RadioButton.Group
          onValueChange={handlePaymentMethodChange}
          value={paymentsMethod}>
          <View style={styles.paymentMethodView}>
            <Text style={styles.radioText}>Debit Card or Credit Card</Text>
            <RadioButton value="card" />
          </View>
          <View style={styles.paymentMethodView}>
            <Text style={styles.radioText}>Paypal</Text>
            <RadioButton value="paypal" />
          </View>
          <View style={styles.paymentMethodView}>
            <Text style={styles.radioText}>Online Banking</Text>
            <RadioButton value="online banking" />
          </View>
        </RadioButton.Group>

        <View style={styles.paymentMethodView}>
          <Checkbox status="indeterminate" />
          <Text>I have an app credit to claim</Text>
        </View>
        <View style={styles.bottomButtonSection}>
          <Text style={styles.radioText}>
            Even with an ad credit, you will need to add a payment method to run
            ads. You can claim your ad credit after entering your payment
            information.
          </Text>
        </View>

        <Text style={[styles.radioText, styles.paymentDisclaimer]}>
          Your payment methods are saved and stored securely.
        </Text>

        <Pressable style={styles.nextButtonView} onPress={handleNextPress}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={showPaymentModal} transparent={true}>
        <Pressable
          style={styles.modalMainContainer}
          onPress={() => setShowPaymentModal(false)}>
          <Pressable style={styles.modalViewContainer}>
            <Pressable style={styles.modalButton} onPress={openPaymentSheet}>
              <Text style={styles.buttonText}>Try free for 1 month</Text>
            </Pressable>
            <Text style={styles.modalText}>1 month free, then $500/month</Text>

            <Text style={styles.termsText}>
              By placing this order, you agree to Dream's Terms of Service and
              Privacy Policy. Your selected payment methods will be charged $500
              each month once the free trial ends.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default BusinessPaymentsPreviewScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  businessTextInput: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 3,
  },
  businessNameText: {
    fontSize: 20,
    color: '#020202',
    fontWeight: '500',
    marginVertical: 10,
  },
  businessNameDesc: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodView: {
    width: width * 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioText: {
    color: '#020202',
    fontSize: 14,
    fontWeight: '600',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressInput: {
    marginRight: 5,
  },
  bottomButtonSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  nextButtonView: {
    backgroundColor: 'red',
    padding: 15,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 2,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  modalMainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalViewContainer: {
    height: height * 0.3,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: width,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
    paddingVertical: 10,
    borderRadius: 100,
  },
  modalText: {
    marginVertical: 10,
  },
  termsText: {
    color: '#020202',
    width: width * 0.9,
    textAlign: 'center',
  },
  paymentDisclaimer: {
    marginVertical: 10,
  },
});
