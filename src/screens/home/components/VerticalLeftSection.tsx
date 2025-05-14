import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Source} from '@d11/react-native-fast-image';
import * as videoApi from '../../../apis/video.api';
import {useAppSelector} from '../../../store/hooks';
import {Container, Icon} from '../../../components';
import {formatNumber} from '../../../utils/formatNumber';
import ProfileImage from '../../../components/ProfileImage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImageIcon from '../../../components/FastImageIcon';
import {BORDER, COLOR, SPACING} from '../../../configs/styles';

import {
  setCurrentComment,
  setIsShowComment,
} from '../../../store/slices/ui/mainScreenSlice';
import {
  setModalSignIn,
  setShareSheet,
  setShareContent,
  incrementFavoritesUpdateCount,
} from '../../../store/slices/ui/indexSlice';
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {selectMyProfileData} from '../../../store/selectors';
import {icons} from '../../../assets/icons';
import {gifs} from '../../../assets/gifs';

// Types
interface VerticalLeftSectionProps {
  idVideo: number;
  author: string;
  share: number;
  item: any;
  num_like: number;
  isLike: boolean;
  handleLike: () => void;
  allow_comments: boolean;
  isLikeAnimating: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  comment: number;
  onGiftPress: () => void;
  user: {
    profile_pic?: string;
    id?: number;
  };
  handleClickAvatar: () => void;
  handleDiscPress: () => void;
  isAdAvaliable: boolean;
  discAnimatedStyle: AnimatedStyle<any>;
  commentPrivacy: boolean;
}

interface ItemVerticalProps {
  source: Source;
  text: string | number | null;
  tinColor?: string;
  onPress: () => void;
  width?: number;
  height?: number;
  testID?: string;
}

/**
 * A reusable vertical item component with icon and text
 */
const ItemVertical = React.memo<ItemVerticalProps>(
  ({source, text, tinColor, onPress, width = 33, height = 33, testID}) => (
    <Container marginBottom={2} alignItems="center">
      <FastImageIcon
        source={source}
        width={width}
        height={height}
        tintColor={tinColor}
        onPress={onPress}
        testID={testID}
      />
      <Text style={styles.itemText}>{formatNumber(text as number) || 0}</Text>
    </Container>
  ),
);

/**
 * Vertical section of icons and interactions on the left side of a video
 */
