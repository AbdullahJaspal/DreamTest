import React, {useState} from 'react';
import {Dimensions, Modal, Pressable, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';

import CustomGift from './component/CustomGift';
import {useAppSelector} from '../../store/hooks';
import PutGiftScreen from './component/PutGiftScreen';
import BoxGiftHeader from './component/BoxGiftHeader';
import {selectShowBoxGift} from '../../store/selectors';
import {changeShowBoxGift} from '../../store/slices/ui/boxGiftSlice';

const {width} = Dimensions.get('screen');

const BoxGiftMainModel: React.FC = () => {
  const box_gift = useAppSelector(selectShowBoxGift);
  const dispatch = useDispatch();
  const [selected_container, setSelected_container] =
    useState<string>('put_box');

  const handleClose = () => {
    dispatch(changeShowBoxGift(false));
  };

  if (!box_gift) {
    return null;
  }
  return (
    <View>
      <Modal
        visible={box_gift}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={handleClose}>
        <View style={styles.main_container}>
          <Pressable style={{flex: 1}} onPress={handleClose} />

          <View style={styles.nested_container}>
            <BoxGiftHeader
              handleClose={handleClose}
              selected_container={selected_container}
              setSelected_container={setSelected_container}
            />

            {selected_container === 'custom' && <CustomGift />}

            {selected_container === 'put_box' && <PutGiftScreen />}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BoxGiftMainModel;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  nested_container: {
    width: width,
    height: 575,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});
