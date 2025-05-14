import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {VideoGiftDataProps} from '../types/VideoGiftDataProps';
import {generate_link} from '../../../utils/generate_link';
import {icons} from '../../../assets/icons';

interface RenderGiftViewProps {
  item: VideoGiftDataProps;
  index: number;
  selected_gift?: VideoGiftDataProps;
  setSelected_gift: React.Dispatch<
    React.SetStateAction<VideoGiftDataProps | undefined>
  >;
  handleSend: () => void;
}

const {width, height} = Dimensions.get('screen');

const RenderGiftView: React.FC<RenderGiftViewProps> = ({
  item,
  index,
  selected_gift,
  setSelected_gift,
  handleSend,
}) => {
  return (
    <Pressable
      onPress={() => {
        setSelected_gift(item);
      }}
      style={styles.gift_view_main_container}>
      <Image
        source={{uri: generate_link(item?.gift_image)}}
        style={styles.not_selected_gift_img}
      />
      {selected_gift && selected_gift?.gift_name === item.gift_name && (
        <Pressable onPress={handleSend} style={styles.gift_send_button}>
          <Text style={styles.txt}>Send</Text>
        </Pressable>
      )}

      {selected_gift?.gift_name !== item.gift_name && (
        <>
          <Text style={styles.txt}>{item.gift_name}</Text>
          <View style={styles.selected_gift_view}>
            <Image source={icons.diamond} style={styles.selected_gift_img} />
            <Text style={styles.txt}>{item.cost}</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

export default RenderGiftView;

const styles = StyleSheet.create({
  gift_view_main_container: {
    marginHorizontal: 10,
    marginVertical: 30,
    width: width / 5,
    height: width / 5,
    borderRadius: width / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  not_selected_gift_img: {
    width: 60,
    height: 60,
  },
  gift_send_button: {
    width: 79,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected_gift_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  selected_gift_img: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  txt: {
    color: '#fff',
    textAlign: 'center',
  },
});
