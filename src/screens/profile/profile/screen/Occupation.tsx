import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {updateProfile} from '../../../../apis/userApi';
import {update_occupation} from '../../../../store/slices/user/my_dataSlice';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import * as userApi from '../../../../apis/userApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

interface OccupationData {
  createdAt: string;
  description: string | null;
  id: number;
  name: string;
  parentId: number | null;
  updatedAt: string;
  userId: number | null;
}

interface RootState {
  my_data: {
    my_profile_data: {
      auth_token: string | null;
    };
  };
}

const Occupation: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<OccupationData[]>([]);
  const [subCategories, setSubCategories] = useState<OccupationData[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<OccupationData | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<OccupationData | null>(null);

  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (selectedCategory && selectedSubCategory) {
      const value = selectedSubCategory.name;
      dispatch(update_occupation(value));
      const data = {name: 'occupation', value};
      try {
        setLoading(true);
        if (my_data?.auth_token) {
          const res = await updateProfile(my_data.auth_token, data);
          if (res?.message) {
            Toast.show(res.message, Toast.SHORT);
          }
        }
      } catch (err) {
        console.error('Error updating profile:', err);
        Toast.show('Failed to update profile', Toast.SHORT);
      } finally {
        setLoading(false);
        navigation.goBack();
      }
    } else {
      Toast.show('Please select a category and subcategory.', Toast.SHORT);
    }
  };

  const getOccupations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userApi.getOccupations();
      const allOccupations = response.occupations || [];
      setCategories(
        allOccupations.filter(
          (item: {parentId: number | null}) => item.parentId === null,
        ),
      );
      setSubCategories(
        allOccupations.filter(
          (item: {parentId: number | null}) => item.parentId !== null,
        ),
      );
    } catch (error) {
      console.error('Error fetching occupations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getOccupations();
  }, [getOccupations]);

  const renderCategory = ({item}: {item: OccupationData}) => {
    const isSelected = selectedCategory?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item)}
        style={[
          styles.categoryItem,
          {backgroundColor: isSelected ? '#d9f0fc' : 'white'},
        ]}>
        <Text style={{color: isSelected ? 'blue' : 'black'}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderSubCategory = ({item}: {item: OccupationData}) => {
    const isSelected = selectedSubCategory?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedSubCategory(item)}
        style={[
          styles.subCategoryItem,
          {backgroundColor: isSelected ? '#f7d9d9' : 'white'},
        ]}>
        <Text style={{color: isSelected ? 'red' : 'black'}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headertext={t('Occupation')}
        thirdButton={true}
        onPress={handleConfirm}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{t('Categories')}</Text>
            <FlatList
              data={categories}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCategory}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{t('Subcategories')}</Text>
            {selectedCategory ? (
              <FlatList
                data={subCategories.filter(
                  item => item.parentId === selectedCategory.id,
                )}
                keyExtractor={item => item.id.toString()}
                renderItem={renderSubCategory}
                contentContainerStyle={styles.subCategoryList}
              />
            ) : (
              <Text style={styles.placeholderText}>
                {t('Select a category to view subcategories')}
              </Text>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Occupation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginBottom: 5,
  },
  categoryList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  subCategoryList: {
    paddingHorizontal: 15,
  },
  subCategoryItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  scrollView: {
    paddingBottom: 20,
  },
});
