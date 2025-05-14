import React from 'react';
import {Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
const OwnerTag: React.FC = () => {
  const {t, i18n} = useTranslation();
  return (
    <LinearGradient
      colors={['#ff8c00', '#ff0080', '#ff0080', '#ff8c00']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gradientContainer}>
      <Text style={styles.ownerText}>{t('Author')}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    width: 45,
    height: 20,
  },
  ownerText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
});

export default React.memo(OwnerTag);
