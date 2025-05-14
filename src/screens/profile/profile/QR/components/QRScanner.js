import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
import Header from '../../components/Header';

const QRScanner = () => {
  const navigation = useNavigation();

  const onSuccess = e => {
    // Extract relevant user information from the scanned QR code
    const scannedData = e.data;
    console.log(scannedData, 'scannedData');

    // Navigate to the user profile screen with the extracted data
    navigation.navigate('QRScreen');
  };

  return (
    <View style={styles.mainContainer}>
      <Header headertext={'QR_Scanner'} />

      {/* <QRCodeScanner
        onRead={onSuccess}
        flashMode={QRCodeScanner.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            Go to{' '}
            <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
            your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  centerText: {
    fontSize: 18,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonTouchable: {
    padding: 16,
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
});

export default QRScanner;
