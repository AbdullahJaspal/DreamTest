import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as userApi from '../../../../apis/userApi';
import {useNavigation} from '@react-navigation/native';
import {Checkbox} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {debounce} from '../../../../utils/debounce';
import {update_language} from '../../../../store/slices/user/my_dataSlice';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

interface LanguageDataProps {
  code: string;
  createdAt: string;
  id: number;
  name: string;
  updatedAt: string;
}

const {width} = Dimensions.get('screen');

const MasteryOfLanguage: React.FC = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [languageData, setLanguageData] = useState<LanguageDataProps[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchedData, setSearchedData] = useState<LanguageDataProps[] | null>(
    null,
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const inputRef = useRef<TextInput | null>(null);
  const myData = useAppSelector(selectMyProfileData);

  const getAllLanguageList = async () => {
    try {
      const result = await userApi.getLanguageAllLanguageList(pageNo, 20);
      setLanguageData(prev => [...prev, ...result?.data]);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  useEffect(() => {
    getAllLanguageList();
  }, [pageNo]);

  const handleEndReached = () => {
    setPageNo(prev => prev + 1);
  };

  const handleValueChange = debounce(async (value: string) => {
    try {
      if (value.trim().length > 0) {
        const result = await userApi.searchLanguage(value);
        setSearchedData(result?.data);
      } else {
        setSearchedData([]);
      }
    } catch (error) {
      console.error('Error searching languages:', error);
    }
  }, 300);

  const handleLanguageSave = () => {
    const data = {
      name: 'language',
      value: JSON.stringify(selectedLanguages),
    };
    userApi
      .updateProfile(myData?.auth_token, data)
      .then(res => {
        dispatch(update_language(data.value));
        navigation.goBack();
        Toast.show(res.message, Toast.SHORT);
      })
      .catch(err => {
        console.error('Error updating profile:', err);
      });
  };

  const RenderItem = ({item}: {item: LanguageDataProps}) => {
    const isCheckboxChecked = selectedLanguages.includes(item.name);

    const handleOnValueChange = () => {
      setSelectedLanguages(prev =>
        isCheckboxChecked
          ? prev.filter(lang => lang !== item.name)
          : [...prev, item.name],
      );
    };

    return (
      <Pressable style={styles.itemView} onPress={handleOnValueChange}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Checkbox
          status={isCheckboxChecked ? 'checked' : 'unchecked'}
          onPress={handleOnValueChange}
          color="red"
          uncheckedColor="black"
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back">
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
        <Pressable
          onPress={handleLanguageSave}
          accessibilityLabel="Save selected languages">
          <Text style={styles.txt}>{t('Save')}</Text>
        </Pressable>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          data={searchedData || languageData}
          renderItem={({item}) => <RenderItem item={item} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('No languages found')}.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MasteryOfLanguage;

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
    borderRadius: 8,
    height: 40,
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
  txt: {
    fontSize: 18,
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'gray',
  },
});
