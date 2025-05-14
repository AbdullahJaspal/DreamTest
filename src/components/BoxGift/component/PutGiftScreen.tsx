import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';

import * as boxGift from '../../../apis/gifts';
import {setRechargeSheet} from '../../../store/slices/ui/indexSlice';
import {changeShowBoxGift} from '../../../store/slices/ui/boxGiftSlice';
import {update_wallet_diamond} from '../../../store/slices/user/my_dataSlice';

import {icons} from '../../../assets/icons';
import {useAppSelector} from '../../../store/hooks';
import {selectCurrentUser, selectMyProfileData} from '../../../store/selectors';
import {colors} from '../../../screens/sounds/utils/colors';
import {gradientColors} from '../../../constants/colors';

interface BoxGiftData {
  video_id: string;
  starting_time: Date;
  quantity: number;
  repetition: number;
}

const {width} = Dimensions.get('screen');

const PutGiftScreen: React.FC = () => {
  const res = useAppSelector(selectCurrentUser);
  const my_data = useAppSelector(selectMyProfileData);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const data: BoxGiftData = useMemo(
    () => ({
      video_id: res,
      starting_time: new Date(),
      quantity: 4,
      repetition: 10,
    }),
    [res],
  );

  const sendBoxGift = useCallback(async () => {
    if (loading) {
      return;
    }
    if (my_data?.wallet <= 400) {
      setLoading(true);
      try {
        await boxGift.sendBoxGift(my_data.auth_token, data);
        handleClose();
        handleUpdateDiamond(my_data?.wallet - 400);
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

  return (
    <View style={styles.main_container}>
      <LinearGradient colors={colors} style={styles.gradient}>
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
            <Text style={styles.gradient_text}>
              Time and Date
              {'\n'}
              Immediately
            </Text>
          </LinearGradient>
          <Text style={styles.box_info_txt}>Time and date</Text>
        </View>

        {/* Second container, Quantity and repetition */}
        <View style={styles.selection_container}>
          <LinearGradient
            colors={gradientColors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient_selection_box}>
            <Image source={icons.diamond} style={styles.diamonds_img} />
            <Text style={styles.gradient_text}>40 X 10</Text>
          </LinearGradient>
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
            <Text style={styles.gradient_text}>400</Text>
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
    </View>
  );
};

export default React.memo(PutGiftScreen);

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
});
