import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  Image,
} from 'react-native';
import React from 'react';
import {COLOR, TEXT} from '../../configs/styles/index';
import {icons} from '../../assets/icons';

const ItemVideo = ({item, NUM_COLUMS}) => {
  const {avatarUri, like, empty} = item;
  const {width} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: width / NUM_COLUMS,
      backgroundColor: COLOR.BLACK,
      margin: 1,
    },
    containerView: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      alignItems: 'center',
    },
    txtView: {
      ...TEXT.SMALL,
      color: COLOR.WHITE,
    },
  });
  if (!empty) {
    return (
      <ImageBackground source={{uri: avatarUri}} style={styles.container}>
        <View style={styles.containerView}>
          <Image source={icons.playButton} tintColor={COLOR.WHITE} />
          <Text style={styles.txtView}>{like}</Text>
        </View>
      </ImageBackground>
    );
  } else {
    return <View style={[styles.container, {backgroundColor: COLOR.WHITE}]} />;
  }
};

export default ItemVideo;
