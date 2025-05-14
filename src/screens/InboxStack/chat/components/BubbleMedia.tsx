import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Share,
  Animated,
  ActivityIndicator,
  BackHandler,
  Pressable,
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  PinchGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import styles from '../styles/bubbleMediaStyles';
import Text from '../../../../components/Text';

const {width, height} = Dimensions.get('window');

const BubbleMediaViewer = ({
  visible,
  uri,
  type,
  sender,
  timestamp,
  onClose,
  onDownload,
  onForward,
  onDelete,
}) => {
  const {t} = useTranslation();
  const [isPaused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showOptions, setShowOptions] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const videoRef = useRef(null);

  const doubleTapRef = useRef(null);
  const pinchRef = useRef(null);
  const panRef = useRef(null);

  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const baseScale = useRef(1);
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef({x: 0, y: 0});

  const viewOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      StatusBar.setHidden(true);
      resetState();
      Animated.timing(viewOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      fadeInControls();
      autoHideControls();
    } else {
      StatusBar.setHidden(false);
      resetState();
      viewOpacity.setValue(0); // Reset opacity immediately on close
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => backHandler.remove();
    }
  }, [visible, showOptions]);

  const resetState = () => {
    setPaused(false);
    setIsLoading(true);
    setShowControls(true);
    setCurrentPosition(0);
    setDuration(0);
    setShowOptions(false);
    setIsZooming(false);
    resetZoom();

    fadeAnim.setValue(1);
  };

  const resetZoom = () => {
    lastScale.current = 1;
    lastOffset.current = {x: 0, y: 0};

    scale.setValue(1);
    translateX.setValue(0);
    translateY.setValue(0);
  };

  const handleBackPress = () => {
    if (showOptions) {
      setShowOptions(false);
      return true;
    }
    // If image is zoomed in, reset zoom on back press
    if (lastScale.current > 1) {
      resetZoom();
      setIsZooming(false);
      return true;
    }
    if (visible) {
      handleClose();
      return true;
    }
    return false;
  };

  const handleClose = () => {
    // Animate out before closing
    Animated.timing(viewOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose && onClose();
      resetState();
    });
  };

  const autoHideControls = () => {
    if (type === 'video' && !isPaused) {
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
    if (!isZooming) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowControls(false));
    }
  };

  const handleToggleControls = () => {
    // Don't toggle controls if user is zooming/panning
    if (isZooming || lastScale.current > 1) return;

    if (showControls && !showOptions) {
      fadeOutControls();
    } else if (!showOptions) {
      fadeInControls();
      autoHideControls();
    }
  };

  const handlePlayPause = () => {
    setPaused(prev => !prev);
    fadeInControls();
    if (!isPaused) {
      // If we're about to pause, keep controls visible
      // If we're about to play, auto-hide controls after delay
      autoHideControls();
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: uri || '',
        url: uri || '',
      });
    } catch (error) {
      console.error('Error sharing media:', error);
    }
  };

  const handleVideoLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
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

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleForward = () => {
    setShowOptions(false);
    if (onForward) onForward(uri);
  };

  const handleDownload = () => {
    setShowOptions(false);
    if (onDownload) onDownload(uri);
  };

  const handleDelete = () => {
    setShowOptions(false);
    if (onDelete) onDelete(uri);
  };

  // Handle pinch zoom gesture
  const onPinchGestureEvent = Animated.event([{nativeEvent: {scale: scale}}], {
    useNativeDriver: true,
  });

  const onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      baseScale.current = lastScale.current;

      // If zoomed out past original size, snap back to original
      if (lastScale.current < 1) {
        lastScale.current = 1;
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        setIsZooming(false);
      } else {
        scale.setValue(lastScale.current);
        setIsZooming(lastScale.current > 1);
      }
    }
  };

  // Handle pan gesture for moving zoomed image
  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const onPanHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.current = {
        x: event.nativeEvent.translationX + lastOffset.current.x,
        y: event.nativeEvent.translationY + lastOffset.current.y,
      };
      translateX.setOffset(lastOffset.current.x);
      translateX.setValue(0);
      translateY.setOffset(lastOffset.current.y);
      translateY.setValue(0);
    }
  };

  // Handle double tap to zoom
  const onDoubleTap = event => {
    if (lastScale.current > 1) {
      // If already zoomed in, reset zoom
      resetZoom();
      setIsZooming(false);
    } else {
      // Zoom in to 3x at the tap location
      const tapX = event.nativeEvent.x;
      const tapY = event.nativeEvent.y;

      // Calculate the center offset
      const centerX = tapX - width / 2;
      const centerY = tapY - height / 2;

      lastScale.current = 3;
      lastOffset.current = {
        x: -centerX * 2,
        y: -centerY * 2,
      };

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -centerX * 2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -centerY * 2,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setIsZooming(true);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {opacity: viewOpacity, zIndex: visible ? 9999 : -1},
      ]}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <View style={styles.blackBackground} />

        {/* Main media container */}
        {type === 'image' ? (
          <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchGestureEvent}
            onHandlerStateChange={onPinchHandlerStateChange}
            simultaneousHandlers={[panRef, doubleTapRef]}>
            <Animated.View style={styles.mediaContainer}>
              <PanGestureHandler
                ref={panRef}
                onGestureEvent={onPanGestureEvent}
                onHandlerStateChange={onPanHandlerStateChange}
                simultaneousHandlers={[pinchRef, doubleTapRef]}
                enabled={lastScale.current > 1}>
                <Animated.View style={styles.mediaContainer}>
                  <TapGestureHandler
                    ref={doubleTapRef}
                    onHandlerStateChange={({nativeEvent}) => {
                      if (nativeEvent.state === State.ACTIVE) {
                        onDoubleTap(nativeEvent);
                      }
                    }}
                    numberOfTaps={2}>
                    <Animated.View style={styles.mediaContainer}>
                      <TouchableWithoutFeedback onPress={handleToggleControls}>
                        <Animated.View style={styles.mediaContainer}>
                          {isLoading && (
                            <View style={styles.loadingContainer}>
                              <ActivityIndicator size="large" color="#fff" />
                            </View>
                          )}
                          <Animated.Image
                            source={{uri}}
                            style={[
                              styles.fullScreenMedia,
                              {
                                transform: [
                                  {scale},
                                  {translateX},
                                  {translateY},
                                ],
                              },
                            ]}
                            resizeMode="contain"
                            onLoadStart={() => setIsLoading(true)}
                            onLoadEnd={() => setIsLoading(false)}
                          />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                    </Animated.View>
                  </TapGestureHandler>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        ) : (
          <TouchableWithoutFeedback onPress={handleToggleControls}>
            <View style={styles.videoWrapper}>
              <Video
                ref={videoRef}
                source={{uri}}
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
                    <Ionicons name="play" size={36} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}

        {/* WhatsApp-style top header with sender info */}
        {showControls && (
          <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
            <View style={styles.leftHeader}>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.backButton}
                activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>

              {sender && (
                <View style={styles.senderInfo}>
                  <Text style={styles.senderName} numberOfLines={1}>
                    {sender}
                  </Text>
                  {timestamp && (
                    <Text style={styles.timestamp}>{timestamp}</Text>
                  )}
                </View>
              )}
            </View>

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
                onPress={handleOptions}
                style={styles.controlButton}
                activeOpacity={0.7}>
                <MaterialIcons name="more-vert" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Video playback controls */}
        {showControls && type === 'video' && duration > 0 && (
          <Animated.View style={[styles.seekBarContainer, {opacity: fadeAnim}]}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
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

        {/* Bottom action buttons - WhatsApp style for video */}
        {showControls && type === 'video' && (
          <Animated.View style={[styles.videoTimeBar, {opacity: fadeAnim}]}>
            <Text style={styles.videoTimeText}>
              {formatTime(currentPosition)}
            </Text>
            <Text style={styles.videoTimeSeparator}>/</Text>
            <Text style={styles.videoTimeText}>{formatTime(duration)}</Text>
          </Animated.View>
        )}

        {/* Options menu (WhatsApp style) */}
        {showOptions && (
          <Pressable
            style={styles.optionsOverlay}
            onPress={() => setShowOptions(false)}>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleDownload}>
                <Ionicons name="download-outline" size={22} color="#000" />
                <Text style={styles.optionText}>{t('Download')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleForward}>
                <Ionicons name="arrow-redo-outline" size={22} color="#000" />
                <Text style={styles.optionText}>{t('Forward')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionItem} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={22} color="#000" />
                <Text style={styles.optionText}>{t('Share')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionItem, styles.deleteOption]}
                onPress={handleDelete}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                <Text style={[styles.optionText, styles.deleteText]}>
                  {t('Delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        )}
      </GestureHandlerRootView>
    </Animated.View>
  );
};

export default BubbleMediaViewer;
