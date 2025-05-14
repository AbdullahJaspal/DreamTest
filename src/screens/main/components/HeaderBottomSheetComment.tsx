import React from 'react';
import {Container, Icon} from '../../../components';
import {SPACING} from '../../../configs/styles';
import {Dimensions, View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {icons} from '../../../assets/icons';

const {width} = Dimensions.get('screen');

interface HeaderBottomSheetCommentProps {
  handleClickClose: () => void;
  no_of_comment: number;
}

const HeaderBottomSheetComment: React.FC<HeaderBottomSheetCommentProps> = ({
  handleClickClose,
  no_of_comment,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <View
      style={{
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.txt}>{no_of_comment}</Text>
        <Text style={styles.txt}>{t('comments')}</Text>
      </View>
      <Container position="absolute" right={SPACING.S3}>
        <Icon
          source={icons.close}
          onPress={handleClickClose}
          style={{width: 15, height: 15}}
        />
      </Container>
    </View>
  );
};

export default HeaderBottomSheetComment;

const styles = StyleSheet.create({
  txt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#020202',
    marginLeft: 5,
  },
  reported_view: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
});
