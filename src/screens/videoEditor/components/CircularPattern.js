import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Music from 'react-native-vector-icons/FontAwesome';
import Layer from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {set_play_video} from '../../../store/slices/content/videoSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';
import {setShow_recording} from '../../../store/slices/content/videoSlice';

const {width, height} = Dimensions.get('screen');
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {selectPlayVideo} from '../../../store/selectors';
import {icons} from '../../../assets/icons';

const CircularPattern = ({
  setVideo_path,
  video_path,
  openHandler_modal,
  setShow_media,
  setShow_editor,
  setOPen_top_sheet,
  setShow_music_selection,
  setText_overlay,
}) => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [layer, setLayer] = useState(false);
  const dispatch = useDispatch();
  const play_video = useAppSelector(selectPlayVideo);

  const handleLayer = () => {
    setLayer(!layer);
  };

  const handleRecording = () => {
    dispatch(setShow_recording());
  };

  const numItems = 5; // Number of items to display
  const radius = 95; // Radius of the circular arrangement
  const angleIncrement = Math.PI / 7; // Angle increment for each item

  const getItemPosition = index => {
    const angle = index * angleIncrement;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {x, y};
  };

  const getItemTextPosition = index => {
    const radius = 140;
    const angle = index * angleIncrement;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {x, y};
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable style={styles.import}>
          <Layer name={t('share-alternative')} size={20} color={'#fff'} />
        </Pressable>

        <View style={{flexDirection: 'row'}}>
          <View style={styles.outerCircle}>
            {/* Media button for selecting the media from users devices */}
            <View style={{marginBottom: 5}}>
              <TouchableOpacity
                style={styles.icon_style}
                onPress={() => {
                  setOPen_top_sheet(p => !p);
                }}>
                <Icon
                  name={t('perm-media')}
                  style={{fontSize: 25, color: 'white', marginLeft: 3}}
                />
                <Text style={{fontSize: 10, color: 'white'}}>{t('Media')}</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 5,
                paddingHorizontal: 8,
              }}>
              {/* Layer button for applying many layer on the video */}
              <TouchableOpacity onPress={handleLayer}>
                <View style={styles.icon_style}>
                  <Layer
                    name="layers"
                    style={{
                      fontSize: 25,
                      color: layer ? '#020202' : '#fff',
                      marginTop: 9,
                      marginLeft: 3,
                    }}
                  />
                  <Text style={{fontSize: 10, color: 'white'}}>
                    {t('Layer')}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Camera button for capturing the media from users devices */}
              <View style={styles.camera}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Animation', {
                      setVideo_path,
                      video_path,
                    })
                  }>
                  <Icon name="camera" style={{fontSize: 25, color: 'white'}} />
                </TouchableOpacity>
              </View>

              {/* Music button for selecting music from user devices */}
              <Pressable
                style={[styles.icon_style, {marginBottom: 5}]}
                onPress={() => {
                  setShow_music_selection(p => !p);
                }}>
                <Music
                  name="music"
                  style={{
                    fontSize: 25,
                    color: 'white',
                    marginTop: 9,
                    marginLeft: 6,
                  }}
                />
                <Text style={{fontSize: 10, color: 'white'}}>{t('Audio')}</Text>
              </Pressable>
            </View>

            {/* Recording button for recording music from microphone */}

            <Pressable style={styles.icon_style} onPress={handleRecording}>
              <Music
                name="microphone"
                style={{fontSize: 25, color: 'white', marginLeft: 3}}
              />
              <Text style={{fontSize: 10, color: 'white'}}>{t('Rec')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.play}>
          <Pressable
            onPress={() => {
              dispatch(set_play_video());
            }}>
            <Feather
              color={'#fff'}
              size={35}
              name={play_video ? 'play-circle' : 'pause-circle'}
            />
          </Pressable>
        </View>
      </View>

      <Modal visible={layer} transparent={true}>
        <Pressable style={{flex: 1}} onPress={handleLayer}>
          <View
            style={{
              width: 100,
              backgroundColor: 'red',
              position: 'absolute',
              top: 10,
              right: 210,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                justifyContent: 'space-evenly',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                padding: 10,
              }}
              onPress={() => {
                setShow_media(p => !p);
              }}>
              <Icon
                name="perm-media"
                style={{fontSize: 25, color: '#020202', marginLeft: 3}}
              />
              <Text style={{fontSize: 10, color: '#020202'}}>{t('Media')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                justifyContent: 'space-evenly',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                padding: 10,
              }}
              onPress={() => {
                navigation.navigate('RenderTextInput', {setText_overlay});
              }}>
              <MaterialCommunityIcons
                name="format-text"
                style={{fontSize: 25, color: '#020202', marginLeft: 3}}
              />
              <Text style={{fontSize: 10, color: '#020202'}}>Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                justifyContent: 'space-evenly',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                padding: 10,
              }}
              onPress={() => {
                navigation.navigate('RenderTextInput', {setText_overlay});
              }}>
              <MaterialCommunityIcons
                name="sticker"
                style={{fontSize: 25, color: '#020202', marginLeft: 3}}
              />
              <Text style={{fontSize: 10, color: '#020202'}}>Sticker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                justifyContent: 'space-evenly',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                padding: 10,
              }}
              onPress={() => {
                setShow_media(p => !p);
              }}>
              <Image source={icons.unity} style={{width: 25, height: 25}} />
              <Text style={{fontSize: 10, color: '#020202'}}>
                {t('Effect')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CircularPattern;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: height * 0.62,
    width: 250,
  },
  outerCircle: {
    width: 160,
    height: 160,
    borderRadius: 100,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 70,
  },

  camera: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#f24470',
    borderWidth: 2,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  import: {
    marginLeft: 185,
    top: 20,
  },
  play: {
    justifyContent: 'space-between',
    width: 200,
    bottom: 80,
    alignItems: 'flex-end',
  },
  icon_style: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 2 * 50,
    height: 2 * 50,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 70,
    transform: [{rotate: '130deg'}],
    left: 40,
  },
  item: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
