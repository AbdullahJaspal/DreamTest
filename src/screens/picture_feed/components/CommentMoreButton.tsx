import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
interface CommentMoreButtonProps {
  showMoreButton: boolean;
  onEditPress: () => void;
  onMoreButtonClose: () => void;
  onDeletePress: () => void;
  onReportPress: () => void;
}

const CommentMoreButton: React.FC<CommentMoreButtonProps> = ({
  showMoreButton,
  onEditPress,
  onMoreButtonClose,
  onDeletePress,
  onReportPress,
}) => {
  const {t, i18n} = useTranslation();
  return (
    <Modal
      visible={showMoreButton}
      onRequestClose={onMoreButtonClose}
      transparent={true}
      animationType="slide">
      <Pressable style={styles.upper_container} onPress={onMoreButtonClose} />
      <View style={styles.main_container}>
        <Pressable style={styles.button_view} onPress={onEditPress}>
          <AntDesign name={'edit'} size={20} color={'#000'} />
          <Text style={styles.edit_txt}>{t('Edit')}</Text>
        </Pressable>
        <Pressable style={styles.button_view} onPress={onDeletePress}>
          <AntDesign name={'delete'} size={18} color={'#000'} />
          <Text style={styles.edit_txt}>{t('Delete')}</Text>
        </Pressable>

        <Pressable style={styles.button_view} onPress={onReportPress}>
          <MaterialIcons name={'report'} size={22} color={'#000'} />
          <Text style={styles.edit_txt}>{t('Report')}</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default React.memo(CommentMoreButton);

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 20,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    paddingHorizontal: 50,
  },
  edit_txt: {
    color: '#000',
    fontSize: 14,
    marginLeft: 20,
    fontWeight: '600',
  },
  button_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  upper_container: {
    flex: 1,
  },
});
