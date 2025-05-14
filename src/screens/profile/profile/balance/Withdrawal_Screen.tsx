import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from '../components/Header';

import {selectMyProfileData} from '../../../../store/selectors';
import {useAppSelector} from '../../../../store/hooks';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const Withdrawal_Screen = ({route}) => {
  const getPaypalAccount = require('../../../../apis/userApi');
  const my_data = useAppSelector(selectMyProfileData);
  const [paypalAccountData, setPaypalAccountData] = useState(null);
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const {t, i18n} = useTranslation();

  const {withdrawalAmount} = route.params;
  const navigation = useNavigation();

  const handleAddAccount = () => {
    navigation.navigate('Payment_Method');
  };

  const handleWithdrawalSubmit = withdrawalDetails => {
    // Handle withdrawal details submission and verification here
    console.log('Withdrawal Details:', withdrawalDetails);
    // You can make API calls or perform other actions as needed
  };

  const getAccountPaypal = async () => {
    try {
      const response = await getPaypalAccount.getPaypalAccount(my_data.id);
      setPaypalAccountData(response.data);
    } catch (error) {
      console.error('Error fetching PayPal account:', error);
    }
  };
  useEffect(() => {
    getAccountPaypal();
  }, [my_data.id]);

  // function to display the one item and if cick display the more items;

  const renderPaypalAccount = ({item}) => (
    <View style={styles.account_main_container}>
      <View style={styles.accountContainer}>
        <View style={styles.images}>
          <Image
            source={icons.paypal}
            style={{width: 50, height: 50}}
            resizeMode="cover"
          />
        </View>
        <View style={styles.paypal_email}>
          <Text style={styles.accountText}>
            {t('Paypal')} ({item.paypalEmail})
          </Text>
        </View>

        {/* <Text style={styles.accountText}>Name: {item.firstName} {item.lastName}</Text> */}
        {/* Add other fields as needed */}
        {/* <Text style={styles.accountDivider}>-----------------------------</Text> */}
      </View>
      <View style={styles.inner_txt}>
        <Text>{t('Funds will be credited in 3-4 business days ')}</Text>
      </View>
    </View>
  );

  const renderMoreButton = () => (
    <TouchableOpacity
      onPress={() => setShowAllAccounts(!showAllAccounts)}
      style={styles.showmore}>
      <Icon
        name={showAllAccounts ? 'angle-up' : 'angle-down'}
        size={20}
        color="#eb3d51"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Withdraw Money')} />
      <Text style={styles.withdrawal_account_txt}>
        {t('Withdrawal account')}
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
        <Text style={styles.addButtonText}>{t('Add Account')}</Text>
      </TouchableOpacity>

      {paypalAccountData ? (
        <View style={styles.flatListContainer}>
          {/* <Text style={styles.accountInfo}>PayPal Account Information:</Text> */}
          {paypalAccountData.length > 0 && (
            <FlatList
              data={
                showAllAccounts ? paypalAccountData : [paypalAccountData[0]]
              }
              renderItem={renderPaypalAccount}
              keyExtractor={item => item.id.toString()}
              keyboardShouldPersistTaps="handled"
            />
          )}
          {paypalAccountData.length > 1 && renderMoreButton()}
        </View>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#eb3d51" />
        </View>
      )}

      <View>
        <Text style={styles.amount_txt}>{t('Amount')}</Text>
        {/* <Text style={styles.withdrawalamount_text}> $ {withdrawalAmount}</Text> */}
        <Text style={styles.withdrawalamount_text}>
          $ {(((my_data.wallet * 0.7) / 1000) * 3).toFixed(2)}{' '}
        </Text>
      </View>

      <TouchableOpacity style={styles.money_txt}>
        <Text style={styles.draw_txt}>{t('Withdraw Money')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'red', // You can use your preferred color
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  withdrawal_account_txt: {
    color: '#000',
    padding: 20,
    paddingVertical: 25,
  },
  amount_txt: {
    color: '#000',
    padding: 10,
  },
  withdrawalamount_text: {
    color: '#000',
    fontSize: 30,
    padding: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },
  money_txt: {
    backgroundColor: 'red',
    width: width * 0.4,
    alignSelf: 'center',
    marginTop: '8%',
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  draw_txt: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  accountContainer: {
    flexDirection: 'row',
  },
  account_main_container: {
    borderBottomWidth: 0.2,
    width: width,
    height: height * 0.1,
    borderBottomColor: 'grey',
  },

  images: {
    width: width * 0.15,
    paddingHorizontal: 4,
  },
  paypal_email: {
    justifyContent: 'center',
    width: width * 0.7,
    paddingHorizontal: 6,
  },
  moreButton: {
    color: '#eb3d51',
    alignSelf: 'flex-end',
    padding: 5,
  },
  showmore: {
    width: width * 0.1,
    position: 'absolute',
    backgroundColor: '#f0ebeb',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountText: {
    color: '#000',
    fontSize: 17,
  },
  inner_txt: {
    width: width * 0.7,
    alignSelf: 'center',
  },
  flatListContainer: {
    height: height * 0.3,
  },
});

export default Withdrawal_Screen;
