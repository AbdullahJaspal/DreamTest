import {
  Dimensions,
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
} from 'react-native';
import type {PictureFeedScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {useNavigation} from '@react-navigation/native';
import type {PicturePost} from '../types/picturePost';
import PictureFeedHeader from './PictureFeedHeader';
import PictureFeedFooter from './PictureFeedFooter';
import PictureFeedBody from './PictureFeedBody';
import React from 'react';

interface RenderMainFeedProps {
  item: PicturePost;
  index: number;
}

const {width} = Dimensions.get('screen');

const RenderMainFeed: React.FC<RenderMainFeedProps> = ({item, index}) => {
  const navigation = useNavigation<PictureFeedScreenNavigationProps>();

  function handlePostPress(_event: GestureResponderEvent): void {
    navigation.navigate('PicturePostDetails', {post_details: item});
  }

  function handleImagePress(imageIndex: number): void {
    navigation.navigate('PicturePostDetails', {
      post_details: item,
      selectedImageIndex: imageIndex,
    });
  }

  return (
    <Pressable style={styles.main_container} onPress={handlePostPress}>
      {/* Header */}
      <PictureFeedHeader item={item} index={index} />

      {/* Body */}
      <PictureFeedBody
        item={item}
        index={index}
        onImagePress={handleImagePress}
      />

      {/* Footer */}
      <PictureFeedFooter item={item} index={index} />
    </Pressable>
  );
};

export default React.memo(RenderMainFeed);

const styles = StyleSheet.create({
  main_container: {
    width: width,
  },
});
