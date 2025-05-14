import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';

const WithdrawalFormStripe: React.FC = () => {
  const [step, setStep] = useState(1);
  const {t, i18n} = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dob: '',
    address: '',
    iban: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bankInfoType, setBankInfoType] = useState<'iban' | 'accountRouting'>(
    'iban',
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: ''}));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = 'First Name is required.';
      if (!formData.lastName.trim())
        newErrors.lastName = 'Last Name is required.';
      if (!formData.phoneNumber.trim())
        newErrors.phoneNumber = 'Phone Number is required.';
      if (!formData.dob.trim()) newErrors.dob = 'Date of Birth is required.';
      if (!formData.address.trim()) newErrors.address = 'Address is required.';
    } else if (step === 2) {
      if (bankInfoType === 'iban' && !formData.iban.trim()) {
        newErrors.iban = 'IBAN is required.';
      }
      if (bankInfoType === 'accountRouting') {
        if (!formData.accountNumber.trim())
          newErrors.accountNumber = 'Account Number is required.';
        if (!formData.routingNumber.trim())
          newErrors.routingNumber = 'Routing Number is required.';
      }
      if (!formData.accountHolderName.trim()) {
        newErrors.accountHolderName = 'Account Holder Name is required.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFormSubmit = () => {
    if (validateStep()) {
      Alert.alert('Success', 'Your account information has been submitted.');
    }
  };

  return (
    <ScrollView style={styles.main_container}>
      <Header headertext={'Stripe'} />
      <View style={styles.container}>
        {step === 1 && (
          <View>
            <Text style={styles.header}>{t('Personal Information')}</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('Legal First Name')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('First Name')}
                value={formData.firstName}
                onChangeText={value => handleInputChange('firstName', value)}
              />
              {errors.firstName && (
                <Text style={styles.error}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('Legal Last Name')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('Last Name')}
                value={formData.lastName}
                onChangeText={value => handleInputChange('lastName', value)}
              />
              {errors.lastName && (
                <Text style={styles.error}>{errors.lastName}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('Phone Number ')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="49 151 23456789"
                value={formData.phoneNumber}
                onChangeText={value => handleInputChange('phoneNumber', value)}
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
                <Text style={styles.error}>{errors.phoneNumber}</Text>
              )}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('Date of Birth')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={formData.dob}
                onChangeText={value => handleInputChange('dob', value)}
              />
              {errors.dob && <Text style={styles.error}>{errors.dob}</Text>}
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {t('Address')}
                <Text style={styles.asterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={t('Street Address, City, Postal Code')}
                value={formData.address}
                onChangeText={value => handleInputChange('address', value)}
              />
              {errors.address && (
                <Text style={styles.error}>{errors.address}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>{t('Next')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.header}>{t('Bank Information')}</Text>
            <Text style={styles.subheader}>
              {t('How would you like to provide your bank details?')}
            </Text>
            <View style={styles.radioGroup}>
              <RadioButton
                value="iban"
                status={bankInfoType === 'iban' ? 'checked' : 'unchecked'}
                onPress={() => setBankInfoType('iban')}
              />
              <Text style={styles.radioLabel}>IBAN</Text>
              <RadioButton
                value="accountRouting"
                status={
                  bankInfoType === 'accountRouting' ? 'checked' : 'unchecked'
                }
                onPress={() => setBankInfoType('accountRouting')}
              />
              <Text style={styles.radioLabel}>
                {t('Account & Routing Number')}
              </Text>
            </View>

            {bankInfoType === 'iban' ? (
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="IBAN"
                  value={formData.iban}
                  onChangeText={value => handleInputChange('iban', value)}
                />
                {errors.iban && <Text style={styles.error}>{errors.iban}</Text>}
              </View>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('Account Number')}
                    value={formData.accountNumber}
                    onChangeText={value =>
                      handleInputChange('accountNumber', value)
                    }
                  />
                  {errors.accountNumber && (
                    <Text style={styles.error}>{errors.accountNumber}</Text>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('Routing Number')}
                    value={formData.routingNumber}
                    onChangeText={value =>
                      handleInputChange('routingNumber', value)
                    }
                  />
                  {errors.routingNumber && (
                    <Text style={styles.error}>{errors.routingNumber}</Text>
                  )}
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder={t('Account Holder Name')}
                value={formData.accountHolderName}
                onChangeText={value =>
                  handleInputChange('accountHolderName', value)
                }
              />
              {errors.accountHolderName && (
                <Text style={styles.error}>{errors.accountHolderName}</Text>
              )}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={prevStep}>
                <Text style={styles.buttonText}>{t('Back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleFormSubmit}>
                <Text style={styles.buttonText}>{t('Submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  asterisk: {
    color: 'red',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default WithdrawalFormStripe;
