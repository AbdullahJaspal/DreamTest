import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import * as videoApi from '../../../apis/video.api';
import PicturePostHeader from './PicturePostHeader';

const UserPicturePost = ({visible, setShow_picture_post, user_data}) => {
  const [image, setImage] = useState();
  const {width, height} = useWindowDimensions();
  const styles = StyleSheet.create({
    main_container: {
      flex: 1,
    },
    des_text: {
      fontSize: 20,
      color: '#fff',
      position: 'absolute',
      bottom: 15,
      left: width / 3,
    },
    image_view: {
      width: width,
      height: height * 0.7,
    },
  });

  const other_user_picture = useCallback(async () => {
    try {
      const result = await videoApi.getAllPicturePost(user_data?.id);
      setImage(result.payload);
    } catch (err) {
      console.log(err);
    }
  }, []);

  function renderItem({item}) {
    return (
      <View style={[styles.image_view, {marginBottom: 10}]}>
        <Image
          source={{
            uri: `https://dpcst9y3un003.cloudfront.net/${item?.image_url}`,
          }}
          style={styles.image_view}
          resizeMode="cover"
        />
        <Text style={styles.des_text}>
          {/* {item?.description} */}
          Hello user
        </Text>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onShow={other_user_picture}
      onRequestClose={() => {
        setShow_picture_post(false);
      }}>
      <PicturePostHeader
        setShow_picture_post={() => {
          setShow_picture_post(false);
        }}
      />
      <View style={{flex: 1}}>
        <FlatList data={image} renderItem={renderItem} />
      </View>
    </Modal>
  );
};

export default UserPicturePost;
