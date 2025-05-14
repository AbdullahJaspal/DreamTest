import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import SvgImage from './components/SvgImage';
import SvgImage2 from './components/SvgImage2';
import RenderGiftView from './components/RenderGiftView';
import GiftHeader from './components/GiftHeader';
import InfoModal from '../../components/infoButtonModal';
import RechargePayScreen from '../../components/bottomSheets/RechargePayScreen';
import Balance from '../profile/profile/balance/BalanceScreen';

import {icons} from '../../assets/icons';

import {setRechargeSheet} from '../../store/slices/ui/indexSlice';
import {updateGiftData} from '../../store/slices/content/videoSlice';
import {changeShowBoxGift} from '../../store/slices/ui/boxGiftSlice';
import {update_wallet_diamond} from '../../store/slices/user/my_dataSlice';
import {setIsShowGift} from '../../store/slices/ui/mainScreenSlice';

import * as giftsApi from '../../apis/gifts';
import {sendGifts} from '../../apis/video.api';

import {VideoGiftScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {VideoGiftDataProps} from './types/VideoGiftDataProps';
import {useAppSelector} from '../../store/hooks';
import {selectCurrentVideo, selectMyProfileData} from '../../store/selectors';

const {width, height} = Dimensions.get('screen');

const box_gift = {
  category: 'functional',
  cost: 400,
  createdAt: '2023-11-03T05:27:30.000Z',
  gift_image: 'video_gift/functional_gift/box_gift.png',
  gift_name: 'Box Gift',
  gift_video: 'video_gift/video/hello.mov',
  id: 0,
  updatedAt: '2023-11-03T05:27:30.000Z',
};

const VideoGift = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<VideoGiftScreenNavigationProps>();

  const dispatch = useDispatch();
  const videoData = useAppSelector(selectCurrentVideo);
  const my_data = useAppSelector(selectMyProfileData);

  const [selected_gift, setSelected_gift] = useState<VideoGiftDataProps>();
  const [functional_gift, setFunctional_gift] = useState<boolean>(true);
  const [functional_gift_data, setFuntional_gift_data] = useState<
    VideoGiftDataProps[]
  >([box_gift]);
  const [mood_gift, setMood_gift] = useState<boolean>(false);
  const [mood_gift_data, setMood_gift_data] = useState<VideoGiftDataProps[]>(
    [],
  );
  const [vip_gift, setVip_gift] = useState<boolean>(false);
  const [vip_gift_data, setVip_gift_data] = useState<VideoGiftDataProps[]>([]);

  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showRecharge, setShowRecharge] = useState<boolean>(false);

  const getAllGiftListByCategories = useCallback(async () => {
    const result = await giftsApi.getAllGiftListByCategories(
      my_data?.auth_token,
    );
    if (functional_gift_data.length === 1) {
      setFuntional_gift_data([
        ...functional_gift_data,
        ...result?.payload?.functional_gift,
      ]);
    }
    setMood_gift_data(result?.payload?.mood_gift);
    setVip_gift_data(result?.payload?.vip_gift);
  }, [my_data]);

  useEffect(() => {
    getAllGiftListByCategories();
  }, []);

  const handlePayments = () => {
    console.log('Payment');
    dispatch(setRechargeSheet(true));
  };

  const handleFunctionalGift = () => {
    setFunctional_gift(true);
    setMood_gift(false);
    setVip_gift(false);
  };
  const handleVipGifts = () => {
    setVip_gift(true);
    setMood_gift(false);
    setFunctional_gift(false);
  };
  const handleMoodGifts = () => {
    setMood_gift(true);
    setFunctional_gift(false);
    setVip_gift(false);
  };

  const handleSend = () => {
    if (selected_gift?.id === 0) {
      navigation.goBack();
      dispatch(changeShowBoxGift(true));
    } else {
      const coin = selected_gift?.cost || 0;
      dispatch(
        updateGiftData({
          video_link: selected_gift?.gift_video ?? '',
          video_id: Number(videoData.id),
        }),
      );
      if (my_data?.wallet >= coin) {
        const diamonds = selected_gift?.cost;
        const video_id = videoData?.id;
        const reciever_id = videoData?.user_id;
        const token = my_data?.auth_token;

        const data = {
          diamonds,
          video_id,
          reciever_id,
        };
        dispatch(setIsShowGift(false));
        sendGifts(data, token)
          .then(r => {
            dispatch(
              update_wallet_diamond(r?.data?.result?.sender_final_diamond),
            );
            setSelected_gift(undefined);
            Toast.show('Successfully sent', Toast.LONG);
          })
          .catch(err => {
            console.log('Error generated when sending gift', err);
          });
      } else {
        dispatch(setRechargeSheet(true));
      }
    }
  };

  const faqData = [
    {
      question: t('What Are Gifts in Dream?'),
      answer: t(
        'Gifts are virtual items that users can send to their favorite creators as a way to show appreciation for their content. These gifts are converted into diamonds, which can be used to unlock features, participate in events, and purchase tickets for Lucky Wheel.',
      ),
    },
    {
      question: t('How Do I Send a Gift?'),
      answer: `${t(
        'Step 1: Open the video of the creator you want to support',
      )}.\n ${t(
        'Step 2: Tap the Gift Icon located at the bottom of the video screen',
      )}.\n ${t(
        'Step 3: Choose a gift from the available options. Each gift displays its diamond value',
      )}.\n ${t(
        'Step 4: Click Send, and the gift will be delivered instantly',
      )}!`,
    },
    {
      question: t('How Can I Use Diamonds?'),
      answer: `${t('Diamonds can be used for')}:\n\n- ${t(
        'Buying Lucky Wheel Tickets: Enter lottery draws for prizes',
      )}.\n- ${t(
        'Upgrading Accounts: Switch to Premium or Business accounts for more benefits',
      )}.\n- ${t(
        'Sending Gifts: Support creators and build connections.',
      )}\n- ${t(
        'Unlocking Features: Gain access to exclusive tools and content.',
      )}\n- ${t(
        'Send it to a friend: Diamonds can be transferred to your friend within the country where the diamonds were purchased only.',
      )}`,
    },
    {
      question: t('Can I Transfer or Withdraw Diamonds?'),
      answer: `${t(
        'Yes, you can withdraw your diamonds as cash! Once your balance reaches a minimum of $100 USD, you can request a withdrawal through the wallet section in the app',
      )}.\n\n ${t(
        'Note: Withdrawal processing times may vary depending on your selected payment method',
      )}.`,
    },
    {
      question: t('Do Gifts Expire?'),
      answer: t(
        'No, gifts do not expire. Once sent, they are instantly converted into diamonds for the recipient to use anytime.',
      ),
    },
    {
      question: t('What Happens if I Don’t Use My Diamonds?'),
      answer: t(
        'Unused diamonds remain in your wallet until you decide how to spend them. They do not expire, so you can save them for future events or features.',
      ),
    },
    {
      question: t('Need More Help?'),
      answer: t(
        'For more information, please contact our Customer Support team.',
      ),
    },
  ];

  function handleQuestionPress(): void {
    setShowInfo(true);
  }

  function handleShowRecharge() {
    setShowRecharge(true);
  }

  const handleBalancePressed = async () => {
    setShowBalance(true);
    // Alert.alert("Button Clicked");
  };

  return (
    <View style={styles.main_conatainer}>
      {/* Profile picture part */}

      <GiftHeader />

      <View style={styles.upper_part}>
        {/* Gift header when functional gift is selected */}
        {functional_gift && (
          <View style={styles.gift_view}>
            <Pressable
              onPress={handleMoodGifts}
              style={styles.functional_dream_gift_view}>
              <Text style={styles.text}>{t('D ')}</Text>
            </Pressable>

            <Pressable onPress={handleVipGifts} style={{width: width / 3}}>
              <SvgImage text={t('VIP ')} />
            </Pressable>

            <Pressable
              onPress={handleFunctionalGift}
              style={styles.functional_functional_gift_view}>
              <Text style={styles.functional_functional_gift_text}>
                {t('F ')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Gift header when functional vip is selected */}
        {vip_gift && (
          <View style={styles.gift_view}>
            <Pressable onPress={handleMoodGifts} style={{width: width / 3}}>
              <SvgImage text={t('D ')} />
            </Pressable>

            <Pressable
              onPress={handleVipGifts}
              style={styles.functional_functional_gift_view}>
              <Text style={styles.functional_functional_gift_text}>
                {t('VIP ')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleFunctionalGift}
              style={styles.functional_functional_gift_view}>
              <SvgImage2 text={t('F ')} />
            </Pressable>
          </View>
        )}

        {/* Gift header when functional vip is selected */}
        {mood_gift && (
          <View style={styles.gift_view}>
            <Pressable
              onPress={handleMoodGifts}
              style={styles.functional_functional_gift_view}>
              <Text style={styles.functional_functional_gift_text}>
                {t('D ')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleVipGifts}
              style={styles.functional_functional_gift_view}>
              <SvgImage2 text={t('VIP ')} />
            </Pressable>

            <Pressable
              onPress={handleFunctionalGift}
              style={styles.functional_dream_gift_view}>
              <Text style={styles.text}>{t('F ')}</Text>
            </Pressable>
          </View>
        )}
      </View>
      {/* End of header */}

      {/* Functional Gift list */}
      {functional_gift && (
        <View style={styles.gift_list_container}>
          {functional_gift_data?.length > 0 ? (
            <FlatList
              data={functional_gift_data}
              numColumns={4}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <RenderGiftView
                  item={item}
                  index={index}
                  selected_gift={selected_gift}
                  setSelected_gift={setSelected_gift}
                  handleSend={handleSend}
                />
              )}
            />
          ) : (
            <View style={styles.no_gift_found_view}>
              <Text style={styles.no_gift_found_txt}>{t('No Gift Found')}</Text>
            </View>
          )}
        </View>
      )}

      {/* Dream Gift list */}
      {mood_gift && (
        <View style={styles.gift_list_container}>
          {mood_gift_data.length > 0 ? (
            <FlatList
              data={mood_gift_data}
              numColumns={4}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <RenderGiftView
                  item={item}
                  index={index}
                  selected_gift={selected_gift}
                  setSelected_gift={setSelected_gift}
                  handleSend={handleSend}
                />
              )}
            />
          ) : (
            <View style={styles.no_gift_found_view}>
              <Text style={styles.no_gift_found_txt}>{t('No Gift Found')}</Text>
            </View>
          )}
        </View>
      )}

      {/* Vip Gift list */}
      {vip_gift && (
        <View style={styles.gift_list_container}>
          {vip_gift_data?.length > 0 ? (
            <FlatList
              data={vip_gift_data}
              numColumns={4}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <RenderGiftView
                  item={item}
                  index={index}
                  selected_gift={selected_gift}
                  setSelected_gift={setSelected_gift}
                  handleSend={handleSend}
                />
              )}
            />
          ) : (
            <View style={styles.no_gift_found_view}>
              <Text style={styles.no_gift_found_txt}>No Gift Found</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.bottom_container}>
        <Pressable onPress={handleBalancePressed}>
          <Text style={styles.txt}>{t('Balance')}</Text>
        </Pressable>

        <View style={styles.coin_view}>
          <Pressable
            onPress={handleQuestionPress}
            style={styles.question_mark_view}>
            <Image
              source={icons.questionMark}
              style={{width: 20, height: 20}}
            />
          </Pressable>
          <Image source={icons.diamond} style={{width: 20, height: 20}} />
          <Text style={styles.txt}>{my_data?.wallet}</Text>
          <Pressable onPress={handleShowRecharge} style={{marginLeft: 5}}>
            <AntDesign name="right" size={30} color={'#fff'} />
          </Pressable>
        </View>
      </View>
      <InfoModal
        show_model={showInfo}
        setShowModel={setShowInfo}
        faqData={faqData}
        title={t('Purchasing Gift Info')}
      />
      <RechargePayScreen
        showModal={showRecharge}
        setShowModal={setShowRecharge}
      />
      <Balance showModal={showBalance} setShowModal={setShowBalance} />
    </View>
  );
};

export default React.memo(VideoGift);

const styles = StyleSheet.create({
  main_conatainer: {
    width: width,
    height: height * 0.6,
    backgroundColor: '#020202',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  upper_part: {
    width: width,
    height: 50,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  txt: {
    color: '#fff',
    textAlign: 'center',
  },
  linear_gradient_view: {
    width: width,
    height: height * 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  back_big_picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: height * 0.28,
    left: width * 0.4,
    right: width * 0.5,
    zIndex: 100,
    backgroundColor: '#fff',
  },
  gift_view: {
    width: width,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom_container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottom_container_corner: {
    backgroundColor: '#020202',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  coin_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#020202',
  },
  no_gift_found_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  no_gift_found_txt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  functional_dream_gift_view: {
    width: width / 3,
    backgroundColor: '#676767',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderWidth: 1,
    borderColor: '#fff',
  },
  functional_functional_gift_view: {
    width: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  functional_functional_gift_text: {
    color: '#FBFF2E',
    fontSize: 16,
    fontWeight: '700',
  },
  gift_list_container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  question_mark_view: {
    backgroundColor: 'white',
    borderRadius: 50,
    marginRight: 15,
  },
});
