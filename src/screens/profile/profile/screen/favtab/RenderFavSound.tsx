import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ProfileScreenNavigationProps} from '../../../../../types/screenNavigationAndRoute';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';
import React, {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import FastImage from '@d11/react-native-fast-image';

interface RenderFavSoundProps {
  data?: string[];
}

interface RenderSoundProps {
  item: any;
  index: number;
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: (id: string | null) => void;
  durations: Record<string, number>;
  remainingTimes: Record<string, number>;
  setRemainingTime: (id: string, time: number) => void;
  loadingDurations: Record<string, boolean>;
}

const {width} = Dimensions.get('screen');

const RenderFavSound: React.FC<RenderFavSoundProps> = ({data}) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null,
  );
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [remainingTimes, setRemainingTimes] = useState<Record<string, number>>(
    {},
  );
  const [loadingDurations, setLoadingDurations] = useState<
    Record<string, boolean>
  >({});
  const navigation = useNavigation<ProfileScreenNavigationProps>();
  const {t} = useTranslation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update a specific remaining time
  const setRemainingTime = (id: string, time: number) => {
    setRemainingTimes(prev => ({
      ...prev,
      [id]: time,
    }));
  };

  // Load all durations when component mounts
  useEffect(() => {
    if (!data || data.length === 0) return;

    const loadAllDurations = async () => {
      // Initialize loading state for all items
      const initialLoadingState: Record<string, boolean> = {};
      data.forEach((item: any) => {
        const soundId = item?.extracted_audio?.audio_url;
        if (soundId) {
          initialLoadingState[soundId] = true;
        }
      });
      setLoadingDurations(initialLoadingState);

      // Load durations one by one
      for (const item of data) {
        const soundId = item?.extracted_audio?.audio_url;
        if (!soundId) continue;

        const audioUrl = `https://dpcst9y3un003.cloudfront.net/extracted_audio/${soundId}`;

        try {
          // Load the URL but don't play it
          SoundPlayer.loadUrl(audioUrl);

          // Wait a bit for loading
          await new Promise(resolve => setTimeout(resolve, 500));

          try {
            const info = await SoundPlayer.getInfo();
            if (info && info.duration) {
              setDurations(prev => ({
                ...prev,
                [soundId]: info.duration,
              }));
              setRemainingTimes(prev => ({
                ...prev,
                [soundId]: info.duration,
              }));
            }
          } catch (error) {
            console.log(`Error getting duration for ${soundId}`, error);
          }
        } catch (error) {
          console.log(`Error loading audio ${soundId}`, error);
        } finally {
          // Mark this item as loaded
          setLoadingDurations(prev => ({
            ...prev,
            [soundId]: false,
          }));
        }
      }
    };

    loadAllDurations();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data]);

  // Start timer when a sound is playing
  useEffect(() => {
    if (currentlyPlayingId) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Start a new timer that updates every second
      timerRef.current = setInterval(async () => {
        try {
          const info = await SoundPlayer.getInfo();
          if (info && durations[currentlyPlayingId]) {
            const remaining = durations[currentlyPlayingId] - info.currentTime;
            setRemainingTime(currentlyPlayingId, remaining > 0 ? remaining : 0);
          }
        } catch (error) {
          console.log('Error updating timer', error);
        }
      }, 1000);
    } else {
      // Stop timer when no sound is playing
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentlyPlayingId, durations]);

  // Handle navigation events
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (currentlyPlayingId) {
        SoundPlayer.stop();
        setCurrentlyPlayingId(null);
      }
    });

    return () => {
      unsubscribeBlur();
      if (currentlyPlayingId) {
        SoundPlayer.stop();
      }
    };
  }, [navigation, currentlyPlayingId]);

  const RenderSound: React.FC<RenderSoundProps> = ({
    item,
    currentlyPlayingId,
    setCurrentlyPlayingId,
    durations,
    remainingTimes,
    setRemainingTime,
    loadingDurations,
  }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const soundId = item?.extracted_audio?.audio_url;

    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${
        remainingSeconds < 10 ? '0' : ''
      }${remainingSeconds}`;
    };

    const playSound = async () => {
      try {
        setLoading(true);

        // Stop any currently playing sound
        if (currentlyPlayingId) {
          SoundPlayer.stop();
          setCurrentlyPlayingId(null);
          // Reset the previous playing sound's remaining time
          if (durations[currentlyPlayingId]) {
            setRemainingTime(currentlyPlayingId, durations[currentlyPlayingId]);
          }
          // Give more time for the player to fully stop
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Play the new sound
        SoundPlayer.playUrl(
          `https://dpcst9y3un003.cloudfront.net/extracted_audio/${soundId}`,
        );
        setCurrentlyPlayingId(soundId);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const pauseSound = () => {
      try {
        setLoading(true);
        SoundPlayer.stop();
        setCurrentlyPlayingId(null);

        // Reset remaining time to full duration when paused
        if (durations[soundId]) {
          setRemainingTime(soundId, durations[soundId]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const togglePlayPause = () => {
      if (!loading) {
        currentlyPlayingId === soundId ? pauseSound() : playSound();
      }
    };

    const handleSoundPress = () => {
      navigation.navigate('SoundMainScreen', {
        video_id: item?.extracted_audio?.video_id,
        original_video_id: item?.extracted_audio?.video_id,
      });
    };

    useEffect(() => {
      // Set up event listeners
      const finishedPlayingSubscription = SoundPlayer.addEventListener(
        'FinishedPlaying',
        ({success}) => {
          if (currentlyPlayingId === soundId) {
            setCurrentlyPlayingId(null);
            // Reset to full duration when finished
            if (durations[soundId]) {
              setRemainingTime(soundId, durations[soundId]);
            }
          }
        },
      );

      return () => {
        finishedPlayingSubscription.remove();
      };
    }, [currentlyPlayingId, soundId, durations]);

    return (
      <Pressable style={styles.main_container} delayLongPress={500}>
        <View style={styles.left_container_sound}>
          <FastImage
            source={{
              uri: `https://dpcst9y3un003.cloudfront.net/${item?.extracted_audio?.video?.thum}`,
            }}
            style={styles.sound_pic}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.author_details_view}>
            <Text>
              {t('Author')}: {item?.extracted_audio?.user?.nickname}
            </Text>
            <Text>{item?.extracted_audio?.user?.username}</Text>
            <Text>
              <Text style={styles.duration_txt}> {t('Duration')}:</Text>{' '}
              <Text style={styles.duration_time_txt}>
                {loadingDurations[soundId]
                  ? '--/-'
                  : remainingTimes[soundId] !== undefined
                  ? formatDuration(remainingTimes[soundId])
                  : t('Loading...')}
              </Text>
            </Text>
          </View>

          <Pressable
            onPress={togglePlayPause}
            style={[styles.sound_pic, styles.player_details]}>
            {loading ? (
              <ActivityIndicator size={'small'} color={'#fff'} />
            ) : (
              <AntDesign
                name={currentlyPlayingId === soundId ? 'pause' : 'play'}
                size={20}
                color={'#fff'}
              />
            )}
          </Pressable>
        </View>

        <Pressable onPress={handleSoundPress}>
          <AntDesign name="right" size={15} color={'#000'} />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(_item, index) => index.toString()}
        ListFooterComponent={() => <View style={styles.footer_view} />}
        renderItem={({item, index}) => (
          <RenderSound
            item={item}
            index={index}
            currentlyPlayingId={currentlyPlayingId}
            setCurrentlyPlayingId={setCurrentlyPlayingId}
            durations={durations}
            remainingTimes={remainingTimes}
            setRemainingTime={setRemainingTime}
            loadingDurations={loadingDurations}
          />
        )}
      />
    </>
  );
};

export default RenderFavSound;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sound_pic: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  left_container_sound: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author_details_view: {
    marginLeft: 15,
  },
  player_details: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  footer_view: {
    marginBottom: 60,
  },
  duration_txt: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  duration_time_txt: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
});
