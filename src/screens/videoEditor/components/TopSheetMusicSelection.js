import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import TopSheet from '../../../components/bottomSheets/TopSheet';
import LeftIcon from './LeftIcon';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {readAllFolder} from '../utils/ReadAllFiles';
import Entypo from 'react-native-vector-icons/Entypo';
import {t} from 'i18next';
const {width, height} = Dimensions.get('window');

const TopSheetMusicSelection = ({setShow_music_selection}) => {
  const [folder_name, setFolder_name] = useState('');
  const topSheetRef = useRef();
  const {width, height} = useWindowDimensions();
  const data = [
    {
      id: 1,
      group_name: 'FontAwesome5',
      icon_name: 'music',
      title: t('Music'),
      onPress: () => {
        navigation.goBack();
      },
    },
    {
      id: 2,
      group_name: 'MaterialIcons',
      icon_name: 'record-voice-over',
      title: t('Record'),
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 3,
      group_name: 'MaterialCommunityIcons',
      icon_name: 'surround-sound',
      title: t('Sound effect'),
      onPress: () => {
        console.log('pressed');
      },
    },
  ];
  useEffect(() => {
    const updateDimensions = ({window}) => {};

    Dimensions.addEventListener('change', updateDimensions);

    // Clean up the listener when the component unmounts
    return () => {
      // Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  // const readAllFolder = async () => {
  //     try {
  //       const granted = await requestPermission();
  //       if (granted) {
  //         const folder_path = RNFS.ExternalStorageDirectoryPath;
  //         const file_path = await RNFS.readDir(folder_path);
  //         for (let i = 0; i < file_path.length; i++) {
  //             console.log("name",file_path[i].name)
  //             console.log("path",file_path[i].path)

  //         }
  //       } else {
  //         console.log('Permission denied');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const readParticularPath = async ()=>{
  //     try {
  //         const file = await RNFS.readDir('/storage/emulated/0/WhatsApp/Media/WhatsApp Animated Gifs')
  //         console.log(file)
  //     } catch (error) {
  //         console.log(error.message)
  //     }
  //   }

  // //  Download

  //   useEffect(() => {
  //     // readAllFolder();
  //     readParticularPath()
  //   }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: t('External Storage Permission'),
            message: t(
              'This app needs permission to access the external storage.',
            ),
            buttonPositive: 'OK',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    return false;
  };

  // useEffect(() => {
  //     async function fetchData() {
  //         const folderData = await readAllFolder();
  //         setFolder_name(folderData)

  //     }

  //     fetchData();
  // }, []);

  const handleCancel = () => {
    setShow_media(p => !p);
  };

  const styles = StyleSheet.create({
    main_container: {
      width: width,
      height: height * 0.62,
      backgroundColor: '#fff',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#020202',
      flexDirection: 'row',
    },
    left_icon: {
      width: 50,
      backgroundColor: 'red',
      height: height * 0.62,
    },
    image_view: {
      width: 50,
      height: (height * 0.62) / 3,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 0.5,
      borderColor: 'white',
      borderRightWidth: 0,
      borderBottomWidth: 1,
    },
    text: {
      color: 'white',
      marginTop: 5,
    },
    right_view: {
      width: width - 50,
      backgroundColor: '#fff',
      height: height * 0.62,
    },
    right_top_view: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'red',
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
  });

  return (
    <View style={styles.main_container}>
      {/* Left view */}
      <View style={styles.left_icon}>
        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <View style={styles.image_view}>
              <LeftIcon
                group_name={item.group_name}
                icon_name={item.icon_name}
                size={25}
                onPress={item.onPress}
                color={'white'}
              />
              <Text style={styles.text}>{item.title}</Text>
            </View>
          )}
        />
      </View>
      {/* Left view ended  */}

      {/* right view */}
      <View style={styles.right_view}>
        <View style={styles.right_top_view}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'red',
            }}>
            <LeftIcon
              group_name={'FontAwesome5'}
              icon_name={'music'}
              color={'#fff'}
              size={30}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '600',
                marginLeft: 10,
              }}>
              Sound browser
            </Text>
          </View>
          <LeftIcon
            group_name={'Entypo'}
            icon_name={'cross'}
            color={'#fff'}
            size={30}
            onPress={() => {
              setShow_music_selection(p => !p);
            }}
          />
        </View>
      </View>
      {/* right view ended */}
    </View>
  );
};

export default TopSheetMusicSelection;
