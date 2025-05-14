import {FlatList, type ListRenderItem, StyleSheet, View} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import type {NestedPicturePost, PicturePost} from '../types/picturePost';
import RenderSinglePicture from './RenderSinglePicture';
import PictureFeedHeader from './PictureFeedHeader';
import CustomDesParser from './CustomDesParser';
import PictureFeedFooter from './PictureFeedFooter';

interface DisaplyEverySinglePictureProps {
  item: PicturePost;
  index?: number;
  selectedImageIndex?: number;
}

const DisaplyEverySinglePicture: React.FC<DisaplyEverySinglePictureProps> = ({
  item,
  selectedImageIndex,
}) => {
  const flatListRef = useRef<FlatList<NestedPicturePost>>(null);
  const user_id = item?.user_id?.toString();

  const ITEM_HEIGHT = 600;

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <PictureFeedHeader item={item} />
        <CustomDesParser text={item.description} />
        <PictureFeedFooter item={item} />
      </View>
    ),
    [item],
  );

  const renderItem: ListRenderItem<NestedPicturePost> = useCallback(
    ({item, index}) => {
      return (
        <RenderSinglePicture user_id={user_id} item={item} index={index} />
      );
    },
    [user_id],
  );

  const keyExtractor = useCallback((item: NestedPicturePost): string => {
    return item.id.toString();
  }, []);

  // Fix the type signature for getItemLayout to match FlatList expectations
  const getItemLayout = useCallback(
    (
      _data: ArrayLike<NestedPicturePost> | null | undefined,
      index: number,
    ) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index + (ListHeaderComponent ? 200 : 0),
      index,
    }),
    [ListHeaderComponent],
  );

  if (item.NestedPicturePosts.length === 0) {
    return null;
  }

  return (
    <View style={styles.main_container}>
      <FlatList
        ref={flatListRef}
        data={item.NestedPicturePosts}
        ListHeaderComponent={ListHeaderComponent}
        keyExtractor={keyExtractor}
        ListFooterComponent={() => <View style={styles.footer} />}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialScrollIndex={selectedImageIndex}
        initialNumToRender={
          selectedImageIndex !== undefined
            ? Math.max(selectedImageIndex + 2, 10)
            : 10
        }
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={false}
      />
    </View>
  );
};

export default React.memo(DisaplyEverySinglePicture);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  footer: {
    height: 10,
  },
  header: {
    flex: 1,
    marginTop: 50,
  },
});
