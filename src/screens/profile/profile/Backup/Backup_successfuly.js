import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const imageSize = 150;

const Backup_successfuly = () => {
  const {t, i18n} = useTranslation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={icons.twoHearts}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: height * 0.48,
        }}>
        <View>
          <Text style={styles.toptext}>
            {t('backup has been made successfully')}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.toptext,
              {fontSize: 16, fontWeight: 500, lineHeight: 18, color: '#1d9117'},
            ]}>
            {t('Please check your email')}
          </Text>
        </View>
        <View>
          <Text
            style={[
              styles.toptext,
              {fontSize: 16, fontWeight: 500, lineHeight: 18, color: '#d91f16'},
            ]}>
            {t('You will find a file that you can download to your device')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Backup_successfuly;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Set your desired background color
  },
  backgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 23,
    opacity: 0.3,
    width: imageSize,
    height: imageSize,
  },
  toptext: {
    fontSize: 23,
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 24,
  },
});
