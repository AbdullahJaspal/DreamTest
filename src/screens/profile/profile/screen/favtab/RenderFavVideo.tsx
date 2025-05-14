import {FlatList, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {VideoData} from '../../../../other_user/types/VideoData';
import RenderPost from '../../../../other_user/RenderPost';
import {ProfileScreenNavigationProps} from '../../../../../types/screenNavigationAndRoute';
import {WatchVideoProfileActionEnum} from '../../../../../enum/WatchProfileActionEnum';
import {getItemLayout} from '../../../../../utils/videoItemLayout';

interface RenderFavVideoProps {
  data?: VideoData[];
}

const RenderFavVideo: React.FC<RenderFavVideoProps> = ({data}) => {
  const navigation = useNavigation<ProfileScreenNavigationProps>();

  function handlePostPress(
    video_id: number,
    user_id: number,
    index: number,
  ): void {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.MY_FAVOURITE_VIDEO,
      respected_action_data: user_id,
      current_video_id: video_id,
      current_index: index,
    });
  }

  return (
    <FlatList
      data={data}
      numColumns={3}
      windowSize={3}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={100}
      getItemLayout={getItemLayout}
      keyExtractor={(_item, index) => index.toString()}
      ListFooterComponent={() => <View style={styles.footer_view} />}
      renderItem={({item, index}) => (
        <RenderPost
          item={item}
          index={index}
          handlePostPress={handlePostPress}
        />
      )}
    />
  );
};

export default React.memo(RenderFavVideo);

const styles = StyleSheet.create({
  footer_view: {
    marginBottom: 60,
  },
});
