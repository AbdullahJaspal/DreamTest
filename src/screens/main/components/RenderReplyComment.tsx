import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';

const {width, height} = Dimensions.get('screen');

const RenderReplyComment = ({item, index}) => {
  return (
    <FlatList
      data={item?.replies}
      renderItem={({item, index}) => (
        <View style={styles.nested_flatlist}>
          <View style={styles.top_container}>
            <Pressable>
              <Image
                source={{uri: item?.user?.profile_pic}}
                style={styles.profile_image}
              />
            </Pressable>
            <View style={styles.username_view}>
              <Text style={styles.username_text}>@{item?.user?.username}</Text>
              <Text style={styles.text}>{item?.user?.nickname}</Text>
            </View>
          </View>
          <View style={styles.botton_container}>
            <Text style={styles.date_text}>
              {formattedDate(item?.updatedAt)}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

export default RenderReplyComment;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    marginBottom: 40,
    // backgroundColor: 'red'
  },
  profile_image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    color: '#020202',
  },
  top_container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  username_view: {
    marginLeft: 10,
  },
  botton_container: {
    flexDirection: 'row',
    width: width,
    justifyContent: 'space-between',
    paddingLeft: 50,
    alignItems: 'center',
  },
  reply_button: {
    flexDirection: 'row',
    width: width * 0.5,
    justifyContent: 'space-evenly',
  },
  heart_img: {
    width: 30,
    height: 30,
  },
  nested_flatlist: {
    width: width,
    marginLeft: width * 0.1,
  },
  date_text: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
  },
  username_text: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.4)',
  },
});
