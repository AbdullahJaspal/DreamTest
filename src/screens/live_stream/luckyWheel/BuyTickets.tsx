import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';

import WheelHeader from './WheelHeader';

import * as wheelApi from '../../../apis/wheel_luck';

import {setRechargeSheet} from '../../../store/slices/ui/indexSlice';
import {update_wallet_diamond} from '../../../store/slices/user/my_dataSlice';
import {selectMyProfileData} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

import {ShowModelState} from './types/wheel';
import {UserProfile} from '../../../types/UserProfileData';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

interface BuyTicketsProps {
  setShowModel: React.Dispatch<React.SetStateAction<ShowModelState>>;
  show_model: ShowModelState;
}

interface RenderButListProps {
  item: {
    id: number;
    price: number;
    ticket: number;
  };
  index: number;
}

const BuyTickets: React.FC<BuyTicketsProps> = ({show_model, setShowModel}) => {
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();

  const ticketData = [
    {id: 1, price: 100, ticket: 1},
    {id: 2, price: 200, ticket: 2},
    {id: 3, price: 300, ticket: 3},
    {id: 4, price: 400, ticket: 4},
    {id: 5, price: 500, ticket: 5},
  ];

  const handleClose = () => {
    setShowModel(p => ({
      ...p,
      buy_ticket: false,
    }));
  };

  const RenderButList: React.FC<RenderButListProps> = ({item, index}) => {
    const handleBuyPress = () => {
      if (my_data?.wallet >= item.price) {
        Alert.alert(
          'Confirm',
          `Are you sure you want to buy ${item.ticket} ticket(s) for ${item.price} diamonds?`,
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: async () => {
                const data = {
                  no_of_tickets: item.ticket,
                  diamonds: item.price,
                };

                dispatch(update_wallet_diamond(my_data.wallet - item.price));

                const result = await wheelApi.purchaseWheelLuck(
                  my_data.auth_token,
                  data,
                );

                if (result?.success) {
                  Toast.show('Ticket purchased successfully', Toast.LONG);
                  handleClose();
                  setShowModel(p => ({
                    ...p,
                    ticket_confirmation: true,
                  }));
                }
              },
            },
          ],
        );
      } else {
        dispatch(setRechargeSheet(true));
      }
    };

    return (
      <View style={styles.pricing_list}>
        <View style={styles.left_view}>
          <Text style={styles.no_of_ticket}>
            {item.ticket} {')'}
          </Text>
          <View style={styles.diamond_value_view}>
            <Text style={styles.diamond_txt}>{item.price}</Text>
            <Image source={icons.diamond} style={styles.dimamond_img} />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleBuyPress}
          style={styles.buy_ticket_view}>
          <Text style={styles.buy_text}>Buy</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Modal
        visible={show_model?.buy_ticket}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={handleClose}>
        <Pressable
          onPress={handleClose}
          style={{flex: 1, backgroundColor: 'rgba(0,0,0,0)'}}
        />
        <View style={styles.main_container}>
          <WheelHeader my_data={my_data} />
          <Text style={styles.upper_txt}>
            Buy a ticket and enter the monthly draw
          </Text>
          <Text style={styles.try_luck_txt}>
            Try your luck and win amazing prizes
          </Text>

          <View style={styles.list_view}>
            <FlatList
              data={ticketData}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <RenderButList item={item} index={index} />
              )}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(BuyTickets);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  upper_txt: {
    fontSize: 12,
    color: '#020202',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  try_luck_txt: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 5,
  },
  buy_ticket_view: {
    width: 80,
    height: 35,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buy_text: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  no_of_ticket: {
    fontSize: 20,
    color: '#020202',
    fontWeight: '700',
  },
  diamond_txt: {
    fontSize: 14,
    color: '#020202',
    fontWeight: '600',
  },
  diamond_value_view: {
    borderWidth: 1,
    paddingHorizontal: 25,
    borderColor: '#020202',
    borderRadius: 5,
    paddingVertical: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  left_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.4,
  },
  dimamond_img: {
    width: 20,
    height: 20,
    marginLeft: 10,
    backgroundColor: 'red',
  },
  pricing_list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  list_view: {
    flex: 1,
    marginTop: 20,
  },
});
