import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Checkbox} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import * as countryApi from '../../../apis/countryApi';
import * as userApi from '../../../apis/userApi';

import {CountryProps} from '../../discover/types/CountrySelection';
import {UserProfile} from '../../../types/UserProfileData';

import {update_country} from '../../../store/slices/user/my_dataSlice';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const {width, height} = Dimensions.get('window');

const ProfileCountry: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [countryData, setCountryData] = useState<CountryProps[]>([]);
  const [searchedData, setSearchedData] = useState<CountryProps[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const inputRef = useRef<TextInput>(null);
  const selectedLanguageRef = useRef<string[]>([]);
  const my_data: UserProfile = useAppSelector(selectMyProfileData);

  const getAllCountryDetails = useCallback(async () => {
    try {
      const result = await countryApi.getAllCountries();
      setCountryData(result?.payload);
    } catch (error) {
      console.log('Error generated while getting country list', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllCountryDetails();
  }, [getAllCountryDetails]);

  function handleValueChange(text: string): void {
    if (text.trim() === '') {
      setSearchedData(null);
      return;
    }
    const filteredData = countryData.filter(country =>
      country.name.toLowerCase().includes(text.toLowerCase()),
    );
    setSearchedData(filteredData);
  }

  const RenderItem: React.FC<{item: CountryProps}> = ({item}) => {
    const isCheckboxChecked = selectedLanguageRef.current.includes(item.name);
    const [selected, setSelected] = useState<boolean>(isCheckboxChecked);

    const handleOnValueChange = () => {
      if (isCheckboxChecked) {
        selectedLanguageRef.current = selectedLanguageRef.current.filter(
          lang => lang !== item.name,
        );
        setSelected(false);
      } else {
        if (selectedLanguageRef.current.length >= 3) {
          Alert.alert('You can select a maximum of 3 countries.');
          return;
        }
        selectedLanguageRef.current.push(item.name);
        setSelected(true);
      }
    };

    return (
      <Pressable style={styles.itemView} onPress={handleOnValueChange}>
        <View style={styles.country_name}>
          <Text>{item.emoji}</Text>
          <Text style={{marginLeft: 12}}>{item.name}</Text>
        </View>{' '}
        <Checkbox
          status={selected ? 'checked' : 'unchecked'}
          onPress={handleOnValueChange}
          color="red"
          uncheckedColor="black"
        />
      </Pressable>
    );
  };

  function handleCountrySave(): void {
    if (selectedLanguageRef.current.length === 0) {
      Alert.alert('Please select at least one country before saving.');
      return;
    }
    const data = {
      name: 'country',
      value: JSON.stringify(selectedLanguageRef.current),
    };
    userApi
      .updateProfile(my_data?.auth_token, data)
      .then(res => {
        dispatch(update_country(data.value));
        console.log('successfully added', 1);
        navigation.goBack();
        console.log('successfully added', 2);
        Toast.show(res.message, Toast.SHORT);
        console.log('successfully added', 3);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={25} color={'#020202'} />
        </Pressable>
        <TextInput
          placeholder={t('Search')}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
          style={styles.textInput}
          onChangeText={handleValueChange}
          ref={inputRef}
          keyboardType="default"
          keyboardAppearance="dark"
        />
        <Pressable onPress={handleCountrySave}>
          <Text style={styles.saveText}>{t('Save')}</Text>
        </Pressable>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          data={searchedData || countryData}
          renderItem={({item}) => <RenderItem item={item} />}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={() =>
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('No data available')}</Text>
              </View>
            )
          }
          ListFooterComponent={
            <Text style={styles.emptyText}>{t('No more country found')}.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileCountry;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 5,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  itemView: {
    flexDirection: 'row',
    width: width,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    marginVertical: 5,
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 17,
    color: '#020202',
  },
  saveText: {
    fontSize: 18,
    color: 'red',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    width: width,
    textAlign: 'center',
  },
  country_name: {
    flexDirection: 'row',
    width: width * 0.4,
    alignItems: 'center',
  },
});
