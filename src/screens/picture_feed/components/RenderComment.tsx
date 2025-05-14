import {View, StyleSheet, Dimensions} from 'react-native';
import React, {useCallback} from 'react';
import {PicturePostComment} from '../types/picturePost';
import CommentTemplate from './CommentTemplate';

interface RenderCommentProps {
  item: PicturePostComment;
  index: number;
}

const {width} = Dimensions.get('screen');
const RenderComment: React.FC<RenderCommentProps> = ({item, index}) => {
  const screenWidth = useCallback(() => {
    return {
      width: item.parent_id ? width * 0.96 : width * 0.99,
    };
  }, []);

  const borderWidth = useCallback(() => {
    if (item?.replies?.length) {
      return {
        // borderBottomLeftRadius: 10,
        // borderLeftWidth: 1,
        // borderLeftColor: '#000',
      };
    }
  }, []);
  return (
    <View style={[styles.commentContainer, borderWidth(), screenWidth()]}>
      <CommentTemplate item={item} index={index} />
      {item.replies && item.replies.length > 0 && (
        <View>
          {item.replies.map((reply, replyIndex) => (
            <RenderComment key={reply.id} item={reply} index={replyIndex} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    alignItems: 'flex-end',
  },
});

export default RenderComment;
