import {StyleSheet, Text, View, Modal, Pressable} from 'react-native';
import React from 'react';
import WheelHeader from './WheelHeader';
import {ShowModelState} from './types/wheel';
import {selectMyProfileData} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

interface BuyTicketsProps {
  setShowModel: React.Dispatch<React.SetStateAction<ShowModelState>>;
  show_model: ShowModelState;
}

const TicketsConfirmations: React.FC<BuyTicketsProps> = ({
  show_model,
  setShowModel,
}) => {
  const my_data = useAppSelector(selectMyProfileData);
  const handleClose = () => {
    setShowModel(p => ({
      ...p,
      ticket_confirmation: false,
    }));
  };

  const handleTicketReviewPress = () => {
    setShowModel(p => ({
      ...p,
      ticket_confirmation: false,
      ticket_review: true,
    }));
  };

  const handleGobackPress = () => {
    setShowModel(p => ({
      ...p,
      ticket_confirmation: false,
      wheel_lucky: true,
    }));
  };

  return (
    <View>
      <Modal
        visible={show_model?.ticket_confirmation}
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
          <Text style={styles.thanks_text}>
            Thank you for Purchasing the wheel lucky
          </Text>

          <Text style={styles.message_text}>
            Please check your ticket, You will find the ticket in your profile
            in the wheel lucky section. Alternatively, you will find the ticket
            in your email. Please check your email. All you need to do is to
            wait for the live stream to start and enjoy the game. {'\n'} Good
            luck!
          </Text>

          <View style={styles.button_section}>
            <Pressable
              onPress={handleTicketReviewPress}
              style={styles.button_view}>
              <Text style={styles.button_txt}>View Ticket</Text>
            </Pressable>

            <Pressable onPress={handleGobackPress} style={styles.button_view}>
              <Text style={styles.button_txt}>Go back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(TicketsConfirmations);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 500,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  thanks_text: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  message_text: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    fontWeight: 'bold',
    color: 'red',
    lineHeight: 35,
  },
  button_section: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button_view: {
    width: '40%',
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button_txt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
