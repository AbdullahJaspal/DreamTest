import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {formatDuration} from '../../../utils/formatDuration';
import FastImage from '@d11/react-native-fast-image';

interface RenderMediaLIstProps {
  item: PhotoIdentifier;
  index: number;
  selectedMedia: Array<PhotoIdentifier>;
  handleMediaSelection: (item: PhotoIdentifier) => void;
}
const {width} = Dimensions.get('screen');

const RenderMediaLIst: React.FC<RenderMediaLIstProps> = ({
  item,
  index,
  selectedMedia,
  handleMediaSelection,
}) => {
  const videoUri = item.node.image.uri;
  const isVideo = item.node.type.startsWith('video');

  const getSelectedItemIndex = (item: PhotoIdentifier) => {
    return selectedMedia.findIndex(
      selectedItem => selectedItem.node.id === item.node.id,
    );
  };

  if (isVideo) {
    return (
      <TouchableOpacity
        style={styles.list_media_view}
        onPress={() => {
          handleMediaSelection(item);
        }}>
        <FastImage
          source={{uri: videoUri}}
          style={styles.list_media_view}
          resizeMode={FastImage.resizeMode.stretch}
          onLoad={d => {
            console.log('d', d.nativeEvent);
          }}
        />
        {item.node.image.playableDuration && (
          <View style={styles.durations_view}>
            <FontAwesome5 name="play" size={10} color={'#fff'} />
            <Text style={styles.durations_txt}>
              {formatDuration(item.node.image.playableDuration)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.list_media_view}
      onPress={() => {
        handleMediaSelection(item);
      }}>
      <FastImage source={{uri: videoUri}} style={styles.list_media_view} />
      {getSelectedItemIndex(item) != -1 && (
        <View style={styles.selected_media_view}>
          <Text style={styles.selected_media_txt}>
            {getSelectedItemIndex(item) + 1}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(RenderMediaLIst);

const styles = StyleSheet.create({
  selected_media_view: {
    width: width / 3.123,
    height: width / 3.045,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list_media_view: {
    width: width / 3.123,
    height: width / 3.045,
    margin: 2,
    borderRadius: 3,
    overflow: 'hidden',
    resizeMode: 'stretch',
  },
  durations_view: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
    position: 'absolute',
    width: width / 3.123,
    bottom: 2,
  },
  durations_txt: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    fontWeight: '600',
  },
  selected_media_txt: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
  },
});
