import {
  Dimensions,
  GestureResponderEvent,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import Video, {VideoRef} from 'react-native-video';

interface SelectedMediaDisplayProps {
  selectedMedia?: PhotoIdentifier;
}

const {width, height} = Dimensions.get('screen');

const SelectedMediaDisplay: React.FC<SelectedMediaDisplayProps> = ({
  selectedMedia,
}) => {
  const videoRef = useRef<VideoRef>(null);
  const isVideoPlaying = useRef<boolean>(false);
  const isVideo = useMemo(
    () => selectedMedia?.node?.type?.startsWith('video'),
    [selectedMedia],
  );

  const mediaURL = useMemo(() => {
    return selectedMedia?.node.image.uri;
  }, [selectedMedia]);

  const handleVideoPress = useCallback((event: GestureResponderEvent) => {
    if (isVideoPlaying.current) {
      videoRef.current?.pause();
      isVideoPlaying.current = false;
    } else {
      videoRef.current?.resume();
      isVideoPlaying.current = true;
    }
  }, []);

  return (
    <View style={styles.selected_media_view}>
      {isVideo ? (
        <TouchableOpacity onPress={handleVideoPress}>
          <Video
            ref={videoRef}
            source={{uri: mediaURL}}
            style={styles.selected_media_view}
            resizeMode="contain"
            controls={true}
            repeat={false}
            muted={true}
            viewType={2}
            paused={true}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={{uri: mediaURL}}
          style={styles.selected_media_view}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default React.memo(SelectedMediaDisplay);

const styles = StyleSheet.create({
  selected_media_view: {
    width: width,
    height: height * 0.35,
    backgroundColor: '#fff',
  },
});
