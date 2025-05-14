import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';

const data = [
  {
    value: 77,
    color: '#ed5334',
  },
  {
    value: 23,
    color: '#ad2d13',
  },
];
const barData = [
  {value: 52, label: '52%', frontColor: '#ed5334'},
  {value: 14, label: '14%', frontColor: '#ed5334'},
  {value: 7, label: '7%', frontColor: '#ed5334'},
  {value: 6, label: '6%', frontColor: '#ed5334'},
  {value: 5, label: '5%', frontColor: '#ed5334'},
];

const ContentAnalytics = () => {
  const {width, height} = useWindowDimensions();
  const {t, i18n} = useTranslation();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFFFFF',
      flex: 1,
    },
    sectionHeader: {
      width: width,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#F5F5F5',
    },
    sectionTitle: {
      color: '#333333',
      fontSize: 18,
      fontWeight: '600',
    },
    mainPieChart: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#F9FAFB',
    },
    pieLegendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    dataLabel: {
      alignItems: 'center',
      padding: 15,
    },
    percentage: {
      color: '#333333',
      fontSize: 16,
      fontWeight: '600',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 5,
    },
    mainBarChart: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: '#F9FAFB',
      borderRadius: 10,
      alignItems: 'center',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#4CAF50" />
  //     </View>
  //   );
  // }

  // Render tooltip
  const renderTooltip = item => (
    <View
      style={{
        position: 'relative',
        top: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 9,
        borderRadius: 5,
      }}>
      <Text style={{color: '#fff'}}>{`Total: ${
        item.originalValue || item.value
      }`}</Text>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.main_pie_chart}>
        <View
          style={{backgroundColor: '#020202', width: width, paddingLeft: 20}}>
          <Text style={{color: '#fff', fontSize: 16}}>{t('All Viewers')}</Text>
        </View>
        <View style={{margin: 30}}>
          <PieChart
            data={data}
            radius={90}
            isThreeD={false}
            strokeColor="black"
            strokeWidth={3}
          />
        </View>
        <View style={styles.viewers_section}>
          <View style={styles.data_label}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.dot} />
              <Text style={styles.percentage}>{t('77%')}</Text>
            </View>
            <Text style={styles.percentage}>{t('Male')}</Text>
          </View>

          <View style={styles.data_label}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.dot} />
              <Text style={styles.percentage}>{t('23%')}</Text>
            </View>
            <Text style={styles.percentage}>{t('Female')}</Text>
          </View>
        </View>
      </View>

      <View style={{backgroundColor: '#020202'}}>
        <Text style={{color: '#fff', fontSize: 16}}>
          {t('Top Countries/regions')}
        </Text>
      </View>
      <View style={styles.mainBarChart}>
        <BarChart
          barWidth={30}
          spacing={30}
          noOfSections={5}
          barBorderRadius={4}
          // data={countryData.slice(0, 10)} // Limit to top 10 countries
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisLabelTextStyle={{color: '#333', fontWeight: '600'}}
          yAxisLabelTextStyle={{color: '#333', fontWeight: '600'}}
          backgroundColor="#F9FAFB"
          renderTooltip={item => renderTooltip(item)}
        />
      </View>
    </ScrollView>
  );
};

export default ContentAnalytics;
