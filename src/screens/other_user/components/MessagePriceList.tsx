import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {setRechargeSheet} from '../../../store/slices/ui/indexSlice';
import * as messageSubs from '../../../apis/message_subscription';

import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const {width, height} = Dimensions.get('window');

export default function MessagePriceList({setShowMessageList, user_data}) {
  const {t, i18n} = useTranslation();

  const [price, setPrice] = useState(null);
  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();

  const handlePayments = async (no_of_diamond, no_of_allowed_messages) => {
    if (no_of_diamond <= my_data?.wallet) {
      try {
        let reciever_id = user_data?.id;
        const data = {
          reciever_id,
          no_of_diamond,
          no_of_allowed_messages,
        };
        const result = await messageSubs.getMessageSubscription(
          data,
          my_data?.auth_token,
        );
        console.log(result);
      } catch (error) {
        console.log('error while making the message subscription api', error);
      }
    } else {
      dispatch(setRechargeSheet(true));
    }
  };

  const data = [
    {
      id: 1,
      no_of_diamond: 5000,
      time_period: t('one month'),
    },
    {
      id: 2,
      no_of_diamond: 1350,
      time_period: t('three messages'),
    },
    {
      id: 3,
      no_of_diamond: 900,
      time_period: t('two messages'),
    },
    {
      id: 4,
      no_of_diamond: 500,
      time_period: t('one message'),
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.60)'}}
        onPressIn={() => {
          setShowMessageList(false);
        }}
      />

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{fontSize: 16, fontWeight: 600, color: '#000'}}>
            {t('Charges per Message')}
          </Text>
        </View>
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',

                justifyContent: 'space-evenly',
                padding: 5,
              }}>
              <View style={styles.message_diamond}>
                <Text style={styles.txt}>
                  {item?.no_of_diamond} {t('Diamonds')}
                </Text>
              </View>
              <View style={styles.equal_to}>
                <Text style={styles.txt}>=</Text>
              </View>
              <View style={styles.message}>
                <Text style={styles.txt}>{item?.time_period}</Text>
              </View>
              <TouchableOpacity
                style={styles.continue}
                onPress={() => {
                  handlePayments(item?.no_of_diamond, item?.time_period);
                }}>
                <Text style={styles.text}>{t('continue')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: height * 0.38,
    position: 'absolute',
    bottom: 0,
  },
  modalContent: {
    height: height * 0.05,
    alignItems: 'center',
    marginTop: height * 0.02,
    borderBottomWidth: 0.5,
    marginBottom: height * 0.03,
  },
  message_diamond: {
    width: width * 0.35,

    paddingVertical: 10,
  },
  txt: {
    fontSize: 14,
    color: 'black',
  },
  equal_to: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    paddingVertical: 10,
    width: width * 0.3,
  },
  continue: {
    backgroundColor: 'red',
    width: width * 0.2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});
