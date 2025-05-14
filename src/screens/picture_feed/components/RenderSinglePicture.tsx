import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useMemo} from 'react';
import type {NestedPicturePost} from '../types/picturePost';
import FastImage from '@d11/react-native-fast-image';
import {generate_link} from '../../../utils/generate_link';

interface RenderSinglePictureProps {
  user_id: string;
  item: NestedPicturePost;
  index: number;
}

const {width} = Dimensions.get('screen');

const RenderSinglePicture: React.FC<RenderSinglePictureProps> = ({item}) => {
  const imageUrl = useMemo(() => generate_link(item.img_url), [item.img_url]);

  return (
    <View style={styles.container}>
      <FastImage
        source={{uri: imageUrl}}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
};

export default React.memo(RenderSinglePicture);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: 600,
    paddingTop: 10,
    paddingBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
