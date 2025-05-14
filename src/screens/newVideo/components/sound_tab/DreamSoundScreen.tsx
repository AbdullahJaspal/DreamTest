import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {AudioItem} from '../../types/Audio';
import Toast from 'react-native-simple-toast';
import ItemDreamSound from './ItemDreamSound';
import SoundPlayer from 'react-native-sound-player';
import {useIsFocused} from '@react-navigation/native';
import {useAppSelector} from '../../../../store/hooks';
import * as audioApi from '../../../../apis/audio.api';
import {COLOR, SPACING} from '../../../../configs/styles/index';
import {dreamSound} from '../../../../store/slices/ui/indexSlice';
import {
  selectDreamSounds,
  selectMyProfileData,
} from '../../../../store/selectors';

import {
  addNickname,
  setSoundRemoteUrl,
} from '../../../../store/slices/content/externalSoundSlice';
import FastImage from '@d11/react-native-fast-image';
import {gifs} from '../../../../assets/gifs';

interface DreamSoundScreenProps {
  route: any;
}
interface CellType {
  playSound: () => void;
  pauseSound: () => void;
}
interface CellRefsType {
  [key: string]: CellType;
}

const DreamSoundScreen: React.FC<DreamSoundScreenProps> = ({route}) => {
  const {closeModal} = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [audioData, setAudioData] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const my_data = useAppSelector(selectMyProfileData);
  const dreamAudio = useAppSelector(selectDreamSounds);
  const dataLoadedRef = useRef(false);
  const pageNo = useRef<number>(1);
  const pageSize = useRef<number>(20);

  /**
   * Get External sound - initial fetch
   */
  const fetchAllExternalSound = useCallback(
    async (isInitial = true) => {
      try {
        if (isInitial) {
          setLoading(true);
          pageNo.current = 1;
        } else {
          setLoadingMore(true);
        }

        const result = await audioApi.getallaudio(
          my_data?.auth_token,
          pageNo.current,
          pageSize.current,
        );

        if (result.payload && result.payload.length > 0) {
          if (isInitial) {
            setAudioData(result.payload);
            dispatch(dreamSound(result.payload));
            dataLoadedRef.current = true;
          } else {
            setAudioData(prevData => [...prevData, ...result.payload]);
          }

          // Check if we received fewer items than requested, meaning we've reached the end
          if (result.payload.length < pageSize.current) {
            setHasMoreData(false);
          } else {
            pageNo.current += 1;
          }
        } else {
          setHasMoreData(false);
        }
      } catch (error) {
        console.log('Error getting external audio', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [my_data?.auth_token, dispatch],
  );

  // Load more data when user reaches the end of the list
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMoreData && !loading) {
      fetchAllExternalSound(false);
    }
  }, [fetchAllExternalSound, loadingMore, hasMoreData, loading]);

  // Effect to handle focus changes
  useEffect(() => {
    if (isFocused && !dataLoadedRef.current) {
      fetchAllExternalSound(true);
    } else if (!isFocused) {
      if (currentPlayingId !== null) {
        SoundPlayer.pause();
        setCurrentPlayingId(null);
      }
    }
  }, [isFocused, fetchAllExternalSound, currentPlayingId]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Stop any playing sounds when component unmounts
      SoundPlayer.pause();
      setCurrentPlayingId(null);
    };
  }, []);

  const externalAudio = async (url: any, nickname: string | null) => {
    try {
      closeModal();
      const remote_url = `https://dpcst9y3un003.cloudfront.net/extracted_audio/${url}`;
      dispatch(setSoundRemoteUrl(remote_url));
      dispatch(addNickname(nickname));
    } catch (error) {
      console.log('error', error);
      Toast.show('You cannot use this sound for now', Toast.LONG);
    }
  };

  const renderItem = useCallback(
    ({item, index}: {item: AudioItem; index: number}) => {
      return (
        <ItemDreamSound
          item={item}
          closeModal={closeModal}
          externalAudio={externalAudio}
          currentPlayingId={currentPlayingId}
          setCurrentPlayingId={setCurrentPlayingId}
          isFocused={isFocused}
        />
      );
    },
    [currentPlayingId, isFocused, closeModal, externalAudio],
  );

  // Footer component to show loading indicator when loading more data
  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <FastImage source={gifs.tiktokLoader} style={styles.gifloader} />
      </View>
    );
  }, [loadingMore]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <FastImage source={gifs.tiktokLoader} style={styles.gifloader} />
        </View>
      ) : (
        <FlatList
          data={audioData}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          windowSize={10}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default React.memo(DreamSoundScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: SPACING.S2,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: SPACING.S3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifloader: {
    width: 40,
    height: 40,
  },
});
