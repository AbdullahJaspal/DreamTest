import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useTranslation} from 'react-i18next';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('screen');

const ChooseBusinessAccount: React.FC = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const data = [
    {
      account_type: t('Buy a business account'),
      onPress: () => {},
    },
    {
      account_type: t('Password'),
      onPress: () => {},
    },
    {
      account_type: t('Change account'),
      onPress: () => {},
    },
    {
      account_type: t('Business account'),
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={20} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginTop: 0}]}>
            {t('Business Account')}
          </Text>
        </View>
        <View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.list_view}>
                <Text style={styles.list_text}>{item.account_type}</Text>
                <TouchableOpacity>
                  <Entypo name="chevron-right" size={30} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default React.memo(ChooseBusinessAccount);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 25,
    marginTop: 3,
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
