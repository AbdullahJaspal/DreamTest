import React, {useCallback, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import * as hastagApi from '../../../apis/favourate_hashtag_Api';
import * as hashtagApi from '../../../apis/hashtag.api';
import {setModalSignIn} from '../../../store/slices/ui/indexSlice';
import {useAppSelector} from '../../../store/hooks';
import {selectMyProfileData} from '../../../store/selectors';

const {width, height} = Dimensions.get('screen');

interface CustomTextParserProps {
  des: string;
}

const CustomTextParser: React.FC<CustomTextParserProps> = ({des}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const my_data = useAppSelector(selectMyProfileData);
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const maxLength = 50;

  const handleFullTextClick = useCallback(() => {
    setShowFullText(p => !p);
  }, []);

  const fetchVideoThroughTag = useCallback(
    async (tag_id: number, title: string, post: number) => {
      try {
        const getVideoThroughTag = await hashtagApi.getVideoThroughTag(tag_id);
        const videoAssociations = getVideoThroughTag.payload.map(
          (item: any) => item.videoAssociation,
        );
        if (getVideoThroughTag) {
          navigation.navigate('HashtagScreen', {
            VideoThroughTag: videoAssociations,
            title: title,
            post: post,
            tag_id: tag_id,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [],
  );

  const handleHashtagPress = useCallback(async (hashtag: string) => {
    try {
      if (my_data) {
        const result = await hastagApi.getHastagDetailsFromHastagText(
          my_data?.auth_token,
          hashtag,
        );
        const payload = result?.payload;
        fetchVideoThroughTag(payload?.id, payload?.title, payload?.noOfPost);
      } else {
        dispatch(setModalSignIn(true));
      }
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const handleProfileClick = (id: any) => {
    if (id) {
      navigation.navigate('UserProfileMainPage', {user_id: id});
    }
  };
  const textToDisplay = showFullText
    ? des
    : des.length > maxLength
    ? `${des.slice(0, maxLength)}...`
    : des;

  return (
    <View style={[styles.container]}>
      <ScrollView
        style={styles.textContainer}
        nestedScrollEnabled
        scrollEnabled={showFullText}
        showsVerticalScrollIndicator={false}>
        <ParsedText
          style={styles.text}
          parse={[
            {
              pattern: /#(\w+)/,
              style: styles.hashTag,
              onPress: handleHashtagPress,
            },
            {
              pattern: /@(\w+)/,
              style: styles.mention,
              onPress: handleProfileClick,
            },
          ]}
          childrenProps={{allowFontScaling: false}}>
          {textToDisplay}
        </ParsedText>
      </ScrollView>
      {des.length > maxLength && (
        <TouchableOpacity
          style={styles.more_button}
          onPress={handleFullTextClick}>
          <Text style={styles.moreText}>{showFullText ? 'less' : 'more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(CustomTextParser);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 5,
    padding: 5,
  },
  hashTag: {
    fontStyle: 'italic',
    color: '#2CFFF9',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 23,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'left',
    lineHeight: 23,
  },
  moreText: {
    color: '#FF0113',
    marginTop: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  mention: {
    fontStyle: 'italic',
    color: '#2CFFF9',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 23,
  },
  more_button: {
    // position: 'absolute',
    // bottom: 5,
    // right: 5,
    marginTop: 3,
  },
  textContainer: {
    maxHeight: height * 0.17,
  },
});
