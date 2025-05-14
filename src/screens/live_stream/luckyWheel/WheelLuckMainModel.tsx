import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import WheelLuckTicketReview from './WheelLuckTicketReview';
import BuyTickets from './BuyTickets';
import TicketsConfirmations from './TicketsConfirmations';
import WheelHeader from './WheelHeader';
import * as userApi from '../../../apis/userApi';
import {ShowModelState} from './types/wheel';
import {UserProfile} from '../../../types/UserProfileData';
import {useTranslation} from 'react-i18next';
import {selectMyProfileData} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

const {height} = Dimensions.get('screen');

interface WheelLuckMainModelProps {
  setLuckyWheel: React.Dispatch<React.SetStateAction<boolean>>;
  luckyWheel: boolean;
  user_id: number;
}

const WheelLuckMainModel: React.FC<WheelLuckMainModelProps> = ({
  setLuckyWheel,
  luckyWheel,
  user_id,
}) => {
  const [show_model, setShowModel] = React.useState<ShowModelState>({
    buy_ticket: false,
    ticket_confirmation: false,
    ticket_review: false,
  });
  const [user_info, setUser_info] = useState();
  const my_data: UserProfile = useAppSelector(selectMyProfileData);

  const handleClose = () => {
    setLuckyWheel(false);
  };

  const handleBuyTicketPress = () => {
    setShowModel({
      ...show_model,
      buy_ticket: true,
    });
  };
  const handleReviewTickets = () => {
    setShowModel({
      ...show_model,
      ticket_review: true,
    });
  };

  const handleOnShow = async () => {
    const user = await userApi.getShortUserInfo(user_id);
    setUser_info(user?.payload);
  };
  const {t, i18n} = useTranslation();

  return (
    <View>
      <Modal
        visible={luckyWheel}
        animationType="slide"
        transparent={true}
        onShow={handleOnShow}
        onRequestClose={handleClose}>
        <Pressable
          onPress={handleClose}
          style={{flex: 1, backgroundColor: 'rgba(0,0,0, 0)'}}
        />
        <View style={styles.main_container}>
          <WheelHeader my_data={user_info} />
          <View>
            <View style={styles.header_view}>
              {my_data?.id == user_id && (
                <TouchableOpacity
                  onPress={handleBuyTicketPress}
                  style={styles.ticket_section}>
                  <Text style={styles.ticket_txt}>{t('Buy Tickets')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleReviewTickets}
                style={styles.ticket_section}>
                <Text style={styles.ticket_txt}>{t('Review Tickets')}</Text>
              </TouchableOpacity>
            </View>
            <Image source={icons.luckyWheel} style={styles.lucky_wheel_icon} />
          </View>
        </View>

        <WheelLuckTicketReview
          show_model={show_model}
          setShowModel={setShowModel}
          my_data={user_info}
        />
        <BuyTickets show_model={show_model} setShowModel={setShowModel} />
        <TicketsConfirmations
          show_model={show_model}
          setShowModel={setShowModel}
        />
      </Modal>
    </View>
  );
};

export default React.memo(WheelLuckMainModel);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lucky_wheel_icon: {
    width: 500,
    height: 500,
    alignSelf: 'center',
    marginTop: -30,
  },
  header_view: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: 'rgba(0, 0, 0, 0.6)',
    marginTop: 10,
  },
  ticket_section: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  ticket_txt: {
    fontSize: 15,
    color: '#020202',
    fontWeight: '600',
  },
});
