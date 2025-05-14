import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLOR, SPACING} from '../../../configs/styles';
import ListView from '../../../components/ListView';
import {useIsFocused} from '@react-navigation/native';
import * as audioApi from '../../../apis/audio.api';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SoundPlayer from 'react-native-sound-player';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {t} from 'i18next';
import EmptyScreen from '../../../utils/emptyScreen';
import {selectTxtSearch} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';

const {height, width} = Dimensions.get('screen');

const Audio = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const isFocusTab = useIsFocused();
  const txtSearch = useAppSelector(selectTxtSearch);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(false);
  const [audios, setAudios] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const getAudios = await audioApi.getallaudiodetail(
        txtSearch,
        pageNo,
        pageSize,
      );
      const filteredData = getAudios.payload.filter(item => item.length > 0);
      setAudios(filteredData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const fetchdatabysound = useCallback(video_id => {
    try {
      navigation.navigate('SoundMainScreen', {video_id: video_id});
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (isFocusTab) {
      fetchData();
    }
  }, [isFocusTab, fetchData]);

  return (
    <View style={styles.container}>
      {!loading && audios.length === 0 && (
        <EmptyScreen
          message="You're all caught up!"
          imageSource={icons.headphones}
          imageStyle={{tintColor: '#ccc', width: 50, height: 50}} // Example of overriding styles
        />
      )}
      {loading ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      ) : (
        <ListView
          data={audios}
          renderItem={({item}) => (
            <ItemSearchAudio item={item} fetchdatabysound={fetchdatabysound} />
          )}
        />
      )}
    </View>
  );
};

export default Audio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: SPACING.S2,
  },
  itemsearchaudiocontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: 'gray',
    width: width,
    paddingHorizontal: 10,
  },
  item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
  },
  imageContainer: {
    marginRight: 10,
    width: width * 0.2,
    position: 'relative',
    zIndex: -99,
  },
  textContainer: {
    width: width * 0.4,
  },
  statsContainer: {
    width: width * 0.25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgstyle: {
    width: width * 0.13,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 13,
  },
  player_details: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sound_pic: {
    width: width * 0.13,
    height: 70,
    borderRadius: 10,
  },
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ItemSearchAudio = ({item, fetchdatabysound}) => {
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
    <View style={styles.itemsearchaudiocontainer}>
      <Pressable
        onPress={() => {
          fetchdatabysound(item[0]?.video_id);
        }}>
        <View style={styles.item_container}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: item[0]?.user?.profile_pic}}
              style={styles.imgstyle}
            />
          </View>
          <Pressable
            onPress={togglePlayPause}
            style={[styles.sound_pic, styles.player_details]}>
            {loading ? (
              <ActivityIndicator size={'small'} color={'#fff'} />
            ) : (
              <AntDesign
                name={sound_playing ? 'pause' : 'play'}
                size={30}
                color={'#fff'}
              />
            )}
          </Pressable>

          <View style={styles.textContainer}>
            <View>
              <Text style={{color: '#000', fontSize: 15}}>
                {item[0]?.user?.username}
              </Text>
            </View>

            <View>
              <Text>
                {t('Author')}: {item[0]?.user?.nickname}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View>
              <Text>{item[0].total_video}</Text>
            </View>

            <View style={{paddingHorizontal: 3}}>
              <Text style={{fontSize: 15}}>{t('Videos')}</Text>
            </View>
          </View>

          <View>
            <Image source={icons.right} style={styles.iconstyle} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};
