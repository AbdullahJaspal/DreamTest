import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useNavigation, useRoute} from '@react-navigation/native';

const Animation = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {setVideo_path, video_path} = route.params;

  // console.log('video_path', video_path)

  useEffect(() => {
    newPermission();
  }, []);
  const newPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    const newMicrophonePermission = await Camera.requestMicrophonePermission();
    // console.log(newPermission);
  };
  if (device == null) {
    return <ActivityIndicator />;
  }
  const takePictue = async () => {
    const photo = await camera.current.startRecording({
      flash: 'on',
      onRecordingFinished: video => {
        setVideo_path(video.path);
        console.log(video.path);
        navigation.navigate('MainBody');
      },
      onRecordingError: error => console.error(error),
    });
    setTimeout(() => {
      camera.current.stopRecording();
    }, 5000);
  };
  return (
    <View style={{flex: 1}}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video={true}
      />
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          backgroundColor: 'red',
          borderRadius: 30,
          bottom: 50,
          position: 'absolute',
          alignSelf: 'center',
        }}
        onPress={() => {
          takePictue();
        }}
      />
    </View>
  );
};

export default Animation;

const styles = StyleSheet.create({});
