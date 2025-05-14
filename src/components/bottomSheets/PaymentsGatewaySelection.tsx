import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  setPaymentSelectionSheet,
  selectedRechargeSheetProps,
} from '../../store/slices/ui/indexSlice';
import PaymentSelectionHeader from './PaymentSelectionHeader';
import {useStripe} from '@stripe/stripe-react-native';
import {
  stripePaymentsCreateIntent,
  changedStripeTransactionStatus,
  generateGoogleplayPaymentsIntent,
} from '../../apis/payments1Api';
import {productSkus} from '../../utils/productSkus';
import {
  Product,
  Purchase,
  PurchaseError,
  getProducts,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  acknowledgePurchaseAndroid,
} from 'react-native-iap';
import Toast from 'react-native-simple-toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector} from '../../store/hooks';
import {
  selectMyProfileData,
  selectPaymentSelection,
  selectSelectedRechargeData,
} from '../../store/selectors';
import {icons} from '../../assets/icons';

const {width} = Dimensions.get('screen');

interface PaymentDataProps {
  item: {
    id: number;
    info_text: string;
    icon_name: ImageSourcePropType;
    diamonds: string;
    diamonds_number: number;
  };
  index: number;
}

interface PurchaseRequest {
  skus?: string[];
  sku?: string;
}

const increaseBy5Percent = (num: number): number => {
  const increase = num * 0.05;
  const result = num + increase;
  return result;
};

