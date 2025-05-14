import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';

import {Camera as RNCamera} from 'react-native-vision-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileImage from '../../../../components/ProfileImage';

import QRModal from './components/QRModal';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import {icons} from '../../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const QRScreen = () => {
  const {t, i18n} = useTranslation();

  const my_data = useAppSelector(selectMyProfileData);

  const navigation = useNavigation();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const viewShotRef = useRef();

  const qrCodeValue = `${my_data.id}`;

  const handleScanPress = () => {
    setIsCameraVisible(true);
  };

  const handleBarCodeRead = user_id => {
    navigation.navigate('UserProfileMainPage', {user_id});
    setIsCameraVisible(false);
  };

  const handleSharePress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    return () => {
      setIsCameraVisible(false);
    };
  }, []);

  const handleDownload = async () => {
    try {
      // Get the target directory path
      const targetDirectory = `${RNFS.ExternalStorageDirectoryPath}/DCIM/DREAM`;

      // Check if the target directory exists, if not, create it
      const directoryExists = await RNFS.exists(targetDirectory);
      if (!directoryExists) {
        await RNFS.mkdir(targetDirectory);
      }

      // Capture the QR code image
      const uri = await viewShotRef.current.capture();

      // Define the file name
      const fileName = 'QRCodeImage.jpg';

      // Define the full path
      const fullPath = `${targetDirectory}/${fileName}`;

      // Move the file to the specified path
      await RNFS.moveFile(uri, fullPath);

      // console.log('Image saved:', fullPath);

      await CameraRoll.save(fullPath, {type: 'photo'});

      // console.log('Image saved:', fullPath);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header headertext={t('QR Scanner')} />

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.share} onPress={handleSharePress}>
          <Image
            source={icons.reply}
            style={{width: 30, height: 30}}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <ViewShot ref={viewShotRef}>
          <View style={styles.viewshot_view}>
            <View style={styles.username_img}>
              <ProfileImage uri={my_data?.profile_pic} />
              <Text style={styles.username_txt}>{my_data?.username}</Text>
            </View>
            <View style={{flex: 1}}>
              <QRCode
                value={qrCodeValue}
                size={250}
                color="#000"
                logo={icons.dreamQR}
                logoSize={58}
                logoBackgroundColor="#d6d6d6"
                backgroundColor="#d6d6d6"
              />
            </View>
          </View>
        </ViewShot>
        <View style={styles.icon_scanner}>
          <Text style={styles.txt_line}>
            {t('Share your QR code so that others can follow you')}
          </Text>
          <MaterialCommunityIcons
            name="line-scan"
            size={40}
            color="#000"
            onPress={handleScanPress}
          />
        </View>

        {/* Modal */}
        <QRModal
          isVisible={isModalVisible}
          closeModal={closeModal}
          handleDownload={handleDownload}
        />
      </View>

      {isCameraVisible && (
        <RNCamera
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={({data}) => handleBarCodeRead(data)}>
          <View style={styles.overlay}>
            <View style={styles.overlayInner} />
          </View>
        </RNCamera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#d6d6d6',
  },
  share: {
    alignSelf: 'flex-end',
    margin: 10,
  },
  icon_scanner: {
    margin: 20,
    alignSelf: 'center',
    flexDirection: 'column',
    width: width * 0.8,
    alignItems: 'center',
    height: height * 0.1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.2,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeModalText: {
    fontSize: 16,
    color: 'blue',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  // qr_generator: {
  //     width: width * .75,
  //     height: height * .4,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     backgroundColor: "#d6d6d6",
  //     borderRadius: 10,
  // },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayInner: {
    borderWidth: 2,
    borderColor: 'red',
    width: width * 0.8,
    height: height * 0.4,
    margin: 30,
  },
  username_img: {
    flexDirection: 'column',
    width: width * 0.6,
    height: height * 0.12,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  username_txt: {
    color: '#000',
    fontWeight: '600',
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    fontSize: 16,
  },
  viewshot_view: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: height * 0.5,
    alignItems: 'center',
  },
  txt_line: {
    color: '#000',
    fontSize: 12.8,
    margin: 10,
  },
});

export default QRScreen;
