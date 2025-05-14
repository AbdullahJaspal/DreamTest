import React from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {unhidePost} from '../../../store/slices/content/pictureSlice';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface HiddenPostPlaceholderProps {
  postId: number;
}

const HiddenPostPlaceholder: React.FC<HiddenPostPlaceholderProps> = ({
  postId,
}) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const handleUndo = () => {
    dispatch(unhidePost(postId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {t('Hiding posts helps us personalize your feed')}
      </Text>
      <TouchableOpacity
        onPress={handleUndo}
        style={styles.undoButton}
        accessible={true}
        accessibilityLabel={t('Undo hide post')}
        accessibilityHint={t('Shows the post again')}>
        <Text style={styles.undoText}>{t('Undo')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  undoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF0113',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  undoText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default React.memo(HiddenPostPlaceholder);
