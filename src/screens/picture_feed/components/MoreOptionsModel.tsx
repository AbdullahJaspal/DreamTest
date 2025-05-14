import React, {useMemo, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {PicturePost} from '../types/picturePost';
import {POST_EVENTS} from '../../../socket/events';
import {useAppSelector} from '../../../store/hooks';
import {useNavigation} from '@react-navigation/native';
import * as imagePostApi from '../../../apis/video.api';
import * as addBlockedUser from '../../../apis/userApi';
import {useSocket} from '../../../socket/SocketProvider';
import Clipboard from '@react-native-clipboard/clipboard';
import {SERVER_API_URL} from '../../../constants/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ConfirmModal from '../../../components/ConfirmModal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  setPostData,
  toggleShowMoreOptions,
  addBlockedUserId,
  hidePost,
  setSharePostRootId,
  addToFavorites,
  removePost,
  setFavouritePosts,
} from '../../../store/slices/content/pictureSlice';
import {
  selectMyProfileData,
  selectPicturePostData,
  selectShowMoreOptions,
} from '../../../store/selectors';

interface ConfirmModalState {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: string;
  onConfirm: () => void;
}

const MoreOptionsModel: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {emit} = useSocket();

  const my_data = useAppSelector(selectMyProfileData);
  const postData: PicturePost = useAppSelector(selectPicturePostData);
  const showMoreOptions = useAppSelector(selectShowMoreOptions);
  const containerHeight = postData?.user?.id === my_data?.id ? '40%' : '65%';
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => {},
  });

  function onMoreButtonClose(): void {
    dispatch(toggleShowMoreOptions());
    dispatch(setPostData(null));
  }

  function onEditPress(): void {
    if (!postData) {
      Toast.show(
        t('Cannot edit post: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    if (postData.user?.id !== my_data?.id) {
      Toast.show(t('You can only edit your own posts.'), Toast.SHORT);
      return;
    }

    const pictureURLs = postData.NestedPicturePosts
      ? postData.NestedPicturePosts.map((item, index) => ({
          img_url: item.img_url,
          id: item.id || index.toString(),
        }))
      : [];

    onMoreButtonClose();

    try {
      navigation.navigate('EditPostPictureScreen', {
        postData,
        pictureURLs,
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Toast.show(t('Failed to navigate to edit screen.'), Toast.SHORT);
    }
  }

  function onDeletePress(): void {
    if (!postData?.id) {
      Toast.show(
        t('Cannot delete post: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    if (postData.user?.id !== my_data?.id) {
      Toast.show(t('You can only delete your own posts.'), Toast.SHORT);
      return;
    }

    setConfirmModal({
      visible: true,
      title: t('Delete Post'),
      message: t(
        'Are you sure you want to delete this post? This action cannot be undone.',
      ),
      confirmText: t('Delete'),
      confirmColor: '#fff',
      onConfirm: async () => {
        setIsDeleting(true);
        onMoreButtonClose();
        dispatch(removePost(postData.id));

        try {
          const result = await imagePostApi.deletePicturePost(
            postData.id.toString(),
            my_data.auth_token,
          );

          if (result.success) {
            Toast.show(t('Post deleted successfully.'), Toast.SHORT);
          } else {
            Toast.show(
              result.message || t('Failed to delete post.'),
              Toast.SHORT,
            );
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          Toast.show(
            t('An error occurred while deleting the post.'),
            Toast.SHORT,
          );
        } finally {
          setIsDeleting(false);
          setConfirmModal(prev => ({...prev, visible: false}));
        }
      },
    });
  }

  function onReportPress(): void {
    if (!postData?.id) {
      Toast.show(
        t('Cannot report post: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    navigation.navigate('ShareReportScreen', {idVideo: postData.id});

    onMoreButtonClose();
  }

  function onSharePress(): void {
    if (!postData?.id) {
      Toast.show(
        t('Cannot share post: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    dispatch(setSharePostRootId(postData.id));
    onMoreButtonClose();

    emit(
      POST_EVENTS.SHARE_POST,
      {post_id: postData.id, post_user_id: postData.user.id},
      (res: {success: boolean; message?: string}) => {
        if (!res.success) {
          Toast.show(
            t('Something went wrong while sharing the post.'),
            Toast.LONG,
          );
        }
      },
    );
  }

  function onCopyLinkPress(): void {
    if (!postData?.id) {
      Toast.show(
        t('Cannot copy link: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    const postUrl = `${SERVER_API_URL}/image_post/getPicturePost/${postData.id}`;

    Clipboard.setString(postUrl);
    Toast.show(t('Link copied to clipboard!'), Toast.SHORT);
    onMoreButtonClose();
  }

  function onFavouritePress(): void {
    if (!postData) {
      Toast.show(
        t('Cannot add to favorites: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    emit(
      POST_EVENTS.ADD_TO_FAVORITES,
      {post_id: postData.id, post_user_id: postData.user.id},
      (res: {success: boolean; message?: string}) => {
        if (res.success) {
          dispatch(addToFavorites(postData));
          dispatch(setFavouritePosts(postData));

          Toast.show(
            t(
              'This post has been added to your favorites! You can find it in your list later.',
            ),
            Toast.LONG,
          );
          onMoreButtonClose();
        } else {
          Toast.show(
            t('Something went wrong while adding to favorites.'),
            Toast.LONG,
          );
        }
      },
    );
  }

  function onInterestedPress(): void {
    emit(
      POST_EVENTS.MARK_INTERESTING,
      {post_id: postData.id, post_user_id: postData.user.id},
      (res: {success: boolean; message?: string}) => {
        if (res.success) {
          Toast.show(
            t('Great! We will show you more posts like this.'),
            Toast.LONG,
          );
          onMoreButtonClose();
        } else {
          Toast.show(
            t('Something went wrong while marking as interesting.'),
            Toast.LONG,
          );
        }
      },
    );
  }

  function onNotInterestedPress(): void {
    emit(
      POST_EVENTS.MARK_NOT_INTERESTING,
      {post_id: postData.id, post_user_id: postData.user.id},
      (res: {success: boolean; message?: string}) => {
        if (res.success) {
          Toast.show(
            t("No worries! We won't show you more posts like this."),
            Toast.LONG,
          );
          onMoreButtonClose();
        } else {
          Toast.show(
            t('Something went wrong while marking as not interesting.'),
            Toast.LONG,
          );
        }
      },
    );
  }

  function onMuteUserPress(): void {
    emit(
      POST_EVENTS.MUTE_USER,
      {post_id: postData.id, post_user_id: postData.user.id},
      (res: {success: boolean; message?: string}) => {
        if (res.success) {
          Toast.show(
            t('You will no longer receive posts from this user.'),
            Toast.LONG,
          );
          onMoreButtonClose();
        } else {
          Toast.show(
            t('Something went wrong while muting the user.'),
            Toast.LONG,
          );
        }
      },
    );
  }

  function onBlockUserPress(): void {
    if (!postData?.user?.id) {
      Toast.show(
        t('Cannot block user: user information is missing.'),
        Toast.SHORT,
      );
      return;
    }

    setConfirmModal({
      visible: true,
      title: t('Block User'),
      message: t(
        'Are you sure you want to block this user? You will no longer see their posts or receive messages from them.',
      ),
      confirmText: t('Block'),
      confirmColor: '#fff',
      onConfirm: async () => {
        try {
          const data = {
            blocked_user_id: postData.user.id,
          };

          const result = await addBlockedUser.addBlockedUser(
            data,
            my_data.auth_token,
          );

          if (result.success) {
            dispatch(addBlockedUserId(postData.user.id));
            Toast.show(t('User blocked successfully.'), Toast.SHORT);
            onMoreButtonClose();
          } else {
            Toast.show(
              result.message || t('Failed to block user.'),
              Toast.SHORT,
            );
          }
        } catch (error) {
          console.error('Error blocking user:', error);
          Toast.show(
            t('An error occurred while blocking the user.'),
            Toast.SHORT,
          );
        } finally {
          setConfirmModal(prev => ({...prev, visible: false}));
        }
      },
    });
  }

  function onHidePress(): void {
    if (!postData?.id) {
      Toast.show(
        t('Cannot hide post: post information is missing.'),
        Toast.SHORT,
      );
      return;
    }
    dispatch(hidePost(postData.id));
    Toast.show(
      t('Post hidden. You can undo this action from the feed.'),
      Toast.SHORT,
    );

    onMoreButtonClose();
  }

  const renderUserOptions = useMemo(() => {
    if (postData?.user?.id !== my_data?.id) {
      return (
        <>
          <TouchableOpacity
            style={styles.button_view}
            onPress={onFavouritePress}
            accessible={true}
            accessibilityLabel="Favourite post"
            accessibilityHint="Add this post to your favourites">
            <MaterialIcons name={'favorite'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Favourite')}</Text>
              <Text style={styles.action_description}>
                {t('Add this post to your favourites')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.button_view}
            onPress={onInterestedPress}
            accessible={true}
            accessibilityLabel="Mark as Interested"
            accessibilityHint="Show interest in this post">
            <MaterialIcons name={'thumb-up'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Interested')}</Text>
              <Text style={styles.action_description}>
                {t('Show interest in this post')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Not Interested Option */}
          <TouchableOpacity
            style={styles.button_view}
            onPress={onNotInterestedPress}
            accessible={true}
            accessibilityLabel="Mark as Not Interested"
            accessibilityHint="Hide this post from your interests">
            <MaterialIcons name={'thumb-down'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Not Interested')}</Text>
              <Text style={styles.action_description}>
                {t('Hide this post from your interests')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.button_view}
            onPress={onHidePress}
            accessible={true}
            accessibilityLabel="Hide post"
            accessibilityHint="Hide this post from your feed">
            <MaterialIcons name={'visibility-off'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Hide')}</Text>
              <Text style={styles.action_description}>
                {t('Hide this post from your feed')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.button_view}
            onPress={onMuteUserPress}
            accessible={true}
            accessibilityLabel="Mute user"
            accessibilityHint="Mute this user to stop seeing their posts in your feed">
            <MaterialIcons name={'volume-off'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Mute User')}</Text>
              <Text style={styles.action_description}>
                {t('Mute this user to stop seeing their posts')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.button_view}
            onPress={onReportPress}
            accessible={true}
            accessibilityLabel="Report post"
            accessibilityHint="Report this post for inappropriate content">
            <MaterialIcons name={'report'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Report Post')}</Text>
              <Text style={styles.action_description}>
                {t('Report this post for inappropriate content')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.button_view}
            onPress={onBlockUserPress}
            accessible={true}
            accessibilityLabel="Block user"
            accessibilityHint="Block this user from interacting with you">
            <MaterialIcons name={'block'} size={22} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Block User')}</Text>
              <Text style={styles.action_description}>
                {t('Block this user from contacting you')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />
        </>
      );
    } else {
      return null;
    }
  }, [postData, my_data]);

  const renderEditAndDelete = useMemo(() => {
    if (postData?.user?.id === my_data?.id) {
      return (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.button_view}
            onPress={onEditPress}
            accessible={true}
            accessibilityLabel="Edit post"
            accessibilityHint="Edit the content of this post">
            <AntDesign name={'edit'} size={20} color={'#000'} />
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Edit')}</Text>
              <Text style={styles.action_description}>
                {t('Modify your post content')}.
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Delete Option */}
          <TouchableOpacity
            style={styles.button_view}
            onPress={onDeletePress}
            disabled={isDeleting}
            accessible={true}
            accessibilityLabel="Delete post"
            accessibilityHint="Delete this post permanently">
            {isDeleting ? (
              <ActivityIndicator
                size="small"
                color="#000"
                style={{width: 22}}
              />
            ) : (
              <AntDesign name={'delete'} size={18} color={'#000'} />
            )}
            <View style={styles.text_view}>
              <Text style={styles.action_title}>{t('Delete')}</Text>
              <Text style={styles.action_description}>
                {t('Permanently remove this post')}.
              </Text>
            </View>
          </TouchableOpacity>
        </>
      );
    } else {
      return null;
    }
  }, [postData, my_data, isDeleting]);

  return (
    <>
      <Modal
        visible={showMoreOptions}
        onRequestClose={onMoreButtonClose}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        accessibilityViewIsModal={true}
        accessible={true}
        accessibilityLabel="Post actions modal"
        accessibilityHint="Shows options for post actions like edit, delete, and report.">
        <TouchableOpacity
          style={styles.upper_container}
          onPress={onMoreButtonClose}
          accessible={true}
          accessibilityLabel="Close"
          accessibilityHint="Closes the post actions modal"
        />

        <View style={[styles.main_container, {height: containerHeight}]}>
          <Text
            style={styles.header_text}
            accessible={true}
            accessibilityLabel="Post options header"
            accessibilityHint="Describes the options available for interacting with this post.">
            {t('Post Options')}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.divider} />

            {renderUserOptions}

            <TouchableOpacity
              style={styles.button_view}
              onPress={onSharePress}
              accessible={true}
              accessibilityLabel="Share post"
              accessibilityHint="Share this post with others or to social media">
              <MaterialIcons name={'share'} size={22} color={'#000'} />
              <View style={styles.text_view}>
                <Text style={styles.action_title}>{t('Share')}</Text>
                <Text style={styles.action_description}>
                  {t('Share this post with others')}.
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.button_view}
              onPress={onCopyLinkPress}
              accessible={true}
              accessibilityLabel="Copy link"
              accessibilityHint="Copy the link to this post">
              <MaterialIcons name={'link'} size={22} color={'#000'} />
              <View style={styles.text_view}>
                <Text style={styles.action_title}>{t('Copy Link')}</Text>
                <Text style={styles.action_description}>
                  {t('Copy the post link to clipboard')}.
                </Text>
              </View>
            </TouchableOpacity>

            {renderEditAndDelete}
          </ScrollView>
        </View>
      </Modal>

      <ConfirmModal
        visible={confirmModal.visible}
        onClose={() => setConfirmModal(prev => ({...prev, visible: false}))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={t('Cancel')}
        confirmColor={confirmModal.confirmColor}
      />
    </>
  );
};

export default React.memo(MoreOptionsModel);

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#f1f1f1',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    paddingHorizontal: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
  },
  header_text: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  action_title: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  action_description: {
    color: '#7d7d7d',
    fontSize: 12,
  },
  text_view: {
    marginLeft: 20,
  },
  button_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  upper_container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
