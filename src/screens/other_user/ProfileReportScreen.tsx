import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';

import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../profile/profile/components/Header';

import * as shareApi from '../../apis/share';

import {useAppSelector} from '../../store/hooks';
import {selectMyProfileData} from '../../store/selectors';

interface RouteParams {
  selected: string;
  profile_id: number;
}

const ProfileReportScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const my_data = useAppSelector(selectMyProfileData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const {selected, profile_id} = route.params as RouteParams;
  const handleCameraPress = () => {
    launchImageLibrary(
      {mediaType: 'photo', maxFiles: 1, selection: selectedImage},
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setSelectedImage(response.assets);
        }
      },
    );
  };

  const handleVideoPress = () => {
    launchImageLibrary({mediaType: 'video'}, response => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setSelectedVideo(response.assets[0]);
      }
    });
  };

  const handleSendPress = async () => {
    try {
      setLoading(true);
      if (!selectedImage || !selectedVideo || (!description && my_data)) {
        throw new Error('Please make sure all fields are filled out');
      }
      const formData = new FormData();

      formData.append('description', description);
      formData.append('report_type', selected);
      formData.append('profile_id', profile_id);
      formData.append('reported_id', my_data?.id);

      formData.append('image', {
        uri: selectedImage[0]?.uri,
        name: selectedImage[0]?.fileName,
        type: 'image/jpeg',
      });

      formData.append('video', {
        uri: selectedVideo.uri,
        name: selectedVideo.fileName,
        type: 'video/mp4',
      });

      const result = await shareApi.reportUserProfile(
        my_data?.auth_token,
        formData,
      );

      console.log('result', result);

      Toast.show('Successfully Reported', Toast.LONG);
      setLoading(true);
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.log('error', error);
      Toast.show(error?.message, Toast.LONG);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.main_conatiner}>
      <Header headertext={t('Report')} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {t(
              'Please send us the reason for the report with sufficient evidence.',
            )}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{t('Selected Report')}:</Text>
          <Text style={styles.info_selected_Txt}>{t(selected)}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{t('Report description')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            placeholder={t('Tap to describe the details')}
            style={styles.input}
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
            <Icon name="camera" size={20} color="#000" />
            <Text style={styles.buttonTxt}>{t('Camera')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleVideoPress}>
            <Icon name="video-camera" size={20} color="#000" />
            <Text style={styles.buttonTxt}>{t('Video')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selected_icon_styles}>
          {selectedImage?.length && (
            <Image
              source={{uri: selectedImage[0]?.uri}}
              style={{width: 80, height: 150}}
            />
          )}
          {selectedVideo && (
            <Image
              source={{uri: selectedVideo?.uri}}
              style={{width: 80, height: 150}}
            />
          )}
        </View>

        {loading ? (
          <TouchableOpacity style={styles.buttonsend}>
            <ActivityIndicator size={'small'} color={'#fff'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonsend} onPress={handleSendPress}>
            <Text style={styles.buttonText}>{t('Send')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  header: {
    fontSize: 25,
    width: '70%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  descriptionContainer: {
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    height: 150,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#c9c5c5',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsend: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonTxt: {
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    alignSelf: 'center',
  },
  main_conatiner: {
    backgroundColor: '#fff',
    flex: 1,
  },
  info_selected_Txt: {
    color: 'red',
    fontSize: 20,
    fontWeight: '600',
  },
  selected_icon_styles: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});

export default ProfileReportScreen;
