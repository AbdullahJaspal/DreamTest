import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {VideoData} from './types/VideoData';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import * as vedioapi from '../../apis/video.api';
import {useAppSelector} from '../../store/hooks';
import {formatNumber} from '../../utils/formatNumber';
import LinearGradient from 'react-native-linear-gradient';
import ConfirmModal from '../../components/ConfirmModal';
import {selectMyProfileData} from '../../store/selectors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {decrementFavoritesUpdateCount} from '../../store/slices/ui/indexSlice';
import {useDispatch} from 'react-redux';
import {icons} from '../../assets/icons';

const {width} = Dimensions.get('screen');

const colors = [
  'rgba(0, 0, 0, 0.1)',
  'rgba(0, 0, 0, 0.125)',
  'rgba(0, 0, 0, 0.15)',
  'rgba(0, 0, 0, 0.175)',
  'rgba(0, 0, 0, 0.2)',
  'rgba(0, 0, 0, 0.225)',
  'rgba(0, 0, 0, 0.25)',
  'rgba(0, 0, 0, 0.275)',
  'rgba(0, 0, 0, 0.3)',
  'rgba(0, 0, 0, 0.325)',
  'rgba(0, 0, 0, 0.35)',
];

// Create a FastImage background component with LinearGradient
interface FastImageWithGradientProps {
  source: any;
  style?: any;
  children?: React.ReactNode;
}

const FastImageWithGradient: React.FC<FastImageWithGradientProps> = ({
  source,
  style,
  children,
}) => {
  return (
    <View style={[styles.fastImageContainer, style]}>
      <FastImage
        source={source}
        style={[StyleSheet.absoluteFill]}
        resizeMode={FastImage.resizeMode.cover}
      />
      <LinearGradient style={{flex: 1}} colors={colors}>
        {children}
      </LinearGradient>
    </View>
  );
};

interface RenderPostProps {
  item: VideoData;
  index: number;
  handlePostPress: (video_id: number, user_id: number, index: number) => void;
}

const RenderPost: React.FC<RenderPostProps> = ({
  item,
  index,
  handlePostPress,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const my_data = useAppSelector(selectMyProfileData);

  const handlePress = useCallback(() => {
    handlePostPress(item?.id, item?.user_id, index);
  }, [handlePostPress, item?.id, item?.user_id, index]);

  const handleRemoveFav = async (vidoeId: number) => {
    try {
      const res = await vedioapi.makeVideoUnFavourite(my_data?.auth_token, {
        video_id: vidoeId,
      });
      dispatch(decrementFavoritesUpdateCount());
      Toast.show('Video Removed from Favourites', Toast.LONG);
    } catch (error) {
      console.error('Error removing favorite user:', error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Prepare the image source with FastImage caching options
  const imageSource = item?.thum
    ? {
        uri: `https://dpcst9y3un003.cloudfront.net/${item.thum}`,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }
    : {
        uri: 'https://',
        priority: FastImage.priority.low,
      };

  return (
    <>
      <Pressable
        onPress={handlePress}
        onLongPress={() => setShowConfirmModal(true)}
        style={styles.main_container}>
        <FastImageWithGradient source={imageSource} style={styles.image_style}>
          <View style={styles.image_bottom}>
            <View style={styles.paused_section}>
              <AntDesign name="caretright" size={14} color={'white'} />
              <Text style={[styles.txt, {color: 'white', textAlign: 'center'}]}>
                {formatNumber(item?.view || 0)}
              </Text>
            </View>

            <View style={styles.image_upper_view}>
              <Image source={icons.diamond} style={{width: 20, height: 20}} />
              <Text style={styles.txt}>
                {formatNumber(item?.diamond_value || 0)}
              </Text>
            </View>
          </View>
        </FastImageWithGradient>
      </Pressable>
      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleRemoveFav(item?.id)}
        title={t('Remove from favorites')}
        message={t(
          'Are you sure you want to remove this Video from favorites?',
        )}
        confirmText={t('Remove')}
        confirmColor="#fff"
        cancelText={t('Cancel')}
      />
    </>
  );
};

export default React.memo(RenderPost);

const styles = StyleSheet.create({
  fastImageContainer: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  image_style: {
    width: width / 3.045,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  main_container: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  image_upper_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txt: {
    color: 'yellow',
    marginLeft: 2,
  },
  paused_section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image_bottom_view: {
    flexDirection: 'row',
    width: width * 0.3,
    position: 'absolute',
    bottom: 26,
    justifyContent: 'space-around',
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  image_bottom: {
    flexDirection: 'row',
    width: width * 0.3,
    position: 'absolute',
    bottom: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
});
