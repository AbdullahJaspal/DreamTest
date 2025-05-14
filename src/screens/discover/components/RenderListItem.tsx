import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {formatNumber} from '../../../utils/formatNumber';
import {icons} from '../../../assets/icons';

interface RenderListItemProps {
  item: any;
  index: number;
  handleImagePress: (index: number, video_id: number) => void;
}

const {width, height} = Dimensions.get('screen');

const RenderListItem: React.FC<RenderListItemProps> = ({
  item,
  index,
  handleImagePress,
}) => {
  return (
    <Pressable
      onPress={() => {
        handleImagePress(index, item?.id);
      }}
      style={styles.main_container}>
      <ImageBackground
        source={
          item?.thum
            ? {uri: `https://dpcst9y3un003.cloudfront.net/${item.thum}`}
            : {uri: 'https://'}
        }
        style={styles.image_style}>
        <LinearGradient
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

export default RenderListItem;

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
    // backgroundColor:'red'
  },
});
