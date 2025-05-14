import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';

import Icon from '../../../components/Icon';

import {BORDER, SPACING} from '../../../configs/styles';

import {selectMyProfileData} from '../../../store/selectors';
import {icons} from '../../../assets/icons';
import {images} from '../../../assets/images';

interface CommentSendRoseProps {
  handleRoseSend: () => void;
  showCommentRoseModel: boolean;
  onCloseRoseModel: () => void;
}

const {width} = Dimensions.get('screen');

const CommentSendRose: React.FC<CommentSendRoseProps> = ({
  onCloseRoseModel,
  handleRoseSend,
  showCommentRoseModel,
}) => {
  const my_data = useAppSelector(selectMyProfileData);
  const {t, i18n} = useTranslation();
  return (
    <Modal
      visible={showCommentRoseModel}
      transparent={true}
      onRequestClose={onCloseRoseModel}
      animationType="slide">
      <Pressable style={{flex: 1}} onPress={onCloseRoseModel}>
        <Pressable style={styles.rose_model}>
          <View style={styles.upper_view}>
            <View style={styles.balance_view}>
              <Text style={styles.text}>{t('Cost')}</Text>
              <Icon
                source={icons.coin}
                borderRadius={BORDER.PILL}
                width={10}
                height={10}
              />
              <Text style={styles.text}>{t('10')}</Text>
            </View>
            <Icon
              source={images.rose}
              borderRadius={BORDER.PILL}
              width={40}
              height={40}
              marginLeft={SPACING.S3}
            />
            <View style={styles.balance_view}>
              <Text style={styles.text}>{t('Balance')}</Text>
              <Icon
                source={icons.coin}
                borderRadius={BORDER.PILL}
                width={10}
                height={10}
              />
              <Text style={styles.text}>{my_data?.wallet}</Text>
            </View>
          </View>
          <Pressable style={styles.send_button} onPress={handleRoseSend}>
            <Text style={styles.button_text}>{t('Send')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default React.memo(CommentSendRose);

const styles = StyleSheet.create({
  rose_model: {
    width: width,
    backgroundColor: '#f1f1f1',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  send_button: {
    backgroundColor: 'red',
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  button_text: {
    color: '#fff',
    fontSize: 20,
    padding: 7,
  },
  upper_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  balance_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: width * 0.3,
  },
  text: {
    color: '#020202',
    fontSize: 15,
  },
});
