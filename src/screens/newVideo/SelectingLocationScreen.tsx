import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  GestureResponderEvent,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {Checkbox} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import * as countryApi from '../../apis/countryApi';
import {debounce} from '../../utils/debounce';

import {
  SelectingLocationScreenNavigationProps,
  SelectingLocationScreenRouteProps,
} from '../../types/screenNavigationAndRoute';
import {CountryProps} from '../discover/types/CountrySelection';
import {InitialState as LocationSelectionProps} from '../../store/slices/common/locationSlice';
import {locationSelection} from '../../store/selectors';
import {useAppSelector} from '../../store/hooks';

interface CountryCardProps {
  item: CountryProps;
  index: number;
}

const {width, height} = Dimensions.get('window');

const SelectingLocationScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const route = useRoute<SelectingLocationScreenRouteProps>();
  const navigation = useNavigation<SelectingLocationScreenNavigationProps>();
  const locationSelectionDetails: LocationSelectionProps =
    useAppSelector(locationSelection);
  const countriesData = useRef<CountryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredUsers, setFilteredUsers] = useState<CountryProps[]>([]);
  const {countries, cities} = route.params;

  // get the data from the backend
  const getCountry = useCallback(async () => {
    try {
      const result = await countryApi.getAllCountries();
      countriesData.current = result.payload;
    } catch (error) {
      console.log('Error generated while getting coutried details', error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getCountry();
  }, [getCountry]);

  const handleSearch = (text: string): void => {
    if (text === '') {
      setFilteredUsers([]);
      return;
    }
    const filteredData = countriesData.current.filter(user =>
      user.name.toLowerCase().startsWith(text.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  };
  const debouncedSearch = useCallback(debounce(handleSearch, 300), [
    handleSearch,
  ]);

  function handleGoBackPress(event: GestureResponderEvent): void {
    navigation.goBack();
  }

  const handleAllSelectAtOnce = (): void => {
    const allSelected =
      countries.current.length === countriesData.current.length;
    if (allSelected) {
      countries.current = [];
    } else {
      countries.current = countriesData.current.map(item => item.id);
    }
    setFilteredUsers([...filteredUsers]);
  };

  const CountryCard: React.FC<CountryCardProps> = ({item, index}) => {
    const locationSelectionDetails: LocationSelectionProps =
      useAppSelector(locationSelection);
    const code = item?.short_name;
    const id = item?.id;
    const [isSelected, setIsSelected] = useState<boolean>(
      countries.current.includes(id),
    );

    function handleSelectCountries(): void {
      if (isSelected) {
        countries.current = countries.current.filter(v => v !== id);
        setIsSelected(false);
      } else {
        if (
          countries.current?.length <
          locationSelectionDetails.noOFCountryAllowedToSelect
        ) {
          countries.current = [...countries.current, id];
          setIsSelected(true);
        } else {
          Alert.alert(
            'Information',
            `You can not select more than ${locationSelectionDetails.noOFCountryAllowedToSelect} countries. If you want to do so, please consider upgrading to our Premium Account.`,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Upgrade Now',
                onPress: () => console.log('Navigate to Upgrade Page'),
              },
              {
                text: 'Check Features',
                onPress: () => console.log('Navigate to Features Page'),
              },
            ],
            {cancelable: true},
          );
        }
      }
    }

    function handleCitiesSelection(_event: GestureResponderEvent): void {
      navigation.navigate('SelectingCitiesScreen', {
        cities: cities,
        code: code,
      });
    }

    return (
      <View style={styles.country_card}>
        <Pressable style={styles.flag_group} onPress={handleSelectCountries}>
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={handleSelectCountries}
            color="red"
          />
          <View style={styles.country_name}>
            <Text>{item.emoji}</Text>
            <Text style={{marginLeft: 12}}>{item.name}</Text>
          </View>
        </Pressable>

        <TouchableOpacity onPress={handleCitiesSelection}>
          <AntDesign name="arrowright" size={25} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBackPress}>
          <AntDesign name="arrowleft" size={25} />
        </TouchableOpacity>
        <TextInput
          placeholder={t('Search Countries')}
          onChangeText={debouncedSearch}
          style={styles.input_box}
        />
      </View>

      {/* Body component */}
      <View style={styles.countries}>
        <View style={styles.select_all_view}>
          <Text>Select All</Text>
          <Checkbox
            status={
              countries.current.length === countriesData.current.length
                ? 'checked'
                : 'unchecked'
            }
            onPress={handleAllSelectAtOnce}
            color="red"
            disabled={!locationSelectionDetails.isAllSelectionAllowedInCountry}
          />
        </View>
        {loading ? (
          <View style={styles.loading_container}>
            <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        ) : (
          <FlatList
            data={
              filteredUsers.length > 0 ? filteredUsers : countriesData.current
            }
            keyExtractor={item => item?.id?.toString()}
            renderItem={({item, index}) => (
              <CountryCard item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View style={styles.footer_view} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectingLocationScreen;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  countries: {
    width: width,
    height: height,
    alignItems: 'center',
  },
  header: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  country_card: {
    width: width,
    flexDirection: 'row',
    paddingHorizontal: width * 0.07,
    justifyContent: 'space-between',
    marginVertical: 5,
    alignItems: 'center',
  },
  country_name: {
    flexDirection: 'row',
    width: width * 0.4,
    marginLeft: 30,
    alignItems: 'center',
  },
  flag_group: {
    width: width * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_box: {
    marginLeft: 5,
    backgroundColor: '#fff',
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 5,
  },
  select_all_view: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.1,
    marginTop: 10,
  },
  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer_view: {
    height: 100,
  },
  select_all_checkbox: {
    backgroundColor: '#fff',
    marginRight: -(width * 0.05),
    padding: 5,
  },
});
