import React, {useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import type {PictureFeedScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import CustomDesParser from '../../../picture_feed/components/CustomDesParser';
import Octicons from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import ConfirmModal from '../../../../components/ConfirmModal';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {decrementFavoritesPostCount} from '../../../../store/slices/content/pictureSlice';
import {useSocket} from '../../../../socket/SocketProvider';
import {POST_EVENTS} from '../../../../socket/events';
const {width} = Dimensions.get('window');

interface FastImageBackgroundProps {
  source: any;
  style?: any;
  children?: React.ReactNode;
}

const FastImageBackground: React.FC<FastImageBackgroundProps> = ({
  source,
  style,
  children,
}) => {
  return (
    <View style={[styles.imageBackgroundContainer, style]}>
      <FastImage
        source={source}
        style={[StyleSheet.absoluteFill]}
        resizeMode={FastImage.resizeMode.cover}
      />
      {children}
    </View>
  );
};

interface RenderPictureProps {
  item: any;
  index: number;
  handlePostPress: (event: GestureResponderEvent) => void;
}

const RenderPicture: React.FC<RenderPictureProps> = ({
  item,
  index,
  handlePostPress,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigation = useNavigation<PictureFeedScreenNavigationProps>();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {emit} = useSocket();

  // Handle nested structure for image URL
  let imageUrl = '';

  if (item?.NestedPicturePosts && item.NestedPicturePosts.length > 0) {
    imageUrl = item.NestedPicturePosts[0].img_url;
  } else if (item?.img_url) {
    imageUrl = item.img_url;
  } else if (item?.user?.profile_pic) {
    imageUrl = item.user.profile_pic;
  }

  const likeCount = typeof item?.like === 'number' ? item.like : 0;
  const viewCount = typeof item?.view === 'number' ? item.view : 0;
  const description =
    typeof item?.description === 'string' ? item.description : '';
  const postId = item?.id || item?.picture_post_id;
  const favoriteId = item?.favorite_id || postId;

  // Check if we have a valid image URL
  if (!imageUrl) {
    console.warn('No image URL found for item:', item);
    return null;
  }

  // Determine the full image URL
  const fullImageUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `https://dpcst9y3un003.cloudfront.net/${imageUrl}`;

  const handleLongPress = () => {
    setShowConfirmModal(true);
  };

  const handleRemoveFavorite = () => {
    emit(
      POST_EVENTS.REMOVE_FROM_FAVORITES,
      {post_id: postId},
      (res: {success: boolean; message?: string}) => {
        if (res.success) {
          dispatch(decrementFavoritesPostCount());
          setShowConfirmModal(false);
          Toast.show(t('Removed from favorites'), Toast.SHORT);
        } else {
          Toast.show(
            t(res.message || 'Failed to remove favorite'),
            Toast.SHORT,
          );
        }
      },
    );
  };

  return (
    <>
      <Pressable
        style={styles.main_container}
        onPress={handlePostPress}
        onLongPress={handleLongPress}>
        <FastImageBackground
          source={{
            uri: fullImageUrl,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.image_style}>
          <View style={styles.image_bottom_view}>
            <View style={styles.paused_section}>
              <Entypo name="eye" size={12} color={'#fff'} />
              <Text style={styles.txt}>{viewCount}</Text>
            </View>

            <View style={styles.paused_section}>
              <Octicons name="heart-fill" size={12} color={'#DE152D'} />
              <Text style={styles.txt}>{likeCount}</Text>
            </View>
          </View>
        </FastImageBackground>
        <View style={styles.description}>
          <CustomDesParser
            text={description || ''}
            hideMoreButton={false}
            boldFirstWord={true}
            lineBreakAfterFirstWord={true}
            maxLength={22}
          />
        </View>
      </Pressable>

      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleRemoveFavorite()}
        title={t('Remove from favorites')}
        message={t('Are you sure you want to remove this post from favorites?')}
        confirmText={t('Remove')}
        confirmColor="#fff"
        cancelText={t('Cancel')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    overflow: 'hidden',
  },
  image_style: {
    width: width / 3,
    height: 180,
  },
  main_container: {
    width: width / 3,
    borderWidth: 2,
    borderColor: '#fff',
  },
  image_upper_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 5,
    width: width / 3,
    paddingHorizontal: 10,
    right: 5,
  },
  txt: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
  desc_txt_head: {
    color: '#000',
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
  },
  paused_section: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image_bottom_view: {
    flexDirection: 'row',
    width: width * 0.33,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  time_view: {
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  time_txt: {
    color: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  description: {
    fontSize: 10,
    width: width / 3,
    minHeight: 40,
    maxHeight: 'auto',
    backgroundColor: '#fff',
  },
});

export default React.memo(RenderPicture);
