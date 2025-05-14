import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import {Container, Icon} from '../../../components';
import {SPACING} from '../../../configs/styles';
import {setIsShowGift} from '../../../store/slices/ui/mainScreenSlice';
import {icons} from '../../../assets/icons';

const {width} = Dimensions.get('screen');

const GiftHeader: React.FC = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const handleClickClose = () => {
    dispatch(setIsShowGift(false));
  };
  return (
    <View style={styles.main_conatainer}>
      <Text style={styles.text}>{t('Gift')}</Text>
      <Container position="absolute" right={SPACING.S3}>
        <Icon
          source={icons.close}
          onPress={handleClickClose}
          style={{width: 15, height: 15}}
          tintColor={'#fff'}
        />
      </Container>
    </View>
  );
};

export default React.memo(GiftHeader);

const styles = StyleSheet.create({
  main_conatainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
  },
});
