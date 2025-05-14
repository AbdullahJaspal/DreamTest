import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useWindowDimensions,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {setTextOverLay} from '../../../store/slices/content/videoSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TriangleColorPicker} from 'react-native-color-picker';
import LeftIcon from './LeftIcon';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '../../../store/hooks';
import {selectTextOverlay} from '../../../store/selectors';

const RenderTextInput = () => {
  const {t, i18n} = useTranslation();
  const {width, height} = useWindowDimensions();
  const text_overlay = useAppSelector(selectTextOverlay);
  const dispatch = useDispatch();
  const route = useRoute();
  const setText_overlay = route?.params?.setText_overlay;
  const [show_color_picker, setShow_color_picker] = useState(false);
  const [show_background_color, setShow_background_color] = useState(false);
  const navigattion = useNavigation();
  const [text, setText] = useState({
    value: '',
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 24,
    letterSpacing: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: 'blue',
    textDecorationStyle: 'solid',
    textTransform: 'uppercase',
    textShadowColor: 'red',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    backgroundColor: 'transparent',
    opacity: 0.8,
    elevation: 5,
    fontFamily: 'lato-black',
  });

  console.log(text);
  const styles = StyleSheet.create({
    main_container: {
      flex: 1,
      backgroundColor: '#020202',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      fontSize: 20,
      marginRight: 20,
      borderColor: '#fff',
      paddingHorizontal: 30,
    },
    button: {
      borderWidth: 1,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingVertical: 5,
      marginVertical: 5,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    text: {
      color: text.color,
      fontSize: text.fontSize,
      // fontWeight: text.fontWeight,
      // fontStyle: text.fontStyle,
      // lineHeight: text.lineHeight,
      // letterSpacing: text.letterSpacing,
      textAlign: text.textAlign,
      // textAlignVertical: text.textAlignVertical,
      // textDecorationLine: text.textDecorationLine,
      // textDecorationColor: text.textDecorationColor,
      // textDecorationStyle: text.textDecorationStyle,
      // textTransform: text.textTransform,
      // textShadowColor: text.textShadowColor,
      // textShadowOffset: { width: text?.textShadowOffset?.width, height: text?.textShadowOffset?.height },
      // textShadowRadius: text.textShadowRadius,
      backgroundColor: text.backgroundColor,
      // opacity: text.opacity,
      // elevation: text.elevation,
      fontFamily: text?.fontFamily,
    },
    color_picker: {
      width: width * 0.5,
      height: height * 0.7,
    },
    color_picker_left_view: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0, 0, 0.7)',
    },
    fontEditor: {
      width: 120,
      height: height,
      position: 'absolute',
      right: 0,
    },
    txt: {
      color: '#fff',
    },
    font_editor_card: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderWidth: 0.3,
      borderColor: '#fff',
      height: height / 5,
    },
  });

  const fontEditor = [
    {
      id: 1,
      name: t('Size'),
      group_name: 'MaterialCommunityIcons',
      icon_name: 'format-font-size-increase',
      onPress: () => {
        setText(p => ({
          ...p,
          fontSize: p.fontSize + 1,
        }));
      },
    },
    {
      id: 2,
      name: t('Size'),
      group_name: 'MaterialCommunityIcons',
      icon_name: 'format-font-size-decrease',
      onPress: () => {
        setText(p => ({
          ...p,
          fontSize: p.fontSize - 1,
        }));
      },
    },
    {
      id: 3,
      name: t('Font'),
      group_name: 'FontAwesome',
      icon_name: 'font',
      onPress: () => {
        navigattion.navigate('FontPicker', {setText});
      },
    },
    {
      id: 4,
      name: t('Color'),
      group_name: 'MaterialIcons',
      icon_name: 'colorize',
      onPress: () => {
        setShow_color_picker(p => !p);
      },
    },
    {
      id: 5,
      name: t('BG Color'),
      group_name: 'Ionicons',
      icon_name: 'color-fill',
      onPress: () => {
        setShow_background_color(p => !p);
      },
    },
    {
      id: 6,
      name: t('Ok'),
      group_name: 'Entypo',
      icon_name: 'check',
      onPress: () => {
        setText_overlay(text);
        navigattion.goBack();
      },
    },
    {
      id: 7,
      name: t('Cancel'),
      group_name: 'Entypo',
      icon_name: 'cross',
      onPress: () => {
        navigattion.goBack();
      },
    },
  ];

  const handleOk = () => {
    dispatch(setTextOverLay(text));
    navigattion.goBack();
  };
  const handleCancel = () => {
    navigattion.goBack();
  };
  const handleColorPicker = () => {
    setShow_color_picker(p => !p);
  };
  const handleColorSelection = value => {
    setText(p => ({
      ...p,
      color: value,
    }));
    setShow_color_picker(p => !p);
  };
  const handleBgColorSelection = value => {
    setText(p => ({
      ...p,
      backgroundColor: value,
    }));
    setShow_background_color(p => !p);
  };

  return (
    <>
      <View style={styles.main_container}>
        <View>
          <TextInput
            placeholder={t('Enter Text')}
            placeholderTextColor={'#fff'}
            style={[styles.textInput, styles.text]}
            value={text.value}
            onChangeText={value => {
              setText(p => ({
                ...p,
                value: value,
              }));
            }}
          />
        </View>
        <View style={styles.fontEditor}>
          <FlatList
            data={fontEditor}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.font_editor_card}
                onPress={item?.onPress}>
                <LeftIcon
                  group_name={item?.group_name}
                  icon_name={item?.icon_name}
                  color={'#fff'}
                  onPress={item?.onPress}
                  size={25}
                />
                <Text style={styles.txt}>{item?.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Modal visible={show_color_picker} transparent={true}>
        <Pressable style={styles.color_picker_left_view}>
          <View style={styles.color_picker}>
            <TriangleColorPicker
              style={{flex: 1}}
              onColorSelected={handleColorSelection}
            />
          </View>
        </Pressable>
      </Modal>
      <Modal visible={show_background_color} transparent={true}>
        <Pressable style={styles.color_picker_left_view}>
          <View style={styles.color_picker}>
            <TriangleColorPicker
              style={{flex: 1}}
              onColorSelected={handleBgColorSelection}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default RenderTextInput;

const styles = StyleSheet.create({});
