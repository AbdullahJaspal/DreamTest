import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {DateTime} from 'luxon';
import * as analyticsApi from '../../../../apis/analyticsApi';
import {BarChart} from 'react-native-gifted-charts';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const GeneralAnalytics: React.FC = () => {
  const my_data = useAppSelector(selectMyProfileData);
  const {t, i18n} = useTranslation();

  const [selectedId, setSelectedId] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [date, setDate] = useState({
    starting_date: DateTime.local().toFormat('dd LLL'),
    ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
  });
  // const [date, setDate] = useState({
  //   starting_date: DateTime.local().setLocale(i18n.language).toFormat('dd LLL'),
  //   ending_date: DateTime.local().minus({ days: 1 }).setLocale(i18n.language).toFormat('dd LLL'),
  // });
  const [filterDateText, setFillterDateText] = useState(t('Last 1 day'));
  const [showFilter, setShowFilter] = useState(false);
  const [startingTime, setStartingTime] = useState(1);

  const [received_comment, setReceivedcomment] = useState();
  const [received_Total_like, setReceivedTotalLike] = useState();
  const [total_coins, setTotalCoins] = useState();
  const [receivedFollower, setReceivedTotalFollower] = useState();
  const [user_interaction, setUser_interaction] = useState();
  // console.log(user_interaction.total_time_spended,"user_interactionuser_interaction")
  const [barData, setBarData] = useState([]);

  const handleFilterPress = () => {
    setShowFilter(p => !p);
  };

  //calling the data og all the analytics

  const getAllAnalytics = async () => {
    try {
      const ending_time = new Date();
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - startingTime);
      const diamond_result = await analyticsApi.getCoinAnalytics(
        my_data?.auth_token,
        currentDate,
        ending_time,
      );
      const follow_result = await analyticsApi.getFollowAnalytics(
        my_data?.auth_token,
        currentDate,
        ending_time,
      );
      const comment_result = await analyticsApi.ViewersSubmitComment(
        my_data?.auth_token,
        currentDate,
        ending_time,
      );
      const like_result = await analyticsApi.getLikeAnalytics(
        my_data?.auth_token,
        currentDate,
        ending_time,
      );
      const user_interaction_result = await analyticsApi.getUserInteractions(
        my_data?.auth_token,
        currentDate,
        ending_time,
      );

      // console.log(diamond_result,"total_coinsjuh")

      setReceivedTotalFollower(follow_result);
      setReceivedcomment(comment_result);
      setReceivedTotalLike(like_result);
      setTotalCoins(diamond_result);
      setUser_interaction(user_interaction_result);
    } catch (error) {}
  };

  useEffect(() => {
    getAllAnalytics();
  }, [startingTime]);

  const mapAnalyticsToBarData = (
    rawData: any,
    valueKey: string,
    labelKey: string,
  ) => {
    return (
      rawData?.map((item: any) => ({
        value: item[valueKey],
        label: DateTime.fromISO(item[labelKey]).toFormat('dd LLL'),
      })) || []
    );
  };

  const updateBarData = dataType => {
    let rawData = [];
    let valueKey = '';
    let labelKey = 'day';

    switch (dataType) {
      case 'likes':
        rawData = received_Total_like?.payload;
        valueKey = 'total_like';
        break;
      case 'followers':
        rawData = receivedFollower?.payload;
        valueKey = 'total_follow';
        break;
      case 'comments':
        rawData = received_comment?.payload?.result;
        valueKey = 'total_received_comments';
        break;
      case 'coins':
        rawData = total_coins?.payload;
        valueKey = 'totalCoins';
        break;
      case 'interaction':
        rawData = user_interaction?.payload?.map(item => ({
          ...item,
          total_interacted_time: item?.total_interacted_time / 3600000, // Convert ms to hours
        }));
        valueKey = `total_interacted_time`;
        console.log('Processed interaction data:', rawData);

        break;
      default:
        console.error('Invalid data type:', dataType);
        return;
    }

    const mappedData = mapAnalyticsToBarData(rawData, valueKey, labelKey);
    setBarData(mappedData);
  };

  // Trigger updateBarData whenever date or startingTime changes
  useEffect(() => {
    updateBarData('likes');
  }, [date, startingTime]);

  const filterData = [
    {
      id: 1,
      title: t('Last 1 day'),
      onPress: () => {
        setFillterDateText('Last 1 day');
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
        }));
        setStartingTime(4);
        setShowFilter(p => !p);
      },
    },
    {
      id: 2,
      title: t('Last 7 days'),
      onPress: () => {
        setFillterDateText('Last 7 days');
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 7}).toFormat('dd LLL'),
        }));
        setStartingTime(7);
        setShowFilter(p => !p);
      },
    },
    {
      id: 3,
      title: t('Last 15 days'),
      onPress: () => {
        setFillterDateText('Last 15 days');
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 15}).toFormat('dd LLL'),
        }));
        setStartingTime(15);
        setShowFilter(p => !p);
      },
    },
    {
      id: 4,
      title: t('Last 30 days'),
      onPress: () => {
        setFillterDateText('Last 30 days');
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 30}).toFormat('dd LLL'),
        }));
        setStartingTime(30);
        setShowFilter(p => !p);
      },
    },
    {
      id: 5,
      title: t('Last 90 days'),
      onPress: () => {
        setFillterDateText('Last 90 days');
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 90}).toFormat('dd LLL'),
        }));
        setStartingTime(90);
        setShowFilter(p => !p);
      },
    },
  ];

  // useEffect(() => {
  //   console.log("Bar data updated 2: ", barData); // Debug log
  //   updateBarData('likes');
  //   updateBarData('likes');  // Call updateBarData for likes

  // }, [date]);

  const User_video = [
    // {
    //   id: '1',
    //   uppertitle: 'Total Shares',
    //   bottomtitle: '---',
    //   onPress: () => {
    //     // Add logic for shares if needed
    //   },
    // },
    {
      id: '2',
      uppertitle: t('Total Like'),
      bottomtitle: `${received_Total_like?.total_like_received}`,
      onPress: () => {
        updateBarData('likes'); // Call updateBarData for likes
        console.log('Button Clicked');
      },
    },
    {
      id: '3',
      uppertitle: t('Total followers'),
      bottomtitle: `${receivedFollower?.total_follow_initiated}`,
      onPress: () => {
        updateBarData('followers'); // Call updateBarData for followers
      },
    },
    {
      id: '4',
      uppertitle: t('Usage time'),
      bottomtitle: user_interaction?.total_time_spended
        ? user_interaction.total_time_spended < 60
          ? `${user_interaction.total_time_spended} min`
          : `${(user_interaction.total_time_spended / 60).toFixed(2)} hr`
        : '0 hr',
      onPress: () => {
        // Add logic for usage time if needed
        updateBarData('interaction');
      },
    },
    // {
    //   id: '5',
    //   uppertitle: 'Total comments',
    //   bottomtitle: `${received_comment?.payload?.totalReceivedComments}`,
    //   onPress: () => {
    //     updateBarData('comments');  // Call updateBarData for comments
    //   },
    // },
    {
      id: '6',
      uppertitle: t('Total Coins'),
      bottomtitle: `${total_coins?.totalReceivedCoins}`,
      onPress: () => {
        updateBarData('coins'); // Call updateBarData for coins
      },
    },
    // {
    //   id: '7',
    //   uppertitle: '----',
    //   bottomtitle: '----',
    //   onPress: () => {
    //     // Add logic for item 7 if needed
    //   },
    // },
    // {
    //   id: '8',
    //   uppertitle: 'Total ticket purchase',
    //   middletitle: 'Luckwheel',
    //   bottomtitle: '----',
    //   onPress: () => {
    //     // Add logic for ticket purchase if needed
    //   },
    // },
  ];

  // const User_live = [
  //   {
  //     id: '9',
  //     uppertitle: 'Total Shares',

  //     bottomtitle: '130',

  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '10',
  //     uppertitle: 'Total Like',
  //     bottomtitle: '920',
  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '11',
  //     uppertitle: 'Total followers',
  //     bottomtitle: '6',
  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '12',
  //     uppertitle: 'Usage time',

  //     bottomtitle: '2:6 hr',
  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '13',
  //     uppertitle: 'Total comments',

  //     bottomtitle: '55',
  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '14',
  //     uppertitle: 'Total Coins',
  //     bottomtitle: '120',
  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '15',
  //     uppertitle: 'Total coins from',
  //     middletitle: 'wheel box',
  //     bottomtitle: '---',
  //     onPress: (onPress = () => { }),
  //   },
  //   {
  //     id: '16',
  //     uppertitle: 'Total ticket purchase',
  //     middletitle: 'Luckwheel',
  //     bottomtitle: '---',
  //     onPress: (onPress = () => { }),
  //   },
  // ];
  const renderItem = ({item}) => (
    <View>
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item.id === selectedId ? null : item.id); // Toggle selected ID
          item.onPress(); // Call the item's onPress function
        }}>
        <View
          style={{
            backgroundColor: item.id === selectedId ? 'red' : 'white',
            width: width * 0.6,
            height: height * 0.1,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'rgba(0,0,0,0.2)',
            margin: 12,
          }}>
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

  // const renderliveItem = ({ item }) => (
  //   <View>
  //     <TouchableOpacity
  //       onPress={() => setSelected(item.id === selected ? null : item.id)}>
  //       <View
  //         style={{
  //           backgroundColor: item.id === selected ? 'red' : 'white',

  //           width: width * 0.4,
  //           height: height * 0.1,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderWidth: 2,
  //           borderColor: 'rgba(0,0,0,0.2)',
  //           margin: 12,
  //         }}>
  //         <Text>{item.uppertitle}</Text>
  //         <Text>{item.middletitle}</Text>
  //         <Text>{item.bottomtitle}</Text>
  //       </View>
  //     </TouchableOpacity>
  //   </View>
  // );

  // Analytics data for the chart
  const chartData = [
    {label: 'Sep 18', value: total_coins?.totalReceivedCoins || 0},
    {label: 'Sep 19', value: received_Total_like?.total_like_received || 0},
    {
      label: 'Sep 20',
      value: received_comment?.payload?.totalReceivedComments || 0,
    },
  ];

  const RenderToolTip = (item, index) => {
    return (
      <View
        style={{
          backgroundColor: '#f29da3',
          alignItems: 'center',
          borderRadius: 2,
          paddingHorizontal: 10,
          position: 'absolute',
          top: -150,
          left: -50,
          paddingVertical: 4,
        }}>
        <Text style={styles.font_size}>Date: {item.label}</Text>
        <Text style={styles.font_size}>Value: {item?.value}</Text>
      </View>
    );
  };

  const LoaderComponent = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#3498db" />{' '}
      {/* Adjust size and color as needed */}
    </View>
  );

  return (
    <ScrollView style={{backgroundColor: '#fff', flex: 1}}>
      <View
        style={{
          paddingHorizontal: width * 0.05,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 25,
          padding: 5,
          // backgroundColor:'pink'
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 300,
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
              fontWeight: 500,
              color: '#000',
            }}>
            {t('Filter')} :
          </Text>

          {/* displaying date view */}
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
            <Text style={{fontSize: 12, fontWeight: 500, color: '#000'}}>
              {/* {filterDateText} */}
              {i18n.language === 'ar' ? t(filterDateText) : filterDateText}
            </Text>
            <Entypo name="chevron-small-down" size={20} alignItems={'center'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bar Chart Section */}
      <View style={styles.chartContainer}>
        <BarChart
          barWidth={25}
          noOfSections={5}
          frontColor="red"
          data={barData}
          yAxisThickness={1}
          xAxisThickness={1}
          spacing={40}
          // backgroundColor={'#020202'}
          width={width * 0.95}
          initialSpacing={10}
          dashGap={10}
          isAnimated={true}
          // textFontSize={20}
          // onPress={console.log('he')}
          rotateLabel={true}
          labelsExtraHeight={50}
          hideYAxisText={false}
          renderTooltip={RenderToolTip}
          capColor={'rgb(78, 0, 142)'}
          barBorderRadius={3}
        />
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          marginLeft: width * 0.05,
          marginRight: width * 0.05,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            width: width * 0.7,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 14, fontWeight: 500}}>
            {t('User Use video')}
          </Text>
          <FlatList
            data={User_video}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>

        {/* <View
          style={{
            // backgroundColor: '#b88a7d',
            width: width * 0.45,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>User Use Live</Text>
          <FlatList
            data={User_live}
            renderItem={renderliveItem}
            keyExtractor={item => item.id}
          />
        </View> */}
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
              renderItem={({item, index}) => (
                <Pressable style={styles.filter_view} onPress={item?.onPress}>
                  <Text style={styles.filter_text}>{item?.title}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

export default GeneralAnalytics;
const styles = StyleSheet.create({
  box: {
    width: width * 0.42,
    height: height * 0.09,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 20,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  txt: {
    fontSize: 14,
    color: '#000',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
