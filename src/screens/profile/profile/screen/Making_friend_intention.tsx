import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Body from '../../../../components/Body/Body.components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {updateProfile} from '../../../../apis/userApi';
import {update_making_friend_intention} from '../../../../store/slices/user/my_dataSlice';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const Making_friend_intention = () => {
  const {t, i18n} = useTranslation();
  const [age, setAge] = useState('26+');
  const [location, setLocation] = useState('Local');
  const [prefer, setPrefer] = useState('Hot chat');
  const navigation = useNavigation();
  const my_data = useAppSelector(selectMyProfileData);
  const dispatch = useDispatch();

  const handleMakingFriendIntentionPress = () => {
    const name = 'making_friend_intention',
      value = JSON.stringify([age, location, prefer]);
    const data = {
      name,
      value,
    };
    updateProfile(my_data?.auth_token, data)
      .then(res => {
        dispatch(update_making_friend_intention(value));
        Toast.show(res.message, Toast.SHORT);
      })
      .catch(err => {
        console.log(err.message);
      });
    navigation.goBack();
  };

  return (
    <Body style={{flex: 1}}>
      <Header
        headertext={t('Making Friend Intention')}
        thirdButton={true}
        onPress={handleMakingFriendIntentionPress}
      />

      <Body applyPadding={false}>
        <Body applyPadding={false} style={styles.age_main_container}>
          <Text style={styles.txt}>{t('Age')}</Text>
          <Body applyPadding={false} style={styles.age_card}>
            <TouchableOpacity
              onPress={() => {
                setAge('18-26');
              }}
              style={[
                styles.age_button,
                {
                  backgroundColor:
                    age == '18-26' ? 'red' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}>
              <Text>{t('18-26')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAge('26+');
              }}
              style={[
                styles.age_button,
                {
                  backgroundColor: age == '26+' ? 'red' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}>
              <Text>{t('26+')}</Text>
            </TouchableOpacity>
          </Body>
        </Body>

        <Body applyPadding={false} style={styles.age_main_container}>
          <Text style={styles.txt}>{t('Location')}</Text>
          <Body applyPadding={false} style={styles.age_card}>
            <TouchableOpacity
              onPress={() => {
                setLocation('Overseas');
              }}
              style={[
                styles.age_button,
                {
                  backgroundColor:
                    location == 'Overseas' ? 'red' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}>
              <Text>{t('Overseas')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLocation('Local');
              }}
              style={[
                styles.age_button,
                {
                  backgroundColor:
                    location == 'Local' ? 'red' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}>
              <Text>{t('Local')}</Text>
            </TouchableOpacity>
          </Body>
        </Body>

        <Body applyPadding={false} style={styles.age_main_container}>
          <Text style={styles.txt}>{t('Prefer')}</Text>
          <Body applyPadding={false} style={styles.age_card}>
            <TouchableOpacity
              onPress={() => {
                setPrefer('Soulmate');
              }}
              style={[
                styles.age_button,
                {
                  backgroundColor:
                    prefer == 'Soulmate' ? 'red' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}>
              <Text>{t('Soulmate')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPrefer('Hot chat');
              }}
              style={[
                styles.age_button,
                {
                  backgroundColor:
                    prefer == 'Hot chat' ? 'red' : 'rgba(0, 0, 0, 0.4)',
                },
              ]}>
              <Text>{t('Hot chat')}</Text>
            </TouchableOpacity>
          </Body>
        </Body>
      </Body>
    </Body>
  );
};

export default Making_friend_intention;

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
  age_button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 5,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginHorizontal: 10,
  },
  age_card: {
    flexDirection: 'row',
    width: width * 0.38,
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 10,
  },
  age_main_container: {
    width: width,
    paddingLeft: 40,
    marginTop: 15,
  },
});
