// QRModal.js

import React, {useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {icons} from '../../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const QRModal = ({isVisible, closeModal, handleDownload}) => {
  const handleOverlayPress = () => {
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.cross} onPress={closeModal}>
              <AntDesign name="close" size={20} />
            </TouchableOpacity>
            <View style={styles.social_icon}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#d6d6d6',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleDownload}>
                <MaterialCommunityIcons
                  name="download"
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
              <Image
                source={icons.whatsapp}
                style={{width: 40, height: 40}}
                resizeMode="cover"
              />
              <Image
                source={icons.facebook}
                style={{width: 40, height: 40}}
                resizeMode="cover"
              />
              <Image
                source={icons.instagram}
                style={{width: 40, height: 40}}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={{
                  backgroundColor: '#d6d6d6',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={handleDownload}>
                <Feather name="more-horizontal" size={30} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    width: width,
    height: height * 0.18,
  },
  cross: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  social_icon: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    alignItems: 'center',
    marginTop: 5,
  },
});

export default QRModal;
