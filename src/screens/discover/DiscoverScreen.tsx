import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Voice from '@react-native-voice/voice';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import CInput from '../../components/CInput';
import CText from '../../components/CText';
import SuggestionsSearch from './components/SuggestionsSearch';
import DefaultSearch from './components/DefaultSearch';
import Mic_model from './components/Mic_model';

import SearchTopTabNavigation from '../../navigations/SearchTopTabNavigation';

import {COLOR, SPACING, TEXT} from '../../configs/styles';
import {setTxtSearch} from '../../store/slices/common/searchSlice';
import {KEY_STORAGE} from '../../constants/constants';
import {useAppSelector} from '../../store/hooks';
import {selectTxtSearch} from '../../store/selectors';
import {icons} from '../../assets/icons';

const DiscoverScreen: React.FC = () => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const txtSearch = useAppSelector(selectTxtSearch);
  const [islistner, setislistner] = useState(false);
  const [modalvisable, setmodalvisible] = useState(false);

  const [volume, setVolume] = useState(0);

  const marginRight = useSharedValue(0);
  const opacity = useSharedValue(0);

  const searchInputStyle = useAnimatedStyle(() => {
    return {
      marginRight: withTiming(marginRight.value, {
        duration: 300,
        easing: Easing.linear,
      }),
    };
  }, []);

  const buttonSearchStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
        easing: Easing.linear,
      }),
    };
  }, []);

  useEffect(() => {
    if (txtSearch?.length > 0) {
      marginRight.value = SPACING.S10 + SPACING.S4;
      opacity.value = 1;
    } else {
      marginRight.value = 0;
      opacity.value = 0;
    }
  }, [txtSearch, marginRight, opacity]);

  const handleSearch = useCallback(async () => {
    try {
      let searchHis = await AsyncStorage.getItem(KEY_STORAGE.SEARCH_HIS);
      if (!searchHis) {
        searchHis = [];
      } else {
        searchHis = JSON.parse(searchHis);
      }
      if (!searchHis.includes(txtSearch) || txtSearch.trim().length === 0) {
        searchHis?.push(txtSearch);
        await AsyncStorage.setItem(
          KEY_STORAGE.SEARCH_HIS,
          JSON.stringify(searchHis),
        );
      }
      setIsFocus(false);
    } catch (error) {
      console.log(error);
    }
  }, [txtSearch]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = StopListener;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onErrorHandler;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChangedHandler;

    return () => {
      Voice.destroy();
      // hideStatusBar()
    };
  }, []);

  const onSpeechStartHandler = (event: any) => {
    console.log(event, 'Recording started');
  };

  const onSpeechResultsHandler = (event: {value: any[]}) => {
    console.log(event, 'Speech recognition results');
    const text = event.value[0];
    dispatch(setTxtSearch(text));
    console.log(text, 'Recognized text');
  };

  const onErrorHandler = (error: any) => {
    console.log('Speech recognition error:', error);
  };

  const SpeechListener = async () => {
    console.log('Speech listener start');
    try {
      const start = await Voice.start('en-US');
      setislistner(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const StopListener = async () => {
    // Corrected function name
    try {
      await Voice.stop();
      setislistner(false);
      setmodalvisible(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };
  const onSpeechVolumeChangedHandler = (event: {
    value: React.SetStateAction<number>;
  }) => {
    setVolume(event.value);
  };

  const toglemodal = () => {
    setmodalvisible(false);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.main_container}>
        <View style={styles.searchBar}>
          <Animated.View style={[styles.searchInput, searchInputStyle]}>
            <CInput
              onFocus={() => setIsFocus(true)}
              iconLeft={icons.search}
              placeholder={t('Search')}
              value={txtSearch}
              iconColor={'#000000'}
              iconRight={icons.mic}
              onPressIconRight={() => {
                islistner ? StopListener() : SpeechListener(),
                  setmodalvisible(true);
              }}
              onChangeText={(text: any) => dispatch(setTxtSearch(text))}
              returnKeyType={'search'}
              onSubmitEditing={handleSearch}
            />
          </Animated.View>
          <Animated.View style={[styles.buttonSearch, buttonSearchStyle]}>
            <CText
              text={TEXT.REGULAR}
              color={COLOR.DANGER2}
              onPress={handleSearch}>
              {t('Search')}
            </CText>
          </Animated.View>
        </View>

        {txtSearch?.length < 1 ? (
          <ScrollView>
            <DefaultSearch />
          </ScrollView>
        ) : isFocus ? (
          <SuggestionsSearch setIsFocus={setIsFocus} />
        ) : (
          <SearchTopTabNavigation />
        )}

        {modalvisable && (
          <Mic_model
            modalvisable={modalvisable}
            setmodalvisible={setmodalvisible}
            islistner={islistner}
            setVolume={() => setVolume(0)}
            recognizedText={txtSearch}
            volume={volume}
            toglemodal={toglemodal}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default React.memo(DiscoverScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  searchBar: {
    paddingHorizontal: SPACING.S2,
    paddingVertical: SPACING.S2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flexGrow: 1,
    borderRadius: 24,
  },
  buttonSearch: {
    position: 'absolute',
    right: SPACING.S4,
    opacity: 0,
    zIndex: -1,
  },
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
