import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import VideoGift from '../screens/gift/VideoGift';
import ShareReportScreen from '../screens/home/components/ShareReportScreen';

const HomeStack = createNativeStackNavigator();

const HomeStackNavigation: React.FC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="VideoGift" component={VideoGift} />
    </HomeStack.Navigator>
  );
};

export default React.memo(HomeStackNavigation);
