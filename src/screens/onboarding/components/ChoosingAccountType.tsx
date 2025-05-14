import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../profile/profile/components/Header';
import {ImageProps} from 'react-native';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('screen');

interface ChoosingAccountTypeProps {
  onPress: () => void;
  HeaderText: string;
  descrptionHeader: string;
  description: string;
  image: ImageProps;
}

const ChoosingAccountType: React.FC<ChoosingAccountTypeProps> = ({
  onPress,
  HeaderText,
  descrptionHeader,
  description,
  image,
}) => {
  const {t, i18n} = useTranslation();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        <Header headertext={HeaderText} />
        <View style={styles.body}>
          <View style={styles.imageContainer}></View>
          <View style={styles.textContainer}>
            <Text style={styles.descriptionHeader}>{descrptionHeader}</Text>
            <Text style={styles.description}>{description}</Text>

            <Pressable onPress={onPress} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>{t('Next')}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default React.memo(ChoosingAccountType);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  imageContainer: {
    width: width,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  textContainer: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.05,
  },
  descriptionHeader: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
    width: width * 0.95,
  },
  description: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: height * 0.02,
    width: width * 0.95,
    lineHeight: 20,
  },
  nextButton: {
    width: width * 0.6,
    backgroundColor: '#FF006B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 2,
    marginTop: height * 0.05,
  },
  nextButtonText: {
    color: '#fff',
  },
});
