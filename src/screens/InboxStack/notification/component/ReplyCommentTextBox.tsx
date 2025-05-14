import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface ReplyCommentTextBoxProps {
  show_reply_container: boolean;
  setShow_reply_container: any;
  reply_data: any;
}

const {width} = Dimensions.get('screen');

const ReplyCommentTextBox: React.FC<ReplyCommentTextBoxProps> = ({
  show_reply_container,
  setShow_reply_container,
  reply_data,
}) => {
  return (
    <View style={styles.reply_main_container}>
      <Text>ReplyCommentTextBox</Text>
    </View>
  );
};

export default ReplyCommentTextBox;

const styles = StyleSheet.create({
  reply_main_container: {
    width: width,
    backgroundColor: 'red',
    height: 50,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
});
