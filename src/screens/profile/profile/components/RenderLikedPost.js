import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradients from 'react-native-linear-gradient';
import {formatNumber} from '../../../../utils/formatNumber';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('window');

const RenderLikedPost = React.memo(({item, index, onPostClick}) => {
  return (
    <Pressable
      style={styles.main_container}
      onPress={() => {
        onPostClick(index);
      }}>
      <ImageBackground
        resizeMode="cover"
        source={{
          uri: `https://dpcst9y3un003.cloudfront.net/${item?.video?.thum}`,
        }}
        // source={{ uri: `https://dpcst9y3un003.cloudfront.net/${item?.thum}` }}
        style={styles.image_style}>
        <LinearGradients
          style={{flex: 1}}
          colors={[
            'rgba(0, 0, 0, 0.1)',
            'rgba(0, 0, 0, 0.125)',
            'rgba(0, 0, 0, 0.15)',
            'rgba(0, 0, 0, 0.175)',
            'rgba(0, 0, 0, 0.2)',
            'rgba(0, 0, 0, 0.225)',
            'rgba(0, 0, 0, 0.25)',
            'rgba(0, 0, 0, 0.275)',
            'rgba(0, 0, 0, 0.3)',
            'rgba(0, 0, 0, 0.325)',
            'rgba(0, 0, 0, 0.35)',
          ]}>
          <View style={styles.image_bottom_view}>
            <View style={styles.paused_section}>
              <Entypo name="controller-play" size={20} color={'white'} />
              <Text style={styles.txt}>
                {formatNumber(item?.video?.view || 0)}
              </Text>
              {/* <Text style={styles.txt}>{formatNumber(item?.view || 0)}</Text> */}
            </View>
            <View style={styles.paused_section}>
              <Image source={icons.diamond} style={styles.diamond} />
              <Text style={styles.txt}>
                {formatNumber(item?.video?.diamond_value || 0)}
              </Text>
              {/* <Text style={styles.txt}>{formatNumber(item?.diamond || 0)}</Text> */}
            </View>
          </View>
        </LinearGradients>
      </ImageBackground>
    </Pressable>
  );
});

export default React.memo(RenderLikedPost);

const styles = StyleSheet.create({
  image_style: {
    width: width / 3.045,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  main_container: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  image_upper_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 5,
    width: width / 3,
    paddingHorizontal: 5,
    right: 5,
  },
  txt: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
  paused_section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image_bottom_view: {
    flexDirection: 'row',
    width: width * 0.3,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  diamond: {
    width: 25,
    height: 25,
  },
  time_view: {
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  time_txt: {
    color: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});
