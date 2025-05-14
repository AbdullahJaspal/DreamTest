import {HomeScreenNavigationProps} from '../../../../../types/screenNavigationAndRoute';
import RenderPicture from '../../../../profile/profile/components/RenderPicture';
import {StyleSheet, View, FlatList, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import React, {useMemo} from 'react';

interface RenderFavFeedProps {
  data?: any[];
}

const RenderFavFeed: React.FC<RenderFavFeedProps> = ({data}) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();

  const favoritePostsFromProps = data || [];
  const favoritePostsFromRedux = useSelector(
    (state: any) => state?.picture_post?.favoritePosts || [],
  );

  const favoritePosts = useMemo(() => {
    return data ? favoritePostsFromProps : favoritePostsFromRedux;
  }, [data, favoritePostsFromRedux, favoritePostsFromProps]);

  const processedPosts = useMemo(() => {
    return favoritePosts.map((item: any) => {
      if (item.RootPicturePost) {
        return {
          ...item.RootPicturePost,
          id: item.RootPicturePost.id || item.picture_post_id,
          favorite_id: item.id,
        };
      }
      return item;
    });
  }, [favoritePosts]);

  const handlePostPress = (postId: number) => {
    navigation.navigate('FeedStackNavigation', {
      screen: 'PictureFeedScreen',
      params: {postId},
    });
  };

  if (processedPosts.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No favorite posts yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={processedPosts}
        numColumns={3}
        windowSize={3}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        removeClippedSubviews={true}
        keyExtractor={(item, index) => `favorite-feed-${item.id || index}`}
        renderItem={({item, index}) => (
          <RenderPicture
            item={item}
            index={index}
            handlePostPress={() => {
              handlePostPress(item.id);
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default React.memo(RenderFavFeed);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
