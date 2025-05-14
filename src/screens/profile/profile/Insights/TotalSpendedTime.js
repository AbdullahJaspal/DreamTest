import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';

const TotalSpendedTime = () => {
  const data = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];

  return (
    <View>
      <PieChart data={data} />
    </View>
  );
};

export default TotalSpendedTime;

const styles = StyleSheet.create({});
