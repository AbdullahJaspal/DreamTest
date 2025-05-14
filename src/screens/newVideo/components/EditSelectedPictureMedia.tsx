import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import FastImage from '@d11/react-native-fast-image';

interface EditSelectedPictureMediaProps {
  pictureURLs: Array<{img_url: string; id: string}>;
  onRemoveImage?: (imageId: string) => void;
  removedImageIds?: string[];
}

const {width} = Dimensions.get('screen');

const BASE_URL = 'https://dpcst9y3un003.cloudfront.net/';

const SelectedPictureMedia: React.FC<EditSelectedPictureMediaProps> = ({
  pictureURLs,
  onRemoveImage,
  removedImageIds = [],
}) => {
  // Filter out removed images
  const filteredPictureURLs = pictureURLs.filter(
    item => !removedImageIds.includes(item.id),
  );

  const selectedMediaLength = filteredPictureURLs.length;

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('content://')) {
      return url;
    }

    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('file:')
    ) {
      return url;
    }

    return `${BASE_URL}${url}`;
  };

  const handleRemoveImage = (id: string) => {
    if (onRemoveImage) {
      onRemoveImage(id);
    }
  };

  const renderRemoveButton = (id: string) => {
    return (
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveImage(id)}>
        <AntDesign name="closecircle" size={24} color="red" />
      </TouchableOpacity>
    );
  };

  if (selectedMediaLength === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No images available</Text>
      </View>
    );
  }

  if (selectedMediaLength === 1) {
    const fullUrl = getFullImageUrl(filteredPictureURLs[0].img_url);
    return (
      <View style={styles.main_container_view}>
        <FastImage
          source={{uri: fullUrl}}
          style={[styles.main_container_view]}
          resizeMode={FastImage.resizeMode.cover}
        />
        {renderRemoveButton(filteredPictureURLs[0].id)}
      </View>
    );
  }

  if (selectedMediaLength === 2) {
    return (
      <View style={styles.main_container_view}>
        <View style={{position: 'relative', ...styles.two_img_view}}>
          <FastImage
            source={{uri: getFullImageUrl(filteredPictureURLs[0].img_url)}}
            style={[styles.two_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
          {renderRemoveButton(filteredPictureURLs[0].id)}
        </View>
        <View style={{position: 'relative', ...styles.two_img_view}}>
          <FastImage
            source={{uri: getFullImageUrl(filteredPictureURLs[1].img_url)}}
            style={[styles.two_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
          {renderRemoveButton(filteredPictureURLs[1].id)}
        </View>
      </View>
    );
  }

  if (selectedMediaLength === 3) {
    return (
      <View style={styles.main_container_view}>
        <View style={{position: 'relative', ...styles.two_img_view}}>
          <FastImage
            source={{uri: getFullImageUrl(filteredPictureURLs[0].img_url)}}
            style={[styles.two_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
          {renderRemoveButton(filteredPictureURLs[0].img_url)}
        </View>
        <View style={styles.two_img_view}>
          <View style={{position: 'relative', ...styles.three_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[1].img_url)}}
              style={[styles.three_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[1].id)}
          </View>
          <View style={{position: 'relative', ...styles.three_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[2].img_url)}}
              style={[styles.three_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[2].id)}
          </View>
        </View>
      </View>
    );
  }

  if (selectedMediaLength === 4) {
    return (
      <View style={styles.main_container_view}>
        <View style={{position: 'relative', ...styles.fouth_first_img_view}}>
          <FastImage
            source={{uri: getFullImageUrl(filteredPictureURLs[0].img_url)}}
            style={[styles.fouth_first_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
          {renderRemoveButton(filteredPictureURLs[0].id)}
        </View>
        <View style={{width: width / 3}}>
          <View style={{position: 'relative', ...styles.four_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[1].img_url)}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[1].id)}
          </View>
          <View style={{position: 'relative', ...styles.four_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[2].img_url)}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[2].id)}
          </View>
          <View style={{position: 'relative', ...styles.four_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[3].img_url)}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[3].id)}
          </View>
        </View>
      </View>
    );
  }

  if (selectedMediaLength > 4) {
    return (
      <View style={styles.main_container_view}>
        <View style={{position: 'relative', ...styles.fouth_first_img_view}}>
          <FastImage
            source={{uri: getFullImageUrl(filteredPictureURLs[0].img_url)}}
            style={[styles.fouth_first_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
          {renderRemoveButton(filteredPictureURLs[0].id)}
        </View>
        <View style={{width: width / 3}}>
          <View style={{position: 'relative', ...styles.four_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[1].img_url)}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[1].id)}
          </View>
          <View style={{position: 'relative', ...styles.four_img_view}}>
            <FastImage
              source={{uri: getFullImageUrl(filteredPictureURLs[2].img_url)}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
            {renderRemoveButton(filteredPictureURLs[2].id)}
          </View>
          <View style={styles.four_img_view}>
            <View style={{position: 'relative', width: '100%', height: '100%'}}>
              <FastImage
                source={{uri: getFullImageUrl(filteredPictureURLs[3].img_url)}}
                style={[styles.four_img_view]}
                resizeMode={FastImage.resizeMode.cover}
              />
              {renderRemoveButton(filteredPictureURLs[3].id)}
            </View>
            <View style={[styles.more_view, styles.four_img_view]}>
              <Text style={styles.more_txt}>+{selectedMediaLength - 4}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

export default SelectedPictureMedia;

const styles = StyleSheet.create({
  main_container_view: {
    width: width,
    height: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  two_img_view: {
    width: width / 2,
    height: width,
  },
  three_img_view: {
    width: width / 2,
    height: width / 2,
  },
  four_img_view: {
    width: width / 3,
    height: width / 3,
  },
  fouth_first_img_view: {
    width: (2 * width) / 3,
    height: width,
  },
  more_view: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  more_txt: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    zIndex: 10,
  },
  emptyContainer: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
