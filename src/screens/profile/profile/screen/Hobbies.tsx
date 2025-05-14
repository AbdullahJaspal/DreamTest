import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as userApi from '../../../../apis/userApi';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Checkbox} from 'react-native-paper';
import Toast from 'react-native-simple-toast';

import {update_hobbies} from '../../../../store/slices/user/my_dataSlice';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

interface LanguageItem {
  id: number;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileData {
  auth_token: string;
  [key: string]: any;
}

const Hobbies: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [languageData, setLanguageData] = useState<LanguageItem[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [searchedData, setSearchedData] = useState<LanguageItem[] | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const selectedLanguageRef = useRef<string[]>([]);
  const inputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();

  const myData = useAppSelector(selectMyProfileData) as UserProfileData;

  const getAllLanguageList = useCallback(async () => {
    try {
      const result = await userApi.getAllHobbiesList(pageNo, 40);
      setLanguageData(prev => [...prev, ...(result?.data || [])]);
    } catch (error) {
      console.log('Error generated while getting the hobbies details', error);
    } finally {
      setLoading(false);
    }
  }, [pageNo]);

  useEffect(() => {
    getAllLanguageList();
  }, [getAllLanguageList]);

  const handleEndReached = () => {
    if (!loading) {
      setPageNo(prev => prev + 1);
    }
  };

  const handleValueChange = async (value: string) => {
    try {
      if (value?.length > 0) {
        const result = await userApi.searchHobbies(value);
        setSearchedData(result?.data || null);
      } else {
        setSearchedData(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLanguageSave = () => {
    const data = {
      name: 'hobbies',
      value: JSON.stringify(selectedLanguageRef.current),
    };
    userApi
      .updateProfile(myData?.auth_token, data)
      .then(res => {
        dispatch(update_hobbies(data.value));
        navigation.goBack();
        Toast.show(res.message, Toast.SHORT);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  const RenderItem: React.FC<{item: LanguageItem}> = ({item}) => {
    const isCheckboxChecked = selectedLanguageRef.current.includes(item.name);
    const [selected, setSelected] = useState<boolean>(isCheckboxChecked);

    const handleOnValueChange = () => {
      if (isCheckboxChecked) {
        selectedLanguageRef.current = selectedLanguageRef.current.filter(
          lang => lang !== item.name,
        );
      } else {
        selectedLanguageRef.current.push(item.name);
      }
      setSelected(!selected);
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
        <Pressable onPress={handleLanguageSave}>
          <Text style={styles.saveText}>{t('Save')}</Text>
        </Pressable>
      </View>

      <View style={{flex: 1}}>
        <FlatList
          data={searchedData || languageData}
          renderItem={({item}) => <RenderItem item={item} />}
          onEndReached={handleEndReached}
          keyExtractor={index => index.toString()}
          ListEmptyComponent={() =>
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No data available</Text>
              </View>
            )
          }
          ListFooterComponent={() =>
            loading && (
              <View style={pageNo == 1 ? styles.loader : null}>
                <ActivityIndicator size="large" color="red" />
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Hobbies;

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
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: height,
  },
});
