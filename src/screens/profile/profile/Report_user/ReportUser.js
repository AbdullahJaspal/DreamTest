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
  Modal,
} from 'react-native';

import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const ReportUser = () => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();

  const BlockUserList = require('../../../../apis/userApi');
  const my_data = useAppSelector(selectMyProfileData);
  const [blockedUsersData, setBlockedUsersData] = useState([]);
  const [reportedUsersData, setreportedUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('blocked');

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    try {
      const userId = my_data.id;
      const response = await BlockUserList.getBlockedUserList(userId);
      // const userDataArray = Array.isArray(response.user_data) ? response.user_data : [response.user_data];
      // Combine `user_data` with `blocked_at`
      const userDataArray = response.user_data
        ? [
            {
              ...response.user_data,
              blocked_at: response.blocked_at, // Add the `blocked_at` field to the user data
            },
          ]
        : [];
      // console.log(userDataArray);
      setBlockedUsersData(userDataArray);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users who blocked me
  const fetchReportedMeUsers = async () => {
    try {
      // Dummy data for reported users
      // const dummyReportedUsers = [
      //   {
      //     id: 1,
      //     username: 'reported_user_1',
      //     email: 'user1@example.com',
      //     profile_pic: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg',
      //     reportDetails: {
      //       video: 'https://example.com/video1.mp4',
      //       picture: 'https://replicate.delivery/pbxt/JF3foGR90vm9BXSEXNaYkaeVKHYbJPinmpbMFvRtlDpH4MMk/out-0-1.png',
      //       description: 'Inappropriate content',
      //     },
      //   },
      //   // Add more dummy users as needed
      // ];
      const userId = my_data.id;
      const response = await BlockUserList.getReportedUserList(userId);
      const userDataArray = Array.isArray(response.data)
        ? response.data
        : [response.data];
      // console.log("userDataArray", userDataArray);
      setreportedUsersData(userDataArray);
    } catch (error) {
      console.error('Error fetching reported users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to a user's profile
  const handleProfileVisit = userId => {
    navigation.navigate('UserProfileMainPage', {user_id: userId});
  };

  useEffect(() => {
    setLoading(true); // Set loading state before each fetch
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

  // console.log(selectedReport.description);

  // Helper function to format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // const renderItem = ({ item }) => (
  //   <View style={styles.userContainer}>
  //     <Image style={styles.profilePic} source={{ uri: item.profile_pic }} />
  //     <View style={styles.userInfo}>
  //       <Text style={styles.userInfoText}>{item.username}</Text>
  //       <Text style={styles.userInfoText}>{item.email}</Text>
  //     </View>
  //     <TouchableOpacity style={styles.followButton}>
  //       <Text style={styles.followButtonText}>BLOCKED</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  const renderItem = ({item}) => (
    <View style={styles.userContainer}>
      {/* TouchableOpacity for visiting the profile */}
      <TouchableOpacity
        onPress={() => handleProfileVisit(item.id)} // Pass the user ID to visit the profile
      >
        <Image style={styles.profilePic} source={{uri: item.profile_pic}} />
      </TouchableOpacity>

      {/* User Information */}
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>{item.username}</Text>
        <Text style={styles.userInfoText}>{item.email}</Text>
        <Text style={{...styles.userInfoText, color: 'grey'}}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {t('Blocked on')}:{' '}
          </Text>
          {formatDate(item.blocked_at)}
        </Text>
        {/* {console.log(item.blocked_at)} */}
      </View>

      {/* Block Button */}
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>{t('BLOCKED')}</Text>
      </TouchableOpacity>
    </View>
  );

  // const renderItem2 = ({ item }) => (
  //   <TouchableOpacity onPress={() => handleUserClick(item)} style={styles.userContainer}>
  //     <Image style={styles.profilePic} onPress={() => handleProfileVisit(item.user.id)} source={{ uri: item.user.profile_pic }} />
  //     <View style={styles.userInfo}>
  //       <Text style={styles.userInfoText}>{item.user.username}</Text>
  //       <Text style={styles.userInfoText}>{item.user.email}</Text>
  //       <Text style={styles.userInfoText}>Reported on: {formatDate(item.createdAt)}</Text>
  //     </View>
  //     <TouchableOpacity style={styles.followButton}>
  //       <Text style={styles.followButtonText}>REPORTED</Text>
  //     </TouchableOpacity>
  //   </TouchableOpacity>
  // );

  const renderItem2 = ({item}) => (
    <TouchableOpacity
      onPress={() => handleUserClick(item)}
      style={styles.userContainer}>
      {/* Image with its own onPress handler */}
      <TouchableOpacity
        onPress={event => {
          event.stopPropagation(); // Prevent parent onPress
          handleProfileVisit(item.user.id); // Navigate to user profile
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
      <Header headertext={t('List')} />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'blocked' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('blocked')}>
          <Text style={styles.tabText}>{t('Blocked Users')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'reported' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('reported')}>
          <Text style={styles.tabText}>{t('Reported Users')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : selectedTab === 'blocked' ? (
        blockedUsersData?.length > 0 ? (
          <FlatList
            data={blockedUsersData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatListContainer}
          />
        ) : (
          // <View style={styles.noUsersContainer}>
          //     <Icon name="user-times" size={75} color="#888" />
          //     <Text style={styles.noUsersText}>No Blocked Users</Text>
          // </View>
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
        // <View style={styles.noUsersContainer}>
        //     <Icon name="user-times" size={75} color="#888" />
        //     <Text style={styles.noUsersText}>No Reported Users</Text>
        // </View>
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
      {isModalVisible && selectedReport && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Display selected image and description */}
              {/* <Image source={{ uri: selectedReport.images }} style={styles.reportedImage} /> */}
              <Image
                source={{
                  uri: `https://dpcst9y3un003.cloudfront.net/${selectedReport.images}`,
                }}
                style={styles.reportedImage}
              />
              <Text style={styles.modalText}>
                {t('Description')}: {selectedReport.description}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>{t('Close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
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
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 10,
  },
  activeTab: {
    borderColor: '#000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userContainer: {
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  // noUsersContainer: {
  //     flex: 1,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     paddingTop: 50,
  // },
  // noUsersText: {
  //     fontSize: 18,
  //     color: '#888',
  //     marginTop: 10,
  // },
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

  userInfoText: {
    fontSize: 14,
    color: 'black',
  },
  profilePic: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
  followButton: {
    // backgroundColor: '#1E90FF',
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Existing styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reportedImage: {
    width: 300,
    height: 400,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});

export default ReportUser;
