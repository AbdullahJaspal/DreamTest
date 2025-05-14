import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {DateTime} from 'luxon';

import Entypo from 'react-native-vector-icons/Entypo';

import * as analyticsApi from '../../../../apis/analyticsApi';

import {BarChart} from 'react-native-gifted-charts';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('window');

const MeAnalytics = () => {
  const my_data = useAppSelector(selectMyProfileData);
  const {t, i18n} = useTranslation();

  const [selectedId, setSelectedId] = useState(null);
  const [startingTime, setStartingTime] = useState(1);
  const [date, setDate] = useState({
    starting_date: DateTime.local().toFormat('dd LLL'),
    ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
  });
  const [filterDateText, setFilterDateText] = useState(t('Last 1 day'));
  const [showFilter, setShowFilter] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    coinsSent: 0,
    coinsReceived: 0,
    totalLikedPosts: 0,
    totalLikesReceived: 0,
    totalFollowers: 0,
    totalFollowersSend: 0,
    usageTime: 0,
    totalReceivedComments: 0,
    totalSentComments: 0,
    likedPostsPayload: [],
    likesReceivedPayload: [],
    followersPayload: [],
    followersSendPayload: [],
    receivedCommentsPayload: [],
    sentCommentsPayload: [],
    diamondSentResult: [],
    diamondReceivedResult: [],
    sharesSent: [],
    sharesReceived: [],
  });

  //Graph Bar
  const [barData, setBarData] = useState([]);

  const getAllAnalytics = async () => {
    try {
      const ending_time = new Date();
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - startingTime);

      // Fetch data for all analytics
      const [
        likedPosts,
        likesReceived,
        followers,
        followersSend,
        receivedComments,
        sentComments,
        diamondReceivedResult,
        diamondSentResult,
        sharesSent,
        sharesReceived,
      ] = await Promise.all([
        analyticsApi.getTotalLikedPosts(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getTotalLikesReceived(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getFollowAnalytics(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getFollowAnalyticsByUser(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getReceivedCommentsByUser(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getSentCommentsByUser(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getCoinAnalytics(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getSentCoinsAnalytics(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getTotalSharesSentByUser(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),
        analyticsApi.getTotalSharesReceivedByUser(
          my_data?.auth_token,
          currentDate,
          ending_time,
        ),

        // analyticsApi.getUserInteractions(my_data?.auth_token, currentDate, ending_time),
        // analyticsApi.getCoinAnalytics(my_data?.auth_token, currentDate, ending_time),
      ]);
      // console.log("Result diamondReceivedResult", diamondSentResult);

      // Update state with the fetched data
      setAnalyticsData({
        // coinsSent: diamondResult?.totalReceivedCoins || 0,
        // coinsReceived: diamondResult?.totalSentCoins || 0,
        totalLikedPosts: likedPosts?.total_like_received || 0,
        totalLikesReceived: likesReceived?.total_like_received || 0,
        totalFollowers: followers?.total_follow_initiated || 0,
        totalFollowersSend: followersSend?.total_follow_initiated || 0,
        // usageTime: usageTime?.total_time_spended || 0,
        likedPostsPayload: likedPosts?.payload || [],
        likesReceivedPayload: likesReceived?.payload || [],
        followersPayload: followers?.payload || [],
        followersSendPayload: followersSend?.payload || [],
        receivedCommentsPayload: receivedComments?.payload || [],
        totalReceivedComments: receivedComments?.total_received_comments || 0,
        totalSentComments: sentComments.total_send_comments || 0,
        sentCommentsPayload: sentComments?.payload || [],
        totalReceivedDiamonds: diamondReceivedResult.totalReceivedCoins || 0,
        totalReceivedDiamondsPayload: diamondReceivedResult?.payload || [],
        totalSentDiamonds: diamondSentResult?.totalSentCoins || 0,
        totalSentDiamondsPayload: diamondSentResult?.payload || [],
        totalSharesSent: sharesSent?.total_shares_received || 0,
        totalSharesReceived: sharesReceived?.total_shares_received || 0,
        sharesSentPayload: sharesSent?.payload || [],
        sharesReceivedPayload: sharesReceived?.payload || [],
      });

      // Map data to bar graph format initially (default case)
      setBarData(
        mapAnalyticsToBarData(likedPosts?.payload || [], 'total_like', 'day'),
      );
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  useEffect(() => {
    getAllAnalytics();
  }, [startingTime]);

  // console.log(
  //   'ANALYTICS totalSentDiamondsPayload',
  //   analyticsData.sharesSentPayload,
  //   analyticsData.totalSharesSent,
  // );
  // console.log(
  //   'ANALYTICS totalReceivedDiamondsPayload',s
  //   analyticsData.sharesReceivedPayload,
  //   analyticsData.totalSharesReceived,
  // );

  const handleFilterPress = () => setShowFilter(prev => !prev);

  const applyLogScale = (data, valueKey) => {
    return data.map(item => ({
      ...item,
      logValue: Math.log10(parseInt(item[valueKey], 10) + 1), // Add 1 to avoid log(0)
    }));
  };

  const mapAnalyticsToBarData = (rawData, valueKey, labelKey) => {
    const logScaledData = applyLogScale(rawData, valueKey);
    return logScaledData.map(item => ({
      value: item.logValue || 0,
      label: DateTime.fromISO(item[labelKey]).toFormat('dd LLL'),
      originalValue: item[valueKey], // Keep original value for tooltips
    }));
  };

  // const mapAnalyticsToBarData = (rawData, valueKey, labelKey) => {
  //   return (
  //     rawData?.map((item) => ({
  //       value: item[valueKey] || 0,
  //       label: DateTime.fromISO(item[labelKey]).toFormat('dd LLL'),
  //     })) || []
  //   );
  // };

  // Render tooltip
  const renderTooltip = item => (
    <View
      style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 5,
        borderRadius: 5,
      }}>
      <Text style={{color: '#fff'}}>{`Total: ${item.originalValue}`}</Text>
    </View>
  );

  // Define the `updateBarData` function
  const updateBarData = (type, rawData = []) => {
    let formattedBarData = [];
    switch (type) {
      case 'likesSend':
        formattedBarData = mapAnalyticsToBarData(rawData, 'total_like', 'day');
        break;
      case 'likesRecieved':
        formattedBarData = mapAnalyticsToBarData(rawData, 'total_like', 'day');
        break;
      case 'followersSend':
        formattedBarData = mapAnalyticsToBarData(
          rawData,
          'total_follow',
          'day',
        );
        break;
      case 'followersReceived':
        formattedBarData = mapAnalyticsToBarData(
          rawData,
          'total_follow',
          'day',
        );
        break;
      case 'receivedComments':
        formattedBarData = mapAnalyticsToBarData(
          rawData,
          'total_received_comments',
          'day',
        );
        break;
      case 'sentComments':
        formattedBarData = mapAnalyticsToBarData(
          rawData,
          'total_send_comments',
          'day',
        );
        break;
      case 'sentDiamonds':
        formattedBarData = mapAnalyticsToBarData(rawData, 'totalCoins', 'day');
        break;
      case 'receivedDiamonds':
        formattedBarData = mapAnalyticsToBarData(rawData, 'totalCoins', 'day');
        break;
      case 'sharesSent':
        formattedBarData = mapAnalyticsToBarData(
          rawData,
          'total_shares',
          'day',
        );
        break;
      case 'sharesReceived':
        formattedBarData = mapAnalyticsToBarData(
          rawData,
          'total_shares',
          'day',
        );
        break;
      // Add more cases as needed
      default:
        break;
    }
    setBarData(formattedBarData);
  };

  const DATA = [
    {
      id: '3',
      uppertitle: analyticsData.totalLikedPosts,
      middletitle: t('Liked Send Posts'),
      onPress: () =>
        updateBarData('likesSend', analyticsData.likedPostsPayload),
    },
    {
      id: '4',
      uppertitle: analyticsData.totalLikesReceived,
      middletitle: t('Likes Received'),
      onPress: () =>
        updateBarData('likesRecieved', analyticsData.likesReceivedPayload),
    },
    {
      id: '5',
      uppertitle: analyticsData.totalFollowersSend,
      middletitle: t('Followers Sent'),
      onPress: () =>
        updateBarData('followersReceived', analyticsData.followersSendPayload),
    },
    {
      id: '6',
      uppertitle: analyticsData.totalFollowers,
      middletitle: t('Followers Received'),
      onPress: () =>
        updateBarData('followersSend', analyticsData.followersPayload),
    },
    {
      id: '7',
      uppertitle: analyticsData.totalReceivedComments,
      middletitle: t('Comments Received'),
      onPress: () =>
        updateBarData(
          'receivedComments',
          analyticsData.receivedCommentsPayload,
        ),
    },
    {
      id: '8',
      uppertitle: analyticsData.totalSentComments,
      middletitle: t('Comments Sent'),
      onPress: () =>
        updateBarData('sentComments', analyticsData.sentCommentsPayload),
    },
    {
      id: '7',
      uppertitle: analyticsData.totalReceivedComments,
      middletitle: 'Comments Received',
      onPress: () =>
        updateBarData(
          'receivedComments',
          analyticsData.receivedCommentsPayload,
        ),
    },
    {
      id: '9',
      uppertitle: analyticsData.totalSentDiamonds,
      middletitle: t('Diamonds Sent'),
      onPress: () =>
        updateBarData('sentDiamonds', analyticsData.totalSentDiamondsPayload),
    },
    {
      id: '10',
      uppertitle: analyticsData.totalReceivedDiamonds,
      middletitle: t('Diamonds Received'),
      onPress: () =>
        updateBarData(
          'receivedDiamonds',
          analyticsData.totalReceivedDiamondsPayload,
        ),
    },
    {
      id: '11',
      uppertitle: analyticsData.totalSharesSent,
      middletitle: t('Shares Sent'),
      onPress: () =>
        updateBarData('sharesSent', analyticsData.sharesSentPayload),
    },
    {
      id: '12',
      uppertitle: analyticsData.totalSharesReceived,
      middletitle: t('Shares Received'),
      onPress: () =>
        updateBarData('sharesReceived', analyticsData.sharesReceivedPayload),
    },
  ];

  const filterData = [
    {
      id: 1,
      title: t('Last 1 day'),
      onPress: () => {
        setFilterDateText('Last 1 day');
        setDate(prev => ({
          ...prev,
          ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
        }));
        setStartingTime(1);
        setShowFilter(false);
      },
    },
    {
      id: 2,
      title: t('Last 7 days'),
      onPress: () => {
        setFilterDateText('Last 7 days');
        setDate(prev => ({
          ...prev,
          ending_date: DateTime.local().minus({days: 7}).toFormat('dd LLL'),
        }));
        setStartingTime(7);
        setShowFilter(false);
      },
    },
    {
      id: 3,
      title: t('Last 15 days'),
      onPress: () => {
        setFilterDateText('Last 15 days');
        setDate(prev => ({
          ...prev,
          ending_date: DateTime.local().minus({days: 15}).toFormat('dd LLL'),
        }));
        setStartingTime(15);
        setShowFilter(false);
      },
    },
    {
      id: 4,
      title: t('Last 30 days'),
      onPress: () => {
        setFilterDateText('Last 30 days');
        setDate(prev => ({
          ...prev,
          ending_date: DateTime.local().minus({days: 30}).toFormat('dd LLL'),
        }));
        setStartingTime(30);
        setShowFilter(false);
      },
    },
    {
      id: 5,
      title: t('Last 90 days'),
      onPress: () => {
        setFilterDateText('Last 90 days');
        setDate(prev => ({
          ...prev,
          ending_date: DateTime.local().minus({days: 90}).toFormat('dd LLL'),
        }));
        setStartingTime(90);
        setShowFilter(false);
      },
    },
  ];

  // Trigger updateBarData whenever date or startingTime changes
  useEffect(() => {
    updateBarData('likesSend');
    setSelectedId('3'); // Toggle selected ID
  }, [date, startingTime]);

  const renderItem = ({item}) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item.id === selectedId ? item.id : item.id); // Toggle selected ID
          item.onPress(); // Call the item's onPress function
        }}>
        <View
          style={{
            backgroundColor: item.id === selectedId ? 'red' : 'white',
            width: width * 0.4,
            height: height * 0.1,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'rgba(0,0,0,0.2)',
            margin: 12,
          }}>
          {/* <Text>{item.uppertitle}</Text>
          <Text>{item.middletitle}</Text>
          <Text>{item.bottomtitle}</Text> */}
          <Text
            style={{
              color: item.id === selectedId ? 'white' : 'black',
              fontStyle: 'bolder', // Corrected
            }}>
            {item.uppertitle}
          </Text>
          <Text
            style={{
              color: item.id === selectedId ? 'white' : 'black',
              fontStyle: 'bolder', // Corrected
            }}>
            {item.middletitle}
          </Text>
          <Text
            style={{
              color: item.id === selectedId ? 'white' : 'black',
              fontStyle: 'bolder', // Corrected
            }}>
            {item.bottomtitle}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#ffff'}}>
      <View
        style={{
          paddingHorizontal: width * 0.05,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 25,
          padding: 5,
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '300',
                color: '#000',
                opacity: 0.8,
              }}>
              {date?.ending_date} - {date?.starting_date}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginRight: width * 0.03,
              fontSize: 17,
              fontWeight: '500',
              color: '#000',
            }}>
            {t('Filter')}:
          </Text>
          <TouchableOpacity
            onPress={handleFilterPress}
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#d4d5d6',
              width: width * 0.25,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 12, fontWeight: '500', color: '#000'}}>
              {t(filterDateText)}
            </Text>
            <Entypo name="chevron-small-down" size={20} alignItems={'center'} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Bar Chart */}
      <View
        style={{paddingVertical: 20, backgroundColor: '#fff', marginTop: 20}}>
        <ScrollView horizontal={true}>
          <BarChart
            barWidth={25}
            noOfSections={5}
            frontColor="red"
            data={barData}
            yAxisThickness={1}
            xAxisThickness={1}
            spacing={40}
            width={Math.max(width, barData.length * 65)} // Dynamically set width based on data length
            initialSpacing={10}
            isAnimated={true}
            rotateLabel={true}
            labelsExtraHeight={50}
            hideYAxisText={false}
            capColor={'rgb(78, 0, 142)'}
            barBorderRadius={3}
            renderTooltip={renderTooltip} // Display original values in tooltip
          />
        </ScrollView>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </View>
      <Modal visible={showFilter} transparent={true}>
        <Pressable
          style={{flex: 1}}
          onPress={() => {
            setShowFilter(false);
          }}>
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#fff',
              width: width * 0.25,
              right: width * 0.05,
              top: 155,
              borderRadius: 1,
            }}>
            <FlatList
              data={filterData}
              renderItem={({item}) => (
                <Pressable style={{padding: 10}} onPress={item.onPress}>
                  <Text>{item.title}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MeAnalytics;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filter_view: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 10,
    marginLeft: 5,
  },
  filter_text: {
    fontSize: 16,
    color: '#020202',
  },
  font_size: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
});
