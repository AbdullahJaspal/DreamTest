import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {NestedPicturePost} from '../types/picturePost';
import {formatNumber} from '../../../utils/formatNumber';
import {useSocket} from '../../../socket/SocketProvider';
import Toast from 'react-native-simple-toast';
import {selectMyProfileData} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';
import {icons} from '../../../assets/icons';
import {gifs} from '../../../assets/gifs';

const NESTED_POST_EVENTS = {
  LIKE_NESTED_POST: 'like_picture_nested_post',
  UNLIKE_NESTED_POST: 'dislike_picture_nested_post',
};

interface SinglePictureFooterProps {
  item: NestedPicturePost;
  index?: number;
  user_id?: number;
}

const {width} = Dimensions.get('screen');

const SinglePictureFooter: React.FC<SinglePictureFooterProps> = ({
  item,
  user_id,
}) => {
  // Use the centralized socket hook
  const {isConnected, emit} = useSocket();

  const my_data = useAppSelector(selectMyProfileData);
  const noOfLike = useRef<number>(item?.respectedNestedPostLike?.length);
  const [isLikeAnimating, setLikeAnimating] = useState<boolean>(false);

  const [isLike, setLike] = useState<boolean>(
    item?.respectedNestedPostLike?.some(
      like => like.sender_id === my_data?.id,
    ) || false,
  );

  // Handle like/unlike action
  function handleLikePress(_event: GestureResponderEvent): void {
    if (!isConnected) {
      Toast.show(
        'Not connected to server. Please try again later.',
        Toast.SHORT,
      );
      return;
    }

    const postData = {
      post_id: item.id,
      post_user_id: user_id,
    };

    if (isLike) {
      // Unlike post
      noOfLike.current = noOfLike.current - 1;
      setLike(false);
      emit(NESTED_POST_EVENTS.UNLIKE_NESTED_POST, postData);
    } else {
      // Like post with animation
      setLikeAnimating(true);
      noOfLike.current = noOfLike.current + 1;
      setLike(true);
      emit(NESTED_POST_EVENTS.LIKE_NESTED_POST, postData);

      // Reset animation after 1 second
      setTimeout(() => {
        setLikeAnimating(false);
      }, 1000);
    }
  }

  // Render different heart images based on state
  const renderLikeImage = useMemo(() => {
    if (isLikeAnimating) {
      return <Image source={gifs.heart} style={styles.hrt_img} />;
    } else if (isLike) {
      return <Image source={icons.redHeart} style={styles.hrt_img} />;
    } else {
      return <Image source={icons.whiteHeart} style={styles.hrt_img} />;
    }
  }, [isLike, isLikeAnimating]);

  return (
    <View style={styles.main_container}>
      <TouchableOpacity
        style={styles.like_view}
        onPress={handleLikePress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={isLike ? 'Unlike' : 'Like'}
        accessibilityHint={
          isLike ? 'Remove your like from this post' : 'Like this post'
        }>
        {renderLikeImage}
        <Text style={styles.info_txt}>{formatNumber(noOfLike.current)}</Text>
      </TouchableOpacity>

      {/* Commented out UI elements preserved for reference */}
    </View>
  );
};

export default React.memo(SinglePictureFooter);

const styles = StyleSheet.create({
  main_container: {
    width: width - 10,
    backgroundColor: 'rgba(0, 0, 0, 0.0.5)',
    alignItems: 'flex-start',
    marginHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 10,
    paddingLeft: 25,
  },
  like_view: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  hrt_img: {
    width: 20,
    height: 20,
  },
  comment_img: {
    width: 25,
    height: 25,
  },
  share_img: {
    width: 25,
    height: 25,
  },
  view_img: {
    width: 25,
    height: 25,
  },
  info_txt: {
    fontSize: 14,
    marginLeft: 5,
    color: '#fff',
  },
});
