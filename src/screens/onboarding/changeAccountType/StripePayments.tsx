import React, {useEffect, useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {stripePaymentsCreateIntent} from '../../../apis/payments1Api';
import {Button, View, Text, ActivityIndicator} from 'react-native';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

export default function CheckoutScreen() {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const my_data = useAppSelector(selectMyProfileData);

  const initializePaymentSheet = async () => {
    const amount = 1099;
    const data = {amount};

    try {
      const {paymentIntent, ephemeralKey, customer, publishableKey} =
        await stripePaymentsCreateIntent(data, my_data?.auth_token);

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Example, Inc.',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        paymentMethodTypes: ['card', 'google_pay'],
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });

      if (!error) {
        setLoading(true);
      }
    } catch (error) {
      console.error('Error initializing Payment Sheet:', error);
    }
  };

  const openPaymentSheet = async () => {
    try {
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

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title="Checkout"
        onPress={!loading ? null : openPaymentSheet}
        disabled={!loading}
      />
      {!loading && <ActivityIndicator style={{marginTop: 10}} />}
    </View>
  );
}
