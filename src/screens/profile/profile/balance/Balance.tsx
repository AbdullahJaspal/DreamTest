import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import LinearGradient from 'react-native-linear-gradient';

import Header from '../components/Header';

import {BalanceScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const Balance = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation<BalanceScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);

  const [isModalVisible, setModalVisible] = useState(true);

  const getStarCount = (coins: number) => {
    if (coins >= 1000000) {
      return 5;
    } else if (coins >= 800000) {
      return 4;
    } else if (coins >= 600000) {
      return 3;
    } else if (coins >= 400000) {
      return 2;
    } else if (coins >= 200000) {
      return 1;
    } else {
      return 0;
    }
  };

  const starCount = getStarCount(my_data?.wallet * 0.7);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const continueHandler = () => {
    const withdrawalAmount = Math.floor(
      Math.abs(my_data?.wallet / 120) * 0.7 -
        ((my_data?.wallet * 0.7) / 1000) * 3,
    ).toFixed(2);
    navigation.navigate('Withdrawal_Screen', {withdrawalAmount});
  };

  const renderModalContent = () => {
    return (
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{t('Withdrawal Money')}</Text>
            <Text>{t('You will be charged $ 3 for every 1000 coins.')} </Text>

            <Text style={styles.second_txt}>
              {t('Final money to be withdrawn')}:
            </Text>

            {/* <Text style={styles.wallet_money}>
              ${Math.floor(Math.abs(my_data?.wallet / 120) * 0.7 - ((my_data?.wallet *.7)/ 1000) * 3).toFixed(2)}
            </Text> */}
            <Text style={styles.wallet_money}>
              $ {(((my_data.wallet * 0.7) / 1000) * 3).toFixed(2)}
            </Text>

            {/* <View style={styles.wallet_diamond_container}>
              <Text>Diamonds:</Text>
              <Image source={icons.diamond} style={{ width: 20, height: 20 }} />
              <Text style={styles.diamond_txt}>{Math.floor(Math.abs(my_data?.wallet * 0.7))}</Text>
            </View> */}

            <TouchableOpacity style={styles.continue} onPress={continueHandler}>
              <Text style={{color: '#fff', fontSize: 18, fontWeight: '500'}}>
                {t('Continue')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const withdrawalHandler = () => {
    if (my_data?.wallet / 120 > 100) {
      openModal();
    } else {
      // Display an alert for insufficient funds

      Alert.alert(
        t('Insufficient Funds for withdrawal'),
        t('You need at least 100 $ for withdrawal'),
        [{text: t('OK'), onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  return (
    <View style={styles.main_container}>
      <Header headertext={t('My Balance')} />
      <View style={styles.image_username}>
        <View style={styles.img}>
          <Image
            source={
              my_data?.profile_pic
                ? {uri: my_data?.profile_pic}
                : icons.userFilled
            }
            style={{width: 40, height: 40, borderRadius: 10000}}
            resizeMode="cover"
          />
        </View>
        <View style={styles.username}>
          <Text style={[styles.txt, {fontWeight: '500'}]}>
            {my_data?.nickname}
          </Text>
          <Text style={styles.txt}>@ {my_data?.username}</Text>
        </View>
      </View>

      <View style={{marginTop: 30}}>
        <LinearGradient
          colors={['#fff', '#edc16d', '#f5a816']}
          style={styles.card}>
          <View style={styles.img_coins}>
            <Image
              source={icons.diamond}
              style={{width: 30, height: 30}}
              resizeMode="cover"
            />
            <Text style={styles.txt}>{t('Coins')}</Text>
          </View>
          <View style={styles.amount_coins}>
            <View style={styles.dollar_txt}>
              <Text style={[styles.txt, {fontWeight: '500', fontSize: 16}]}>
                {Math.floor(Math.abs(my_data?.wallet * 0.7))}
              </Text>
            </View>

            {starCount === 5 && (
              <Image
                source={icons.verified}
                style={{width: 100, height: 100}}
                resizeMode="cover"
              />
            )}
          </View>
          {starCount > 0 && (
            <View
              style={{
                flexDirection: 'row',
                marginLeft: width * 0.44,
                marginVertical: 9,
              }}>
              {[...Array(starCount)].map((_, index) => (
                <Image
                  key={index}
                  source={icons.star}
                  style={{width: 25, height: 25, marginHorizontal: 5}}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </LinearGradient>
      </View>
      <TouchableOpacity
        style={styles.withdrawal_txt}
        activeOpacity={0.7}
        onPress={withdrawalHandler}>
        <LinearGradient
          colors={['#fff', '#edc16d', '#f5a816']}
          style={styles.withdrawel_button}>
          <Text style={styles.withdrawaltext}>{t('WITHDRAW')}</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        // visible={true}
        onRequestClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </View>
  );
};

export default Balance;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  image_username: {
    width: width,
    height: height * 0.07,
    flexDirection: 'row',
    marginTop: 15,
  },
  img: {
    width: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    justifyContent: 'center',
  },
  txt: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  card: {
    borderWidth: 1.5,
    width: width * 0.9,
    alignSelf: 'center',
    borderRadius: 30,
    borderColor: '#dba43d',
    height: height * 0.21,
    marginTop: 15,
  },
  img_coins: {
    flexDirection: 'row',
    padding: 10,
    width: width * 0.3,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  amount_coins: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.7,
    alignSelf: 'center',
    height: height * 0.07,
  },
  withdrawal_txt: {
    width: width * 0.5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.1,
    marginTop: 30,
    borderRadius: 20,
    borderColor: 'dba43d',
  },
  withdrawaltext: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  dollar_txt: {
    flexDirection: 'column',
    marginTop: 26,
    height: height * 0.03,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: width,
    height: height * 0.4,
    bottom: 0,
    position: 'absolute',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    borderBottomWidth: 1,
    color: '#000',
  },
  continue: {
    backgroundColor: '#d9912b',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.5,
    height: height * 0.06,
    alignSelf: 'center',
    borderRadius: 24,
    bottom: 10,
    position: 'absolute',
  },
  second_txt: {
    color: '#000',
    fontSize: 15,
  },
  wallet_money: {
    color: '#000',
    width: width * 0.3,
    alignSelf: 'center',
    marginTop: 30,
    fontSize: 25,
  },
  wallet_diamond_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginRight: 15,
  },
  withdrawel_button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.25,
    borderRadius: 18,
  },
});
