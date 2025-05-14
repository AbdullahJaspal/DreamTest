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
import LinearGradient from 'react-native-linear-gradient';
import {formatNumber} from '../../../utils/formatNumber';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {icons} from '../../../assets/icons';

interface RenderSoundUserVideoProps {
  item: any;
  index: number;
  video_id: number;
  onPostClick: (index: number, video_id: number) => void;
}

const {width} = Dimensions.get('screen');

const colors = [
  '#0c65f2',
  '#4287f5',
  '#6f9fd5',
  '#9cb7eb',
  '#c9d0f2',
  '#f6f7f8',
];

const colors1 = [
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
];

const RenderSoundUserVideo: React.FC<RenderSoundUserVideoProps> = ({
  item,
  index,
  video_id,
  onPostClick,
}) => {
  return (
    <Pressable
      onPress={() => {
        onPostClick(index, item?.id);
      }}
      style={styles.main_container}>
      <ImageBackground
        source={
          item?.thum
            ? {uri: `https://dpcst9y3un003.cloudfront.net/${item.thum}`}
            : {uri: 'https://'}
        }
        style={styles.image_style}>
        <LinearGradient style={{flex: 1}} colors={colors1}>
          {item?.id === video_id ? (
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.original_view}
              colors={colors}>
              <Pressable>
                <Text style={styles.original_text}>Original</Text>
              </Pressable>
            </LinearGradient>
          ) : null}

          <View style={styles.image_bottom}>
            <View style={styles.paused_section}>
              <AntDesign name="caretright" size={14} color={'white'} />
              <Text style={[styles.txt, {color: 'white', textAlign: 'center'}]}>
                {formatNumber(item?.view || 0)}
              </Text>
            </View>

            <View style={styles.image_upper_view}>
              <Image source={icons.diamond} style={{width: 20, height: 20}} />
              <Text style={styles.txt}>
                {formatNumber(item?.diamond_value || 0)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

export default React.memo(RenderSoundUserVideo);

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
  },
  image_upper_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txt: {
    color: 'yellow',
    marginLeft: 2,
  },
  paused_section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image_bottom_view: {
    flexDirection: 'row',
    width: width * 0.3,
    position: 'absolute',
    bottom: 26,
    justifyContent: 'space-around',
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  image_bottom: {
    flexDirection: 'row',
    width: width * 0.3,
    position: 'absolute',
    bottom: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  original_view: {
    position: 'absolute',
    left: 5,
    top: 5,
    borderRadius: 5,
    width: 50,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  original_text: {
    color: '#000',
    textAlign: 'left',
    fontWeight: '700',
    fontSize: 10,
  },
});
