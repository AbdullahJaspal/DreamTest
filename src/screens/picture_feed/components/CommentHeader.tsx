import React, {useMemo, useState} from 'react';
import {
  Alert,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';

import {PicturePostComment} from '../types/picturePost';
import {CommentScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {truncateText} from '../../../utils/truncateText';
import {hideStatusBar} from '../../../utils/statusBar';

import ProfileImage from '../../../components/ProfileImage';
import Badge from '../../../components/Badge';
import CommentMoreButton from './CommentMoreButton';
import OwnerTag from './OwnerTag';
import CustomDesParser from './CustomDesParser';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import * as imagePost from '../../../apis/imagePost';
import {
  setEnableEdit,
  setPostComment,
} from '../../../store/slices/content/pictureSlice';

import Toast from 'react-native-simple-toast';

import {
  selectCurrentCommentUserIds,
  selectMyProfileData,
} from '../../../store/selectors';

interface CommentHeaderProps {
  item: PicturePostComment;
  index: number;
  showCrossIcon?: boolean;
  handleCrossIconPress?: () => void;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({
  item,
  showCrossIcon = false,
  handleCrossIconPress,
}) => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const my_data = useAppSelector(selectMyProfileData);
  const currentCommentUserIds = useAppSelector(selectCurrentCommentUserIds);
  const navigation = useNavigation<CommentScreenNavigationProps>();
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);

  function handleProfilePress(): void {
    hideStatusBar();
    navigation.navigate('UserProfileMainPage', {user_id: item.user.id});
  }
  function handleClickMoreOption(_event: GestureResponderEvent): void {
    setShowMoreButton(true);
  }

  function handleEditPress(): void {
    if (my_data?.id === item.user.id) {
      Alert.alert(
        t('Confirm Edit'),
        t('Are you sure you want to edit this comment?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Edit'),
            onPress: () => {
              dispatch(setPostComment(item));
              dispatch(setEnableEdit(true));
              handleMoreOptionsClose();
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      handleMoreOptionsClose();
      Toast.show(t('You are not allowed to edit this comment'), Toast.LONG);
    }
  }

  function handleMoreOptionsClose(): void {
    setShowMoreButton(false);
  }

  const handleDeletePress = async () => {
    if (item.user.id === my_data?.id) {
      Alert.alert(
        t('Confirm Deletion'),
        t('Are you sure you want to delete this comment?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Delete'),
            onPress: async () => {
              try {
                await imagePost.deleteCommentOrCommentreply(
                  my_data?.auth_token,
                  {
                    comment_id: item.id,
                  },
                );
                Toast.show(t('Successfully deleted'), Toast.LONG);
              } catch (error) {
                console.log('Error generated while deleting comments');
              } finally {
                handleMoreOptionsClose();
              }
            },
          },
        ],
        {cancelable: true},
      );
    } else {
      Toast.show(t('You are not allowed to delete this comment'), Toast.LONG);
      handleMoreOptionsClose();
    }
  };

  const handleReportPress = async () => {
    Alert.alert(
      t('Confirm Report'),
      t('Are you sure you want to report this comment?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Report'),
          onPress: async () => {
            try {
              await imagePost.reportCommentOrCommentReply(my_data?.auth_token, {
                comment_id: item.id,
              });
              Toast.show('Successfully reported', Toast.LONG);
            } catch (error) {
              console.log('Error generated while reporting comment', error);
            } finally {
              handleMoreOptionsClose();
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const renderProfileImage = useMemo(() => {
    if (item.parent_id) {
      return (
        <ProfileImage
          width={25}
          height={25}
          onPress={handleProfilePress}
          uri={item.user.profile_pic}
        />
      );
    } else {
      return (
        <ProfileImage
          onPress={handleProfilePress}
          uri={item.user.profile_pic}
        />
      );
    }
  }, [item]);

  return (
    <View style={[styles.main_container]}>
      <CommentMoreButton
        showMoreButton={showMoreButton}
        onEditPress={handleEditPress}
        onMoreButtonClose={handleMoreOptionsClose}
        onDeletePress={handleDeletePress}
        onReportPress={handleReportPress}
      />
      {/* First Container */}
      {renderProfileImage}

      {/* Second Container */}
      <View style={styles.second_container}>
        <View style={styles.nested_second_container}>
          <Text style={styles.nickname}>
            {truncateText(item?.user?.nickname, 10)}
          </Text>
          <Badge user_data={item?.user} />
          <Text style={styles.username}>
            @{truncateText(item?.user?.username, 10)}
          </Text>
          {currentCommentUserIds === item.user.id && <OwnerTag />}
        </View>

        <View style={styles.place_view}>
          <CustomDesParser text={item?.comment_data} />
        </View>
      </View>

      {/* Third Container */}
      {showCrossIcon ? (
        <TouchableOpacity onPress={handleCrossIconPress}>
          <Entypo name="cross" size={20} color={'#020202'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleClickMoreOption}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={'#020202'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(CommentHeader);

const styles = StyleSheet.create({
  main_container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'flex-start',
  },
  second_container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 15,
  },
  username: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 10,
  },
  nickname: {
    color: '#020202',
    fontSize: 14,
    textAlign: 'left',
  },
  nested_second_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  place_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verified_img: {
    width: 20,
    height: 20,
  },
});
