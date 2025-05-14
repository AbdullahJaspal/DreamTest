import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';
import {ChooseAccountNavigationProps} from '../../navigations/types/OnboardingNavigationAndRoute';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Header from '../profile/profile/components/Header';

const {width} = Dimensions.get('screen');

const ChooseAccount: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<ChooseAccountNavigationProps>();

  const data = [
    {
      account_type: t('Basic account'),
      onPress: () => {
        navigation.navigate('BasicAccount');
      },
    },
    {
      account_type: t('Premium account'),
      onPress: () => {
        navigation.navigate('PremiumAccount');
      },
    },
    {
      account_type: t('Business account'),
      onPress: () => {
        navigation.navigate('BusinessAccountCategories');
      },
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header headertext="Choose Account" />

        {/* Account Types List */}
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={item.onPress}
              accessible={true}
              accessibilityLabel={`Select ${item.account_type}`}>
              <View style={styles.listItem}>
                <Text style={styles.accountTypeText}>{item.account_type}</Text>
                <Entypo name="chevron-right" size={30} color="#020202" />
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default React.memo(ChooseAccount);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: width * 0.05,
  },
  accountTypeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
