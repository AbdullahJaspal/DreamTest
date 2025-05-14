import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Trimmer from './Trimmer';
import Filter from './Filter';
import Adjustment from './Adjustment';
import Rotate from './Rotate';
import Speed from './Speed';
import PropertySettings from './PropertySettings';
import {
  change_loading,
  change_video_url,
} from '../../../store/slices/content/videoSlice';
import {FFmpegKit, ReturnCode, FFprobeKit} from 'ffmpeg-kit-react-native';
import {stateList} from '../State';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {selectVideo} from '../../../store/selectors';
import {icons} from '../../../assets/icons';

const {width, height} = Dimensions.get('screen');

const MainEditor = ({
  setShow_editor,
  show_editor,
  rotateVideo,
  reverse_video,
  rotateAntiClockwiseVideo,
  mirroringHorizontally,
  mirroringVertically,
}) => {
  const {t, i18n} = useTranslation();

  const dispatch = useDispatch();
  const video = useAppSelector(selectVideo);
  const [show_trimming, setShow_trimmer] = useState(false);
  const [enable_editing, setEnable_editing] = useState(show_editor);
  const [show_filter, setShowFilter] = useState(false);
  const [show_adjustment, setshow_adjustment] = useState(false);
  const [show_rotation, setShow_rotation] = useState(false);
  const [show_speed, setShow_speed] = useState(false);
  const [show_information_modal, setShow_information_modal] = useState(false);

  const compressVideo = async () => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const videoBitrate = '1000k';
    const videoCodec = 'libx264';
    const command = `-i ${video.video_url} -b:v ${videoBitrate} -vcodec ${videoCodec} -vf "scale=1280:720" ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('Success: Compressed video saved at', output_path);
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('Cancel: Video compression canceled');
        dispatch(change_loading(false));
      } else {
        console.error('Error: Video compression failed');
        dispatch(change_loading(false));
      }
    });
  };

  const compressAndSlipVideo = async slipDurationInSeconds => {
    dispatch(change_loading(true));
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const videoBitrate = '1000k';
    const videoCodec = 'libx264';

    // Calculate the offset for slipping the video
    const slipOffset = slipDurationInSeconds
      ? `-itsoffset ${slipDurationInSeconds}`
      : '';

    const command = `-i ${video.video_url} ${slipOffset} -b:v ${videoBitrate} -vcodec ${videoCodec} -vf "scale=1280:720" ${output_path}`;

    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log(
          'Success: Compressed and slipped video saved at',
          output_path,
        );
        stateList.addState(output_path);
        dispatch(change_video_url(stateList.current.data));
        dispatch(change_loading(false));
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('Cancel: Video compression and slipping canceled');
        dispatch(change_loading(false));
      } else {
        console.error('Error: Video compression and slipping failed');
        dispatch(change_loading(false));
      }
    });
  };

  const upper_view = [
    {
      id: 1,
      name: t('Replace'),
      icon_name: icons.repeat,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 2,
      name: t('Trim/Split'),
      icon_name: icons.videoTrim,
      onPress: () => {
        setShow_trimmer(p => !p);
        setEnable_editing(p => !p);
      },
    },
    {
      id: 3,
      name: t('Slip'),
      icon_name: icons.shift,
      onPress: () => {
        compressAndSlipVideo(2);
      },
    },
    {
      id: 4,
      name: t('Mixer'),
      icon_name: icons.volume,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 5,
      name: t('Speed'),
      icon_name: icons.speedometer,
      onPress: () => {
        setShow_speed(p => !p);
        setEnable_editing(p => !p);
      },
    },
    {
      id: 6,
      name: t('Reverse'),
      icon_name: icons.history,
      onPress: () => {
        reverse_video();
      },
    },
    {
      id: 7,
      name: t('Compress'),
      icon_name: icons.collapse,
      onPress: () => {
        compressVideo();
      },
    },
    {
      id: 8,
      name: t('Rotate/Mirroring'),
      icon_name: icons.uploadVideo,
      onPress: () => {
        setShow_rotation(p => !p);
        setEnable_editing(p => !p);
      },
    },
    {
      id: 9,
      name: t('Filter'),
      icon_name: icons.unity,
      onPress: () => {
        setShowFilter(p => !p);
        setEnable_editing(p => !p);
      },
    },
    {
      id: 10,
      name: t('Adjustment'),
      icon_name: icons.filter,
      onPress: () => {
        setshow_adjustment(p => !p);
        setEnable_editing(p => !p);
      },
    },
    {
      id: 11,
      name: t('Clip Graphics'),
      icon_name: icons.premiereClip,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 12,
      name: t('Vignette'),
      icon_name: icons.vignette,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 13,
      name: t('Volume Envelope'),
      icon_name: icons.audioMail,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 14,
      name: t('Voice Changer'),
      icon_name: icons.audioWaves,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 15,
      name: t('Extract Audio'),
      icon_name: icons.extractAudio,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 16,
      name: t('Transcode'),
      icon_name: icons.transcode,
      onPress: () => {
        console.log('pressed');
      },
    },
    {
      id: 17,
      name: t('Information'),
      icon_name: icons.info,
      onPress: () => {
        setShow_information_modal(true);
      },
    },
  ];

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          onPress={() => {
            setShow_editor(false);
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {enable_editing && (
        <View style={styles.main_container}>
          <RenderHeader />
          <FlatList
            data={upper_view}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={item.onPress}
                style={styles.upper_icon_view}>
                <Image source={item.icon_name} style={styles.icon} />
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {show_trimming && (
        <Trimmer
          setShow_trimmer={setShow_trimmer}
          setEnable_editing={setEnable_editing}
        />
      )}
      {show_filter && (
        <Filter
          setShowFilter={setShowFilter}
          setEnable_editing={setEnable_editing}
        />
      )}
      {show_adjustment && (
        <Adjustment
          setshow_adjustment={setshow_adjustment}
          setEnable_editing={setEnable_editing}
        />
      )}
      {show_rotation && (
        <Rotate
          setShow_rotation={setShow_rotation}
          setEnable_editing={setEnable_editing}
          rotateAntiClockwiseVideo={rotateAntiClockwiseVideo}
          mirroringHorizontally={mirroringHorizontally}
          mirroringVertically={mirroringVertically}
          rotateVideo={rotateVideo}
        />
      )}
      {show_speed && (
        <Speed
          setShow_speed={setShow_speed}
          setEnable_editing={setEnable_editing}
        />
      )}
      <Modal
        visible={show_information_modal}
        transparent={true}
        animationType="slide">
        <Pressable
          onPress={() => {
            setShow_information_modal(false);
          }}
          style={{flex: 1}}>
          <View
            style={{
              width: 350,
              height: 220,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              position: 'absolute',
              top: 30,
              left: (width - 350) / 2,
              right: (width - 350) / 2,
              borderRadius: 10,
            }}>
            <View
              style={{
                width: '100%',
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'grey',
              }}>
              <Text style={styles.modal_text}>Information</Text>
            </View>

            <View
              style={{
                width: '100%',
                paddingLeft: 30,
                paddingTop: 15,
                marginBottom: 20,
              }}>
              <Text style={styles.details_text}>reverse_67353_37623.mp4</Text>
              <Text style={styles.details_text}>Date: 2023.07.07 PM 03:05</Text>
              <Text style={styles.details_text}>
                File Format: MP4 (H264/AAC)
              </Text>
              <Text style={styles.details_text}>Resoluction: 320 X 176 </Text>
              <Text style={styles.details_text}>Frame Rate: 25 fps</Text>
              <Text style={styles.details_text}>Duration: 0.10</Text>
              <Text style={styles.details_text}>Location: App storage</Text>
            </View>
            <Pressable
              onPress={() => {
                setShow_information_modal(false);
              }}
              style={{
                width: '100%',
                height: 35,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'grey',
              }}>
              <Text style={[styles.modal_text, {color: 'red'}]}>OK</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default MainEditor;

const styles = StyleSheet.create({
  main_container: {
    width: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
  },
  upper_goback: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 250,
    height: 40,
    paddingLeft: 1,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  text: {
    color: '#FAF9F6',
    marginTop: 3,
    fontSize: 10,
  },
  upper_icon_view: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 250 / 3,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  modal_text: {
    fontSize: 16,
    color: 'white',
  },
  details_text: {
    fontSize: 13,
    color: 'white',
    fontWeight: '700',
  },
});
