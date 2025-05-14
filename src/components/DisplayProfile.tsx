import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import {SvgXml} from 'react-native-svg';

const DisplayProfile = ({profile_image, width, height}) => {
  return (
    <View style={[styles.container]}>
      {profile_image.startsWith('<') ? (
        <SvgXml xml={profile_image} width={width} height={height} />
      ) : (
        <Image
          source={{uri: profile_image}}
          style={{
            width: width,
            height: height,
          }}
        />
      )}
    </View>
  );
};

export default DisplayProfile;

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
