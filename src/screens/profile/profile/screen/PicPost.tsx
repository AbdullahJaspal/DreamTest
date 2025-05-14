import React, {useEffect, useState, useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useAppSelector} from '../../../../store/hooks';
import * as videoApi from '../../../../apis/video.api';
import RenderPicture from '../components/RenderPicture';
import {selectMyProfileData} from '../../../../store/selectors';
import {getItemLayout} from '../../../../utils/videoItemLayout';
import {StyleSheet, View, Text, Image} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {gifs} from '../../../../assets/gifs';
import {icons} from '../../../../assets/icons';

interface PicPostProps {
  userId?: number;
}

const PicPost: React.FC<PicPostProps> = ({userId}) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const my_data = useAppSelector(selectMyProfileData);
  const pageNo = useRef<number>(1);
  const pageSize = useRef<number>(20);

  // Fetch user posts
  const fetchUserPosts = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await videoApi.getUserPicturePosts(
        my_data.auth_token,
        pageNo.current,
        pageSize.current,
      );

      if (response && response.success && response.payload) {
        setPosts(response.payload);
      } else {
        setPosts([]);
        setError('No posts found');
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [my_data.auth_token, pageNo, pageSize]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handlePostPress = (postId: number) => {
    navigation.navigate('FeedStackNavigation', {
      screen: 'PictureFeedScreen',
      params: {
        postId,
        isUserPost: true,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <FastImage source={gifs.tiktokLoader} style={styles.loader} />
      </View>
    );
  }

  return (
    <Tabs.FlatList
      ListHeaderComponent={() => (
        <>
          {(!posts || posts.length === 0) && (
            <View style={styles.emptyContainer}>
              <Image source={icons.cam} style={styles.empty_image} />
              <Text style={styles.emptyText}>
                {error || t('No picture posts available!')}
              </Text>
            </View>
          )}
          <View style={styles.header} />
        </>
      )}
      data={posts}
      numColumns={3}
      windowSize={3}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={100}
      getItemLayout={getItemLayout}
      keyExtractor={item => `post-${item.id}`}
      renderItem={({item, index}) => (
        <RenderPicture
          item={item}
          index={index}
          handlePostPress={() => handlePostPress(item.id)}
        />
      )}
      onRefresh={fetchUserPosts}
      refreshing={loading}
      contentContainerStyle={styles.listContent}
    />
  );
};
const styles = StyleSheet.create({
  header: {
    height: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  empty_image: {
    width: 70,
    height: 70,
    marginBottom: 20,
    resizeMode: 'contain',
    tintColor: '#646464',
  },
  loader: {
    width: 40,
    height: 40,
  },
  listContent: {
    paddingBottom: 20,
    minHeight: 300,
  },
});

export default React.memo(PicPost);
