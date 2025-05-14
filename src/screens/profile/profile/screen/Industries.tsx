import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CommonActions, useNavigation} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('window');

const Industries: React.FC = ({route}) => {
  const {t, i18n} = useTranslation();

  const {list, setList} = route.params || {};
  const navigation = useNavigation();
  const [industries, setindustries] = useState(null);
  const [company_name, setcompany_name] = useState(null);
  const [occupation, setoccupation] = useState(null);
  const [show_company_modal, setShow_company_modal] = useState(false);

  const handleIndustries = () => {
    navigation.navigate('Occupation', {setindustries, setoccupation});
  };
  const handleCompanyModalPress = () => {
    setShow_company_modal(false);
  };

  const handleOccupationPress = value => {
    const updatedList = list.map(item => {
      if (item.name === 'Occupation') {
        return {
          ...item,
          value: value,
        };
      }
      return item;
    });

    setList(updatedList);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={20} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginTop: 0}]}>
            {t('Occupation')}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleOccupationPress(industries);
          }}>
          <Text style={[styles.headerText, {color: 'rgba(26, 148, 236, 1)'}]}>
            {t('Compl')}...
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.selecting_industries}>
          <Text
            style={{
              fontSize: 16,
            }}>
            {t('Please Select Industry')}
          </Text>
          <TouchableOpacity
            onPress={handleIndustries}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {industries && (
              <Text
                style={{marginRight: 10, fontSize: 16, width: width * 0.35}}>
                {industries}
              </Text>
            )}
            <AntDesign name="right" />
          </TouchableOpacity>
        </View>

        <View style={styles.selecting_industries}>
          <Text
            style={{
              fontSize: 16,
            }}>
            {t('Company')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShow_company_modal(true);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {company_name && (
              <Text
                style={{marginRight: 10, width: width * 0.35, fontSize: 16}}>
                {company_name}
              </Text>
            )}
            {!company_name && (
              <Text
                style={{marginRight: 10, width: width * 0.35, fontSize: 16}}>
                {t('Please enter Company name')}
              </Text>
            )}
            <AntDesign name="right" />
          </TouchableOpacity>
        </View>

        <View style={styles.selecting_industries}>
          <Text
            style={{
              fontSize: 16,
            }}>
            {t('Occupation')}
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {occupation && (
              <Text style={{marginRight: 30, fontSize: 16}}>{occupation}</Text>
            )}
            {!occupation && (
              <Text style={{marginRight: 30, fontSize: 16}}>
                {t('Occupation')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* modal for displaying the company name */}

      <Modal visible={show_company_modal} transparent={true}>
        <View style={styles.nickname_modal}>
          <Text style={styles.modal_text}>{t('Company Name')}</Text>
          <View style={styles.modal_textInput}>
            <TextInput
              placeholder={t('Company name')}
              style={{paddingBottom: -10}}
              value={company_name}
              onChangeText={val => {
                setcompany_name(val);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handleCompanyModalPress}
            style={styles.modal_button}>
            <Text style={styles.modal_button_text}>{t('Save')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Industries;

const styles = StyleSheet.create({
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
  selecting_industries: {
    flexDirection: 'row',
    width: width * 0.95,
    paddingHorizontal: width * 0.025,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    padding: 13,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    marginTop: 15,
  },
  body: {
    alignItems: 'center',
    width: width,
  },
  nickname_modal: {
    width: width * 0.6,
    height: height * 0.22,
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    paddingTop: 5,
  },
  modal_text: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  modal_textInput: {
    borderBottomWidth: 0.5,
    width: width * 0.6,
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  modal_button: {
    backgroundColor: '#1A94EC',
    width: width * 0.55,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 5,
    marginTop: height * 0.04,
  },
  modal_button_text: {
    color: 'white',
  },
});
