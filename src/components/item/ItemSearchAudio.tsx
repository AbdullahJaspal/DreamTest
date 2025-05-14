import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';

import CText from '../CText';
import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';
import Icon from '../Icon';
import {useNavigation} from '@react-navigation/native';
import {urlSourceMedia} from '../../utils/utils';
import {icons} from '../../assets/icons';

const ItemSearchAudio = ({item}) => {
  const {background, name, author, videoCount, _id} = item;

  const navigation = useNavigation();

  const handleClick = () => {
    // console.log('aaa');
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('AudioScreen', {_id})}
      style={styles.container}>
      <TouchableOpacity
        onPress={handleClick}
        activeOpacity={0.6}
        style={styles.backgroundAudio}>
        <Image
          source={{uri: urlSourceMedia(background)}}
          style={styles.image}
        />
        <Icon source={icons.play} />
      </TouchableOpacity>
      <View style={styles.infor}>
        <CText text={TEXT.STRONG} fontSize={16} numberOfLines={1}>
          {name}
        </CText>
        <CText text={TEXT.REGULAR} color={COLOR.GRAY} numberOfLines={1}>
          {author}
        </CText>
        <View style={styles.inforBottom}>
          <CText text={TEXT.REGULAR} color={COLOR.GRAY}>
            00:30
          </CText>
          <CText text={TEXT.REGULAR} color={COLOR.GRAY}>
            {videoCount}
          </CText>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemSearchAudio;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.S4,
    paddingVertical: SPACING.S2,
  },
  backgroundAudio: {
    width: 70,
    height: 70,
    backgroundColor: COLOR.setOpacity(COLOR.BLACK, 0.1),
    borderRadius: BORDER.NORMAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.setOpacity(COLOR.BLACK, 0.1),
    borderRadius: BORDER.NORMAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infor: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: SPACING.S2,
    flex: 1,
  },
  inforBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
