import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../profile/profile/components/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const MainChangeAccountType = () => {
  const {width, height} = useWindowDimensions();
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();

  const my_data = useAppSelector(selectMyProfileData);
  const [userAccountType, setUserAccountType] = useState(my_data?.account_type);

  const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    list_view: {
      flexDirection: 'row',
      width: width,
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.05,
      alignItems: 'center',
      marginVertical: 12,
    },
    list_text: {
      color: 'black',
      fontSize: 18,
      fontWeight: '800',
      marginLeft: 20,
    },
  });
  const data = [
    {
      account_type: 'Basic account',
      onPress: () => {
        navigation.navigate('BasicAccount');
      },
    },
    {
      account_type: 'Premium account',
      onPress: () => {
        navigation.navigate('PremiumAccount');
      },
    },
    {
      account_type: 'Business account',
      onPress: () => {
        navigation.navigate('BusinessAccountCategories');
      },
    },
  ];

  let optionsToDisplay = [];
  if (userAccountType === 'basic') {
    optionsToDisplay = ['Premium account', 'Business account'];
  } else if (userAccountType === 'premium') {
    optionsToDisplay = ['Business account', 'Basic account'];
  } else if (userAccountType === 'business') {
    optionsToDisplay = ['Basic account', 'Premium account'];
  }

  const filteredData = data.filter(item =>
    optionsToDisplay.includes(item.account_type),
  );

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Change Account Type')} />
      <View>
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={item.onPress}>
              <View style={styles.list_view}>
                <View>
                  <Text style={styles.list_text}>{t(item.account_type)}</Text>
                </View>

                <Entypo name="chevron-right" size={30} color={'#020202'} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default MainChangeAccountType;
