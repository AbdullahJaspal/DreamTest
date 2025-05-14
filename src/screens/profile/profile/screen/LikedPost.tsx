import {StyleSheet, View, Text, Image} from 'react-native';
import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {VideoData} from '../../../other_user/types/VideoData';
import RenderPost from '../../../other_user/RenderPost';
import {useNavigation} from '@react-navigation/native';
import {ProfileScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {WatchVideoProfileActionEnum} from '../../../../enum/WatchProfileActionEnum';
import {icons} from '../../../../assets/icons';
interface LikedPostProps {
  data?: VideoData[];
}

const LikedPost: React.FC<LikedPostProps> = ({data}) => {
  const navigation = useNavigation<ProfileScreenNavigationProps>();

  function handlePostPress(
    video_id: number,
    user_id: number,
    index: number,
  ): void {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.MY_LIKED_VIDEO,
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
      ListFooterComponent={() => <View style={styles.footer_view} />}
      // ListHeaderComponent={() => <View style={styles.header} />}
      ListHeaderComponent={() => (
        <>
          {(!data || data.length === 0) && (
            <View style={styles.emptyContainer}>
              <Image source={icons.love} style={styles.empty_image} />
              <Text style={styles.emptyText}>No liked posts available!</Text>
            </View>
          )}
          <View style={styles.header} />
        </>
      )}
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

export default React.memo(LikedPost);

const styles = StyleSheet.create({
  footer_view: {
    marginBottom: 60,
  },
  header: {
    height: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
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
});
