import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {BalanceScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../assets/icons';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

interface BalanceModalProps {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const navigation = useNavigation<BalanceScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  const {t} = useTranslation();

  const getStarCount = (coins: number) => {
    if (coins >= 1000000) return 5;
    if (coins >= 800000) return 4;
    if (coins >= 600000) return 3;
    if (coins >= 400000) return 2;
    if (coins >= 200000) return 1;
    return 0;
  };

  const starCount = getStarCount(my_data?.wallet * 0.7);
  const [isWithdrawalModalVisible, setWithdrawalModalVisible] = useState(false);

  const openWithdrawalModal = () => {
    setWithdrawalModalVisible(true);
  };

  const closeWithdrawalModal = () => {
    setWithdrawalModalVisible(false);
  };

  const continueHandler = () => {
    const withdrawalAmount = Math.floor(
      Math.abs(my_data?.wallet / 120) * 0.7 -
        ((my_data?.wallet * 0.7) / 1000) * 3,
    ).toFixed(2);
    navigation.navigate('Withdrawal_Screen', {withdrawalAmount});
    closeWithdrawalModal(); // Close withdrawal modal after navigation
  };

  const withdrawalHandler = () => {
    if (my_data?.wallet / 120 > 100) {
      openWithdrawalModal();
    } else {
      Alert.alert(
        t('Insufficient Funds for withdrawal'),
        t('You need at least 100 $ for withdrawal'),
        [{text: t('OK'), onPress: () => console.log('OK Pressed')}],
      );
    }
  };

  const renderWithdrawalModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>{t('Withdrawal Money')}</Text>
      <Text>{t('You will be charged $ 3 for every 1000 coins.')}</Text>
      <Text style={styles.second_txt}>{t('Final money to be withdrawn')}:</Text>
      <Text style={styles.wallet_money}>
        $ {(((my_data.wallet * 0.7) / 1000) * 3).toFixed(2)}
      </Text>
      <TouchableOpacity style={styles.continue} onPress={continueHandler}>
        <Text style={{color: '#fff', fontSize: 18, fontWeight: '500'}}>
          {t('Continue')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}>
      <Pressable
        onPress={() => setShowModal(false)}
        style={styles.modalOverlay}
      />
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t('My Balance')}</Text>
        </View>
        <View style={styles.image_username}>
          <Image
            source={
              my_data?.profile_pic
                ? {uri: my_data?.profile_pic}
                : icons.userFilled
            }
            style={styles.profileImage}
          />
          <View style={styles.username}>
            <Text style={styles.usernameText}>{my_data?.nickname}</Text>
            <Text style={styles.usernameText}>@ {my_data?.username}</Text>
          </View>
        </View>
        <LinearGradient
          colors={['#fff', '#edc16d', '#f5a816']}
          style={styles.card}>
          <View style={styles.img_coins}>
            <Image source={icons.diamond} style={styles.diamondIcon} />
            <Text style={styles.txt}>{t('Coins')}</Text>
          </View>
          <View style={styles.amount_coins}>
            <Text style={styles.coinAmount}>
              {Math.floor(Math.abs(my_data?.wallet * 0.7))}
            </Text>
            {starCount === 5 && (
              <Image source={icons.verified} style={styles.verifiedIcon} />
            )}
          </View>
          {starCount > 0 && (
            <View style={styles.starContainer}>
              {[...Array(starCount)].map((_, index) => (
                <Image
                  key={index}
                  source={icons.star}
                  style={styles.starIcon}
                />
              ))}
            </View>
          )}
        </LinearGradient>
        <TouchableOpacity
          style={styles.withdrawalButton}
          onPress={withdrawalHandler}>
          <LinearGradient
            colors={['#fff', '#edc16d', '#f5a816']}
            style={styles.withdrawel_button}>
            <Text style={styles.withdrawalText}>{t('WITHDRAW')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isWithdrawalModalVisible}
          onRequestClose={closeWithdrawalModal}>
          <Pressable
            onPress={closeWithdrawalModal}
            style={styles.modalOverlay}
          />
          {renderWithdrawalModalContent()}
        </Modal>
      </View>
    </Modal>
  );
};

export default BalanceModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
  image_username: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    marginLeft: 10,
  },
  usernameText: {
    fontSize: 14,
    color: '#000',
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 30,
    borderColor: '#dba43d',
    margin: 20,
    padding: 20,
  },
  img_coins: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamondIcon: {
    width: 30,
    height: 30,
  },
  txt: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
  },
  amount_coins: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  coinAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  verifiedIcon: {
    width: 100,
    height: 100,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  starIcon: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
  },
  withdrawalButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  withdrawel_button: {
    width: width * 0.5,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  second_txt: {
    fontSize: 15,
    color: '#000',
  },
  wallet_money: {
    fontSize: 25,
    color: '#000',
    marginTop: 10,
  },
  continue: {
    backgroundColor: '#d9912b',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 24,
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
