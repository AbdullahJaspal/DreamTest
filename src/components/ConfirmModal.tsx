import React from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#fff',
}) => {
  // Split the message into first 4 words and the rest
  const words = message.split(' ');
  const firstFourWords = words.slice(0, 4).join(' ');
  const remainingWords = words.length > 4 ? words.slice(4).join(' ') : '';

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>
            {firstFourWords}
            <Text style={styles.boldText}>
              {words.length > 4 ? ` ${remainingWords}` : ''}
            </Text>
          </Text>
          <View style={styles.modalBottom}>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={[styles.successBtn, {color: confirmColor}]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelBtn}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBottom: {
    alignItems: 'flex-end',
    marginVertical: 10,
    width: '100%',
    gap: 5,
  },
  cancelBtn: {
    color: '#333',
    padding: 7,
    textAlign: 'center',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 9999,
    width: 80,
  },
  successBtn: {
    fontWeight: '500',
    padding: 7,
    fontSize: 13,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 9999,
    width: 80,
    color: '#fff',
    backgroundColor: '#d43f3a',
    borderColor: '#d43f3a',
  },
  modalContent: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    paddingTop: 20,
  },
  modalText: {
    fontSize: 14,
    marginVertical: 5,
    color: '#333',
    fontWeight: '300',
  },
  boldText: {
    fontWeight: '700',
  },
});

export default ConfirmModal;
