import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  setRechargeSheet,
  setPaymentSelectionSheet,
  setSelectedRechargeData,
} from '../../store/slices/ui/indexSlice';
import {icons} from '../../assets/icons';
import {useAppSelector} from '../../store/hooks';
import {selectRechargeSheet} from '../../store/selectors';
import RenderRechargeSheetHeader from './RenderRechargeSheetHeader';

const {width, height} = Dimensions.get('screen');

const RechargeBottomSheet: React.FC = () => {
  const [selected_price, setSelected_price] = useState(0);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const bottomSheetSettingProfile = useAppSelector(selectRechargeSheet);

  const handlePayments = () => {
    handleClose();
    Alert.alert('Working');
    dispatch(setPaymentSelectionSheet(true));
    dispatch(
      setSelectedRechargeData({
        price: priceDetails[selected_price].price,
        diamonds: priceDetails[selected_price].coin,
      }),
    );
  };

  const handleClose = () => {
    dispatch(setRechargeSheet(false));
  };

  const priceDetails = [
    {
      id: 1,
      coin: 1000,
      price: '$ 0.8',
    },
    {
      id: 2,
      coin: 1500,
      price: '$ 1.20',
    },
    {
      id: 3,
      coin: 4500,
      price: '$ 3.60',
    },
    {
      id: 4,
      coin: 7000,
      price: '$ 5.60',
    },
    {
      id: 5,
      coin: 13000,
      price: '$ 10.40',
    },
    {
      id: 6,
      coin: 27500,
      price: '$ 22.00',
    },
    {
      id: 7,
      coin: 50000,
      price: '$ 40.00',
    },
    {
      id: 8,
      coin: 75000,
      price: '$ 56.40',
    },
    {
      id: 9,
      coin: 90000,
      price: '$ 72.00',
    },
    {
      id: 10,
      coin: 150000,
      price: '$ 120',
    },
    {
      id: 11,
      coin: 190000,
      price: '$ 152',
    },
    {
      id: 12,
      coin: 250000,
      price: '$ 200',
    },
    {
      id: 13,
      coin: 350000,
      price: '$ 280',
    },
    {
      id: 14,
      coin: 500000,
      price: '$ 400',
    },
    {
      id: 15,
      coin: 750000,
      price: '$ 600',
    },
    {
      id: 16,
      coin: 1200000,
      price: '$ 960',
    },
    {
      id: 17,
      coin: 2500000,
      price: '$ 2000',
    },
    {
      id: 18,
      coin: 5000000,
      price: '$ 4000',
    },
    {
      id: 19,
      coin: 7500000,
      price: '$ 6000',
    },
    {
      id: 20,
      coin: 10000000,
      price: '$ 8000',
    },
  ];

  if (!bottomSheetSettingProfile) {
    return null;
  }

  return (
    <Modal
      visible={bottomSheetSettingProfile}
      // transparent={true}
      onRequestClose={handleClose}
      // statusBarTranslucent={true}
      animationType="slide">
      <Pressable
        // onPress={handleClose}
        onPress={() => handleClose()}
        style={{
          width: width,
          // height: height,
          height: height,
          position: 'absolute',
          // top: 0,
          // left: 0,
          // right: 0,
          backgroundColor: 'transparent',
          // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          // backgroundColor: "blue",
          zIndex: 1000,
        }}
      />

      <View
        style={{
          width: width,
          // height: height * 0.1,
          // position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopStartRadius: 20,
          borderTopEndRadius: 20,
        }}>
        <View
          style={{
            marginBottom: 70,
            height: height,
            backgroundColor: 'white',
            paddingTop: 10,
          }}>
          <RenderRechargeSheetHeader />
          <FlatList
            data={priceDetails}
            numColumns={3}
            ListFooterComponent={() => <View style={{height: 280}} />}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => {
                  setSelected_price(index);
                }}
                style={[
                  styles.coin_main_container,
                  {borderColor: selected_price == index ? 'red' : 'black'},
                ]}>
                <View style={styles.coin_view}>
                  <Image
                    source={icons.diamond}
                    style={{width: 20, height: 20}}
                  />
                  <Text style={styles.txt}>{item.coin}</Text>
                </View>
                <Text>{item.price}</Text>
              </Pressable>
            )}
          />
        </View>
        <View style={styles.recharge_view}>
          <Pressable onPress={handlePayments} style={styles.recharge_button}>
            <Text style={styles.recharge_button_txt}>{'RECHARGE'}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default RechargeBottomSheet;

const styles = StyleSheet.create({
  upper_container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    padding: 15,
    flexDirection: 'row',
  },
  coin_main_container: {
    width: width * 0.3,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    margin: width * 0.016,
    borderRadius: 10,
  },
  coin_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    marginLeft: 3,
  },
  recharge_button_txt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recharge_button: {
    width: width * 0.5,
    height: 50,
    backgroundColor: 'red',
    // position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  recharge_view: {
    width: width,
    position: 'absolute',
    top: 700,
    alignItems: 'center',
    alignContent: 'center',
  },
});
