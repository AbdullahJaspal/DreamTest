import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

interface BottomButtonProps {
  handleCancelButton: () => void;
  handleSaveButton: () => void;
}

const BottomButton: React.FC<BottomButtonProps> = ({
  handleCancelButton,
  handleSaveButton,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={styles.modal_button_view}>
      <TouchableOpacity
        style={styles.buttom_button}
        onPress={handleCancelButton}>
        <Text style={styles.modal_button_text}>{t('Cancel')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttom_button} onPress={handleSaveButton}>
        <Text style={styles.modal_button_text}>{t('Save')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(BottomButton);

const styles = StyleSheet.create({
  buttom_button: {
    backgroundColor: 'red',
    paddingVertical: 5,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_button_text: {
    color: 'white',
  },
  modal_button_view: {
    flexDirection: 'row',
    // position: 'absolute',
    // bottom: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
});
