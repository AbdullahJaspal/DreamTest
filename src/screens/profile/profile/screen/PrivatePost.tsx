import {StyleSheet, View, Text, Image} from 'react-native';
import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import {VideoData} from '../../../other_user/types/VideoData';
import RenderPost from '../../../other_user/RenderPost';
import {ProfileScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {useNavigation} from '@react-navigation/native';
import {WatchVideoProfileActionEnum} from '../../../../enum/WatchProfileActionEnum';
import {icons} from '../../../../assets/icons';

interface PrivatePostProps {
  data?: VideoData[];
}

const PrivatePost: React.FC<PrivatePostProps> = ({data}) => {
  const navigation = useNavigation<ProfileScreenNavigationProps>();

  function handlePostPress(
    video_id: number,
    user_id: number,
    index: number,
  ): void {
    navigation.navigate('WatchProfileVideo', {
      action_name: WatchVideoProfileActionEnum.MY_PRIVATE_VIDEO,
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
      ListHeaderComponent={() => (
        <>
          {(!data || data.length === 0) && (
            <View style={styles.emptyContainer}>
              <Image source={icons.lock} style={styles.empty_image} />
              <Text style={styles.emptyText}>No private posts available!</Text>
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

export default React.memo(PrivatePost);

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
    tintColor: 100,
  },
});
