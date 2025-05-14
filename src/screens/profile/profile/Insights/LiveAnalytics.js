import React, {useState} from 'react';
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
const {width, height} = Dimensions.get('screen');
import Entypo from 'react-native-vector-icons/Entypo';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
const {DateTime} = require('luxon');

const barData = [
  {value: 250, label: '0'},
  {value: 250, label: '1'},
  {value: 500, label: '2'},
  {value: 745, label: '3'},
  {value: 320, label: '4'},
  {value: 600, label: '5'},
  {value: 256, label: '6'},
  {value: 300, label: '7'},
  {value: 250, label: '8'},
  {value: 500, label: '9'},
  {value: 745, label: '10'},
  {value: 320, label: '11'},
  {value: 320, label: '12'},
  {value: 600, label: '13'},
  {value: 256, label: '14'},
  {value: 300, label: '15'},
  {value: 745, label: '16'},
  {value: 320, label: '17'},
  {value: 600, label: '18'},
  {value: 256, label: '19'},
  {value: 300, label: '20'},
  {value: 250, label: '21'},
  {value: 500, label: '22'},
  {value: 745, label: '23'},
  {value: 320, label: '24'},
];

const LiveAnalytics = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [date, setDate] = useState({
    starting_date: DateTime.local().toFormat('dd LLL'),
    ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
  });

  const handleButtonClick = button => {
    setActiveButton(button === activeButton ? null : button);
  };

  const isButtonActive = button => button === activeButton;

  const handleFilterPress = () => {
    setShowFilter(p => !p);
  };

  const filterData = [
    {
      id: 1,
      title: 'Last 1 day',
      onPress: () => {
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 1}).toFormat('dd LLL'),
        }));
        setShowFilter(p => !p);
      },
    },
    {
      id: 2,
      title: 'Last 7 days',
      onPress: () => {
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 7}).toFormat('dd LLL'),
        }));
        setShowFilter(p => !p);
      },
    },
    {
      id: 3,
      title: 'Last 15 days',
      onPress: () => {
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 15}).toFormat('dd LLL'),
        }));
        setShowFilter(p => !p);
      },
    },
    {
      id: 4,
      title: 'Last 30 days',
      onPress: () => {
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 30}).toFormat('dd LLL'),
        }));
        setShowFilter(p => !p);
      },
    },
    {
      id: 5,
      title: 'Last 90 days',
      onPress: () => {
        setDate(p => ({
          ...p,
          ending_date: DateTime.local().minus({days: 90}).toFormat('dd LLL'),
        }));
        setShowFilter(p => !p);
      },
    },
  ];

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View
            style={{
              width: width,
              paddingHorizontal: width * 0.05,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 25,
              padding: 5,
            }}>
            {/* displaying time ranges */}
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
                Filter:
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
                <Text style={{fontSize: 12, fontWeight: 500, color: '#000'}}>
                  Last 1 days
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
          style={{
            width: width,
            justifyContent: 'flex-start',
            marginLeft: width * 0.2,
            paddingBottom: 20,
            paddingTop: 20,
          }}>
          <Text> Live full time : 2 : 59 hr</Text>
        </View>
        <View style={{paddingVertical: 20, backgroundColor: '#020202'}}>
          <BarChart
            barWidth={15}
            noOfSections={3}
            frontColor="red"
            data={barData}
            yAxisThickness={0}
            xAxisThickness={0}
            spacing={5}
            backgroundColor={'black'}
            width={width}
            initialSpacing={4}
            dashGap={0}
            hideYAxisText={true}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button1') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button1')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button1') && styles.activeButtonText,
            ]}>
            66.500
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button1') && styles.activeButtonText,
            ]}>
            Comments
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            The number of comments that viewers interacted with in the live
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button2') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button2')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button2') && styles.activeButtonText,
            ]}>
            1.980
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button2') && styles.activeButtonText,
            ]}>
            Shares
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            The number of Shares that viewers interacted with in the live
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button3') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button3')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button3') && styles.activeButtonText,
            ]}>
            690
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button3') && styles.activeButtonText,
            ]}>
            Followers
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            he number of viewers who followed your account during the live.
          </Text>
        </View>
        <TouchableOpacity
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
            44.30
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button4') && styles.activeButtonText,
            ]}>
            Lucky Buckle Gifts
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            The number of viewers who sent you coins in the wheel of fortune
            chest, during the live
          </Text>
        </View>
        <TouchableOpacity
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
            22.50
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button5') && styles.activeButtonText,
            ]}>
            Views
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>The number of viewers who were present during the live</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button6') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button6')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button6') && styles.activeButtonText,
            ]}>
            128.946
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button6') && styles.activeButtonText,
            ]}>
            Coins
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>The number of coins that viewers sent you during the live</Text>
        </View>
        <TouchableOpacity
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
            Account Profile Accessed
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>
            The number of viewers who have accessed your Prrofile account
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonActive('button8') && styles.activeButton,
          ]}
          onPress={() => handleButtonClick('button8')}>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button8') && styles.activeButtonText,
            ]}>
            1.23.4
          </Text>
          <Text
            style={[
              styles.buttonText,
              isButtonActive('button8') && styles.activeButtonText,
            ]}>
            Likes
          </Text>
        </TouchableOpacity>
        <View style={styles.outer_txt}>
          <Text>The number of viewers who send LIKE you during the live</Text>
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
    fontSize: 14,
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
});

export default LiveAnalytics;
