import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactElement,
  JSXElementConstructor,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Image} from 'react-native';
import Toast from 'react-native-simple-toast';
import {CoverPicScreenScreenRouteProps} from '../../types/screenNavigationAndRoute';
import {segment_video} from '../../utils/segment_video';
import RenderMainCoverPicture from './components/RenderMainCoverPicture';
import Header from '../profile/profile/components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('screen');

const CoverPicScreen: React.FC = () => {
  const {
    params: {pathVideo, onCoverChange, durations},
  } = useRoute<CoverPicScreenScreenRouteProps>();
  const navigation = useNavigation();
  const [imageSegment, setImageSegment] = useState<string[] | null>(null);
  const [activeCover, setActiveCover] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const mainCoverRef = useRef<FlatList<any>>(null);
  const selectingCoverRef = useRef<FlatList<any>>(null);
  const {t, i18n} = useTranslation();
  const convertVideoToImage = useCallback(async () => {
    setLoading(true);
    try {
      const result = await segment_video(
        pathVideo,
        Math.floor(durations),
        durations,
      );
      setImageSegment(result);
    } catch (error) {
      console.log('error', error);
      Toast.show('Failed to segment video', Toast.LONG);
    } finally {
      setLoading(false);
    }
  }, [pathVideo, durations]);

  useEffect(() => {
    convertVideoToImage();
  }, [convertVideoToImage]);

  const handleChooseCoverPhoto = () => {
    if (imageSegment && imageSegment.length > 0) {
      onCoverChange(`file://${imageSegment[activeCover]}`);

      setImageSegment(null);

      setTimeout(() => {
        navigation.goBack();
      }, 100);
    }
  };

  function renderSelectingCoverPicture(
    info: ListRenderItemInfo<string>,
  ): ReactElement<any, string | JSXElementConstructor<any>> | null {
    const {item, index} = info;
    const handleActiveCover = () => {
      setActiveCover(index);
      mainCoverRef.current?.scrollToIndex({index: index, animated: true});
    };

    return (
      <Pressable
        style={[styles.selecting_cover_pic]}
        onPress={handleActiveCover}>
        <Image
          resizeMode="cover"
          source={{uri: `file://${item}`}}
          style={[
            styles.selecting_cover_pic,
            {
              borderColor: 'red',
              borderWidth: activeCover === index ? 3 : 0,
            },
          ]}
        />
      </Pressable>
    );
  }

  function handleBackPress(): void {
    setImageSegment(null);
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <Header
        headertext={t('Choose Cover Photo')}
        thirdButton={true}
        onPress={handleChooseCoverPhoto}
        backPress={handleBackPress}
      />
      {loading && (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {/* Main view of cover picture */}
      {imageSegment && (
        <FlatList
          data={imageSegment}
          renderItem={({item, index}) => (
            <RenderMainCoverPicture item={item} index={index} />
          )}
          horizontal={true}
          keyExtractor={(item, index) => item + index}
          pagingEnabled={true}
          windowSize={1}
          initialNumToRender={1}
          removeClippedSubviews={true}
          ref={mainCoverRef}
          getItemLayout={(_data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      )}

      {/* Bottom View of cover picture */}
      {imageSegment && (
        <FlatList
          data={imageSegment}
          renderItem={renderSelectingCoverPicture}
          horizontal={true}
          windowSize={1}
          initialNumToRender={1}
          removeClippedSubviews={true}
          keyExtractor={index => index.toString()}
          ref={selectingCoverRef}
          getItemLayout={(_data, index) => ({
            length: 70,
            offset: 70 * index,
            index,
          })}
        />
      )}
    </SafeAreaView>
  );
};

export default React.memo(CoverPicScreen);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  selecting_cover_pic: {
    width: 70,
    height: 100,
    marginHorizontal: 1,
  },
  loading_container: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
