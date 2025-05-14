import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {setShow_recording} from '../../../store/slices/content/videoSlice';
import {useTranslation} from 'react-i18next';
import {json} from '../../../assets/json';

const Recording = () => {
  const {t, i18n} = useTranslation();

  const [recording, setRecording] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const dispatch = useDispatch();

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setShow_recording());
          }}
          style={{
            position: 'absolute',
            left: 0,
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
        <Text style={{color: '#fff', fontWeight: '700', fontSize: 16}}>
          {t('Record')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.main_container}>
      <RenderHeader />
      <Pressable
        style={styles.volume}
        onPress={() => {
          setSpeaker(p => !p);
        }}>
        <MaterialCommunityIcons
          name={speaker ? 'volume-high' : 'volume-off'}
          size={30}
          color={'#fff'}
        />
      </Pressable>
      <View style={styles.recording_container}>
        <LottieView
          source={json.recording}
          autoPlay={recording}
          loop={recording}
          style={{
            width: 100,
            height: 100,
          }}
        />
        <Pressable
          style={[
            styles.start_button,
            {
              backgroundColor: recording
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(0, 0, 0, 0.3)',
            },
          ]}
          onPress={() => {
            setRecording(p => !p);
          }}>
          <Text
            style={{
              color: '#fff',
            }}>
            {recording ? 'Stop' : 'Start'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Recording;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  upper_goback: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 250,
    height: 40,
    paddingLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volume: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    paddingTop: 5,
  },
  start_button: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 20,
  },
});
