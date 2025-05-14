import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const iconComponents = {
  EvilIcons,
  Ionicons,
  Entypo,
  FontAwesome,
  Octicons,
  Feather,
  Foundation,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
};

const LeftIcon = ({group_name, size, color, onPress, icon_name}) => {
  const IconComponent = iconComponents[group_name];

  if (!IconComponent) {
    return null;
  }

  return (
    <Pressable onPress={onPress}>
      <View>
        <IconComponent name={icon_name} size={size} color={color} />
      </View>
    </Pressable>
  );
};

export default LeftIcon;

const styles = StyleSheet.create({});
