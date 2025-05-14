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

const Speed = ({setEnable_editing, setShow_speed}) => {
  const RenderHeader = () => {
    return (
      <View style={styles.upper_goback}>
        <TouchableOpacity
          style={{position: 'absolute', left: 10}}
          onPress={() => {
            setShow_speed(false);
            setEnable_editing(true);
          }}>
          <Entypo name="chevron-small-left" color={'white'} size={40} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 16, fontWeight: '700'}}>
          {t('Speed')}
        </Text>
      </View>
    );
  };
  const data = [
    {
      id: 1,
      value: '1x',
      onPress: () => {},
    },
    {
      id: 2,
      value: '2x',
      onPress: () => {},
    },
    {
      id: 3,
      value: '3x',
      onPress: () => {},
    },
    {
      id: 4,
      value: '4x',
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.main_container}>
      <RenderHeader />

      <View>
        <FlatList
          data={data}
          horizontal={true}
          renderItem={({item, index}) => (
            <View style={styles.icon_view}>
              <Text style={styles.text}>{item.value}</Text>
            </View>
          )}
        />
      </View>
      <View style={{marginTop: 20}}>
        <Slider
          minimumValue={0.125}
          maximumValue={8}
          // style={{backgroundColor: '#fff'}}
          maximumTrackTintColor="#fff"
          minimumTrackTintColor="red"
          thumbTintColor="red"
        />
      </View>
    </View>
  );
};

export default Speed;

const styles = StyleSheet.create({
  main_container: {
    width: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    justifyContent: 'flex-start',
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
  icon_view: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    width: 250 / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_view: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  first_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  card_view: {
    borderColor: 'black',
    borderWidth: 1,
  },
});
