import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';

import Header from '../components/Header';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {Payment_MethodScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';

import * as userApi from '../../../../apis/userApi';
import {formattedDateAndTime} from '../../../../utils/customDate';

import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');
interface PayPalAccount {
  id: number;
  firstName: string;
  lastName: string;
  billingAddress: string;
  email: string;
  paypalEmail: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

const Payment_Method: React.FC = () => {
  const navigation = useNavigation<Payment_MethodScreenNavigationProps>();
  const {t, i18n} = useTranslation();

  const my_data = useAppSelector(selectMyProfileData);
  const [userPayoutData, setUserPayoutData] = useState<PayPalAccount>();
  const paypalHandler = () => {
    navigation.navigate('WithdrawalForm', {update: false});
  };

  const StripeHandler = async () => {
    navigation.navigate('WithdrawalFormStripe');
  };

  const getUserPayoutAccount = useCallback(async () => {
    try {
      const user_account = await userApi.getPaypalAccount(my_data?.auth_token);
      setUserPayoutData(user_account?.data ? user_account?.data : undefined);
    } catch (error) {
      console.log('Error generated while getting user payout account', error);
    }
  }, [my_data]);

  useEffect(() => {
    getUserPayoutAccount();
  }, [getUserPayoutAccount]);

  const handlePayoutChangeDetails = () => {
    navigation.navigate('WithdrawalForm', {update: true});
  };

  return (
    <ScrollView style={styles.main_container}>
      <Header headertext={t('Add Payment Method')} />

      {userPayoutData === undefined ? (
        <>
          <Text style={styles.choose_payments_txt}>
            {t('Your Payout Account Details')}
          </Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('Legal First Name')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('Enter First Name')}
                editable={false}
                value={userPayoutData?.firstName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('Legal Last Name')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                editable={false}
                placeholder={t('Enter Last Name')}
                value={userPayoutData?.lastName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('Legal Billing Address')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                editable={false}
                placeholder={t('Enter Billing Address')}
                value={userPayoutData?.billingAddress}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('Email')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                editable={false}
                placeholder={t('Enter Email')}
                value={userPayoutData?.email}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('PayPal Email')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('Enter PayPal Email')}
                editable={false}
                value={userPayoutData?.paypalEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t('Updated Date')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                editable={false}
                value={formattedDateAndTime(userPayoutData?.updatedAt)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t(' Created Date')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                editable={false}
                value={formattedDateAndTime(userPayoutData?.createdAt)}
              />
            </View>

            <View style={styles.change_button_view}>
              <Pressable
                style={styles.change_button}
                onPress={handlePayoutChangeDetails}>
                <Text style={styles.change_txt}>
                  {t('Change Payout Details')}
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.choose_payments_txt}>
            {t('Choose Payment Method')}
          </Text>

          <View style={styles.image_txt}>
            <View style={styles.image}>
              <Image
                source={icons.paypal}
                style={styles.paypal_img}
                resizeMode="cover"
              />
            </View>

            <View style={styles.paypal}>
              <Text style={styles.paypal_txt}>{t('Paypal')}</Text>
            </View>

            <TouchableOpacity style={styles.antdesign} onPress={paypalHandler}>
              <AntDesign name="right" />
            </TouchableOpacity>
          </View>

          <View style={styles.inner_text}>
            <Text style={{color: 'grey'}}>
              {t(
                'Service fees: $ 3 will be charged for per 1000 coins Minimum transaction amount :$ 100.',
              )}
            </Text>
            <Text style={styles.bottom_txt}>
              {t('Funds should be arrived in 3-4 business days.')}
            </Text>
          </View>

          <View style={styles.image_txt}>
            <View style={styles.image}>
              <Image
                source={icons.stripe}
                style={styles.paypal_img}
                resizeMode="cover"
              />
            </View>

            <View style={styles.paypal}>
              <Text style={styles.paypal_txt}>{t('Stripe')}</Text>
            </View>

            <TouchableOpacity style={styles.antdesign} onPress={StripeHandler}>
              <AntDesign name="right" />
            </TouchableOpacity>
          </View>

          <View style={styles.inner_text}>
            <Text style={{color: 'grey'}}>
              {t(
                'Service fees: $ 3 will be charged for per 1000 coins Minimum transaction amount :$ 100.',
              )}
            </Text>
            <Text style={styles.bottom_txt}>
              {t('Funds should be arrived in 3-4 business days.')}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default React.memo(Payment_Method);

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  image_txt: {
    flexDirection: 'row',
    width: width,
    marginTop: 10,
  },
  image: {
    width: width * 0.2,
    padding: 10,
    height: height * 0.06,
    justifyContent: 'center',
  },
  paypal: {
    width: width * 0.7,
    justifyContent: 'center',
  },
  antdesign: {
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paypal_txt: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  inner_text: {
    width: width * 0.8,
    marginLeft: width * 0.2,
  },
  choose_payments_txt: {
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  paypal_img: {
    width: 50,
    height: 50,
  },
  bottom_txt: {
    color: 'grey',
    marginTop: 3,
    fontWeight: '500',
    marginBottom: 10,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  asterisk: {
    color: 'red',
  },
  input: {
    height: 40,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ecf0f1',
  },
  change_button_view: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  change_button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  change_txt: {
    width: 165,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
