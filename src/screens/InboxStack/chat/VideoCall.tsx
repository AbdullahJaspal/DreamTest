import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

// Mock component for video display - in a real app, would use WebRTC or similar
const VideoStream = ({isMuted, isFrontCamera, isLocalStream, style}) => {
  return (
    <View style={[styles.videoStream, style]}>
      {isLocalStream ? (
        <View style={styles.localVideoIndicators}>
          {isMuted && (
            <View style={styles.indicatorBadge}>
              <Ionicons name="mic-off" size={12} color="#FFF" />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const VideoCall = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user_data = route?.params?.user_data;

  // Call states
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [hasAccepted, setHasAccepted] = useState(false);

  // Timer for call duration
  useEffect(() => {
    let timerInterval;

    if (isConnected) {
      timerInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isConnected]);

  // Simulate connecting to call
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setHasAccepted(true);
      Toast.show('Call connected', Toast.SHORT);
    }, 2500);

    return () => clearTimeout(connectTimeout);
  }, []);

  // Handle back button to prevent accidental exits
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleEndCall();
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  // Format seconds to mm:ss
  const formatDuration = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle muting microphone
  const toggleMic = useCallback(() => {
    setIsMicMuted(prev => !prev);
    Toast.show(isMicMuted ? 'Microphone on' : 'Microphone muted', Toast.SHORT);
  }, [isMicMuted]);

  // Handle turning off camera
  const toggleCamera = useCallback(() => {
    setIsCameraMuted(prev => !prev);
    Toast.show(isCameraMuted ? 'Camera on' : 'Camera off', Toast.SHORT);
  }, [isCameraMuted]);

  // Handle speaker
  const toggleSpeaker = useCallback(() => {
    setIsSpeakerOn(prev => !prev);
    Toast.show(isSpeakerOn ? 'Speaker off' : 'Speaker on', Toast.SHORT);
  }, [isSpeakerOn]);

  // Switch between front and back camera
  const toggleCameraFacing = useCallback(() => {
    setIsFrontCamera(prev => !prev);
    Toast.show(
      `Switched to ${isFrontCamera ? 'back' : 'front'} camera`,
      Toast.SHORT,
    );
  }, [isFrontCamera]);

  // End call confirmation
  const handleEndCall = useCallback(() => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  }, [navigation]);

  // Immediate end call without confirmation (for red button)
  const endCall = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Background */}

      {/* Header */}
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleEndCall}>
            <Ionicons name="chevron-down" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            {isConnected ? (
              <Text style={styles.timerText}>
                {formatDuration(callDuration)}
              </Text>
            ) : (
              <Text style={styles.callingText}>
                {isConnecting ? 'Connecting...' : 'Calling...'}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.switchCameraButton}
            onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Main call area */}
      <View style={styles.callContainer}>
        {/* Remote video (full screen) */}
        {isConnected && !isCameraMuted ? (
          <VideoStream
            isMuted={false}
            isFrontCamera={false}
            isLocalStream={false}
            style={styles.remoteVideo}
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Image
              source={
                user_data?.profile_pic
                  ? {uri: user_data?.profile_pic}
                  : icons.user
              }
              style={styles.userImage}
            />
            <Text style={styles.userName}>{user_data?.nickname || 'User'}</Text>
          </View>
        )}

        {/* Local video (small pip) */}
        {isConnected && !isCameraMuted && (
          <View style={styles.localVideoContainer}>
            <VideoStream
              isMuted={isMicMuted}
              isFrontCamera={isFrontCamera}
              isLocalStream={true}
              style={styles.localVideo}
            />
          </View>
        )}
      </View>

      {/* Call controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              isMicMuted && styles.controlButtonActive,
            ]}
            onPress={toggleMic}>
            <Ionicons
              name={isMicMuted ? 'mic-off' : 'mic'}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              isCameraMuted && styles.controlButtonActive,
            ]}
            onPress={toggleCamera}>
            <Ionicons
              name={isCameraMuted ? 'videocam-off' : 'videocam'}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              isSpeakerOn && styles.controlButtonActive,
            ]}
            onPress={toggleSpeaker}>
            <Ionicons
              name={isSpeakerOn ? 'volume-high' : 'volume-mute'}
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
            <MaterialIcons name="call-end" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Connection status */}
      {!isConnected && !hasAccepted && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isConnecting ? 'Connecting to call...' : 'Ringing...'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  timerText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  callingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchCameraButton: {
    padding: 8,
  },
  callContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#54AD7A',
  },
  controlsContainer: {
    width: '100%',
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#54AD7A',
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  userImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#54AD7A',
  },
  userName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  localVideoIndicators: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
  },
  indicatorBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    borderRadius: 10,
    padding: 5,
  },
  videoStream: {
    backgroundColor: '#54AD7A',
  },
});

export default VideoCall;
