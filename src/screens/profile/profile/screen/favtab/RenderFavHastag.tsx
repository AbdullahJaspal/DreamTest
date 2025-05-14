import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as hashtagApi from '../../../../../apis/hashtag.api';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../../assets/icons';
import FastImage from '@d11/react-native-fast-image';

interface RenderFavHastagProps {
  data?: string[];
}

interface RenderHastagProps {
  item: any;
  index: number;
}

const {width} = Dimensions.get('screen');

const RenderFavHastag: React.FC<RenderFavHastagProps> = ({data}) => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const fetchVideoThroughTag = useCallback(
    async (tag_id: number, title: string, post: number) => {
      try {
        const getVideoThroughTag = await hashtagApi.getVideoThroughTag(tag_id);
        const videoAssociations = getVideoThroughTag.payload.map(
          (item: any) => item.videoAssociation,
        );
        if (getVideoThroughTag) {
          navigation.navigate('HashtagScreen', {
            VideoThroughTag: videoAssociations,
            title: title,
            post: post,
            tag_id: tag_id,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const RenderHastag: React.FC<RenderHastagProps> = ({item, index}) => {
    const handleContainerPress = () => {
      fetchVideoThroughTag(item.tag_id, item.title, item.num_of_video);
    };

    return (
      <Pressable style={styles.main_container} onPress={handleContainerPress}>
        <View style={styles.left_container}>
          <View style={styles.hastag_button}>
            <FastImage
              source={icons.hashtag}
              style={styles.hastag_img}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View>
            <Text style={styles.title_txt}>{item?.title}</Text>
          </View>
        </View>

        <View style={styles.right_container}>
          <Text style={styles.video_info_txt}>
            {item?.num_of_video} {t('Videos')}
          </Text>
          <AntDesign name="right" size={15} color={'#000'} />
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => <RenderHastag item={item} index={index} />}
    />
  );
};

export default RenderFavHastag;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hastag_img: {
    width: 20,
    height: 20,
  },
  left_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title_txt: {
    fontSize: 18,
    color: '#000',
    marginLeft: 10,
  },
  hastag_button: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(53,34,195,1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  right_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  video_info_txt: {
    color: '#000',
    marginRight: 5,
    fontSize: 14,
    textAlign: 'left',
  },
});
