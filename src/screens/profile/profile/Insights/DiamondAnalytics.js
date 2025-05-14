import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {BarChart} from 'react-native-chart-kit';

import Entypo from 'react-native-vector-icons/Entypo';

import Body from '../../../../components/Body/Body.components';
import Header from '../../../profile/profile/components/Header';

import * as analyticsApi from '../../../../apis/analyticsApi';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';

const {width, height} = Dimensions.get('window');

const DiamondAnalytics = () => {
  const navigation = useNavigation();
  const [chartData, setChartData] = useState([]);
  const [diamond_data, setDiamond_data] = useState({
    sun: '',
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
  });

  const my_data = useAppSelector(selectMyProfileData);

  const diamondAnalytics = async () => {
    try {
      let startingtime = '2023-08-05T05:26:12.954Z';
      let endingtime = '2023-08-08T07:26:12.954Z';
      const result = await analyticsApi.dimanodAnalytics(
        my_data?.auth_token,
        startingtime,
        endingtime,
      );
      setChartData(result.payload); // Assuming the data structure matches the API response
      // const dayToPropertyMap = {
      //     'sunday': 'sun',
      //     'monday': 'mon',
      //     'tuesday': 'tue',
      //     'wednesday': 'wed',
      //     'thursday': 'thu',
      //     'friday': 'fri',
      //     'saturday': 'sat'
      // };

      // result.payload.forEach(e => {
      //     const day = e?.dayOfWeek?.toLowerCase();
      //     const property = dayToPropertyMap[day];

      //     if (property) {
      //         setDiamond_data(p => ({
      //             ...p,
      //             [property]: e?.totalDiamonds
      //         }));
      //     }
      // });

      result.payload.forEach(e => {
        const day = e?.dayOfWeek?.toLowerCase();
        if (day.startsWith('sun')) {
          setDiamond_data(p => ({
            ...p,
            sun: e?.totalDiamonds,
          }));
        } else if (day.startsWith('mon')) {
          setDiamond_data(p => ({
            ...p,
            mon: e?.totalDiamonds,
          }));
        } else if (day.startsWith('tue')) {
          setDiamond_data(p => ({
            ...p,
            tue: e?.totalDiamonds,
          }));
        } else if (day.startsWith('wed')) {
          setDiamond_data(p => ({
            ...p,
            wed: e?.totalDiamonds,
          }));
        } else if (day.startsWith('thu')) {
          setDiamond_data(p => ({
            ...p,
            thu: e?.totalDiamonds,
          }));
        } else if (day.startsWith('fri')) {
          setDiamond_data(p => ({
            ...p,
            fri: e?.totalDiamonds,
          }));
        } else if (day.startsWith('sat')) {
          setDiamond_data(p => ({
            ...p,
            sat: e?.totalDiamonds,
          }));
        }
      });
    } catch (error) {
      console.log('erroe while fetching the analytics of diamond', error);
    }
  };
  useEffect(() => {
    diamondAnalytics();
  }, []);

  return (
    <Body>
      <Header headertext={'Diamond Spended'} />

      <View
        style={{
          width: width,
          paddingHorizontal: width * 0.05,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <TouchableOpacity style={styles.date_picker}>
          <Text style={styles.txt}>Last 7 Days</Text>
          <Entypo name="chevron-small-down" size={25} />
        </TouchableOpacity>

        <View style={styles.date_picker}>
          <Text onPress={diamondAnalytics} style={styles.txt}>
            jun 15 - jun 21
          </Text>
        </View>
      </View>

      <View
        style={{
          width: width,
          padding: width * 0.18,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* <Text style={{
                    fontSize: 18,
                    fontWeight: '800',
                    color: 'black'
                }}>20 Hours</Text> */}
        <Text>Time Spended</Text>
      </View>
      {console.log(diamond_data)}
      <View>
        <BarChart
          data={{
            // labels: chartData.map((item) => item.dayOfWeek), // Use the dayOfWeek key from the API response
            labels: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            datasets: [
              {
                // data: chartData.map((item) => item.totalDiamonds),
                data: [
                  diamond_data?.sun,
                  diamond_data?.mon,
                  diamond_data?.tue,
                  diamond_data?.wed,
                  diamond_data?.thu,
                  diamond_data?.fri,
                  diamond_data?.sat,
                ],

                // data: [
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100,
                //     Math.random() * 100
                // ]
              },
            ],
          }}
          width={Dimensions.get('window').width}
          height={300}
          yAxisLabel=""
          yAxisSuffix="D"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: 'black',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(3, 4, 25, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(100, 20, 30, ${opacity})`,
            style: {
              borderRadius: 0,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 5,
            borderRadius: 5,
          }}
        />
      </View>
    </Body>
  );
};

export default DiamondAnalytics;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 7,
    borderColor: 'rgba(217, 217, 217, 0.4)',
    marginTop: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 25,
  },
  leftHeader: {
    flexDirection: 'row',
  },
  date_picker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0e6',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  txt: {
    color: 'black',
  },
});
