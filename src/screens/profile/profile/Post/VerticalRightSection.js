import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {useTranslation} from 'react-i18next';

import * as likeApi from '../../../../apis/like.api';
import * as commentApi from '../../../../apis/comment.api';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const VerticalRightSection = ({item}) => {
  const {t, i18n} = useTranslation();

  const my_data = useAppSelector(selectMyProfileData);
  const [likeData, setLikeData] = useState('');
  const [no_of_comment, setNo_of_comment] = useState('');
  const [isLike, setIsLike] = useState(false);
  // console.log(isLike)

  const ItemVertical = ({imageName, onPress, text, color}) => {
    return (
      <Pressable style={styles.main_view_of_icon} onPress={onPress}>
        <Image
          source={imageName}
          style={{width: 35, height: 35, tintColor: color}}
        />
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  };

  const getAllLikeAndComment = async () => {
    const like = await likeApi.getAllLikeOfVideoByVideoId(item?.id);
    const no_of_comment = await commentApi.getCommentOfVideoByVideoId(item?.id);
    setLikeData(like?.payload);
    setIsLike(like?.payload?.find(item => item?.sender_id === my_data?.id));
    setNo_of_comment(no_of_comment?.no_of_comment);
  };

  useEffect(() => {
    getAllLikeAndComment();
  }, []);

  return (
    <View style={styles.main_container}>
      <ItemVertical imageName={icons.whiteHeart} text={likeData?.length} />

      <ItemVertical imageName={icons.comments} text={no_of_comment} />
      <ItemVertical imageName={icons.reply} text={0} color={'#fff'} />

      <ItemVertical imageName={icons.disk} />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    position: 'absolute',
    right: 10,
    bottom: 30,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  main_view_of_icon: {
    alignItems: 'center',
    marginTop: 35,
  },
});

export default VerticalRightSection;
