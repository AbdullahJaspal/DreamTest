import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import RenderPost from './RenderPost';
import {VideoData} from './types/VideoData';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {WatchProfileVideoScreenNavigationProps} from '../../types/screenNavigationAndRoute';
import {WatchVideoProfileActionEnum} from '../../enum/WatchProfileActionEnum';
import {getItemLayout} from '../../utils/videoItemLayout';

interface ScreenTwoProps {
  data?: VideoData[];
}

const Screentwo: React.FC<ScreenTwoProps> = ({data}) => {
  const navigation = useNavigation<WatchProfileVideoScreenNavigationProps>();

  function handlePostPress(
    video_id: number,
    user_id: number,
    index: number,
  ): void {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.ANOTHER_USER_LIKED_VIDEO,
      respected_action_data: user_id,
      current_video_id: video_id,
      current_index: index,
    });
  }

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
        <RenderPost
          item={item}
          index={index}
          handlePostPress={handlePostPress}
        />
      )}
      ListFooterComponent={() => <View style={styles.footer}></View>}
    />
  );
};

export default React.memo(Screentwo);

const styles = StyleSheet.create({
  footer: {
    height: 50,
  },
});
