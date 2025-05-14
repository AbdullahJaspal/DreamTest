import React, {ReactElement, useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Modal,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TaggedDataProps} from '../types/Audio';
import * as userApi from '../../../apis/userApi';
import {debounce} from '../../../utils/debounce';
import {useAppSelector} from '../../../store/hooks';
import Entypo from 'react-native-vector-icons/Entypo';
import {User} from '../../other_user/types/VideoData';
import {useNavigation} from '@react-navigation/native';
import {truncateText} from '../../../utils/truncateText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProfileImage from '../../../components/ProfileImage';
import {selectMyProfileData} from '../../../store/selectors';
import {PostPictureScreenScreenNavigationProps} from '../../../types/screenNavigationAndRoute';

interface TaggingUserProps {
  onClose: (userIDs: Array<TaggedDataProps>) => void;
  showTagModel: boolean;
}

const {width, height} = Dimensions.get('window');

const getButtonStyle = (isSelected: boolean) => {
  return isSelected ? styles.selectedButton : styles.defaultButton;
};

const TaggingUser: React.FC<TaggingUserProps> = ({onClose, showTagModel}) => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<PostPictureScreenScreenNavigationProps>();
  const my_data = useAppSelector(selectMyProfileData);
  const followersList = useRef<User[]>([]);
  const [selectedUserIds, setSelectedids] = useState<TaggedDataProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  function handleSearch(text: string): void {
    const filteredData = followersList.current?.filter(
      user =>
        user.nickname?.toLowerCase().includes(text.toLowerCase()) ||
        user.username?.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredUsers(filteredData);
  }

  function handleClose(_event: NativeSyntheticEvent<any>): void {
    onClose(selectedUserIds);
  }

  async function handleOnShow(
    _event: NativeSyntheticEvent<any>,
  ): Promise<void> {
    try {
      const result = await userApi.getFollowersDetails(my_data?.id);
      followersList.current = result?.Followers;
    } catch (error) {
      console.log('Error generated while getting followers list:', error);
    } finally {
      setLoading(false);
    }
  }

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  const renderItem = ({item}: ListRenderItemInfo<User>): ReactElement => {
    const dt = {
      user_id: item.id,
      username: item.username,
    };
    const isSelected = selectedUserIds.some(
      selectedUser => selectedUser.user_id === dt.user_id,
    );

    const handleTagButtonPressed = () => {
      if (isSelected) {
        setSelectedids(prev =>
          prev.filter(user => user.user_id !== dt.user_id),
        );
      } else {
        setSelectedids(prev => [...prev, dt]);
      }
    };

    function handleProfileVisit(): void {
      navigation.navigate('UserProfileMainPage', {user_id: item.id});
    }

    return (
      <View style={styles.tag_main_container}>
        <View style={styles.left_container}>
          <ProfileImage uri={item.profile_pic} onPress={handleProfileVisit} />
          <View style={styles.middle_container}>
            <Text style={styles.txt}>
              {truncateText(item?.nickname ?? '', 20)}
            </Text>
            <Text style={styles.txt}>{truncateText(item?.username, 20)}</Text>
          </View>
        </View>
        <Pressable
          style={[styles.tag_button, getButtonStyle(isSelected)]}
          onPress={handleTagButtonPressed}>
          <Text style={styles.selection_txt}>
            {isSelected ? t('Tagged') : t('Tag')}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Modal
      visible={showTagModel}
      onRequestClose={handleClose}
      hardwareAccelerated={true}
      onShow={handleOnShow}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide">
      <Pressable style={styles.empty_container} onPress={handleClose} />

      <View style={styles.main_container}>
        <View style={styles.search_main_container}>
          <AntDesign name="search1" size={20} color={'#020202'} />

          <View style={{flex: 1}}>
            <TextInput
              placeholder={t('Search')}
              placeholderTextColor={'#000'}
              onChangeText={debouncedSearch}
              style={styles.search_input}
            />
          </View>

          <Pressable onPress={handleClose}>
            <Entypo name="cross" size={30} color={'#020202'} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loading_container}>
            <ActivityIndicator size={'large'} color={'#000'} />
          </View>
        ) : followersList.current?.length > 0 ? (
          <FlatList
            data={
              filteredUsers.length > 0 ? filteredUsers : followersList.current
            }
            scrollEventThrottle={20}
            keyExtractor={item => item?.id?.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.loading_container}>
            <Text style={styles.txt}>
              {t('You does not have any followers')}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default React.memo(TaggingUser);

const styles = StyleSheet.create({
  tag_main_container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  tag_button: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 35,
    borderRadius: 5,
  },
  middle_container: {
    width: width * 0.42,
    marginRight: 10,
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  main_container: {
    height: height * 0.6,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  search_main_container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    marginTop: 10,
    justifyContent: 'center',
  },
  search_input: {
    width: '100%',
    marginLeft: 10,
  },
  empty_container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  selectedButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  defaultButton: {
    backgroundColor: 'red',
  },
  selection_txt: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  txt: {
    color: '#020202',
    fontSize: 14,
    textAlign: 'left',
  },
  left_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
