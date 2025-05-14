import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import Header from '../components/Header';

import * as userApi from '../../../../apis/userApi';

import {WithdrawalFormScreenRouteProps} from '../../../../types/screenNavigationAndRoute';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

interface FormData {
  firstName: string;
  lastName: string;
  billingAddress: string;
  email: string;
  paypalEmail: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  billingAddress?: string;
  email?: string;
  paypalEmail?: string;
}

interface MyData {
  id: string;
  [key: string]: any;
}

const WithdrawalForm: React.FC = () => {
  const {
    params: {update},
  } = useRoute<WithdrawalFormScreenRouteProps>();
  const myData = useAppSelector(selectMyProfileData);
  const {t, i18n} = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    billingAddress: '',
    email: '',
    paypalEmail: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const formErrors: FormErrors = {};

    if (!formData.firstName) {
      formErrors.firstName = 'First Name is required';
    }

    if (!formData.lastName) {
      formErrors.lastName = 'Last Name is required';
    }

    if (!formData.billingAddress) {
      formErrors.billingAddress = 'Billing Address is required';
    }

    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)
    ) {
      formErrors.email = 'Invalid email address';
    }

    if (!formData.paypalEmail) {
      formErrors.paypalEmail = 'PayPal Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.paypalEmail)
    ) {
      formErrors.paypalEmail = 'Invalid PayPal email address';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await userApi.addPaypalAccount(
          formData,
          myData?.auth_token,
        );
        // Reset the form data after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          billingAddress: '',
          email: '',
          paypalEmail: '',
        });
        Alert.alert('Success', 'PayPal account added successfully.');
      } catch (error) {
        Alert.alert(
          'Error',
          'An error occurred while processing your request. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({...formData, [field]: value});
  };

  return (
    <ScrollView style={styles.container}>
      <Header headertext={t('PAYPAL ')} />

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('Legal First Name')}
            <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter First Name')}
            onChangeText={value => handleInputChange('firstName', value)}
            value={formData.firstName}
          />
          {errors.firstName && (
            <Text style={styles.error}>{errors.firstName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('Legal Last Name')}
            <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter Last Name ')}
            onChangeText={value => handleInputChange('lastName', value)}
            value={formData.lastName}
          />
          {errors.lastName && (
            <Text style={styles.error}>{errors.lastName}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('Legal Billing Address')}
            <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter Billing Address')}
            onChangeText={value => handleInputChange('billingAddress', value)}
            value={formData.billingAddress}
          />
          {errors.billingAddress && (
            <Text style={styles.error}>{errors.billingAddress}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('Email')}
            <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter Email')}
            onChangeText={value => handleInputChange('email', value)}
            value={formData.email}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {t('PayPal Email ')}
            <Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder={t('Enter PayPal Email')}
            onChangeText={value => handleInputChange('paypalEmail', value)}
            value={formData.paypalEmail}
            keyboardType="email-address"
          />
          {errors.paypalEmail && (
            <Text style={styles.error}>{errors.paypalEmail}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleFormSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.buttonText}>
              {!update ? 'ADD ACCOUNT' : 'UPDATE ACCOUNT'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
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
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#ecf0f1',
  },
  error: {
    color: 'red',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#f03524',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default WithdrawalForm;
