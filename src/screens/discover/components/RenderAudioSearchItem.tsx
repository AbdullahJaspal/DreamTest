import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import SoundPlayer from 'react-native-sound-player';
import {useTranslation} from 'react-i18next';

interface RenderAudioSearchItemProps {
  item: any;
}

const RenderAudioSearchItem = () => {
  const {t, i18n} = useTranslation();
  const [sound_playing, setSound_playing] = useState(false);
  const [loading, setLoading] = useState(false);

  const playSound = () => {
    try {
      setLoading(true);
      SoundPlayer.playUrl(
        `https://dpcst9y3un003.cloudfront.net/extracted_audio/${item[0]?.audio_url}`,
      );
      setLoading(false);
      setSound_playing(true);
    } catch (error) {
      console.log(error);
    }
  };
  const pauseSound = () => {
    try {
      setLoading(true);
      SoundPlayer.pause();
      setLoading(false);
      setSound_playing(false);
    } catch (error) {
      console.log(error);
    }
  };
  const togglePlayPause = () => {
    if (!loading) {
      if (sound_playing) {
        pauseSound();
      } else {
        playSound();
      }
    }
  };

  return (
    <View>
      <Text>{t('RenderAudioSearchItem')}</Text>
    </View>
  );
};

export default RenderAudioSearchItem;

const styles = StyleSheet.create({});
