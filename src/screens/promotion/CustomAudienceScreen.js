import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Icon} from '../../components/index';
import {useNavigation} from '@react-navigation/native';
import Body from '../../components/Body/Body.components';
import {useState} from 'react';
const {width, height} = Dimensions.get('window');
import {useTranslation} from 'react-i18next';
import {icons} from '../../assets/icons';

const CustomAudienceScreen = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const handleConfirm = () => {};
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Body applyPadding={false} style={styles.header}>
        <Body applyPadding={false} style={styles.leftHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={20} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginTop: 0}]}>
            {t('Select Audience')}
          </Text>
        </Body>
        <TouchableOpacity onPress={handleConfirm}>
          <Text style={[styles.headerText, {color: 'rgba(26, 148, 236, 1)'}]}>
            {t('Compl')}...
          </Text>
        </TouchableOpacity>
      </Body>

      <View style={styles.list_section}>
        <Text style={styles.text}>{t('Location')}</Text>
        <Icon
          onPress={() => {
            navigation.navigate('SelectingLocationScreen', {
              countries,
              setCities,
              cities,
              setCountries,
            });
          }}
          source={icons.back}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </View>

      {/* <View style={styles.list_section}>
                <Text style={styles.text}>{t("Interests")}</Text>
                <Icon
                    onPress={() => { navigation.navigate('InterestScreen') }}
                    source={icons.back}
                    style={{ transform: [{ rotate: '180deg' }] }} />
            </View> */}

      <View style={styles.list_section}>
        <Text style={styles.text}>{t('Gender')}</Text>
        <Icon
          onPress={() => {
            navigation.navigate('SelectingGender');
          }}
          source={icons.back}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </View>

      <View style={styles.list_section}>
        <Text style={styles.text}>{t('Age')}</Text>
        <Icon
          onPress={() => {
            navigation.navigate('SelectingAge');
          }}
          source={icons.back}
          style={{transform: [{rotate: '180deg'}]}}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomAudienceScreen;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  list_section: {
    width: width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 7,
    borderColor: 'rgba(217, 217, 217, 0.4)',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 25,
    marginTop: 5,
  },
  leftHeader: {
    flexDirection: 'row',
  },
});
