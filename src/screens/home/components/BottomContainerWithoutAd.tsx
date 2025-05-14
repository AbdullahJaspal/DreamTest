import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import Animated, {AnimatedStyle} from 'react-native-reanimated';
import {formatDateAndTimeForVideo} from '../../../utils/customDate';
import {truncateText} from '../../../utils/truncateText';
import {useTranslation} from 'react-i18next';

interface BottomContainerWithoutAdProps {
  discAnimatedStyle: AnimatedStyle<any>;
  handleDiscPress: () => void;
  original_video_audio_details: {
    user?: {
      profile_pic?: string;
    };
  };
  createdAt: string;
  soundTestAnimatedStyle: AnimatedStyle<any>;
  item: {
    user?: {
      username?: string;
    };
  };
}

/**
 * Component that displays information at the bottom of a video without advertisements
 */
const BottomContainerWithoutAd: React.FC<BottomContainerWithoutAdProps> = ({
  discAnimatedStyle,
  handleDiscPress,
  original_video_audio_details,
  createdAt,
  soundTestAnimatedStyle,
  item,
}) => {
  const {t} = useTranslation();
  const {width} = useWindowDimensions();

  // Get profile picture URL with fallback
  const profilePicUrl = original_video_audio_details?.user?.profile_pic || '';

  // Get username with fallback
  const username = item?.user?.username || '';

  // Calculate width for original text with proper spacing
  const originalTextWidth = width - 170; // Adjusted to prevent text overflow

  return (
    <View style={[styles.mainContainer, {width}]}>
      <View style={[styles.nestedContainer, {width}]}>
        {/* Disc/Profile Picture Section */}
        <View style={styles.discContainer}>
          <Animated.View style={[styles.discIcon, discAnimatedStyle]}>
            <Pressable
              onPress={handleDiscPress}
              style={styles.discIcon}
              accessibilityRole="button"
              accessibilityLabel="View original profile">
              <Image
                source={{uri: profilePicUrl}}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </Pressable>
          </Animated.View>
        </View>

        {/* Original Song Section */}
        <View style={styles.originalSongView}>
          <Animated.Text
            style={[
              styles.originalText,
              soundTestAnimatedStyle,
              {width: originalTextWidth},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${truncateText(username, 5)}) ${t('See Original Song')}`}
          </Animated.Text>
        </View>

        {/* Date Section */}
        <View style={styles.dateView}>
          <Text style={styles.dateText}>
            {formatDateAndTimeForVideo(createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 15,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  nestedContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  discContainer: {
    width: 50,
    height: 25,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  originalSongView: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    overflow: 'hidden',
  },
  dateView: {
    width: 120,
    alignItems: 'center',
  },
  discIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  originalText: {
    fontSize: 13,
    color: 'white',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 0.2, height: 0.2},
    textShadowRadius: 5,
  },
});

export default memo(BottomContainerWithoutAd);
