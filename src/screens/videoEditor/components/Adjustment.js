import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {Slider} from 'react-native-awesome-slider';
import {useTranslation} from 'react-i18next';

const Adjustment = ({setEnable_editing, setshow_adjustment}) => {
  const {t, i18n} = useTranslation();

  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={() => {
            setshow_adjustment(false);
            setEnable_editing(true);
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
          {t('Adjustment')}
        </Text>
      </View>
    );
  };

  const change_brightness = async () => {
    setShow_loader(true);
    const cache_dir_path = await RNFS.CachesDirectoryPath;
    const filename = new Date().getTime();
    const output_path = `${cache_dir_path}/${filename}.mp4`;
    const command = `-i ${video_path} -vf "eq=brightness=0.2:saturation=1.5" ${output_path}`;
    FFmpegKit.executeAsync(command, async session => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        console.log('success');
        stateList.addState(output_path);
        setVideo_path(stateList.current.data);
        setShow_loader(false);
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('cancal');
        setShow_loader(false);
      } else {
        console.log(error);
        setShow_loader(false);
      }
    });
  };

  const Adjustment_data = [
    {
      id: 1,
      name: 'Brightness',
      value: 0,
      onSlides: v => {
        change_brightness();
      },
    },
    {
      id: 2,
      name: 'Contrast',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 3,
      name: 'Saturation',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 4,
      name: 'Vibrance',
      value: 0,
      onSlides: v => {
        console.log(v);
      },
    },
    {
      id: 5,
      name: 'Temperature',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 6,
      name: 'Highlights',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 7,
      name: 'Shadows',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 8,
      name: 'Gain',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 9,
      name: 'Gamma',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 10,
      name: 'Lift',
      value: 0,
      onSlides: () => {},
    },
    {
      id: 11,
      name: 'Hue',
      value: 0,
      onSlides: () => {},
    },
  ];

  return (
    <View style={styles.main_container}>
      <RenderHeader />
      <FlatList
        data={Adjustment_data}
        renderItem={({item, index}) => (
          <View style={styles.view_container}>
            <Text style={styles.text}>{item.name}</Text>
            <Slider
              value={item.value}
              minimumValue={-100}
              maximumValue={100}
              thumbTintColor="red"
              minimumTrackTintColor="red"
              maximumTrackTintColor="white"
              onValueChange={item.onSlides}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Adjustment;

const styles = StyleSheet.create({
  main_container: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
  },
  upper_goback: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 250,
    height: 40,
    paddingLeft: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  text: {
    color: '#FAF9F6',
    marginTop: 3,
    fontSize: 14,
  },
  upper_icon_view: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 50,
  },
  view_container: {
    flex: 1,
    marginTop: 10,
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginLeft: 10,
    paddingHorizontal: 5,
  },
});
