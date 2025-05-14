import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import Header from '../profile/profile/components/Header';
import {useTranslation} from 'react-i18next';
const ProfileReportListSelectionScreen = ({route}) => {
  const navigation = useNavigation();
  const {profile_id} = route.params;
  const {t, i18n} = useTranslation();
  const data = [
    {id: 'spam', label: t('Spam')},
    {id: 'childSafety', label: t('Child Safety')},
    {id: 'hateSpeech', label: t('Hate Speech')},
    {id: 'illegalActivities', label: t('Illegal Activities')},
    {id: 'sexuallyExplicit', label: t('Sexually Explicit')},
    {id: 'falseInformation', label: t('False Information')},
    {id: 'fraudsAndScams', label: t('Frauds and Scams')},
    {id: 'intellectualProperty', label: t('Intellectual Property')},
    {id: 'bullyingAndHarassment', label: t('Bullying and Harassment')},
    {
      id: 'violenceAndDangerousActivities',
      label: t('Violence and Dangerous Activities'),
    },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text>{t(item.label)}</Text>

      <Pressable
        style={[
          styles.selectButton,
          {backgroundColor: selectedItem === item.id ? '#fa1302' : '#f7d2d0'},
        ]}
        onPress={() => toggleItem(item.id)}>
        <Text style={{color: 'white'}}>
          {selectedItem === item.id ? t('Selected') : t('Select')}
        </Text>
      </Pressable>
    </View>
  );

  const toggleItem = itemId => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
  };

  const otherReportHandler = () => {
    if (selectedItem) {
      navigation.navigate('ProfileReportScreen', {
        selected: selectedItem,
        profile_id: profile_id,
      });
    } else {
      Toast.show(t('Please select a reason'), Toast.LONG);
    }
  };

  return (
    <View style={styles.main_conatiner}>
      <Header headertext={t('Report List')} />
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <TouchableOpacity onPress={otherReportHandler}>
          <View
            style={[
              styles.submitButton,
              {
                backgroundColor: selectedItem ? 'red' : 'grey',
              },
            ]}>
            <Text style={styles.submitText}>{t('Next')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectButton: {
    backgroundColor: '#e65050',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: 'grey',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
  },
  main_conatiner: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
  },
});

export default ProfileReportListSelectionScreen;
