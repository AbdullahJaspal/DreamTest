import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  SectionList,
  Switch,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';

import Header from '../components/Header';
import ProfileImage from '../../../../components/ProfileImage';
import CInput from '../../../../components/CInput';

import * as userApi from '../../../../apis/userApi';
import {truncateText} from '../../../../utils/truncateText';

import {RadioButton} from 'react-native-paper';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const DATA = [
  {
    title: 'In-app notifications',
    data: [
      'Comment',
      'Direct message',
      'New follower',
      'Profile views',
      'Activity status',
      'Mentions and tags',
      'Live',
      'Liked',
    ],
  },
  {
    title: 'Message',
    data: ['Direct messages'],
  },
  {
    title: 'Screen time',
    data: [
      'Like',
      'Comments',
      'New followers',
      'Profile View',
      'Mention and Tags',
    ],
  },
  {
    title: 'Games',
    data: [
      'Likes',
      'Profile  Views',
      'New followers game',
      'Mention and Tag',
      'Comments game',
      'Reposts',
    ],
  },
];

const MainNotification = () => {
  const my_data = useAppSelector(selectMyProfileData);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [videoFollowSwitch, setVideoFollowSwitch] = useState(false);
  const [videoLikeSwitch, setVideoLikeSwitch] = useState(false);
  const [videoPeopleKnowSwitch, setVideoPeopleKnowSwitch] = useState(false);
  const [liveRewardsSwitch, setLiveRewardsSwitch] = useState(false);
  const [liveNotificationsSwitch, setLiveNotificationsSwitch] = useState(false);
  const [sectionSwitches, setSectionSwitches] = useState({
    Comment: false,
    Comments: false,
    'Comments game': false,
    'Direct messages': false,
    'New followers': false,
    'New follower': false,
    'New followers game': false,
    'Profile views': false,
    'Activity status': false,
    'Mentions and tags': false,
    'Mention and Tag': false,
    'Mention and Tags': false,
    Live: false,
    Like: false,
    'Direct messages': false,
    'Direct message': false, // Additional data item
    Likes: false,
    Liked: false, // Additional data item
    'Profile View': false, // Additional data item
  });

  const [otherSwitches, setOtherSwitches] = useState({
    'People You May Be Know': false,
    'If You need Enter Your E-mail address': false,
  });

  const [expandedItem, setExpandedItem] = useState(false); // State to track which item is expanded
  //States for search funtionality
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

  const toggleExpand = () => {
    setExpandedItem(prevState => !prevState); // Toggle expansion
  };

  const getfollowers = async () => {
    try {
      const response = await userApi.getFollowersDetails(my_data?.id);
      setUsers(response?.Followers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching followers:', error);
      setLoading(false);
      // Handle the error, e.g., set an error state
    }
  };

  useEffect(() => {
    getfollowers();
  }, [my_data]);

  // Handle Search
  const handleSearch = query => {
    setSearchQuery(query); // Update the search query state
    if (query === '') {
      setFilteredUsers(users); // Reset to original users if search query is empty
    } else {
      const filtered = users.filter(
        user =>
          user.username &&
          user.username.toLowerCase().includes(query.toLowerCase()), // Check if name exists
      );
      setFilteredUsers(filtered); // Update filtered users
    }
  };

  useEffect(() => {
    handleSearch('');
  }, [users]);

  const handleVideoFollowSwitch = value => {
    setVideoFollowSwitch(value);
    // Additional logic can be added based on the value (true/false)
    if (value) {
      // Actions when the switch is turned ON
      console.log('Videos from account you follow switch is ON');
    } else {
      // Actions when the switch is turned OFF
      console.log('Videos from account you follow switch is OFF');
    }
  };

  const handleVideoLikeSwitch = value => {
    setVideoLikeSwitch(value);
    // Additional logic can be added based on the value (true/false)
    if (value) {
      // Actions when the switch is turned ON
      console.log('Videos you might like switch is ON');
    } else {
      // Actions when the switch is turned OFF
      console.log('Videos you might like switch is OFF');
    }
  };
  const handleVideoPeopleKnowSwitch = value => {
    setVideoPeopleKnowSwitch(value);
    // Additional logic can be added based on the value (true/false)
    if (value) {
      // Actions when the switch is turned ON
      console.log('Videos from people you may know switch is ON');
    } else {
      // Actions when the switch is turned OFF
      console.log('Videos from people you may know switch is OFF');
    }
  };

  // Function to handle changes in the "Live rewards notifications" Switch
  const handleLiveRewardsSwitch = value => {
    setLiveRewardsSwitch(value);
    // Additional logic can be added based on the value (true/false)
    if (value) {
      // Actions when the switch is turned ON
      console.log('Live rewards notifications switch is ON');
    } else {
      // Actions when the switch is turned OFF
      console.log('Live rewards notifications switch is OFF');
    }
  };

  // Function to handle changes in the "Get LIVE notifications from accounts you follow" Switch
  const handleLiveNotificationsSwitch = value => {
    setLiveNotificationsSwitch(value);
    // Additional logic can be added based on the value (true/false)
    if (value) {
      // Actions when the switch is turned ON
      console.log(
        'Get LIVE notifications from accounts you follow switch is ON',
      );
    } else {
      // Actions when the switch is turned OFF
      console.log(
        'Get LIVE notifications from accounts you follow switch is OFF',
      );
    }
  };

  const handleSectionSwitchChange = (dataItem, value) => {
    setSectionSwitches(prevSwitches => ({
      ...prevSwitches,
      [dataItem]: value,
    }));

    // Additional logic can be added based on the value (true/false) and data item
    if (value) {
      // Actions when the switch is turned ON
      console.log(`Switch for data item ${dataItem} is ON`);
    } else {
      // Actions when the switch is turned OFF
      console.log(`Switch for data item ${dataItem} is OFF`);
    }
  };

  const handleOtherSwitchChange = (dataItem, value) => {
    setOtherSwitches(prevSwitches => ({
      ...prevSwitches,
      [dataItem]: value,
    }));

    // Additional logic can be added based on the value (true/false) and data item
    if (value) {
      // Actions when the switch is turned ON
      console.log(`Switch for data item ${dataItem} is ON`);
    } else {
      // Actions when the switch is turned OFF
      console.log(`Switch for data item ${dataItem} is OFF`);
    }
  };

  const RenderUsers = ({item, index}) => {
    const [radioValue, setRadioValue] = useState('');
    return (
      <View style={styles.user_left_container}>
        <View style={styles.profile_username}>
          <ProfileImage uri={item?.profile_pic} />
          <Text style={styles.username_text}>
            {truncateText(item?.username, 7)}
          </Text>
        </View>
        <View style={styles.txt_icon_radio}>
          <View style={styles.icon_txt}>
            <Text style={styles.personised_txt}>Personalized</Text>
            <Text style={styles.personised_txt}>None</Text>
            <Text style={{marginLeft: width * 0.11, marginTop: 4}}>All</Text>
          </View>
          <View style={styles.images_bell}>
            <Image
              source={icons.settingNotification}
              style={{width: 20, height: 20}}
            />
            <Image
              source={icons.settingNotification}
              style={{width: 20, height: 20}}
            />
            <Image
              source={icons.settingNotification}
              style={{width: 20, height: 20}}
            />
          </View>
          <View>
            <View>
              <RadioButton.Group
                onValueChange={newValue => setRadioValue(newValue)}
                value={radioValue}>
                <View style={styles.radio_button}>
                  <RadioButton value="Personalized" color="red" size={25} />
                  <RadioButton value="None" color="red" size={25} />
                  <RadioButton value="All" color="red" size={25} />
                </View>
              </RadioButton.Group>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.main_container}>
      <Header headertext={'Notification'} />
      <ScrollView style={styles.scrollview_container}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="grey" />
          </View>
        )}

        <View style={styles.title}>
          <Text style={styles.txt}>You can choose which notifications you</Text>
          <Text style={styles.txt}>need to enable in the Dream app</Text>
        </View>
        <View style={styles.listHeader}>
          <Text style={styles.txtHeader}>Suggested Videos</Text>
        </View>
        <View style={styles.videoSuggested}>
          <View style={styles.left_txt}>
            <Text style={styles.inner_txt}>Videos from account you follow</Text>
          </View>
          <View>
            <Switch
              value={videoFollowSwitch}
              onValueChange={handleVideoFollowSwitch}
              color
            />
          </View>
        </View>

        <View style={styles.videoSuggested}>
          <View style={styles.left_txt}>
            <Text style={styles.inner_txt}>Videos you might like</Text>
          </View>
          <View>
            <Switch
              value={videoLikeSwitch}
              onValueChange={handleVideoLikeSwitch}
            />
          </View>
        </View>
        <View style={styles.videoSuggested}>
          <View style={styles.left_txt}>
            <Text style={styles.inner_txt}>
              Videos from people you may know
            </Text>
          </View>
          <View>
            <Switch
              value={videoPeopleKnowSwitch}
              onValueChange={handleVideoPeopleKnowSwitch}
            />
          </View>
        </View>
        <View style={styles.listHeader}>
          <Text style={styles.txtHeader}>Live Notification settings</Text>
        </View>
        <View style={styles.videoSuggested}>
          <View style={styles.left_txt}>
            <Text style={styles.inner_txt}>Live rewards notifications</Text>
          </View>
          <View>
            <Switch
              value={liveRewardsSwitch}
              onValueChange={handleLiveRewardsSwitch}
            />
          </View>
        </View>
        <View style={styles.videoSuggested}>
          <View style={styles.left_txt}>
            <Text style={styles.inner_txt}>
              Get LIVE notifications from accounts you follow
            </Text>
          </View>
          <View>
            <Switch
              value={liveNotificationsSwitch}
              onValueChange={handleLiveNotificationsSwitch}
            />
          </View>
        </View>
        {/* I wanted to add dropdown accordion for this list is it possible. */}
        <View style={styles.user_flatlist}>
          <TouchableOpacity
            onPress={() => toggleExpand()}
            style={styles.userHeader}>
            <Text style={styles.txtHeader}>User List</Text>
            <Image
              source={icons.right}
              style={[
                styles.arrowIcon,
                {
                  transform: [{rotate: expandedItem ? '90deg' : '-90deg'}],
                  marginTop: 10,
                },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Animated.View style={styles.searchInput}>
              <CInput
                iconLeft={icons.search}
                placeholder={'Search'}
                value={searchQuery}
                iconColor={'#000000'}
                style={{height: 44, borderRadius: 0}}
                onChangeText={text => {
                  handleSearch(text);
                  setExpandedItem(true);
                }}
                returnKeyType={'search'}
              />
            </Animated.View>
          </View>
          {expandedItem && (
            <View>
              {/* <TextInput
                style={styles.searchBar}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={handleSearch} // Update search query on text input
              /> */}

              {/* <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                  <RenderUsers item={item} index={index} />
                )}
              /> */}

              <View style={{flex: 1}}>
                {filteredUsers.length > 0 ? (
                  <FlatList
                    data={filteredUsers}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item, index}) => (
                      <RenderUsers item={item} index={index} />
                    )}
                    style={{maxHeight: 500}}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  />
                ) : (
                  <Text style={styles.noResultsText}>No Search Results</Text> // Display message when no users found
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section_main_container}>
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({item}) => (
              <View style={styles.section_list_txt_switch}>
                <View style={styles.left_sectionView}>
                  <Text style={{color: '#000'}}>{item}</Text>
                </View>

                <Switch
                  value={sectionSwitches[item]}
                  onValueChange={value =>
                    handleSectionSwitchChange(item, value)
                  }
                />
              </View>
            )}
            renderSectionHeader={({section: {title}}) => (
              <View style={styles.listHeader}>
                <Text style={styles.txtHeader}>{title}</Text>
              </View>
            )}
          />
        </View>
        <View>
          <View style={styles.listHeader}>
            <Text style={styles.txtHeader}>Other</Text>
          </View>
          <View style={styles.videoSuggested}>
            <View style={styles.left_txt}>
              <Text style={styles.inner_txt}>People You May Be Know</Text>
              <Text>
                Allow Dream App to send you notifications about people you may
                know from your contacts,Facebook friends, and more...
              </Text>
            </View>
            <View>
              <Switch
                value={otherSwitches['People You May Be Know']}
                onValueChange={value =>
                  handleOtherSwitchChange('People You May Be Know', value)
                }
                trackColor={{false: '#767577', true: 'red'}}
                thumbColor={
                  otherSwitches['People You May Be Know'] ? 'red' : '#f4f3f4'
                }
              />
            </View>
          </View>
          <View style={styles.videoSuggested}>
            <View style={styles.left_txt}>
              <Text style={styles.inner_txt}>
                If You need Enter Your E-mail address
              </Text>
              <Text>
                Your email address may be used to connect you to people you may
                know, improve ads, and more, depending on your settings.
              </Text>
            </View>
            <View>
              <Switch
                value={otherSwitches['If You need Enter Your E-mail address']}
                onValueChange={value =>
                  handleOtherSwitchChange(
                    'If You need Enter Your E-mail address',
                    value,
                  )
                }
              />
            </View>
          </View>
          <View style={styles.email_bottom}>
            <TextInput placeholder="E-mail Address" />
          </View>
          <TouchableOpacity style={styles.send_code}>
            <Text style={{color: '#fff'}}>Send Code </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.thank_you}>
          <Text style={styles.thank_you_txt}>Thank You for using</Text>
          <Text style={styles.thank_you_txt}>Dream</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default MainNotification;

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  scrollview_container: {
    backgroundColor: '#fafafa',
  },
  title: {
    backgroundColor: '#fff',
    width: width * 0.95,
    height: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  txt: {
    color: '#000',
    fontWeight: '600',
    lineHeight: 25,
  },
  listHeader: {
    width: width,
    height: height * 0.05,
    padding: 5,
    justifyContent: 'center',
  },
  txtHeader: {
    fontWeight: '700',
    fontSize: 16,
  },

  videoSuggested: {
    backgroundColor: '#fff',
    width: width * 0.95,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 4,
    padding: 4,
  },
  username_text: {
    // backgroundColor:"green",
    marginLeft: width * 0.04,
    marginTop: width * 0.02,
    color: '#000',
  },
  left_txt: {
    justifyContent: 'center',
    // backgroundColor: "pink",
    width: width * 0.6,
  },
  inner_txt: {
    fontSize: 15,
    color: '#000',
  },
  users_left_view: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  users_main_container: {
    flexDirection: 'row', // Change here
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    // backgroundColor: "pink",
  },
  user_flatlist: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: width * 0.95,

    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 5,
  },
  user_left_container: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  profile_username: {
    flexDirection: 'row',
    width: width * 0.4,
    // backgroundColor: "pink",
    paddingHorizontal: 10,
  },
  txt_icon_radio: {
    width: width * 0.6,
  },
  icon_txt: {
    flexDirection: 'row',
  },
  images_bell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radio_button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  email_bottom: {
    borderBottomWidth: 0.4,
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  thank_you: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    height: height * 0.35,
  },
  personised_txt: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  section_list_txt_switch: {
    backgroundColor: '#fff',
    width: width * 0.95,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingVertical: 10,
  },
  left_sectionView: {
    width: width * 0.6,
    // backgroundColor: "red",
    justifyContent: 'center',
  },

  inner_switch: {
    justifyContent: 'flex-end',
    width: width * 0.4,
    // backgroundColor: "blue"
  },
  send_code: {
    backgroundColor: 'red',
    width: width * 0.5,
    alignSelf: 'center',
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  thank_you_txt: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 12,
    // backgroundColor: '#e0e0e0',
    width: width,
    height: height * 0.03,
    // padding: 5,
    // marginRight: 50
    // justifyContent: 'center',
    paddingRight: 40,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowText: {
    fontSize: 16,
    color: '#666',
  },

  searchBar: {
    padding: 7,
    // borderBottomWidth: 1,
    borderColor: '#ccc',
    // margin: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  searchInput: {
    flexGrow: 1,
    borderRadius: 24,
  },
  arrowIcon: {
    marginTop: 7,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
});
