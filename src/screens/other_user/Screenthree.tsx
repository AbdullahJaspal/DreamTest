import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {getItemLayout} from '../../utils/videoItemLayout';
import RenderPicture from '../profile/profile/components/RenderPicture';
import {PicturePost} from '../picture_feed/types/picturePost';

interface ScreenThreeProps {
  data?: PicturePost[];
}

const ScreenThree: React.FC<ScreenThreeProps> = ({data}) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();

  const handlePostPress = (postId: number) => {
    navigation.navigate('FeedStackNavigation', {
      screen: 'PictureFeedScreen',
      params: {postId},
    });
  };

  console.log('data', data);

  return (
    <Tabs.FlatList
      data={data}
      numColumns={3}
      keyExtractor={(_item, index) => index.toString()}
      windowSize={3}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={100}
      getItemLayout={getItemLayout}
      renderItem={({item, index}) => (
        <RenderPicture
          item={item}
          index={index}
          handlePostPress={() => handlePostPress(item.id)}
        />
      )}
      ListFooterComponent={() => <View style={styles.footer}></View>}
    />
  );
};

export default React.memo(ScreenThree);

const styles = StyleSheet.create({
  footer: {
    height: 50,
  },
});
