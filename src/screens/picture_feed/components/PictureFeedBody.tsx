import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import type {PicturePost} from '../types/picturePost';
import {generate_link} from '../../../utils/generate_link';
import SelectedPictureMedia from '../../newVideo/components/SelectedPictureMedia';
import CustomDesParser from './CustomDesParser';

interface PictureFeedBodyProps {
  item: PicturePost;
  index: number;
  onImagePress?: (imageIndex: number) => void;
}

const {width} = Dimensions.get('screen');

const PictureFeedBody: React.FC<PictureFeedBodyProps> = ({
  item,
  onImagePress,
}) => {
  const pictureURLs = useMemo(() => {
    return item.NestedPicturePosts.map(it => generate_link(it.img_url));
  }, [item.NestedPicturePosts]);

  return (
    <View style={styles.main_container}>
      <CustomDesParser text={item.description} />
      <SelectedPictureMedia
        pictureURLs={pictureURLs}
        onImagePress={onImagePress}
      />
    </View>
  );
};

export default React.memo(PictureFeedBody);

const styles = StyleSheet.create({
  main_container: {
    width: width,
    paddingHorizontal: 0,
    marginVertical: 5,
  },
});
