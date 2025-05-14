import React from 'react';
import {Modal, Pressable, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {setIsShowGift} from '../../../store/slices/ui/mainScreenSlice';
import VideoGift from '../../gift/VideoGift';
import {selectIsShowGift} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

const GiftSheet: React.FC = () => {
  const isShowGift = useAppSelector(selectIsShowGift);
  const dispatch = useDispatch();

  if (!isShowGift) {
    return null;
  }

  function handleClose(): void {
    dispatch(setIsShowGift(false));
  }

  return (
    <View>
      <Modal
        transparent={true}
        visible={isShowGift}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={handleClose}>
        <Pressable style={styles.container} onPress={handleClose} />
        <VideoGift />
      </Modal>
    </View>
  );
};

export default React.memo(GiftSheet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
