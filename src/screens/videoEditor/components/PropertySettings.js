import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {Switch} from 'react-native-paper';
import {Slider} from '@miblanchard/react-native-slider';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('window');

const PropertySettings = ({property_settings, setProperty_settings}) => {
  const {t, i18n} = useTranslation();

  const [selected_item, setSelected_item] = useState('');
  const handleBack = () => {
    setProperty_settings(p => ({
      ...p,
      visible: false,
    }));
  };
  const leftData = [
    {
      id: 1,
      name: t('Audio'),
      onPress: () => {
        setSelected_item(1);
      },
    },
    {
      id: 2,
      name: t('Video'),
      onPress: () => {
        setSelected_item(2);
      },
    },
    {
      id: 3,
      name: t('Editing'),
      onPress: () => {
        setSelected_item(3);
      },
    },
  ];

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={handleBack}>
          <Entypo name="cross" color={'white'} size={30} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 18, fontWeight: '700'}}>
          {t('Property Settings')}
        </Text>
      </View>
    );
  };
  const RightAudioContainer = () => {
    return (
      <ScrollView style={{flex: 1, marginBottom: 30}}>
        <View style={styles.right_container_view}>
          <Text style={styles.txt}>{t('Auto Master Volume')}</Text>
          <Switch />
        </View>

        <View style={styles.right_container_slider}>
          <View style={styles.right_container_view}>
            <Text style={styles.txt}>{t('Master Volume')}</Text>
          </View>
          <Slider />
        </View>

        <View style={styles.right_container_slider}>
          <View style={styles.right_container_view}>
            <Text style={styles.txt}>{t('Audio Fade-in (The Start)')}</Text>
            <Switch />
          </View>
          <Slider />
        </View>

        <View style={styles.right_container_slider}>
          <View style={styles.right_container_view}>
            <Text style={styles.txt}>{t('Audio Fade-in (The End)')}</Text>
            <Switch />
          </View>
          <Slider />
        </View>
      </ScrollView>
    );
  };

  const RightVideoContainer = () => {
    return (
      <ScrollView style={{flex: 1, marginBottom: 30}}>
        <View style={styles.right_container_slider}>
          <View style={styles.right_container_view}>
            <Text style={styles.txt}>{t('Video Fade-in (The Start)')}</Text>
            <Switch />
          </View>
          <Slider />
        </View>

        <View style={styles.right_container_slider}>
          <View style={styles.right_container_view}>
            <Text style={styles.txt}>{t('Video Fade-in (The End)')}</Text>
            <Switch />
          </View>
          <Slider />
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal visible={property_settings.visible} animationType="slide">
      <View style={styles.main_container}>
        <RenderHeader />

        <View style={{flexDirection: 'row'}}>
          {/* left container */}
          <View
            style={{
              width: 150,
              height: height - 40,
            }}>
            <FlatList
              data={leftData}
              renderItem={({item, index}) => (
                <Pressable onPress={item.onPress} style={styles.left_view}>
                  <Text style={styles.text}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>

          {/* right container */}
          <View style={{flex: 1}}>
            <RightAudioContainer />
          </View>
        </View>
      </View>
      <StatusBar hidden={false} />
    </Modal>
  );
};

export default PropertySettings;

const styles = StyleSheet.create({
  upper_goback: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    width: width,
    height: 40,
    paddingLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main_container: {
    flex: 1,
    // backgroundColor: '#180B25',
    backgroundColor: 'transparent',
  },
  left_view: {
    width: '100%',
    height: (height - 40) / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#fff',
    backgroundColor: '#2b1915',
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
  right_container_view: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#2b1915',
    padding: 8,
    margin: 5,
    borderRadius: 3,
  },
  txt: {
    color: 'white',
    fontSize: 18,
  },
  right_container_slider: {
    backgroundColor: '#2b1915',
    padding: 8,
    margin: 3,
    borderRadius: 3,
  },
});