const PaymentsGatewaySelection = () => {
  const dispatch = useDispatch();
  const paymentSelection = useAppSelector(selectPaymentSelection);
  const selected_recharge_data: selectedRechargeSheetProps = useAppSelector(
    selectSelectedRechargeData,
  );
  const my_data = useAppSelector(selectMyProfileData);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [products, setProducts] = useState<Product[]>([]);
  const [product_transaction_id, setProduct_transaction_id] =
    useState<number>();

  const handleClose = () => {
    dispatch(setPaymentSelectionSheet(false));
  };

  const payments_data = [
    {
      id: 1,
      info_text: 'Get 5% extra diamonds with Stripe payment!',
      icon_name: icons.stripe,
      diamonds: `${increaseBy5Percent(
        selected_recharge_data.diamonds,
      )} (5% bonus) 🔝`,
      diamonds_number: increaseBy5Percent(selected_recharge_data.diamonds),
      payments_method: 'Stripe',
    },
    {
      id: 2,
      info_text: 'Pay using Google Play',
      icon_name: icons.googlePlay,
      diamonds: `${selected_recharge_data.diamonds}`,
      diamonds_number: selected_recharge_data.diamonds,
      payments_method: 'Google_play',
    },
  ];

  const fetchProducts = useCallback(async () => {
    try {
      if (productSkus && productSkus.length > 0) {
        const products = await getProducts({skus: ['1000_diamonds']});
        setProducts(products);
        console.log('products', products);
      } else {
        console.error('No product SKUs defined');
      }
    } catch (error) {
      console.error('Error fetching products', (error as Error).message);
    }
  }, [productSkus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChangingPaymentsStatus = async (status: string) => {
    if (product_transaction_id) {
      await changedStripeTransactionStatus(
        {
          transaction_id: product_transaction_id,
          payment_status: status,
        },
        my_data?.auth_token,
      );
    }
    Toast.show(`You payments is ${status}`, Toast.LONG);
  };

  useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        const {transactionReceipt} = purchase;
        const purchaseToken: string | undefined = purchase?.purchaseToken;
        const acknowledged: boolean =
          JSON.parse(transactionReceipt)?.acknowledged;
        if (!acknowledged && purchaseToken) {
          try {
            await acknowledgePurchaseAndroid({token: purchaseToken});
            handleChangingPaymentsStatus('completed');
            console.log('Purchase acknowledged');
          } catch (err) {
            console.error('Error acknowledging purchase:', err);
            handleChangingPaymentsStatus('failed');
          }
        }
      },
    );

    const purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.error('Purchase error:', error.message || error);
      },
    );

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);

  const handlePurchase = async (diamonds_des_txt: string) => {
    if (!products || products.length === 0) {
      console.error('No products available for purchase');
      return;
    }

    try {
      const product = products.find(
        item => item.description === diamonds_des_txt,
      );
      const productId = product?.productId;

      console.log('Product ID:', productId);
      const purchaseRequest: PurchaseRequest =
        Platform.select({
          android: {
            skus: [productId],
          },
          ios: {
            sku: productId,
          },
        }) || {};
      await requestPurchase(purchaseRequest);
    } catch (error) {
      console.error('Error during purchase', (error as Error).message);
    }
  };

  const handleGooglePlayPayments = async (price: number, diamonds: number) => {
    try {
      const intent_result = await generateGoogleplayPaymentsIntent(
        {amount: price, diamonds: diamonds},
        my_data?.auth_token,
      );
      if (intent_result.status === 400) {
        throw new Error('Make sure to provide all required filed');
      }
      const diamonds_des_txt: string = `A pack of ${diamonds} diamonds`;
      setProduct_transaction_id(intent_result?.transaction?.id);
      handlePurchase(diamonds_des_txt);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleStripePayments = async (price: number, diamonds: number) => {
    try {
      const intent_result = await stripePaymentsCreateIntent(
        {amount: price, diamonds: diamonds},
        my_data?.auth_token,
      );

      if (intent_result.status === 400) {
        throw new Error('Make sure to provide all required filed');
      }

      if (intent_result.status === 403) {
        Alert.alert(
          'Payment Method Unavailable',
          "We're sorry for the inconvenience. At this time, this payment method is not available in your country. Please try using Google Play for your purchase.",
        );
        throw new Error('Payment Method Unavailable');
      }

      const {paymentIntent, ephemeralKey, customer, transaction} =
        intent_result;

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Dream',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: my_data?.nickname,
        },
      });
      setProduct_transaction_id(transaction?.id);

      if (!error) {
        const {error} = await presentPaymentSheet();

        if (error) {
          handleChangingPaymentsStatus('failed');
          Alert.alert(`Error: ${error.code}`, error.message);
        } else {
          handleChangingPaymentsStatus('completed');
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const RenderPaymentsList: React.FC<PaymentDataProps> = ({item, index}) => {
    const handlePaymentsListPress = async () => {
      const price: number = parseFloat(
        selected_recharge_data.price?.split(' ')[1] as string,
      );

      switch (item?.payments_method) {
        case 'Stripe':
          handleStripePayments(price, item.diamonds_number);
          break;
        case 'Google_play':
          handleGooglePlayPayments(price, item.diamonds_number);
          break;
        default:
          break;
      }
    };

    return (
      <TouchableOpacity
        style={styles.payment_main_container}
        onPress={handlePaymentsListPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={item.icon_name} style={styles.img_container} />
          <View style={styles.text_info_view}>
            <Text style={styles.info_text}>{item.info_text}</Text>
            <Text style={styles.info_text}>Diamonds: {item?.diamonds}</Text>
            <Text style={styles.info_text}>
              Price: {selected_recharge_data.price}
            </Text>
          </View>
        </View>
        <Image source={icons.right} style={styles.arrow_forward_img} />
      </TouchableOpacity>
    );
  };

  if (!paymentSelection) {
    return null;
  }

  return (
    <SafeAreaView>
      <Modal
        visible={paymentSelection}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={handleClose}>
        <Pressable onPress={handleClose} style={{flex: 1}} />
        <View style={styles.main_container}>
          <PaymentSelectionHeader />
          <View style={{paddingTop: 10}}>
            <FlatList
              data={payments_data}
              renderItem={RenderPaymentsList}
              keyExtractor={item => item.id.toString()}
              ListHeaderComponent={() => (
                <Text style={styles.header_txt}>Choose Payment method:</Text>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentsGatewaySelection;

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#fff',
    width: width,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    height: 320,
  },
  img_container: {
    width: 30,
    height: 30,
  },
  payment_main_container: {
    width: width * 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.3,
    marginVertical: 10,
    marginHorizontal: width * 0.025,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: 'space-between',
    borderColor: 'rgba(0, 0, 0, 0.6)',
  },
  info_text: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  text_info_view: {
    marginLeft: 20,
  },
  arrow_forward_img: {
    width: 15,
    height: 15,
  },
  header_txt: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.8)',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 3,
  },
});
