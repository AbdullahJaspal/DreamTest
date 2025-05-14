// import React, { useRef } from 'react';
// import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import ViewShot from 'react-native-view-shot';
// import RNFS from 'react-native-fs';

// const QRGenerator = ({ id }) => {
//   const qrCodeData = `${id}`;
//   const viewShotRef = useRef();

//   const handleDownload = async () => {
//     try {
//       const uri = await viewShotRef.current.capture();

//       // Define the file name
//       const fileName = 'QRCodeImage.jpg';

//       // Define the full path
//       const fullPath = `${RNFS.ExternalStorageDirectoryPath}/DCIM/DREAM/${fileName}`;

//       // Move the file to the specified path
//       await RNFS.moveFile(uri, fullPath);

//       console.log('Image saved:', fullPath);
//     } catch (error) {
//       console.error('Error saving image:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ViewShot ref={viewShotRef} style={styles.qrContainer}>
//         <QRCode
//           value={qrCodeData}
//           size={250}
//           color="#000"
//           logo={Setting_QR_Black}
//           logoSize={58}
//           logoBackgroundColor="#d6d6d6"
//           backgroundColor="#d6d6d6"
//         />
//       </ViewShot>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   qrContainer: {
//     marginTop: 20,
//   },
//   downloadButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: 'blue',
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default QRGenerator;
