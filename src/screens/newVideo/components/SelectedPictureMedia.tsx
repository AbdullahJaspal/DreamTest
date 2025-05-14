import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import React from 'react';

interface SelectedPictureMediaProps {
  pictureURLs: string[];
  onImagePress?: (index: number) => void;
}

const {width} = Dimensions.get('screen');

const SelectedPictureMedia: React.FC<SelectedPictureMediaProps> = ({
  pictureURLs,
  onImagePress,
}) => {
  const selectedMediaLength = pictureURLs.length;

  const handleImagePress = (index: number) => {
    if (onImagePress) {
      onImagePress(index);
    }
  };

  if (selectedMediaLength === 1) {
    return (
      <View style={styles.main_container_view}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(0)}
          style={styles.touchable_full}>
          <FastImage
            source={{uri: pictureURLs[0]}}
            style={[styles.main_container_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedMediaLength === 2) {
    return (
      <View style={styles.main_container_view}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(0)}
          style={styles.two_img_view}>
          <FastImage
            source={{uri: pictureURLs[0]}}
            style={[styles.two_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(1)}
          style={styles.two_img_view}>
          <FastImage
            source={{uri: pictureURLs[1]}}
            style={[styles.two_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedMediaLength === 3) {
    return (
      <View style={styles.main_container_view}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(0)}
          style={styles.two_img_view}>
          <FastImage
            source={{uri: pictureURLs[0]}}
            style={[styles.two_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={styles.two_img_view}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(1)}
            style={styles.three_img_view}>
            <FastImage
              source={{uri: pictureURLs[1]}}
              style={[styles.three_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(2)}
            style={styles.three_img_view}>
            <FastImage
              source={{uri: pictureURLs[2]}}
              style={[styles.three_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (selectedMediaLength === 4) {
    return (
      <View style={styles.main_container_view}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(0)}
          style={styles.fouth_first_img_view}>
          <FastImage
            source={{uri: pictureURLs[0]}}
            style={[styles.fouth_first_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={{width: width / 3}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(1)}
            style={styles.four_img_view}>
            <FastImage
              source={{uri: pictureURLs[1]}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(2)}
            style={styles.four_img_view}>
            <FastImage
              source={{uri: pictureURLs[2]}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(3)}
            style={styles.four_img_view}>
            <FastImage
              source={{uri: pictureURLs[3]}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (selectedMediaLength > 4) {
    return (
      <View style={styles.main_container_view}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleImagePress(0)}
          style={styles.fouth_first_img_view}>
          <FastImage
            source={{uri: pictureURLs[0]}}
            style={[styles.fouth_first_img_view]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={{width: width / 3}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(1)}
            style={styles.four_img_view}>
            <FastImage
              source={{uri: pictureURLs[1]}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(2)}
            style={styles.four_img_view}>
            <FastImage
              source={{uri: pictureURLs[2]}}
              style={[styles.four_img_view]}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleImagePress(3)}
            style={styles.four_img_view}>
            <View style={styles.four_img_view}>
              <FastImage
                source={{uri: pictureURLs[3]}}
                style={[styles.four_img_view]}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={[styles.more_view, styles.four_img_view]}>
                <Text style={styles.more_txt}>+{selectedMediaLength - 4}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 10,
  },
  touchable_full: {
    width: width,
    height: width,
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
});
