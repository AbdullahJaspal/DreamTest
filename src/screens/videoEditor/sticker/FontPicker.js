import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FlatList} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const FontPicker = ({}) => {
  const {width, height} = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const setText = route?.params?.setText;
  const [fontName, setFontName] = useState(0);
  const [font_name, setFont_name] = useState('lato-black');
  const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      color: '#fff',
      fontSize: 20,
      marginLeft: 20,
      fontFamily: 'BeVietnamPro-Regular',
    },
    header: {
      flexDirection: 'row',
      backgroundColor: 'red',
      height: 50,
      width: width,
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    bottom_container: {
      flex: 1,
      flexDirection: 'row',
    },
    bottom_left_container: {
      width: 150,
      height: height - 50,
    },
    bottom_right_container: {
      // backgroundColor: 'green',
      flex: 1,
    },
    fontHeaderCard: {
      // backgroundColor: '',
      height: (height - 50) / 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: '#fff',
    },
    text: {
      fontSize: 20,
      color: '#fff',
    },
    text1: {
      color: '#fff',
    },
    fontCard: {
      height: 50,
      borderWidth: 0.2,
      borderColor: '#fff',
      justifyContent: 'center',
      paddingHorizontal: 30,
    },
  });
  const FontHeader = [
    {
      id: 1,
      name: 'Lato',
      onPress: () => {
        setFontName(0);
      },
    },
    {
      id: 2,
      name: 'Arabic',
      onPress: () => {
        setFontName(1);
      },
    },
  ];
  const data = [
    [
      {
        id: 1,
        name: 'Lato Black',
        family: 'lato-black',
      },
      {
        id: 2,
        name: 'Lato Black Italic',
        family: 'lato-blackitalic',
      },
      {
        id: 3,
        name: 'Lato Bold',
        family: 'lato-bold',
      },
      {
        id: 4,
        name: 'Lato Bold Italic',
        family: 'lato-bolditalic',
      },
      {
        id: 5,
        name: 'Lato Hairline',
        family: 'lato-hairline',
      },
      {
        id: 6,
        name: 'Lato Hairline Italic',
        family: 'lato-hairlineitalic',
      },
      {
        id: 7,
        name: 'Lato Heavy',
        family: 'lato-heavy',
      },
      {
        id: 8,
        name: 'Lato Heavy Italic',
        family: 'lato-heavyitalic',
      },
      {
        id: 9,
        name: 'Lato Italic',
        family: 'lato-italic',
      },
      {
        id: 10,
        name: 'Lato Light',
        family: 'lato-light',
      },
      {
        id: 11,
        name: 'Lato Light Italic',
        family: 'lato-lightitalic',
      },
      {
        id: 12,
        name: 'Lato Medium',
        family: 'lato-medium',
      },
      {
        id: 13,
        name: 'Lato Medium Italic',
        family: 'lato-medium-italic',
      },
      {
        id: 14,
        name: 'Lato SemiBold',
        family: 'lato-semibold',
      },
      {
        id: 15,
        name: 'Lato SemiBold Italic',
        family: 'lato-semibold-italic',
      },
      {
        id: 16,
        name: 'Lato Thin',
        family: 'lato-thin',
      },
      {
        id: 17,
        name: 'Lato Thin Italic',
        family: 'lato-thinitalic',
      },
    ],
    [
      {
        id: 1,
        name: 'Sans Arabic Bold',
        family: 'IBMPlexSansArabic-Bold',
      },
      {
        id: 2,
        name: 'Sans Arabic Extra Light',
        family: 'IBMPlexSansArabic-ExtraLight',
      },
      {
        id: 3,
        name: 'Sans Arabic Light',
        family: 'IBMPlexSansArabic-Light',
      },
      {
        id: 4,
        name: 'Sans Arabic Medium',
        family: 'IBMPlexSansArabic-Medium',
      },
      {
        id: 5,
        name: 'Sans Arabic Regular',
        family: 'IBMPlexSansArabic-Regular',
      },
      {
        id: 6,
        name: 'Sans Arabic SemiBold',
        family: 'IBMPlexSansArabic-SemiBold',
      },
      {
        id: 7,
        name: 'Sans Arabic Thin',
        family: 'IBMPlexSansArabic-Thin',
      },
    ],
  ];

  const setFont = name => {
    setFont_name(name);
  };
  const handleSave = () => {
    setText(p => ({
      ...p,
      fontFamily: font_name,
    }));
    navigation.goBack();
  };

  return (
    <View style={styles.main_container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons name="format-text" color={'#fff'} size={30} />
          <Text style={styles.text}>Font</Text>
        </View>
        <Pressable onPress={handleSave}>
          <AntDesign name="check" color={'#fff'} size={30} />
        </Pressable>
      </View>

      {/* Bottom View */}
      <View style={styles.bottom_container}>
        <View style={styles.bottom_left_container}>
          <FlatList
            data={FontHeader}
            renderItem={({item, index}) => (
              <Pressable style={styles.fontHeaderCard} onPress={item?.onPress}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: fontName == index ? 'red' : '#fff',
                    },
                  ]}>
                  {item?.name}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.bottom_right_container}>
          <FlatList
            data={data[fontName]}
            renderItem={({item, index}) => (
              <Pressable
                style={styles.fontCard}
                onPress={() => {
                  setFont(item?.family);
                }}>
                <Text
                  style={[
                    styles.text1,
                    {
                      fontFamily: item?.family,
                      color: font_name == item?.family ? 'red' : 'white',
                    },
                  ]}>
                  {item?.name}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default FontPicker;

const styles = StyleSheet.create({});
