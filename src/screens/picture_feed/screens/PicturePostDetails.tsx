import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {PicturePostDetailsScreenRouteProps} from '../../../types/screenNavigationAndRoute';
import Header from '../../profile/profile/components/Header';
import DisaplyEverySinglePicture from '../components/DisaplyEverySinglePicture';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

const PicturePostDetails: React.FC = () => {
  const route = useRoute<PicturePostDetailsScreenRouteProps>();
  const post_details = route.params.post_details;
  const selectedImageIndex = route.params.selectedImageIndex;
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  if (!post_details) {
    return null;
  }

  if (isLoading) {
    setTimeout(() => setIsLoading(false), 50);

    return (
      <SafeAreaView style={styles.main_container}>
        <Header headertext={t('Post Details')} />
        <View style={styles.placeholder} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <Header headertext={t('Post Details')} />
      <DisaplyEverySinglePicture
        item={post_details}
        selectedImageIndex={selectedImageIndex}
      />
    </SafeAreaView>
  );
};

export default PicturePostDetails;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
