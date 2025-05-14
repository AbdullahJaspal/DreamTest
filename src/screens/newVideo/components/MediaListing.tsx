import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import React, {useMemo} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RenderMediaLIst from './RenderMediaLIst';

interface MediaListingProps {
  loading: boolean;
  media: Array<PhotoIdentifier>;
  selectedMedia: Array<PhotoIdentifier>;
  handleMediaSelection: (item: PhotoIdentifier) => void;
}

const {width} = Dimensions.get('screen');

const MediaListing: React.FC<MediaListingProps> = ({
  loading,
  media,
  selectedMedia,
  handleMediaSelection,
}) => {
  const mediaContent = useMemo(() => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" />;
    }

    if (media.length > 0) {
      return (
        <FlatList
          data={media}
          renderItem={({item, index}) => (
            <RenderMediaLIst
              item={item}
              index={index}
              selectedMedia={selectedMedia}
              handleMediaSelection={handleMediaSelection}
            />
          )}
          keyExtractor={(_item, index) => index.toString()}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{width: width}}
          windowSize={3}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
        />
      );
    }

    return <Text style={styles.not_permited_txt}>No media available</Text>;
  }, [loading, media, selectedMedia]);

  return <View style={styles.media_listing_container}>{mediaContent}</View>;
};

export default React.memo(MediaListing);

const styles = StyleSheet.create({
  media_listing_container: {
    flex: 1,
    width: width,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  not_permited_txt: {
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '500',
  },
});
