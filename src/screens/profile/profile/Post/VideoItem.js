import React, {useRef, useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';

import Video from 'react-native-video';
import {Container} from '../../../../components';
import VerticalLeftSection from './VerticalLeftSection';
import VerticalRightSection from './VerticalRightSection';

import {useNavigation} from '@react-navigation/native';
import {DateTime} from 'luxon';

import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const VideoItem = ({item, index, videoRefs, flatListRef, dataLength}) => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [customizedItem, setCustomizedItem] = useState(
    item?.video?.video ? item?.video : item,
  );
  const url = `https://dpcst9y3un003.cloudfront.net/${customizedItem?.video}`;
  const avatar = `https://dpcst9y3un003.cloudfront.net/${customizedItem?.thum}`;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const verticalRef = useRef();
  const des = customizedItem?.description;
  const [showFullText, setShowFullText] = useState(des?.length > 60);
  const [showText, setShowText] = useState(false);
  const my_data = useAppSelector(selectMyProfileData);

  const inputDate = DateTime.fromISO(item?.created);
  const formattedDate = inputDate.toFormat('HH:mm d-MMM-yyyy');

  const handleVideoPlay = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
      // videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoPause = () => {
    if (videoRef.current) {
      // videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  videoRefs.current[index.toString()] = {
    playVideo: handleVideoPlay,
    pauseVideo: handleVideoPause,
  };

  const onGiftPress = () => {
    if (my_data) {
      navigation.navigate('VideoGift', {
        id: customizedItem?.id,
        user_id: my_data?.id,
      });
    } else {
      dispatch(setModalSignIn(true));
    }
  };

  const onEnd = () => {
    if (flatListRef.current) {
      console.log('Play new please');
      flatListRef.current.scrollToIndex({
        index: dataLength > index + 1 ? index + 1 : index,
      });
    }
  };

  return (
    <View style={styles.main_container}>
      <Video
        ref={videoRef}
        source={{
          uri: url,
        }}
        style={{
          top: 0,
          left: 0,
          right: 0,
          width: width,
          height: height,
          bottom: 0,
        }}
        resizeMode="cover"
        repeat={false}
        poster={avatar}
        posterResizeMode={'cover'}
        paused={!isPlaying}
        onEnd={onEnd}
      />

      <VerticalLeftSection
        avatar={avatar}
        onGiftPress={onGiftPress}
        item={customizedItem}
      />

      <VerticalRightSection item={customizedItem} />

      <Container
        position="absolute"
        bottom={80}
        left={width * 0.3}
        alignItems="center">
        <Container marginBottom={40} width={width * 0.4}>
          {showText && (
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                fontWeight: '500',
                backgroundColor: 'transparent',
              }}>
              {des}
            </Text>
          )}

          {!showText && (
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                fontWeight: '500',
                backgroundColor: 'transparent',
              }}>
              {des}{' '}
              {showFullText && (
                <Text
                  style={{fontSize: 12, color: 'white', fontWeight: '500'}}
                  onPress={() => {
                    setShowText(true);
                  }}>
                  more...
                </Text>
              )}
            </Text>
          )}
        </Container>
      </Container>

      <Container position="absolute" left={width * 0.4} bottom={60}>
        <Container
          marginBottom={40}
          alignItems="center"
          justifyContent="center"
          flexDirection="row">
          <Text
            style={{
              fontSize: 10,
              color: 'white',
              fontWeight: '500',
              backgroundColor: 'transparent',
            }}>
            {t('See Original Song')}
          </Text>
          <Text style={{}}>{formattedDate}</Text>
        </Container>
      </Container>
    </View>
  );
};

export default VideoItem;

const styles = StyleSheet.create({
  main_container: {
    // width: width,
    // height: height,
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // backgroundColor: 'red',
    // zIndex: 100,
  },
});
