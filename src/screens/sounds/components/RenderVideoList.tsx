import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Video from 'react-native-video';
import {formatDuration} from '../../../utils/formatDuration';
import Toast from 'react-native-simple-toast';

interface RenderVideoListProps {
  item: any;
  index: number;
  pickVideo: any;
  selected_video_index: number;
}

const {width} = Dimensions.get('screen');

const RenderVideoList: React.FC<RenderVideoListProps> = ({
  item,
  index,
  pickVideo,
  selected_video_index,
}) => {
  const video_url = `file://${item}`;
  const [video_durations, setVideo_durations] = useState<number>();

  const handleVideoPick = () => {
    if (video_durations >= 15) {
      pickVideo(index, video_durations);
    } else {
      Toast.show(
        'We support videos with a minimum duration of 15 seconds.',
        Toast.LONG,
      );
    }
  };

  return (
    <Pressable style={styles.main_container} onPress={handleVideoPick}>
      <View style={styles.radio_select}>
        {selected_video_index === index ? (
          <View style={styles.selector} />
        ) : null}
      </View>
      <Video
        source={{uri: video_url}}
        style={styles.main_container}
        resizeMode="cover"
        paused={false}
        muted={true}
        repeat={true}
        onLoad={v => {
          setVideo_durations(v.duration);
        }}
      />
      <Text style={styles.durations_txt}>
        {formatDuration(video_durations)}
      </Text>
    </Pressable>
  );
};

export default React.memo(RenderVideoList);

const styles = StyleSheet.create({
  main_container: {
    width: width / 4,
    height: width / 4,
    borderRadius: 0,
  },
  radio_select: {
    width: 20,
    height: 20,
    borderWidth: 2,
    position: 'absolute',
    zIndex: 100,
    borderColor: '#fff',
    padding: 1.5,
    right: 4,
    top: 4,
    borderRadius: 15,
  },
  selector: {
    backgroundColor: 'red',
    flex: 1,
    borderRadius: 100,
  },
  durations_txt: {
    position: 'absolute',
    bottom: 1,
    right: 2,
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'left',
  },
});
