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
import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as countryApi from '../../../apis/countryApi';
import {CityProps} from '../../discover/types/CountrySelection';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Checkbox} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {UserProfile} from '../../../types/UserProfileData';
import * as userApi from '../../../apis/userApi';
import {update_city} from '../../../store/slices/user/my_dataSlice';
import Toast from 'react-native-simple-toast';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const {width} = Dimensions.get('screen');

const ProfileCity: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const my_data: UserProfile = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();
  const [citiesData, setCitiesData] = useState<CityProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchedData, setSearchedData] = useState<CityProps[] | null>(null);
  const selectedLanguageRef = useRef<string[]>([]);
  const inputRef = useRef<TextInput>(null);
  const [page, setPage] = useState<number>(1);

  const getAllCities = useCallback(async () => {
    try {
      const result = await countryApi.getAllCities(page, 20);
      setCitiesData(prevData => [...prevData, ...result.payload]);
    } catch (error) {
      console.log('Error generated while getting cities data', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    getAllCities();
  }, [getAllCities]);

  const RenderItem: React.FC<{item: CityProps}> = ({item}) => {
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
        <Text style={styles.itemText}>{item.name}</Text>
        <Checkbox
          status={selected ? 'checked' : 'unchecked'}
          onPress={handleOnValueChange}
          color="red"
          uncheckedColor="black"
        />
      </Pressable>
    );
  };

  async function handleValueChange(text: string) {
    if (text.trim() === '') {
      setSearchedData(null);
      return;
    }
    try {
      const result = await countryApi.searchCity(text, 1, 5);
      setSearchedData(result.payload);
    } catch (error) {
      console.log('Error generated while searching cities');
    }
  }

  function handleCitySave(): void {
    if (selectedLanguageRef.current.length === 0) {
      Alert.alert('Please select at least one city before saving.');
      return;
    }
    const data = {
      name: 'city',
      value: JSON.stringify(selectedLanguageRef.current),
    };
    userApi
      .updateProfile(my_data?.auth_token, data)
      .then(res => {
        dispatch(update_city(data.value));
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

  function handleOnEndReached(): void {
    setPage(pre => pre + 1);
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
        <Pressable onPress={handleCitySave}>
          <Text style={styles.saveText}>{t('Save')}</Text>
        </Pressable>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          data={searchedData || citiesData}
          renderItem={({item}) => <RenderItem item={item} />}
          keyExtractor={item => item.id.toString()}
          onEndReached={handleOnEndReached}
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

export default ProfileCity;

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
