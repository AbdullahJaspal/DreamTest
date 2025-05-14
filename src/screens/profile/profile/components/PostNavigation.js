import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LikedPost from '../screen/LikedPost';
import PicPost from '../screen/PicPost';
import FavouritePost from '../screen/FavouritePost';
import PrivatePost from '../screen/PrivatePost';
import VideoPost from '../screen/VideoPost';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {icons} from '../../../../assets/icons';

const Tab = createMaterialTopTabNavigator();

const PostNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="LikedPost"
        component={LikedPost}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image source={icons.love} style={styles.icon_size} />
          ),
        }}
      />

      <Tab.Screen
        name="PicPost"
        component={PicPost}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="swap-vertical" size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="SavedPost"
        component={FavouritePost}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image source={icons.bookmark} style={styles.icon_size} />
          ),
        }}
      />

      <Tab.Screen
        name="PrivatePost"
        component={PrivatePost}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image source={icons.lock} style={styles.icon_size} />
          ),
        }}
      />

      <Tab.Screen
        name="VideoPost"
        component={VideoPost}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image source={icons.stacks} style={styles.icon_size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default PostNavigation;

const styles = StyleSheet.create({
  icon_size: {
    width: 26,
    height: 26,
  },
});
