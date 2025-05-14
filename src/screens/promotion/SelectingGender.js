import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Body from '../../components/Body/Body.components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Checkbox} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

const SelectingGender = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [male, setMale] = useState(true);
  const [female, setFemale] = useState(true);
  const [notPrefer, setNotPrefer] = useState(true);

  const handleConfirm = () => {};

  return (
    <Body>
      <Body applyPadding={false} style={styles.header}>
        <Body applyPadding={false} style={styles.leftHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={20} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginTop: 0}]}>{t('Gender')}</Text>
        </Body>
        <TouchableOpacity onPress={handleConfirm}>
          <Text style={[styles.headerText, {color: 'rgba(26, 148, 236, 1)'}]}>
            Compl...
          </Text>
        </TouchableOpacity>
      </Body>

      <View style={{width: width, paddingHorizontal: width * 0.2}}>
        <View style={styles.gender_selection}>
          <Text>{t('Male')}</Text>
          <Checkbox
            status={male ? 'checked' : 'unchecked'}
            onPress={() => setMale(!male)}
            color="red"
            uncheckedColor="black"
          />
        </View>

        <View style={styles.gender_selection}>
          <Text>{t('Female')}</Text>
          <Checkbox
            status={female ? 'checked' : 'unchecked'}
            onPress={() => setFemale(!female)}
            color="red"
            uncheckedColor="black"
          />
        </View>

        <View style={styles.gender_selection}>
          <Text>{t('Not Prefer')}</Text>
          <Checkbox
            status={notPrefer ? 'checked' : 'unchecked'}
            onPress={() => setNotPrefer(!notPrefer)}
            color="red"
            uncheckedColor="black"
          />
        </View>
      </View>
    </Body>
  );
};

export default SelectingGender;

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
  gender_selection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
