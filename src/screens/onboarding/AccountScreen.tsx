import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SectionList,
  Image,
  Pressable,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addIsLogin,
  add_my_profile_data,
} from '../../store/slices/user/my_dataSlice';
import {useDispatch} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import {interstitial} from '../../ads/InterstitialAds';
import {AdEventType} from 'react-native-google-mobile-ads';
import {AccountScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {icons} from '../../assets/icons';

const {width, height} = Dimensions.get('screen');

const AccountScreen = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<AccountScreenNavigationProps>();
  const dispatch = useDispatch();
  const [loaded_ads, setLoaded_ads] = useState(false);

  const handleCancleLogout = () => {
    dispatch(addIsLogin(false));
    dispatch(add_my_profile_data(null));
  };

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded_ads(true);
      },
    );

    if (!loaded_ads) {
      interstitial.load();
    }

    return unsubscribe;
  }, [loaded_ads]);

  const handleAdsDisplay = useCallback(() => {
    setLoaded_ads(prevLoaded => {
      if (prevLoaded) {
        interstitial.show();
        return false;
      } else {
        interstitial.load();
        setTimeout(() => {
          setLoaded_ads(latestLoaded => {
            if (latestLoaded) {
              interstitial.show();
              return false;
            }
            return latestLoaded;
          });
        }, 4000);
        return prevLoaded;
      }
    });
  }, [interstitial]);

  const handleLogout = async () => {
    try {
      Alert.alert(
        t('Confirmation'),
        t('Are you sure you want to logout?'),
        [
          {
            text: t('Cancel'),
            onPress: () => handleCancleLogout(),
            style: 'cancel',
          },
          {
            text: t('Logout'),
            onPress: async () => {
              await AsyncStorage.clear();
              navigation.navigate('Home');
              handleCancleLogout();
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.log(error);
    }
  };

  const data1 = [
    {
      heading: t('Account'),
      data: [
        {
          name: t('Choose Account'),
          image: icons.settingProfile,
          onPress: () => {
            navigation.navigate('MainChangeAccountType');
          },
        },
        {
          name: t('Analytics'),
          image: icons.settingAnalytics,
          onPress: () => {
            navigation.navigate('MainInsightScreen');
          },
        },
        {
          name: t('Balance'),
          image: icons.settingBalance,
          onPress: async () => {
            navigation.navigate('Balance');
            handleAdsDisplay();
          },
        },
        {
          name: t('Security'),
          image: icons.settingSecurity,
          onPress: () => {
            navigation.navigate('MainSecurity');
          },
        },
        {
          name: t('Privacy'),
          image: icons.settingPrivacy,
          onPress: () => {
            navigation.navigate('PrivacyPolicy');
          },
        },
      ],
    },
    {
      heading: t('Tools'),
      data: [
        {
          name: t('Wallet'),
          image: icons.settingCoins,
          onPress: async () => {
            navigation.navigate('Wallet_MainScreen');
            handleAdsDisplay();
          },
        },
        {
          name: t('Backup'),
          image: icons.settingBackup,
          onPress: () => {
            navigation.navigate('Backup_and_restore');
          },
        },
        {
          name: t('Free up space'),
          image: icons.settingBin,
          onPress: () => {
            navigation.navigate('Space_saving');
          },
        },
        {
          name: t('Blocked & Reported Users'),
          image: icons.settingBlock,
          onPress: () => {
            navigation.navigate('BlockUser');
          },
        },
        {
          name: t('Videos LIVE a Allowed'),
          image: icons.settingLive,
          onPress: () => {
            navigation.navigate('Video_Live_Allowed');
          },
        },
        {
          name: t('QR Code'),
          image: icons.settingAnalytics,
          onPress: () => {
            navigation.navigate('QRScreen');
          },
        },
      ],
    },
    {
      heading: t('Wheel Luck'),
      data: [
        {
          name: t('Lucky Wheel'),
          image: icons.promotionDiary,
          onPress: () => {
            navigation.navigate('lucky_wheel');
          },
        },
        {
          name: t('Box Wheel'),
          image: icons.promotionActivity,
          onPress: () => {
            navigation.navigate('Wheelluckgift');
          },
        },
        {
          name: t('Q&A'),
          image: icons.settingQNA,
          onPress: () => {
            navigation.navigate('Question_answer');
          },
        },
        {
          name: t('Help/Contact Us'),
          image: icons.settingHelp,
          onPress: () => {
            navigation.navigate('HelpAndContact');
          },
        },
      ],
    },
    {
      heading: t('Settings'),
      data: [
        {
          name: t('Payment Method'),
          image: icons.settingCard,
          onPress: () => {
            navigation.navigate('Payment_Method');
          },
        },
        {
          name: t('Avatars'),
          image: icons.settingHead,
          onPress: () => {
            navigation.navigate('Avatar');
          },
        },
        {
          name: t('Notification'),
          image: icons.settingNotification,
          onPress: async () => {
            navigation.navigate('MainNotification');
            handleAdsDisplay();
          },
        },
        {
          name: t('Download all Information'),
          image: icons.settingDownload,
          onPress: () => {
            navigation.navigate('MainScreen');
          },
        },
        {
          name: t('User Blocked & Reported Me'),
          image: icons.settingFlag,
          onPress: () => {
            navigation.navigate('ReportUser');
          },
        },
        {
          name: t('Transfer all information to another'),
          image: icons.settingBack,
          onPress: () => {},
        },
        {
          name: t('Ads/promote'),
          image: icons.settingSpeakers,
          onPress: () => {},
        },
        {
          name: t('Privacy policy'),
          image: icons.settingPrivacyPolicy,
          onPress: () => {
            Linking.openURL(
              'https://newspakupdat.blogspot.com/p/privacy-policy-of-dream-application.html?m=1',
            );
          },
        },
        {
          name: t('About Us'),
          image: icons.settingForm,
          onPress: () => {
            Linking.openURL(
              'https://newspakupdat.blogspot.com/p/terms-of-service-of-dream-application.html?m=1',
            );
          },
        },
        {
          name: t('Verification'),
          image: icons.dreamVerified,
          onPress: () => {
            navigation.navigate('UserVerification');
          },
        },
        {
          name: t('Share profile'),
          image: icons.settingShares,
          onPress: () => {},
        },
        {
          name: t(t('Language')),
          image: icons.dreamLanguage,
          onPress: () => {
            navigation.navigate('Language');
          },
        },
        {
          name: t('Switching Account'),
          image: icons.settingSwitch,
          onPress: async () => {
            handleAdsDisplay();
          },
        },
        {
          name: t('Logout'),
          image: icons.settingLogout,
          onPress: handleLogout,
        },
        {
          name: t('Close Account'),
          image: icons.settingDelete,
          onPress: () => {
            navigation.navigate('CloseAccount');
            handleAdsDisplay();
          },
        },
      ],
    },
  ];
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data1);
  const [mainData, setmainlData] = useState(data1);
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filterdata = mainData.map(section => ({
      ...section,
      data: section.data.filter(item =>
        item.name.toLowerCase().startsWith(text.toLowerCase()),
      ),
    }));
    setFilteredData(filterdata);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchActive(false);
      setSearchQuery('');
      setFilteredData(data1);
    });
    return unsubscribe;
  }, [navigation]);

  const toggleSearch = () => {
    if (searchActive) {
      setSearchActive(false);
      setSearchQuery('');
      setFilteredData(data1);
    } else {
      setSearchActive(true);
    }
  };

  const HeaderComponents: React.FC = () => {
    return (
      <View style={styles.upper_sections}>
        <Text style={styles.categoriesTxt}>{t('Categories details')}</Text>
        <Text
          style={{
            width: width * 0.75,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontFamily: 'lato-heavy',
            fontWeight: '900',
            textAlign: 'center',
            lineHeight: 24,
          }}>
          {t('Through this page you can manage')}
          {'\n'}
          {t('and configure your profile and')}
          {'\n'}
          {t('all categories releated')}
          {'\n'}
          {t('to Dream')}
        </Text>
      </View>
    );
  };

  const FooterComponents: React.FC = () => {
    return (
      <View
        style={{
          width: width,
          marginBottom: 20,
          marginTop: 10,
          height: 100,
        }}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {searchActive ? (
          <View style={styles.header}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity
              onPress={toggleSearch}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: height * 0.06,
                marginLeft: width * 0.87,
                position: 'absolute',
                bottom: height * 0.03,
                opacity: 0.4,
              }}>
              <FontAwesome
                name={searchActive ? 'times' : 'search'}
                size={25}
                color={'#020202'}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign name="arrowleft" size={25} color={'#020202'} />
            </TouchableOpacity>
            <Text style={[styles.headerText]}>{t('Settings Profile')}</Text>
            <TouchableOpacity onPress={toggleSearch}>
              <FontAwesome
                name={searchActive ? 'times' : 'search'}
                size={25}
                color={'#020202'}
              />
            </TouchableOpacity>
          </View>
        )}
        {/* </Body> */}

        <View>
          <SectionList
            sections={searchActive ? filteredData : data1}
            ListHeaderComponent={HeaderComponents}
            ListFooterComponent={FooterComponents}
            keyExtractor={item => item.name.toString()}
            renderItem={({item}) => (
              <Pressable style={styles.list_view} onPress={item?.onPress}>
                <View style={styles.list_left_view}>
                  <Image source={item.image} style={{width: 25, height: 25}} />
                  <Text style={styles.list_text}>{item.name}</Text>
                </View>
                <TouchableOpacity onPress={item.onPress}>
                  <Entypo name="chevron-small-right" size={20} />
                </TouchableOpacity>
              </Pressable>
            )}
            renderSectionHeader={({section: {heading}}) => (
              <Text style={styles.headingText}>{heading}</Text>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default React.memo(AccountScreen);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
  categoriesTxt: {
    fontFamily: 'lato-heavy',
    fontSize: 30,
    fontWeight: '900',
    color: 'black',
  },
  upper_sections: {
    width: width,
    alignItems: 'center',
  },
  list_view: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    marginVertical: 15,
  },
  list_left_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list_text: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 20,
  },
  headingText: {
    width: width,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
    paddingBottom: 3,
  },
  searchInput: {
    width: width * 0.9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  footer_text: {
    width: width,
    paddingHorizontal: width * 0.05,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 15,
  },
});
