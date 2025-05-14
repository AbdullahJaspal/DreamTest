import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {DateTime} from 'luxon';
import {icons} from '../../../assets/icons';
import Toast from 'react-native-simple-toast';
import * as boxGift from '../../../apis/gifts';
import DatePicker from 'react-native-date-picker';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {setRechargeSheet} from '../../../store/slices/ui/indexSlice';
import {changeShowBoxGift} from '../../../store/slices/ui/boxGiftSlice';
import {update_wallet_diamond} from '../../../store/slices/user/my_dataSlice';
import {useAppSelector} from '../../../store/hooks';
import {selectCurrentUser, selectMyProfileData} from '../../../store/selectors';
import {customGiftColors, gradientColors} from '../../../constants/colors';

const getDate = (
  timestamp: Date,
): {formattedDate: string; day: string; time: string} => {
  const dt = DateTime.fromJSDate(timestamp);
  const formattedDate = dt.toFormat('yyyy-MM-dd');
  const day = dt.toFormat('cccc');
  const time = dt.toFormat('HH:mm:ss');
  return {formattedDate, day, time};
};

interface BoxGiftData {
  video_id: string;
  starting_time: Date;
  quantity: number;
  repetition: number;
}

const {width} = Dimensions.get('screen');

const CustomGift: React.FC = () => {
  const dispatch = useDispatch();
  const [start_time, setStart_time] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now;
  });
  const [quantity, setQuantity] = useState<string>('60');
  const [repetition, setRepetition] = useState<string>('10');
  const [open_date_picker, setOpen_date_picker] = useState<boolean>(false);
  const [keyboardStatus, setKeyboardStatus] = useState('hidden');
  const [show_quantity_selection, setShow_quantity_selection] =
    useState<boolean>(false);
  const res = useAppSelector(selectCurrentUser);
  const my_data = useAppSelector(selectMyProfileData);
  const [loading, setLoading] = useState<boolean>(false);

  const data: BoxGiftData = useMemo(
    () => ({
      video_id: res,
      starting_time: start_time,
      quantity: parseInt(quantity, 10),
      repetition: parseInt(repetition, 10),
    }),
    [res, start_time, quantity, repetition],
  );

  const sendBoxGift = useCallback(async () => {
    if (loading) {
      return;
    }
    if (my_data?.wallet >= parseInt(quantity, 10) * parseInt(repetition, 10)) {
      setLoading(true);
      try {
        await boxGift.sendBoxGift(my_data.auth_token, data);
        handleClose();
        handleUpdateDiamond(
          my_data?.wallet - parseInt(quantity, 10) * parseInt(repetition, 10),
        );
        Toast.show('Success', Toast.LONG);
      } catch (error) {
        handleError();
      } finally {
        setLoading(false);
      }
    } else {
      handlePayments();
    }
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleError = useCallback(() => {
    Alert.alert(
      'Error Occurred',
      'An error occurred. Would you like to try again?',
      [
        {
          text: 'Retry',
          onPress: () => {
            sendBoxGift();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            handleClose();
          },
        },
      ],
      {cancelable: false},
    );
  }, []);

  const handlePayments = useCallback(() => {
    dispatch(setRechargeSheet(true));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(changeShowBoxGift(false));
  }, [dispatch]);

  const handleUpdateDiamond = useCallback(
    (wallet: number) => {
      dispatch(update_wallet_diamond(wallet));
    },
    [dispatch],
  );

  const handleTimeAndDatePress = useCallback(() => {
    setOpen_date_picker(true);
  }, []);

  const handleQuantitypress = useCallback(() => {
    setShow_quantity_selection(true);
  }, []);

  const handleConfirmClick = useCallback(() => {
    setShow_quantity_selection(false);
  }, []);

  return (
    <View style={styles.main_container}>
      <LinearGradient colors={customGiftColors} style={styles.gradient}>
        <View style={styles.info_text_view}>
          <Image source={icons.boxGift} style={styles.less_opacity_gift} />
          <Text style={styles.gift_info_txt}>
            Send the diamond gift of your {'\n'}
            choice to get the most interaction
          </Text>
        </View>

        {/* First container, time and date */}
        <View style={styles.selection_container}>
          <LinearGradient
            colors={gradientColors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient_selection_box}>
            <Pressable onPress={handleTimeAndDatePress}>
              <Text style={styles.gradient_text}>
                {getDate(start_time).day} : {getDate(start_time).formattedDate}
                {'\n'}
                {getDate(start_time).time}
              </Text>
            </Pressable>
          </LinearGradient>

          <Text style={styles.box_info_txt}>Time and date</Text>
        </View>

        {/* Second container, Quantity and repetition */}
        <View style={styles.selection_container}>
          <Pressable onPress={handleQuantitypress}>
            <LinearGradient
              colors={gradientColors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient_selection_box}>
              <Image source={icons.diamond} style={styles.diamonds_img} />
              <Text style={styles.gradient_text}>
                {quantity} X {repetition}
              </Text>
            </LinearGradient>
          </Pressable>
          <Text style={styles.box_info_txt}>Quantity and repetition</Text>
        </View>

        {/* Third container, total summation */}
        <View style={styles.selection_container}>
          <LinearGradient
            colors={gradientColors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient_selection_box}>
            <Image source={icons.diamond} style={styles.diamonds_img} />
            <Text style={styles.gradient_text}>
              {parseInt(quantity, 10) * parseInt(repetition, 10)}
            </Text>
          </LinearGradient>
          <Text style={styles.box_info_txt}>Total summation</Text>
        </View>
      </LinearGradient>

      <Text style={styles.terms_txt}>
        By clicking on the button, you agree to {'\n'}
        the terms and conditions of the gift box. No {'\n'}
        compensation or return
      </Text>

      <Pressable style={styles.button_view} onPress={sendBoxGift}>
        {loading ? (
          <ActivityIndicator size={'small'} color={'#fff'} />
        ) : (
          <Text style={styles.button_txt}>Submit</Text>
        )}
      </Pressable>

      <DatePicker
        modal
        open={open_date_picker}
        date={start_time}
        onConfirm={date => {
          setOpen_date_picker(false);
          setStart_time(date);
        }}
        onCancel={() => {
          setOpen_date_picker(false);
        }}
      />

      {/* Container: Quantity and Repetition */}
      {show_quantity_selection && (
        <View
          style={[
            styles.quantity_view,
            {
              top: keyboardStatus === 'shown' ? 10 : -100,
            },
          ]}>
          <Pressable
            style={styles.cross_button_view}
            onPress={() => {
              setShow_quantity_selection(false);
            }}>
            <Image source={icons.close} style={{width: 20, height: 20}} />
          </Pressable>

          <View style={{marginVertical: 10}}>
            <Text style={styles.textinput_info}>Quantity:</Text>
            <TextInput
              placeholder="Enter Quantity"
              style={styles.model_input_box}
              value={quantity}
              maxLength={6}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>

          <View style={{marginVertical: 10}}>
            <Text style={styles.textinput_info}>Repetition:</Text>
            <TextInput
              placeholder="Enter Repetition"
              style={styles.model_input_box}
              maxLength={6}
              value={repetition}
              onChangeText={setRepetition}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            onPress={handleConfirmClick}
            style={styles.confirm_button}>
            <Text style={styles.confirm_txt}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* End Container: Quantity and Repetition */}
    </View>
  );
};

export default React.memo(CustomGift);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  gift_info_txt: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'left',
    fontWeight: '700',
  },
  gradient: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  less_opacity_gift: {
    width: 60,
    height: 40,
    marginRight: 10,
    opacity: 0.4,
  },
  info_text_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  gradient_selection_box: {
    width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF005C',
    paddingHorizontal: 10,
  },
  gradient_text: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  selection_container: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box_info_txt: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(0, 0, 0, 0.5)',
    marginTop: 5,
  },
  terms_txt: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    marginTop: -20,
  },
  button_view: {
    backgroundColor: '#FF005C',
    paddingVertical: 12,
    width: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: 10,
    height: 50,
  },
  button_txt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  diamonds_img: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  quantity_view: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    paddingVertical: 30,
    borderRadius: 5,
  },
  model_input_box: {
    borderWidth: 0.5,
    width: width * 0.6,
    fontSize: 14,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textinput_info: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '600',
  },
  cross_button_view: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  confirm_button: {
    backgroundColor: '#FF005C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  confirm_txt: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});
