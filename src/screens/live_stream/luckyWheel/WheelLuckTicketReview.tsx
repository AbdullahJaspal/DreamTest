import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import WheelHeader from './WheelHeader';
import * as wheelApi from '../../../apis/wheel_luck';
import {formattedDateAndTime} from '../../../utils/customDate';
import {UserProfile} from '../../../types/UserProfileData';
import {ShowModelState, TicketData} from './types/wheel';
const {height} = Dimensions.get('window');

import {useTranslation} from 'react-i18next';

interface WheelLuckTicketReviewProps {
  setShowModel: React.Dispatch<React.SetStateAction<ShowModelState>>;
  show_model: ShowModelState;
  my_data?: UserProfile;
}

interface RenderTicketProps {
  item: TicketData;
  index: number;
}
const WheelLuckTicketReview: React.FC<WheelLuckTicketReviewProps> = ({
  show_model,
  setShowModel,
  my_data,
}) => {
  const [data, setData] = React.useState<TicketData[]>([]);
  const {t, i18n} = useTranslation();

  const handleClose = () => {
    setShowModel(p => ({
      ...p,
      ticket_review: false,
    }));
  };

  const getAllListofWheelLuck = useCallback(async () => {
    if (my_data) {
      const response = await wheelApi.getWheelLuck(my_data?.id);
      console.log('response', response?.data[0]?.ticket_no);
      if (response.success) {
        setData(response.data);
      }
    }
  }, [my_data]);

  useEffect(() => {
    getAllListofWheelLuck();
  }, [my_data]);

  const RenderTicket: React.FC<RenderTicketProps> = ({item, index}) => {
    return (
      <View>
        <View style={styles.ticket_list_header}>
          <Text style={styles.numbering_txt}>{index + 1}</Text>
          <Text style={styles.date_txt}>
            {formattedDateAndTime(item?.createdAt)} ({item?.ticket_no?.length})
          </Text>
        </View>
        <View style={styles.ticket_view}>
          {item?.ticket_no?.map((ticket, index) => (
            <Text style={styles.ticket_no} key={index}>
              {index + 1} ). {ticket}
              {item?.ticket_no?.length - 1 === index ? '' : ','}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View>
      <Modal
        visible={show_model?.ticket_review}
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
          <Text style={styles.info_txt}>
            {t('Thanks for purchasing wheel luck tickets')}. {'\n'}
            {t('Here is your ticket list')}.
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <RenderTicket item={item} index={index} />
            )}
            ItemSeparatorComponent={() => (
              <View style={{height: 1, backgroundColor: '#ccc'}} />
            )}
            ListEmptyComponent={
              <View style={styles.empty_container}>
                <Text style={styles.empty_text}>
                  {t('No tickets found. Try purchasing one')}!
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(WheelLuckTicketReview);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
    maxHeight: height * 0.5,
  },
  ticket_list_header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  numbering_txt: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date_txt: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  ticket_no: {
    fontSize: 14,
    fontWeight: '400',
    padding: 10,
  },
  ticket_view: {
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  info_txt: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    paddingBottom: 0,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  empty_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  empty_text: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
  },
});
