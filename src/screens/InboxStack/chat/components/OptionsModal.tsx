import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Text from '../../../../components/Text';

const {width} = Dimensions.get('window');

const OptionsModal = ({visible, options = [], onClose}) => {
  const {t} = useTranslation();

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                option.danger && styles.dangerOptionItem,
              ]}
              onPress={() => {
                onClose();
                option.onPress();
              }}
              activeOpacity={0.7}>
              <MaterialIcons
                name={option.icon}
                size={22}
                color={option.danger ? '#FF3B30' : '#555'}
              />
              <Text
                style={[
                  styles.optionText,
                  option.danger && styles.dangerOptionText,
                ]}>
                {t(option.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    width: width * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dangerOptionItem: {
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  dangerOptionText: {
    color: '#FF3B30',
  },
});

export default OptionsModal;
