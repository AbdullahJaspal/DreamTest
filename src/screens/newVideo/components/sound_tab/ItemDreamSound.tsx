import React, {useEffect, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {AudioItem} from '../../types/Audio';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import * as soundApi from '../../../../apis/sound';
import SoundPlayer from 'react-native-sound-player';
import {useAppSelector} from '../../../../store/hooks';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ConfirmModal from '../../../../components/ConfirmModal';
import {selectMyProfileData} from '../../../../store/selectors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  addFavouriteSound,
  removeFavouriteSound,
} from '../../../../store/slices/ui/indexSlice';
import FastImage from '@d11/react-native-fast-image';

interface ItemDreamSoundProps {
  item: AudioItem;
  closeModal: () => void;
  externalAudio: (url: string, nickname: string) => Promise<void>;
  currentPlayingId: number | null;
  setCurrentPlayingId: (id: number | null) => void;
  isFocused: boolean;
}

const {width} = Dimensions.get('screen');

const ItemDreamSound = React.forwardRef<any, ItemDreamSoundProps>(
  (
    {
      item,
      closeModal,
      externalAudio,
      currentPlayingId,
      setCurrentPlayingId,
      isFocused,
    },
    ref,
  ) => {
    const [loading, setLoading] = useState<boolean>(false);
    const sound_playing = currentPlayingId === item.id;
    const [isBookmarked, setIsBookmarked] = useState<boolean>(
      item.isFavourited,
    );
    const [duration, setDuration] = useState<string | null>(null);
    const [remainingTime, setRemainingTime] = useState<string | null>(null);
    const [totalDurationSeconds, setTotalDurationSeconds] = useState<
      number | null
    >(null);
    const my_data = useAppSelector(selectMyProfileData);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const {t, i18n} = useTranslation();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useDispatch();

    // Convert seconds to MM:SS format
    const formatDuration = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${
        remainingSeconds < 10 ? '0' : ''
      }${remainingSeconds}`;
    };

    // handle bookmark
    const handleBookMarkPressed = async () => {
      try {
        const soundData = {
          id: item.id,
          sound_id: item.id,
          user_id: item.user_id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          extracted_audio: {
            audio_url: item.audio_url,
            id: item.id,
            user_id: item.user_id,
            video_id: item.video_id,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            user: {
              id: item.user.id,
              profile_pic: item.user.profile_pic,
              nickname: item.user.nickname,
              username: item.user.username,
            },
            video: {
              thum: item.video.thum,
            },
          },
        };

        const data = {
          sound_id: item.id,
        };
        if (!isBookmarked) {
          await soundApi.addFavouriteSound(my_data?.auth_token, data);
          dispatch(addFavouriteSound(soundData));
          Toast.show('Added to favourites', Toast.LONG);
          setIsBookmarked(true);
        } else {
          setShowConfirmModal(true);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    const removeFavSound = async () => {
      try {
        const data = {
          sound_id: item.id,
        };
        await soundApi.removeFavouriteSound(my_data.auth_token, data);
        dispatch(removeFavouriteSound(item.id));
        Toast.show('Removed from favourites', Toast.LONG);
      } catch (error) {
        console.error('error', error);
      } finally {
        setIsBookmarked(false);
        setShowConfirmModal(false);
      }
    };

    // Start countdown timer
    const startTimer = (totalSeconds: number) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      let secondsRemaining = totalSeconds;

      // Update immediately
      setRemainingTime(formatDuration(secondsRemaining));

      // Set up interval to update every second
      timerRef.current = setInterval(() => {
        secondsRemaining -= 1;

        if (secondsRemaining <= 0) {
          // Stop timer when done
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setRemainingTime('0:00');
        } else {
          setRemainingTime(formatDuration(secondsRemaining));
        }
      }, 1000);
    };

    // Stop countdown timer
    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Reset to total duration
      if (totalDurationSeconds !== null) {
        setRemainingTime(formatDuration(totalDurationSeconds));
      }
    };

    useEffect(() => {
      const soundPlay = SoundPlayer.addEventListener('FinishedPlaying', d => {
        if (currentPlayingId === item.id) {
          setCurrentPlayingId(null);
          stopTimer();
        }
      });

      return () => {
        soundPlay.remove();
        // Clean up timer when component unmounts
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }, [currentPlayingId, item.id, setCurrentPlayingId]);

    // Effect to handle focus changes
    useEffect(() => {
      if (!isFocused && sound_playing) {
        pauseSound();
      }
    }, [isFocused]);

    // Fetch and update duration
    const soundInfo = async () => {
      try {
        const result = await SoundPlayer.getInfo();
        console.log('sound info', `${result.duration}:${item.id}`);
        if (result.duration) {
          const durationFormatted = formatDuration(result.duration);
          setDuration(durationFormatted);
          setRemainingTime(durationFormatted);
          setTotalDurationSeconds(result.duration);

          // Start countdown timer
          if (sound_playing) {
            startTimer(result.duration);
          }
        }
      } catch (error) {
        console.log('Error fetching sound info', error);
      }
    };

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      playSound: () => playSound(),
      pauseSound: () => pauseSound(),
    }));

    // handle playing audio
    const playSound = async () => {
      try {
        setLoading(true);

        // If another sound is playing, stop it first
        if (currentPlayingId !== null && currentPlayingId !== item.id) {
          SoundPlayer.pause();
        }

        SoundPlayer.playUrl(
          `https://dpcst9y3un003.cloudfront.net/extracted_audio/${item?.audio_url}`,
        );

        setCurrentPlayingId(item.id);

        await new Promise(resolve => setTimeout(resolve, 500));
        await soundInfo();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // handle pausing audio
    const pauseSound = () => {
      try {
        setLoading(true);
        SoundPlayer.pause();
        stopTimer();
        setCurrentPlayingId(null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // handle toggle play pause
    const togglePlayPause = () => {
      if (!loading) {
        if (sound_playing) {
          pauseSound();
        } else {
          playSound();
        }
      }
    };

    const itemPress = () => {
      externalAudio(item?.audio_url, item?.user?.nickname);
    };

    return (
      <>
        <Pressable style={styles.itemsearchaudiocontainer} onPress={itemPress}>
          <View style={styles.item_container}>
            <View style={styles.imageContainer}>
              <FastImage
                source={{
                  uri: `https://dpcst9y3un003.cloudfront.net/${item?.video?.thum}`,
                }}
                style={styles.imgstyle}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Pressable
                onPress={togglePlayPause}
                style={[styles.sound_pic, styles.player_details]}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <AntDesign
                    name={sound_playing ? 'pause' : 'play'}
                    size={20}
                    color={'#fff'}
                  />
                )}
              </Pressable>

              <View style={styles.textContainer}>
                <View>
                  <Text style={{color: '#000', fontSize: 15}}>
                    {item?.user?.nickname}
                  </Text>
                </View>
                <View>
                  <Text>
                    {t('Author')}:{item?.user?.nickname}
                  </Text>
                </View>
                <View>
                  <Text>
                    <Text style={styles.duration_txt}> {t('Duration')}:</Text>{' '}
                    <Text style={styles.duration_time_txt}>
                      {sound_playing ? remainingTime : duration ?? t('Play')}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <Pressable
                style={styles.bookmark_button}
                onPress={handleBookMarkPressed}>
                <FontAwesome
                  name={isBookmarked ? 'bookmark' : 'bookmark-o'}
                  size={25}
                  color={isBookmarked ? '#ff0050' : '#000'}
                />
              </Pressable>

              <AntDesign name="right" size={15} color={'#000'} />
            </View>
          </View>
        </Pressable>

        <ConfirmModal
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={removeFavSound}
          title={t('Remove from favorites')}
          message={t(
            'Are you sure you want to remove this sound from favorites?',
          )}
          confirmText={t('Remove')}
          confirmColor="#fff"
          cancelText={t('Cancel')}
        />
      </>
    );
  },
);

export default React.memo(ItemDreamSound);

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 20,
  },
  statsContainer: {
    width: width * 0.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  imgstyle: {
    width: width * 0.15,
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
    width: width * 0.15,
    height: 70,
    borderRadius: 10,
  },
  itemsearchaudiocontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: 'gray',
    width: width,
  },
  item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmark_button: {
    padding: 10,
  },
  duration_txt: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  duration_time_txt: {
    color: '#000',
    fontWeight: '700',
  },
});
