import React, {
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import AntDesign from 'react-native-vector-icons/AntDesign';

import * as userApi from '../../../../apis/userApi';
import Header from '../components/Header';

import {Wallet_MainScreenScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {UserCurrencyDataProps} from './types/userCurrency';
import {selectMyProfileData} from '../../../../store/selectors';
import {useAppSelector} from '../../../../store/hooks';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const Wallet_MainScreen: React.FC = () => {
  const {t, i18n} = useTranslation();

  const data = [
    {
      key: '1',
      title: t('Gifts Information Record'),
      route: 'GiftInformation',
    },
    {
      key: '2',
      title: t('Gift Rewards Into Coins'),
      route: 'GiftRewardIntoCoinsScreen',
    },
    {
      key: '3',
      title: t('Buy Gift for Friend'),
      route: 'Gift_for_friend',
    },
  ];

  const navigation = useNavigation<Wallet_MainScreenScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  const [giftWallet, setGiftWallet] = useState<number>();
  const [currency_data, setCurrecy_data] = useState<UserCurrencyDataProps>();

  const getNoOfDiamondInGiftWalletByUserID = async () => {
    try {
      const diamonds = await userApi.getNoOfDiamondInGiftWalletByUserID(
        my_data?.auth_token,
      );
      setGiftWallet(diamonds.payload);
    } catch (error) {
      console.log('Error generated while getting gift wallet');
    }
  };

  const getCurrency_data = useCallback(async () => {
    const result = await userApi.sendUserGiftWalletCurrecyInDollarAndLocal(
      my_data?.auth_token,
    );
    setCurrecy_data(result?.payload);
  }, []);

  useEffect(() => {
    getCurrency_data();
  }, [getCurrency_data]);

  const RechargeHandler = () => {
    navigation.navigate('Gift_recharge_sheet');
  };

  const handleItemPress = (item: {key: any; title?: string; route: any}) => {
    if (item?.key != 2) {
      navigation.navigate(item.route);
    }
  };

  const handleLetsGoPressed = () => {
    navigation.navigate('GiftRewardIntoCoinsScreen');
  };

  function renderItem(
    info: ListRenderItemInfo<{key: string; title: string; route: string}>,
  ): ReactElement<any, string | JSXElementConstructor<any>> | null {
    const {item} = info;
    return (
      <Pressable style={styles.circletxt} onPress={() => handleItemPress(item)}>
        <View style={styles.redcircle} />
        <Text style={styles.txt}>{item.title}</Text>
      </Pressable>
    );
  }

  return (
    <View
      style={styles.main_container}
      onLayout={getNoOfDiamondInGiftWalletByUserID}>
      <Header headertext={t('My Wallet')} />
      <Pressable style={styles.dreamcontainer} onPress={RechargeHandler}>
        <Text style={styles.container_txt}>{t('Dream')}</Text>
      </Pressable>

      <View style={{marginTop: 15}}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
        />
      </View>

      <View style={styles.green_line} />

      <View style={styles.bottom_container}>
        {/* First Container */}
        <View>
          {currency_data?.local_currency && currency_data.us_dollar ? (
            <>
              <Text style={styles.currency_txt}>
                {currency_data?.us_dollar}
              </Text>
              <Text style={styles.currency_txt}>
                {currency_data?.local_currency}
              </Text>
            </>
          ) : (
            <ActivityIndicator size={'small'} color={'#000'} />
          )}
        </View>

        {/* Second Container */}
        <View style={styles.swap_view}>
          <AntDesign name="swap" size={40} color={'#fff'} />
        </View>

        {/* Third Container */}
        <View>
          {giftWallet != undefined ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={icons.diamond} style={{width: 50, height: 50}} />
              <Text style={styles.currency_txt}>
                {giftWallet ? giftWallet : 0}
              </Text>
            </View>
          ) : (
            <ActivityIndicator size={'small'} color={'#000'} />
          )}
        </View>
      </View>

      <View style={{width: width, alignItems: 'center', marginTop: 30}}>
        <Text>{t('Exchange the balance for diamonds')}</Text>
        <TouchableOpacity
          style={styles.button_view}
          onPress={handleLetsGoPressed}>
          <Text style={styles.button_txt}>{t('Lets Go')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(Wallet_MainScreen);

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  dreamcontainer: {
    backgroundColor: 'black',
    width: width,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circletxt: {
    flexDirection: 'row',
    width: width,
    height: height * 0.05,
    alignItems: 'center',
  },
  redcircle: {
    backgroundColor: 'red',
    width: width * 0.04,
    height: width * 0.04,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: width * 0.025,
    marginLeft: 8,
  },
  txt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingLeft: 15,
  },
  container_txt: {
    color: 'white',
    fontSize: 40,
  },
  bottom_container: {
    width: width,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  swap_view: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  button_view: {
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  button_txt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  currency_txt: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
  green_line: {
    width: width * 0.95,
    height: height * 0.01,
    backgroundColor: 'green',
    alignSelf: 'center',
    marginTop: 25,
    borderRadius: 5,
  },
});
