import React, {useEffect} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import Header from '../../profile/profile/components/Header';
import CommentBottomTextInput from '../components/CommentBottomTextInput';
import CommentBody from '../components/CommentBody';

import * as imagePostApi from '../../../apis/imagePost';

import {CommentScreenRouteProps} from '../../../types/screenNavigationAndRoute';
import {setTotalNoOfComment} from '../../../store/slices/content/pictureSlice';
import {hideStatusBar} from '../../../utils/statusBar';

import {useAppSelector} from '../../../store/hooks';
import {selectTotalNoOfComment} from '../../../store/selectors';

const {width, height} = Dimensions.get('window');

const CommentScreen: React.FC = () => {
  const dispatch = useDispatch();
  const totalNoOfComment = useAppSelector(selectTotalNoOfComment);
  const {
    params: {root_post_id},
  } = useRoute<CommentScreenRouteProps>();

  if (root_post_id === undefined) {
    return null;
  }
  async function handleLayout(_event: LayoutChangeEvent): Promise<void> {
    try {
      if (root_post_id) {
        const result = await imagePostApi.getTotalNoOfPicturePostComment(
          root_post_id,
        );
        dispatch(setTotalNoOfComment(result?.total_comments));
      }
    } catch (error) {
      console.log('Error generated while getting no of commnets', error);
    }
  }

  useEffect(() => {
    return () => {
      hideStatusBar();
    };
  }, []);

  return (
    <SafeAreaView style={styles.main_container} onLayout={handleLayout}>
      <Header headertext={`Post Comments (${totalNoOfComment})`} />
      <CommentBody root_post_id={root_post_id} />
      <CommentBottomTextInput root_post_id={root_post_id} />
      <StatusBar
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
        animated={true}
      />
    </SafeAreaView>
  );
};

export default React.memo(CommentScreen);

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#fff',
    width: width,
    height: height,
  },
});
