import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Pressable,
  GestureResponderEvent,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Checkbox} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useTranslation} from 'react-i18next';
import * as countryApi from '../../apis/countryApi';
import {debounce} from '../../utils/debounce';

import {SelectingCitiesScreenRouteProps} from '../../types/screenNavigationAndRoute';
import {locationSelection} from '../../store/selectors';
import {InitialState as LocationSelectionProps} from '../../store/slices/common/locationSlice';
import {useAppSelector} from '../../store/hooks';

interface CitiesData {
  active: number;
  country_code: string;
  country_id: number;
  created_at: string;
  flag: number;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  state_code: string;
  state_id: number;
  updated_on: string;
  wikiDataId: string;
}

interface CitiesCardProps {
  item: CitiesData;
  index: number;
}

const {width, height} = Dimensions.get('window');

const SelectingCitiesScreen = () => {
  const {t, i18n} = useTranslation();
  const route = useRoute<SelectingCitiesScreenRouteProps>();
  const locationSelectionDetails: LocationSelectionProps =
    useAppSelector(locationSelection);
  const {code, cities} = route.params;
  const citiesData = useRef<CitiesData[]>([]);
  const navigation = useNavigation();
  const [filteredUsers, setFilteredUsers] = useState<CitiesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllCitiesByCountryCode = useCallback(async () => {
    try {
      const result = await countryApi.getCitiesByCountryCode(code);
      citiesData.current = result.payload;
    } catch (error) {
      console.log('Error generated while getting the cities details', error);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    getAllCitiesByCountryCode();
  }, [getAllCitiesByCountryCode]);

  const handleSearch = (text: string): void => {
    if (text === '') {
      setFilteredUsers([]);
      return;
    }
    const filteredData = citiesData.current.filter(user =>
      user.name.toLowerCase().startsWith(text.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  };
  const debouncedSearch = useCallback(debounce(handleSearch, 300), [
    handleSearch,
  ]);

  const CitiesCard: React.FC<CitiesCardProps> = ({item, index}) => {
    const id = item?.id;
    const [isSelected, setSelected] = useState(cities.current.includes(id));

    function handleSelectCities(): void {
      if (isSelected) {
        cities.current = cities.current.filter(v => v !== id);
        setSelected(false);
      } else {
        if (
          cities.current.length <
          locationSelectionDetails.noOFCitiesAllowedToSelect
        ) {
          cities.current = [...cities.current, id];
          setSelected(true);
        } else {
          Alert.alert(
            'Information',
            `You can not select more than ${locationSelectionDetails.noOFCountryAllowedToSelect} cities. If you want to do so, please consider upgrading to our Premium Account.`,
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

    return (
      <Pressable style={styles.cities_card} onPress={handleSelectCities}>
        <Text style={styles.text}>{item.name}</Text>
        <Checkbox
          status={isSelected ? 'checked' : 'unchecked'}
          onPress={handleSelectCities}
          color="red"
        />
      </Pressable>
    );
  };

  const handleAllSelectAtOnce = (): void => {
    const allSelected = cities.current.length === citiesData.current.length;
    if (allSelected) {
      cities.current = [];
    } else {
      cities.current = citiesData.current.map(item => item.id);
    }
    setFilteredUsers([...filteredUsers]);
  };

  function handleGoBackPress(_event: GestureResponderEvent): void {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBackPress}>
          <AntDesign name="arrowleft" size={25} />
        </TouchableOpacity>

        <TextInput
          placeholder={t('Search')}
          onChangeText={debouncedSearch}
          style={styles.input_box}
        />
      </View>

      <View style={{flex: 1}}>
        <View style={styles.select_all_view}>
          <Text>{'Select All'}</Text>
          <Checkbox
            status={
              cities.current.length === citiesData.current.length
                ? 'checked'
                : 'unchecked'
            }
            onPress={handleAllSelectAtOnce}
            color="red"
            disabled={!locationSelectionDetails.isAllSelectionAllowedInCities}
          />
        </View>

        {loading ? (
          <View style={styles.loading_container}>
            <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        ) : (
          <FlatList
            data={filteredUsers.length > 0 ? filteredUsers : citiesData.current}
            keyExtractor={item => item?.id?.toString()}
            renderItem={({item, index}) => (
              <CitiesCard item={item} index={index} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectingCitiesScreen;

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
  cities_card: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.1,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    color: '#020202',
  },
  select_all_view: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.1,
    marginTop: 10,
  },
  input_box: {
    marginLeft: 5,
    backgroundColor: '#fff',
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 5,
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
