import React, {useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import {PicturePost} from '../types/picturePost';
import {PictureFeedScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

import {formatNumber} from '../../../utils/formatNumber';

import {
  setCurrentCommentUserIds,
  setSharePostRootId,
} from '../../../store/slices/content/pictureSlice';
import {useSocket} from '../../../socket/SocketProvider';
import {POST_EVENTS} from '../../../socket/events';

import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('window');

interface PictureFeedFooterProps {
  item: PicturePost;
  index?: number;
}

interface PostAction {
  post_id: number;
  post_user_id: number;
}

const PictureFeedFooter: React.FC<PictureFeedFooterProps> = ({item}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<PictureFeedScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);

  // Use the centralized socket hook
  const {isConnected, emit} = useSocket();

  const [isLikeAnimating, setLikeAnimating] = useState<boolean>(false);
  const noOfLike = useRef<number>(item?.respectedRootPostLike?.length);

  const [isLike, setLike] = useState<boolean>(
    item?.respectedRootPostLike?.some(like => like.sender_id === my_data?.id) ||
      false,
  );

  // Create post action data object
  const postActionData: PostAction = {
    post_id: item.id,
    post_user_id: item.user.id,
  };

  // Handle like/unlike press
  function handleLikePress(_event: GestureResponderEvent): void {
    if (!isConnected) {
      Toast.show(
        'Not connected to server. Please try again later.',
        Toast.SHORT,
      );
      return;
    }

    if (isLike) {
      // Unlike the post
      noOfLike.current = noOfLike.current - 1;
      setLike(false);
      emit(POST_EVENTS.UNLIKE_POST, postActionData);
    } else {
      // Like the post
      setLikeAnimating(true);
      noOfLike.current = noOfLike.current + 1;
      setLike(true);
      emit(POST_EVENTS.LIKE_POST, postActionData);

      // Reset animation after 1 second
      setTimeout(() => {
        setLikeAnimating(false);
      }, 1000);
    }
  }

  // Track post view
  function handleViewPress(_event: GestureResponderEvent): void {
    if (isConnected) {
      emit('picture_post_new_view', postActionData);
    }
  }

  // Navigate to comment screen
  function handleCommentPress(_event: GestureResponderEvent): void {
    if (item.allow_comments) {
      dispatch(setCurrentCommentUserIds(item.user.id));
      navigation.navigate('CommentScreen', {root_post_id: item.id});
    } else {
      Toast.show('Comments are not allowed for this post', Toast.LONG);
    }
  }

  // Handle post sharing
  function handleSharePress(_event: GestureResponderEvent): void {
    if (!isConnected) {
      Toast.show(
        'Not connected to server. Please try again later.',
        Toast.SHORT,
      );
      return;
    }

    dispatch(setSharePostRootId(item.id));

    // Track share event
    emit(POST_EVENTS.SHARE_POST, postActionData);
  }

  const renderLikeImage = useMemo(() => {
    if (isLike) {
      return <Image source={icons.feedLike} style={styles.hrt_img} />;
    } else {
      return (
        <Image
          source={icons.feedLike}
          style={[styles.hrt_img, {tintColor: 'red'}]}
        />
      );
    }
  }, [isLike]);

  return (
    <Pressable style={styles.main_container}>
      <Pressable
        style={styles.like_view}
        onPress={handleLikePress}
        accessible={true}
        accessibilityLabel={isLike ? 'Unlike' : 'Like'}
        accessibilityHint={isLike ? 'Unlike this post' : 'Like this post'}>
        <Image
          source={isLike ? icons.feedLikeActive : icons.feedLike}
          style={[styles.view_img]}
        />
        <Text style={styles.info_txt}>{formatNumber(noOfLike.current)}</Text>
      </Pressable>

      <Pressable
        style={styles.like_view}
        onPress={handleViewPress}
        accessible={true}
        accessibilityLabel="Views"
        accessibilityHint="Post views count">
        <Image source={icons.feedView} style={styles.view_img} />
        <Text style={styles.info_txt}>{formatNumber(item?.view)}</Text>
      </Pressable>

      <Pressable
        style={styles.like_view}
        onPress={handleCommentPress}
        accessible={true}
        accessibilityLabel="Comments"
        accessibilityHint="View or add comments to this post">
        <Image source={icons.feedComment} style={styles.view_img} />
        <Text style={styles.info_txt}>{formatNumber(item?.comment)}</Text>
      </Pressable>

      <Pressable
        style={styles.like_view}
        onPress={handleSharePress}
        accessible={true}
        accessibilityLabel="Share"
        accessibilityHint="Share this post with others">
        <Image source={icons.feedShare} style={styles.share_img} />
        <Text style={styles.info_txt}>{formatNumber(item?.share)}</Text>
      </Pressable>
    </Pressable>
  );
};

export default React.memo(PictureFeedFooter);

const styles = StyleSheet.create({
  main_container: {
    width: width - 10,
    backgroundColor: 'rgba(0, 0, 0, 0.0.5)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 10,
  },
  like_view: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 10,
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
  },
});
