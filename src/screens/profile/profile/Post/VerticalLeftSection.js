import React from 'react';
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {icons} from '../../../../assets/icons';

const VerticalLeftSection = ({avatar, onGiftPress, item}) => {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    main_container: {
      position: 'absolute',
      left: 10,
      bottom: 30,
    },
    text: {
      color: '#fff',
      fontSize: 18,
      // fontWeight: '500'
    },
    main_view_of_icon: {
      alignItems: 'center',
      marginTop: 25,
    },
  });

  const handlePromotionsPressed = () => {
    navigation.navigate('Promotion');
  };

  const ItemVertical = ({imageName, onPress, text, color}) => {
    return (
      <Pressable style={styles.main_view_of_icon} onPress={onPress}>
        <Image
          source={imageName}
          style={{width: 50, height: 50, tintColor: color}}
        />
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.main_container}>
      <View style={styles.main_view_of_icon}>
        <Image
          source={{uri: avatar}}
          style={{width: 50, height: 50, borderRadius: 40}}
        />
        <Image
          source={icons.crown}
          style={{
            width: 80,
            height: 50,
            borderRadius: 40,
            position: 'absolute',
          }}
        />
      </View>

      <ItemVertical
        imageName={icons.gift}
        text={t('Gift')}
        onPress={onGiftPress}
      />

      <ItemVertical imageName={icons.diamond} text={item?.diamond_value || 0} />
      <ItemVertical
        imageName={icons.rocket}
        onPress={handlePromotionsPressed}
        // text={0}
      />
    </View>
  );
};

export default VerticalLeftSection;
