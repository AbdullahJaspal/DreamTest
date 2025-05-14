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
  FlatList,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  setRechargeSheet,
  setPaymentSelectionSheet,
  setSelectedRechargeData,
} from '../../store/slices/ui/indexSlice';
import RenderRechargeSheetHeader from './RenderRechargeSheetHeader';
import {icons} from '../../assets/icons';

const {width, height} = Dimensions.get('window');

const RechargePayScreen = ({showModal, setShowModal}) => {
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const dispatch = useDispatch();

  const handlePayments = () => {
    handleClose();
    dispatch(setPaymentSelectionSheet(true));
    dispatch(
      setSelectedRechargeData({
        price: priceDetails[selectedPriceIndex].price,
        diamonds: priceDetails[selectedPriceIndex].coin,
      }),
    );
  };

  const handleClose = () => {
    setShowModal(false);
    dispatch(setRechargeSheet(false));
  };

  const priceDetails = [
    {id: 1, coin: 1000, price: '$ 0.8'},
    {id: 2, coin: 1500, price: '$ 1.20'},
    {id: 3, coin: 4500, price: '$ 3.60'},
    {id: 4, coin: 7000, price: '$ 5.60'},
    {id: 5, coin: 13000, price: '$ 10.40'},
    {id: 6, coin: 27500, price: '$ 22.00'},
    {id: 7, coin: 50000, price: '$ 40.00'},
    {id: 8, coin: 75000, price: '$ 56.40'},
    {id: 9, coin: 90000, price: '$ 72.00'},
    {id: 10, coin: 150000, price: '$ 120'},
  ];

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent={true}>
      {/* Modal backdrop */}
      <Pressable onPress={handleClose} style={styles.modalOverlay} />

      <View style={styles.mainContainer}>
        <RenderRechargeSheetHeader />
        <FlatList
          data={priceDetails}
          numColumns={3}
          ListFooterComponent={() => <View style={{height: 100}} />}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => setSelectedPriceIndex(index)}
              style={[
                styles.coinContainer,
                {
                  borderColor: selectedPriceIndex === index ? 'red' : 'black',
                  borderWidth: selectedPriceIndex === index ? 2 : 0.5,
                },
              ]}>
              <View style={styles.coinView}>
                <Image source={icons.diamond} style={{width: 20, height: 20}} />
                <Text style={styles.coinText}>{item.coin}</Text>
              </View>
              <Text>{item.price}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.rechargeView}>
          <Pressable onPress={handlePayments} style={styles.rechargeButton}>
            <Text style={styles.rechargeButtonText}>{'RECHARGE'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RechargePayScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  mainContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  coinContainer: {
    width: width * 0.28,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    margin: width * 0.016,
    borderRadius: 10,
  },
  coinView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginLeft: 3,
  },
  rechargeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rechargeButton: {
    width: width * 0.5,
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  rechargeView: {
    width: width,
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
});
