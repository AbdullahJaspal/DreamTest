import {Modal, Pressable, StyleSheet} from 'react-native';
import React from 'react';
import Icon from '../Icon';
import Container from '../Container';
import {HEIGHT, WIDTH} from '../../configs/constant';
import {COLOR} from '../../configs/styles';
import {gifs} from '../../assets/gifs';

interface Props {
  visible: any;
  setVisible: any;
}

const ModalLoading = ({visible, setVisible}: Props) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <Pressable>
        <Container
          height={HEIGHT}
          width={WIDTH}
          justifyContent="center"
          alignItems="center"
          backgroundColor={COLOR.setOpacity(COLOR.BLACK, 0.2)}>
          <Icon source={gifs.tiktokLoader} width={50} height={50} />
        </Container>
      </Pressable>
    </Modal>
  );
};

export default ModalLoading;

const styles = StyleSheet.create({});