const VerticalLeftSection: React.FC<VerticalLeftSectionProps> = ({
  idVideo,
  share,
  item,
  num_like,
  isLike,
  handleLike,
  allow_comments,
  isLikeAnimating,
  playVideo,
  comment = 0,
  onGiftPress,
  user,
  handleClickAvatar,
  handleDiscPress,
  isAdAvaliable,
  discAnimatedStyle,
}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const {width} = useWindowDimensions();
  const my_data = useAppSelector(selectMyProfileData);

  // State
  const [favCount, setFavCount] = useState<number>(item?.favourite || 0);
  const [isFavAnimating, setIsFavAnimating] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean>(!!item?.isFavourited);

  // Animation values
  const bookmarkScale = useSharedValue(1);

  // Animated style for bookmark
  const bookmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: bookmarkScale.value}],
  }));

  // Initialize component state
  useEffect(() => {
    if (item?.isFavourited) {
      setIsFavourite(true);
    }
    playVideo();
  }, [item?.isFavourited, playVideo]);

  // Handle share action
  const handleShare = useCallback(() => {
    if (my_data) {
      dispatch(setShareSheet(true));
      dispatch(setShareContent(item));
    } else {
      dispatch(setModalSignIn(true));
    }
  }, [my_data, dispatch, item]);

  // Handle comment section visibility
  const handleShowComment = useCallback(() => {
    if (!my_data) {
      dispatch(setModalSignIn(true));
      return;
    }

    if (allow_comments) {
      dispatch(setIsShowComment(true));
      dispatch(setCurrentComment(`${idVideo}`));
    } else {
      Alert.alert('Info', 'Comments are not allowed for this video...');
    }
  }, [idVideo, my_data, allow_comments, dispatch]);

  // Handle favorite toggle with animation
  const handleFavourite = useCallback(async () => {
    if (!my_data) {
      dispatch(setModalSignIn(true));
      return;
    }

    try {
      setIsFavAnimating(true);

      // Animate the bookmark icon
      bookmarkScale.value = withSequence(
        withTiming(1.5, {
          duration: 150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0.8, {
          duration: 100,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(1, {
          duration: 150,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      );

      // Toggle favorite state optimistically
      const newFavState = !isFavourite;
      setIsFavourite(newFavState);

      // Update count optimistically
      setFavCount(prevCount =>
        newFavState ? prevCount + 1 : Math.max(0, prevCount - 1),
      );

      // Make API call based on new state
      if (newFavState) {
        await videoApi.makeVideoFavourite(my_data?.auth_token, {
          video_id: idVideo,
        });
        dispatch(incrementFavoritesUpdateCount());
      } else {
        await videoApi.makeVideoUnFavourite(my_data?.auth_token, {
          video_id: idVideo,
        });
      }

      // End animation after completing
      setTimeout(() => setIsFavAnimating(false), 500);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert state on error
      setIsFavourite(isFavourite);
      setFavCount(item?.favourite || 0);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  }, [isFavourite, my_data, idVideo, bookmarkScale, dispatch, item?.favourite]);

  // Memoize like button properties
  const likeButtonProps = useMemo(
    () => ({
      source: isLike
        ? isLikeAnimating
          ? gifs.heart
          : icons.redHeart
        : icons.whiteHeart,
      tinColor: isLike ? 'red' : undefined,
    }),
    [isLike, isLikeAnimating],
  );

  // Calculate bottom position based on screen width
  const bottomPosition = width * 0.15;

  return (
    <Container
      position="absolute"
      left={SPACING.S1}
      bottom={bottomPosition}
      zIndex={10}>
      {/* Profile Image Section */}
      <Container alignItems="center" marginBottom={0}>
        <Container
          marginBottom={20}
          alignItems="center"
          borderRadius={BORDER.PILL}
          borderColor={COLOR.BLACK}
          borderWidth={0}>
          <ProfileImage
            uri={user?.profile_pic}
            onPress={handleClickAvatar}
            testID="profile-avatar"
          />
        </Container>

        {/* Like Button */}
        <ItemVertical
          source={likeButtonProps.source}
          text={num_like}
          onPress={handleLike}
          tinColor={likeButtonProps.tinColor}
          width={30}
          height={30}
          testID="like-button"
        />
      </Container>

      {/* Comment Button */}
      <Container marginBottom={0} marginTop={-5} alignItems="center">
        <ItemVertical
          source={icons.comments}
          text={comment}
          onPress={handleShowComment}
          width={38}
          height={38}
          testID="comment-button"
        />
      </Container>

      {/* Favorite Button */}
      <Container marginBottom={0} alignItems="center">
        <Animated.View style={bookmarkAnimatedStyle}>
          <Pressable
            onPress={handleFavourite}
            accessibilityRole="button"
            accessibilityLabel={
              isFavourite ? 'Remove from favorites' : 'Add to favorites'
            }
            testID="favorite-button">
            <FontAwesome
              name="bookmark"
              color={isFavourite ? '#ffde00' : '#fff'}
              size={28}
            />
          </Pressable>
        </Animated.View>
        <Text style={styles.itemText}>{favCount}</Text>
      </Container>

      {/* Share Button */}
      <Container marginBottom={0} marginTop={-5} alignItems="center">
        <ItemVertical
          source={icons.share}
          text={share}
          tinColor="#f7f7f7"
          onPress={handleShare}
          width={38}
          height={38}
          testID="share-button"
        />
      </Container>

      {/* Gift Button */}
      <Container marginTop={-5} marginBottom={10} alignItems="center">
        <Icon
          source={icons.gift}
          width={38}
          height={38}
          onPress={onGiftPress}
          testID="gift-button"
        />
        <Text style={styles.giftText}>{t('gift')}</Text>
      </Container>

      {/* Music/Disc Button (Conditional) */}
      {isAdAvaliable && (
        <Container alignItems="center">
          <Animated.View style={[styles.discContainer, discAnimatedStyle]}>
            <Pressable
              style={styles.discIcon}
              onPress={handleDiscPress}
              testID="disc-button">
              <Image
                source={{uri: user?.profile_pic}}
                style={styles.userImage}
              />
            </Pressable>
          </Animated.View>
          <Text style={styles.musicText}>{t('music')}</Text>
        </Container>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  iconHeart: {
    position: 'absolute',
    width: 33,
    height: 33,
    top: -1,
  },
  itemText: {
    color: COLOR.WHITE,
    marginBottom: 5,
    elevation: 10,
    shadowColor: '#000',
    fontWeight: '500',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  discContainer: {
    width: 40,
    height: 40,
  },
  discIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  musicText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginTop: 5,
  },
  giftText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});

export default React.memo(VerticalLeftSection);
