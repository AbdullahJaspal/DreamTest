import React, {useCallback, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  Linking,
  Pressable,
  View,
  FlatList,
  ListRenderItem,
  useWindowDimensions,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface AdItem {
  Image: string;
  links: string;
  id?: string | number;
}

/**
 * Props for VideoMainAd component
 */
interface VideoMainAdProps {
  linkwithimg: AdItem[];
}

/**
 * A component that displays a horizontal scrollable list of ads
 */
const VideoMainAd: React.FC<VideoMainAdProps> = ({linkwithimg = []}) => {
  // Get screen dimensions for responsive layout
  const {width} = useWindowDimensions();

  // Reference to the FlatList
  const flatListRef = useRef<FlatList<AdItem>>(null);

  // Calculate item width based on screen width
  const itemWidth = width * 0.25;

  // Calculate container width based on screen width
  const containerWidth = width * 0.36;

  // Memozied initial scroll index - only recalculate when linkwithimg changes
  const initialScrollIndex = useMemo(() => {
    return Math.max(0, linkwithimg.length - 1);
  }, [linkwithimg.length]);

  /**
   * Handle pressing the "look more" button to scroll back to start
   */
  const handleViewMorePress = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  }, []);

  /**
   * Handle opening an ad link
   */
  const handleOpenLink = useCallback((url: string) => {
    if (url) {
      Linking.openURL(url).catch(err =>
        console.error('Failed to open URL:', err),
      );
    }
  }, []);

  /**
   * Render a single ad item
   */
  const renderItem: ListRenderItem<AdItem> = useCallback(
    ({item}) => {
      const imageUrl = `https://dpcst9y3un003.cloudfront.net/${item.Image}`;

      return (
        <Pressable
          style={[styles.itemContainer, {width: itemWidth}]}
          onPress={() => handleOpenLink(item.links)}
          accessibilityRole="button"
          accessibilityLabel="Advertisement">
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>
      );
    },
    [itemWidth, handleOpenLink],
  );

  /**
   * Provide layout information for FlatList items for better performance
   */
  const getItemLayout = useCallback(
    (data: AdItem[] | null | undefined, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth],
  );

  /**
   * Key extractor for FlatList items
   */
  const keyExtractor = useCallback(
    (item: AdItem, index: number) => item.id?.toString() || index.toString(),
    [],
  );

  // Don't render if there are no ads
  if (!linkwithimg || linkwithimg.length === 0) {
    return null;
  }

  return (
    <View style={[styles.adContainer, {width: containerWidth}]}>
      {/* Header with Ad label and "look more" button */}
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Ad</Text>
        <Pressable
          style={styles.viewMore}
          onPress={handleViewMorePress}
          accessibilityRole="button"
          accessibilityLabel="Look at more ads">
          <AntDesign name="swapleft" color="#000" size={15} />
          <Text style={styles.headerText}>look more</Text>
        </Pressable>
      </View>

      {/* Horizontal scrolling ad list */}
      <FlatList
        ref={flatListRef}
        data={linkwithimg}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={true}
        initialScrollIndex={initialScrollIndex}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        removeClippedSubviews={Platform.OS === 'android'}
        windowSize={3}
        maxToRenderPerBatch={3}
        initialNumToRender={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    position: 'absolute',
    left: 0,
    bottom: 5,
    height: 130,
    backgroundColor: 'rgba(239, 215, 86, 0.30)',
    zIndex: 1000000,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 0,
  },
  itemContainer: {
    marginTop: 5,
    paddingHorizontal: 3,
    height: 95,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 10,
    height: 15,
  },
  headerText: {
    fontSize: 10,
    color: '#000',
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    paddingRight: 5,
  },
});

export default React.memo(VideoMainAd);
