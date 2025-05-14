import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  Share,
  Animated,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import styles from '../styles/mediaViewerStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Text from '../../../../components/Text';

const {width, height} = Dimensions.get('screen');

const MediaViewer = ({visible, media, type, onClose, onSendMessage}) => {
  const {t} = useTranslation();
  const [isPaused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [inputText, setInputText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSeekBar, setShowSeekBar] = useState(false);
  const videoRef = useRef(null);

  // Reset state on modal open
  useEffect(() => {
    if (visible) {
      setPaused(false);
      setIsLoading(true);
      fadeInControls();
      autoHideControls();
      setInputText('');
    }
  }, [visible]);

  const autoHideControls = () => {
    if (!isInputFocused) {
      setTimeout(() => fadeOutControls(), 3000);
    }
  };

  const fadeInControls = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutControls = () => {
    if (!isInputFocused) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }
  };

  const handleToggleControls = () => {
    if (showControls) {
      fadeOutControls();
    } else {
      fadeInControls();
      autoHideControls();
    }
  };

  const handlePlayPause = () => {
    setPaused(prev => !prev);
    fadeInControls();
    autoHideControls();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: media?.uri || '',
        url: media?.uri || '',
      });
    } catch (error) {
      console.error('Error sharing media:', error);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    fadeInControls();
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    autoHideControls();
  };

  const handleSendMessage = () => {
    try {
      if (media?.uri) {
        onSendMessage({
          duration: type === 'video' ? duration : undefined,
          uri: media.uri,
          type,
          caption: inputText,
        });
        setInputText('');
      }
    } catch (error) {
      console.log('Error=>', error);
    }
  };

  const handleVideoLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
    setShowSeekBar(true);
  };

  const handleVideoProgress = data => {
    setCurrentPosition(data.currentTime);
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      setPaused(true);
      fadeInControls();
    }
  };

  const handleVideoSeek = value => {
    if (videoRef.current) {
      videoRef.current.seek(value);
    }
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!visible || !media) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={handleToggleControls}>
          <View style={styles.mediaContainer}>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}

            {type === 'image' ? (
              <Image
                source={{uri: media.uri}}
                style={styles.fullScreenMedia}
                resizeMode="contain"
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
              />
            ) : (
              <View style={styles.videoWrapper}>
                <Video
                  ref={videoRef}
                  source={{uri: media.uri}}
                  style={styles.fullScreenMedia}
                  resizeMode="contain"
                  paused={isPaused}
                  repeat={false}
                  controls={false}
                  onLoad={handleVideoLoad}
                  onProgress={handleVideoProgress}
                  onEnd={handleVideoEnd}
                />
                {isPaused && !isLoading && (
                  <View style={styles.playOverlay}>
                    <TouchableOpacity
                      onPress={handlePlayPause}
                      style={styles.playButton}>
                      <Ionicons name="play" size={50} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {showControls && (
          <>
            <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.controlButton}
                activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={26} color="#fff" />
              </TouchableOpacity>

              <View style={styles.rightControls}>
                {type === 'video' && (
                  <TouchableOpacity
                    onPress={handlePlayPause}
                    style={styles.controlButton}
                    activeOpacity={0.7}>
                    <Ionicons
                      name={isPaused ? 'play' : 'pause'}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.controlButton}
                  activeOpacity={0.7}>
                  <Ionicons name="share-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  activeOpacity={0.7}>
                  <MaterialIcons name="more-vert" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {type === 'video' && showSeekBar && (
              <Animated.View
                style={[styles.seekBarContainer, {opacity: fadeAnim}]}>
                <Text style={styles.timeText}>
                  {formatTime(currentPosition)}
                </Text>
                <View style={styles.seekBar}>
                  <View
                    style={[
                      styles.seekBarProgress,
                      {
                        width: `${(currentPosition / duration) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </Animated.View>
            )}
          </>
        )}

        <View style={styles.bottomInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('Add a caption...')}
            placeholderTextColor="#aaa"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[
              styles.sendButton,
              {
                backgroundColor: '#54AD7A',
              },
            ]}
            // disabled={!inputText.trim()}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MediaViewer;
