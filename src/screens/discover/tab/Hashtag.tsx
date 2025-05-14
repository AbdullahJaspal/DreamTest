import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import EmptyScreen from '../../../utils/emptyScreen';
import {useIsFocused} from '@react-navigation/native';
import {HashtagProps} from '../types/CountrySelection';
import {COLOR, SPACING} from '../../../configs/styles';
import * as hashtagApi from '../../../apis/hashtag.api';
import {selectTxtSearch} from '../../../store/selectors';
import RenderSearchHastag from '../components/RenderSearchHastag';
import {icons} from '../../../assets/icons';

const Hashtag: React.FC = () => {
  const {t, i18n} = useTranslation();
  const isFocused = useIsFocused();
  const searchQuery = useAppSelector(selectTxtSearch);

  const [hashtags, setHashtags] = useState<HashtagProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchHashtags = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return;

      if (reset) {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoading(page === 1);
        setLoadingMore(page > 1);
      }

      try {
        const response = await hashtagApi.getHashtags(
          searchQuery,
          reset ? 1 : page,
          10,
        );

        if (reset) {
          setHashtags(response.payload);
        } else if (response.payload.length > 0) {
          setHashtags(prev => [...prev, ...response.payload]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching hashtags:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [page, searchQuery, hasMore],
  );

  useEffect(() => {
    if (isFocused) {
      fetchHashtags(true);
    }
  }, [fetchHashtags, isFocused]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    fetchHashtags(true);
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={COLOR.BLACK} />
        </View>
      );
    } else {
      return (
        <View style={{marginTop: 150}}>
          {!loading && hashtags.length === 0 && (
            <EmptyScreen
              message={t('You are all caught up!')}
              imageSource={icons.hashtag}
              imageStyle={{tintColor: '#ccc', width: 50, height: 50}} // Example of overriding styles
            />
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLOR.BLACK} />
        </View>
      ) : (
        <FlatList
          data={hashtags}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({item, index}) => (
            <RenderSearchHastag item={item} index={index} />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          // ListEmptyComponent={
          //   <View style={styles.messageContainer}>
          //     <Text style={styles.messageText}>No hashtags found</Text>
          //   </View>
          // }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingTop: SPACING.S2,
    paddingBottom: SPACING.S8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    paddingVertical: SPACING.S4,
    alignItems: 'center',
  },
  messageText: {
    color: COLOR.GRAY,
    fontSize: 16,
  },
});

export default Hashtag;
