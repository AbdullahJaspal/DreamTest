import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {DateTime} from 'luxon';

import Entypo from 'react-native-vector-icons/Entypo';

import {BarChart} from 'react-native-gifted-charts';

import * as analyticsApi from '../../../../apis/analyticsApi';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('screen');

const VideoAnalytics = () => {
  const {t, i18n} = useTranslation();

  const my_data = useAppSelector(selectMyProfileData);
  // console.log(my_data, "bjbjb")
  const [activeButton, setActiveButton] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterDateText, setFillterDateText] = useState(t('Last 1 day'));
  const [barData, setBarData] = useState([]);
  const [startingTime, setStartingTime] = useState(1);
  const [date, setDate] = useState({
    starting_date: DateTime.local().toFormat('dd LLL'),
    ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
  });
  const [received_comment, setReceivedcomment] = useState();
  const [received_Total_like, setReceivedTotalLike] = useState();
  const [total_coins, setTotalCoins] = useState();
  const [receivedFollower, setReceivedTotalFollower] = useState();
  const [user_interaction, setUser_interaction] = useState();

  const handleButtonClick = button => {
    setActiveButton(button === activeButton ? null : button);
  };
  const isButtonActive = button => button === activeButton;

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

  useEffect(() => {
    addDiamondToBar();
  }, []);

  const addDiamondToBar = async () => {
    const rawData = total_coins?.payload;
    const finalData = [];
    for (let i = 0; i < rawData?.length; i++) {
      const element = rawData[i];
      const data = {
        value: element?.totalCoins,
        label: DateTime.fromISO(element?.day).toFormat('dd LLL'),
      };
      finalData.push(data);
    }
    setBarData(finalData);
  };
  useEffect(() => {
    addDiamondToBar();
  }, []);

  const addFollowersToBar = async () => {
    const rawData = receivedFollower?.payload;
    const finalData = [];
    for (let i = 0; i < rawData?.length; i++) {
      const element = rawData[i];
      const data = {
        value: element?.total_follow,
        label: DateTime.fromISO(element?.day).toFormat('dd LLL'),
      };
      finalData.push(data);
    }
    setBarData(finalData);
  };

  const addCommentToBar = async () => {
    const rawData = received_comment?.payload?.result;
    const finalData = [];
    for (let i = 0; i < rawData?.length; i++) {
      const element = rawData[i];
      const data = {
        value: element?.total_received_comments,
        label: DateTime.fromISO(element?.day).toFormat('dd LLL'),
      };
      finalData.push(data);
    }
    setBarData(finalData);
  };

  const addLikeToBar = async () => {
    const rawData = received_Total_like?.payload;
    const finalData = [];
    for (let i = 0; i < rawData?.length; i++) {
      const element = rawData[i];
      const data = {
        value: element?.total_like,
        label: DateTime.fromISO(element?.day).toFormat('dd LLL'),
      };
      finalData.push(data);
    }
    setBarData(finalData);
  };

  // {"message": "Success", "payload": [{"day": "2023-09-18", "total_interacted_time": "692920"}, {"day": "2023-09-19", "total_interacted_time": "830609"}], "total_time_spended": 25}

  const addInteractedTimeToBar = async () => {
    const rawData = user_interaction?.payload;

    const finalData = [];
    for (let i = 0; i < rawData?.length; i++) {
      const element = rawData[i];
      console.log(element, 'element');
      const data = {
        value: element?.total_interacted_time / 3600000,
        label: DateTime.fromISO(element?.day).toFormat('dd LLL'),
      };
      finalData.push(data);
    }
    setBarData(finalData);
    // console.log('finalData', finalData)
  };

  const handleFilterPress = () => {
    setShowFilter(p => !p);
  };

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
        setStartingTime(1);
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

  const RenderToolTip = (item, index) => {
    console.log(item, 'itemmmm');
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

  return (
    <ScrollView scrollsToTop={true}>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          {/* displaying date ranges */}
          <View
            style={{
              width: width,
              paddingHorizontal: width * 0.05,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
              padding: 5,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 300,
                  color: '#000',
                  opacity: 0.8,
                }}>
                {date?.ending_date} - {date?.starting_date}
              </Text>
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
                  {t(filterDateText)}
                </Text>
                <Entypo
                  name="chevron-small-down"
                  size={20}
                  alignItems={'center'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{paddingVertical: 20, backgroundColor: '#fff', marginTop: 20}}>
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
            // renderTooltip={RenderToolTip}
            capColor={'rgb(78, 0, 142)'}
            barBorderRadius={3}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button1') && styles.activeButton,
          ]}
          onPress={() => {
            handleButtonClick('button1');
            addFollowersToBar();
          }}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button1') && styles.activeButtonText,
            ]}>
            {receivedFollower?.total_follow_initiated}
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button1') && styles.activeButtonText,
            ]}>
            {t('Viewers followers')}
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            {t(
              'The number of viewers who followed your account during in your Videos',
            )}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button2') && styles.activeButton,
          ]}
          onPress={() => {
            handleButtonClick('button2');
            addInteractedTimeToBar();
          }}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button2') && styles.activeButtonText,
            ]}>
            {user_interaction?.total_time_spended
              ? user_interaction.total_time_spended < 60
                ? `${user_interaction.total_time_spended} min`
                : `${(user_interaction.total_time_spended / 60).toFixed(2)} hr`
              : 'N/A'}
          </Text>

          <Text
            style={[
              styles.buttonText,
              isButtonActive('button2') && styles.activeButtonText,
            ]}>
            {t('Total Spent Time')}
          </Text>
        </TouchableOpacity>

        <View style={styles.outer_txt}>
          <Text>{t('Total interacted time')} </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button3') && styles.activeButton,
          ]}
          onPress={() => {
            handleButtonClick('button3');
            addCommentToBar();
          }}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button3') && styles.activeButtonText,
            ]}>
            {received_comment?.payload?.totalReceivedComments}
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button3') && styles.activeButtonText,
            ]}>
            {t('Viewers Submit a comment')}
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            {t(
              'The number of viewers who interacted with you and sent you comments on the videos',
            )}
          </Text>
        </View>

        {/* <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button4') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button4')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button4') && styles.activeButtonText,
            ]}>
            250
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button4') && styles.activeButtonText,
            ]}>
            User Accessed profile
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>The number of viewers who have accessed your account</Text>
        </View> */}

        {/* <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button5') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button5')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button5') && styles.activeButtonText,
            ]}>
            345
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button5') && styles.activeButtonText,
            ]}>
            User Watching
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>The number of viewers who were watching your videos</Text>
        </View> */}

        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button6') && styles.activeButton,
          ]}
          onPress={() => {
            handleButtonClick('button6');
            addLikeToBar();
          }}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button6') && styles.activeButtonText,
            ]}>
            {received_Total_like?.total_like_received}
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button6') && styles.activeButtonText,
            ]}>
            {t('Viewers Like')}
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>{t('The number of viewers who liked your Videos')}</Text>
        </View>

        {/* <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button7') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button7')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button7') && styles.activeButtonText,
            ]}>
            650
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button7') && styles.activeButtonText,
            ]}>
            User send boxwheel
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            The number of viewers who sent you the wheel box queens in the video
          </Text>
        </View> */}

        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button8') && styles.activeButton,
          ]}
          onPress={() => {
            handleButtonClick('button8');
            addDiamondToBar();
          }}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button8') && styles.activeButtonText,
            ]}>
            {total_coins?.totalReceivedCoins}
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button8') && styles.activeButtonText,
            ]}>
            {t('Viewers send coins')}
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>{t('The number of viewers that sent you Coins in Video')}</Text>
        </View>
      </View>

      {/* for selecting the filter */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: width * 0.7,
    height: height * 0.13,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  activeButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 600,
  },
  activeButtonText: {
    color: 'white',
  },
  outer_txt: {
    paddingVertical: 15,
    width: width * 0.6,
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

export default VideoAnalytics;
