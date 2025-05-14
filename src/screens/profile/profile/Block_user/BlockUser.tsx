import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-simple-toast';
import {useAppSelector} from '../../../../store/hooks';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ConfirmModal from '../../../../components/ConfirmModal';
import {selectMyProfileData} from '../../../../store/selectors';
import {useDispatch} from 'react-redux';
import {removeBlockedUserId} from '../../../../store/slices/content/pictureSlice';

const BlockUser = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const BlockUserList = require('../../../../apis/userApi');
  const my_data = useAppSelector(selectMyProfileData);
  const [blockedUsersData, setBlockedUsersData] = useState([]);
  const dispatch = useDispatch();
  const [reportedUsersData, setreportedUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('blocked');

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedUserToUnblock, setSelectedUserToUnblock] = useState(null);

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      const userId = my_data.id;
      const response = await BlockUserList.getBlockedUserList(userId);
      const userDataArray = response.data.map((item: any) => ({
        ...item.user_data,
        blocked_at: item.blocked_at,
      }));
      setBlockedUsersData(userDataArray);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUserToUnblock) return;

    try {
      const data = {
        user_id: my_data.id,
        blocked_user_id: selectedUserToUnblock.id,
      };

      const response = await BlockUserList.removeBlockedUser(
        data,
        my_data.auth_token,
      );

      if (response.success) {
        dispatch(removeBlockedUserId(selectedUserToUnblock.id));
        Toast.show(t('User unblocked successfully.'), Toast.SHORT);
      } else {
        Toast.show(
          response.message || t('Failed to unblock user.'),
          Toast.SHORT,
        );
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      Toast.show(
        t('An error occurred while unblocking the user.'),
        Toast.SHORT,
      );
    } finally {
      setModalVisible(false);
      setSelectedUserToUnblock(null);
      fetchBlockedUsers();
    }
  };

  // Fetch users who blocked me
  const fetchReportedMeUsers = async () => {
    try {
      const userId = my_data.id;
      const response = await BlockUserList.getReportedUserList(userId);
      const userDataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setreportedUsersData(userDataArray);
    } catch (error) {
      console.error('Error fetching reported users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to a user's profile
  const handleProfileVisit = (userId: number) => {
    navigation.navigate('UserProfileMainPage', {user_id: userId});
  };

  useEffect(() => {
    setLoading(true);
    if (selectedTab === 'blocked') {
      fetchBlockedUsers();
    } else {
      fetchReportedMeUsers();
    }
  }, [selectedTab]);

  // Function to open modal with selected user report
  const handleUserClick = reportedUsersData => {
    setSelectedReport({
      images: reportedUsersData?.images,
      description: reportedUsersData.description,
    });
    setModalVisible(true);
  };

  // Function to open unblock modal
  const openUnblockModal = user => {
    setSelectedUserToUnblock(user);
    setModalVisible(true);
  };

  // Helper function to format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({item}) => (
    <View style={styles.userContainer}>
      {/* TouchableOpacity for visiting the profile */}
      <TouchableOpacity onPress={() => handleProfileVisit(item.id)}>
        <Image style={styles.profilePic} source={{uri: item.profile_pic}} />
      </TouchableOpacity>

      {/* User Information */}
      <View style={styles.userInfo}>
        <Text style={styles.userInfoTitle}>{item.username}</Text>
        <Text style={styles.userInfoText}>{item.email}</Text>
        <Text style={{...styles.userInfoText, color: 'grey'}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>Blocked on: </Text>
          {formatDate(item.blocked_at)}
        </Text>
      </View>

      {/* Block Button */}
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => openUnblockModal(item)}>
        <Text style={styles.followButtonText}>{t('Unblock')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem2 = ({item}) => (
    <TouchableOpacity
      onPress={() => handleUserClick(item)}
      style={styles.userContainer}>
      {/* Image with its own onPress handler */}
      <TouchableOpacity
        onPress={event => {
          event.stopPropagation();
          handleProfileVisit(item.user.id);
        }}>
        <Image
          style={styles.profilePic}
          source={{uri: item.user.profile_pic}}
        />
      </TouchableOpacity>

      {/* User Information */}
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>{item.user.username}</Text>
        <Text style={styles.userInfoText}>{item.user.email}</Text>
        <Text style={{...styles.userInfoText, color: 'grey'}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Reported on:{' '}
          </Text>
          {formatDate(item.createdAt)}
        </Text>
      </View>

      {/* Status Button */}
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>{t('REPORTED')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const keyExtractor = item => item.username;

  return (
    <View style={styles.main_container}>
      <Header
        headertext={t(
          selectedTab === 'blocked' ? 'Blocked accounts' : 'Reported accounts',
        )}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'blocked' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('blocked')}>
          <Text style={styles.tabText}>{t('Blocked')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'reported' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('reported')}>
          <Text style={styles.tabText}>{t('Reported')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="red" />
      ) : selectedTab === 'blocked' ? (
        blockedUsersData?.length > 0 ? (
          <FlatList
            data={blockedUsersData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          <View style={styles.noUsersContainer}>
            <View style={styles.iconContainer}>
              <Icon name="user-times" size={45} color="#888" />
            </View>
            <Text style={styles.noUsersTitle}>{t('Oops')}!</Text>
            <Text style={styles.noUsersText}>
              {t('It seems there are no blocked users at the moment.')}
            </Text>
          </View>
        )
      ) : reportedUsersData.length > 0 ? (
        <FlatList
          data={reportedUsersData}
          renderItem={renderItem2}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <View style={styles.noUsersContainer}>
          <View style={styles.iconContainer}>
            <Icon name="user-times" size={75} color="#888" />
          </View>
          <Text style={styles.noUsersTitle}>{t('Oops')}!</Text>
          <Text style={styles.noUsersText}>
            {t('It seems there are no reported users at the moment.')}
          </Text>
        </View>
      )}

      {/* Unblock User Modal */}
      <ConfirmModal
        visible={isModalVisible && !!selectedUserToUnblock}
        onClose={() => {
          setModalVisible(false);
          setSelectedUserToUnblock(null);
        }}
        onConfirm={handleUnblockUser}
        title={t(`Unblock ${selectedUserToUnblock?.username || ''}?`)}
        message={t(
          `You will be able to see all Feeds from ${
            selectedUserToUnblock?.username || 'this user'
          }. They will not be notified that you unblocked them.`,
        )}
        confirmText={t('Unblock')}
        cancelText={t('Cancel')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 16,
  },
  loader: {
    marginTop: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 10,
    borderRadius: 5,
  },
  activeTab: {
    borderColor: '#333',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  userContainer: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: '#f9f9f9',
  },
  iconContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
    position: 'relative',
    top: -90,
  },
  noUsersTitle: {
    fontSize: 22,
    color: '#444',
    fontWeight: 'bold',
    marginBottom: 10,
    position: 'relative',
    top: -90,
  },
  noUsersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    position: 'relative',
    top: -90,
  },
  userInfoTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  userInfoText: {
    fontSize: 11,
    color: '#333',
  },
  profilePic: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
  followButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  reportedImage: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

export default BlockUser;
