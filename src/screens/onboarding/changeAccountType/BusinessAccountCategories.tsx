import React, {useState} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Header from '../../profile/profile/components/Header';
import {BusinessAccountNavigationProps} from '../../../navigations/types/OnboardingNavigationAndRoute';

const {width} = Dimensions.get('screen');

interface Category {
  id: number;
  label: string;
}

const BusinessAccountCategories: React.FC = () => {
  const {t} = useTranslation();

  const [data] = useState<Category[]>([
    {id: 1, label: t('Art & Crafts')},
    {id: 2, label: t('Automotive & Transportation')},
    {id: 3, label: t('Baby')},
    {id: 4, label: t('Beauty')},
    {id: 5, label: t('Clothing& Accessories')},
    {id: 6, label: t('Education and Traning')},
    {id: 7, label: t('Electronics')},
    {id: 8, label: t('Finance and Investment')},
    {id: 9, label: t('Food & Beverage')},
    {id: 10, label: t('Gaming')},
    {id: 11, label: t('Health & insurance')},
    {id: 12, label: t('Home,Furniture & Appliances')},
    {id: 13, label: t('Machinery & Equipment')},
    {id: 14, label: t('Personal Blog')},
    {id: 15, label: t('Professional Services')},
    {id: 16, label: t('Public Administration')},
    {id: 17, label: t('Real Estate')},
    {id: 18, label: t('Restaurant & Bars')},
    {id: 19, label: t('Shopping & Apps')},
    {id: 20, label: t('Software & Apps')},
    {id: 21, label: t('Sports,Fitness & outdoors')},
    {id: 22, label: t('Travel & tourism')},
    {id: 23, label: t('Others')},
  ]);

  const navigation = useNavigation<BusinessAccountNavigationProps>();
  const [selected_item, setSelected_item] = useState<Category | null>(null);

  const renderItem = ({item}: {item: Category}) => {
    const handleSelect = () => {
      setSelected_item(selected_item?.id === item.id ? null : item);
    };

    return (
      <Pressable style={styles.list_view} onPress={handleSelect}>
        <Text style={styles.itemLabel}>{item?.label}</Text>

        <View style={styles.checkboxContainer}>
          <View
            style={[
              styles.checkbox,
              {
                borderColor: selected_item?.id === item.id ? 'red' : 'gray',
              },
            ]}>
            {selected_item?.id === item.id && (
              <View style={styles.checkedCircle} />
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{t('Choose a category')}</Text>
      <Text style={styles.headerDescription}>
        {t(
          'Select the Category that best describes your business account. This',
        )}
        {t("Category won't be displayed publicly")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.main_container}>
      <Header headertext={'Business Account'} />
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
      />
      {selected_item && (
        <TouchableOpacity
          style={styles.next_button}
          onPress={() => navigation.navigate('BusinessAccount')}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default React.memo(BusinessAccountCategories);

const styles = StyleSheet.create({
  list_view: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 0.5,
    paddingTop: 15,
  },
  itemLabel: {
    color: 'black',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
  },
  checkedCircle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'red',
    top: 1.5,
    left: 1.5,
  },
  headerContainer: {
    marginLeft: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '800',
    paddingBottom: 10,
    paddingTop: 10,
    color: 'black',
  },
  headerDescription: {
    fontSize: 12,
    color: '#a2a6a3',
    fontWeight: '500',
  },
  main_container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  next_button: {
    position: 'absolute',
    bottom: 70,
    right: 30,
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  nextButtonText: {
    color: '#fff',
  },
});
