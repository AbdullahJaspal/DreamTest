import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MicOn from '../../assets/MicOn';
import MicOff from '../../assets/MicOff';
import VideoOn from '../../assets/VideoOn';
import VideoOff from '../../assets/VideoOff';
import CallDeclined from '../../assets/CallDeclined';
import SpeakerOff from '../../assets/SpeakerOff';
import SpeakerOn from '../../assets/SpeakerOn';
import {useTranslation} from 'react-i18next';
import styles from '../styles/audioCallStyles';
import {icons} from '../../../../assets/icons';
import Text from '../../../../components/Text';
import {images} from '../../../../assets/images';

const {width, height} = Dimensions.get('screen');

const AudioCall = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const user_data = route?.params?.user_data;
  const [data, setData] = useState([
    {
      id: 1,
      name: 'speaker',
      isActive: true,
      icon_on: <SpeakerOn />,
      icon_of: <SpeakerOff />,
      onPress: () => {
        setData(prevData =>
          prevData.map(item =>
            item.id === 1 ? {...item, isActive: !item.isActive} : item,
          ),
        );
      },
    },
    {
      id: 2,
      name: 'video',
      isActive: true,
      icon_on: <VideoOn />,
      icon_of: <VideoOff />,
      onPress: () => {
        setData(prevData =>
          prevData.map(item =>
            item.id === 2 ? {...item, isActive: !item.isActive} : item,
          ),
        );
      },
    },
    {
      id: 3,
      name: 'mic',
      isActive: true,
      icon_on: <MicOn />,
      icon_of: <MicOff />,
      onPress: () => {
        setData(prevData =>
          prevData.map(item =>
            item.id === 3 ? {...item, isActive: !item.isActive} : item,
          ),
        );
      },
    },
    {
      id: 4,
      name: 'declined',
      isActive: true,
      icon_on: <CallDeclined />,
      icon_of: '',
      onPress: () => {
        navigation.goBack();
      },
    },
  ]);

  return (
    <View style={styles.main_conatiner}>
      <ImageBackground style={{flex: 1}} source={images.callBackgroundDark}>
        <View style={styles.upper_container}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <AntDesign name="arrowleft" color={'#fff'} size={30} />
          </Pressable>
          <Text style={styles.txt}>{t('Audio Call')}</Text>
        </View>

        <View
          style={{
            marginTop: height * 0.1,
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.images}>
            <Image
              source={
                user_data?.profile_pic
                  ? {uri: user_data?.profile_pic}
                  : icons.user
              }
              style={styles.images}
            />
          </View>
          <Text style={styles.text}>{user_data?.nickname}</Text>

          <Text style={styles.ringing}>{t('Ringing')}</Text>
        </View>

        <View style={styles.bottom_container}>
          <FlatList
            data={data}
            horizontal={true}
            renderItem={({item, index}) => (
              <Pressable style={styles.icon} onPress={item?.onPress}>
                <Pressable style={styles.icon} onPress={item?.onPress}>
                  {item.isActive ? item.icon_on : item.icon_of}
                </Pressable>
              </Pressable>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default AudioCall;
