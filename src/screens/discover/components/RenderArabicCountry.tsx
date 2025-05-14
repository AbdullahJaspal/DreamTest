import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {CountryProps, CountrySelectionProps} from '../types/CountrySelection';

interface RenderArabicCountryProps {
  item: CountryProps;
  index: number;
  handleImagePress: (data: CountrySelectionProps) => void;
}

const RenderArabicCountry: React.FC<RenderArabicCountryProps> = ({
  item,
  handleImagePress,
}) => {
  const handleImage = () => {
    handleImagePress({country_id: item?.id, country_name: item?.name});
  };

  return (
    item.flagurl != null && (
      <Pressable onPress={handleImage}>
        <Image source={{uri: item.flagurl}} style={styles.flag_img} />
      </Pressable>
    )
  );
};

export default React.memo(RenderArabicCountry);

const styles = StyleSheet.create({
  flag_img: {
    width: 25,
    height: 25,
    marginRight: 8,
    marginLeft: 4,
  },
});
