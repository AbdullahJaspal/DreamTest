import {StyleSheet, Text, View, FlatList, Image} from 'react-native';
import React from 'react';
import RenderComment from './RenderComment';

import {useTranslation} from 'react-i18next';
interface CommentScreenProps {
  data: any[];
}

const CommentScreen: React.FC<CommentScreenProps> = ({data}) => {
  const {t, i18n} = useTranslation();
  const renderEmptyContainer = () => (
    <View style={styles.emptyContainer}>
      <Image source={icons.comments} style={styles.empty_image} />
      <Text style={styles.emptyText}>{t('No Comments Found')}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.footerSpacing} />}
        renderItem={({item, index}) => (
          <RenderComment item={item} index={index} />
        )}
        ListEmptyComponent={renderEmptyContainer}
      />
    </View>
  );
};

export default React.memo(CommentScreen);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginBottom: 40,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  footerSpacing: {
    height: 30,
  },
  empty_image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    tintColor: '#C9B5B5',
  },
});
