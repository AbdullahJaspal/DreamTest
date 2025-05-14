import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React from 'react';
import {CountryProps, CountrySelectionProps} from '../types/CountrySelection';

interface RenderCountryProps {
  item: CountryProps;
  index: number;
  getallvideobycountryid: (data: CountrySelectionProps) => void;
  closeModal: () => void;
}
const {width} = Dimensions.get('screen');

const RenderCountry: React.FC<RenderCountryProps> = ({
  item,
  getallvideobycountryid,
  closeModal,
}) => {
  const handleCountryPress = () => {
    getallvideobycountryid({country_id: item.id, country_name: item.name});
    closeModal();
  };

  return (
    <Pressable style={styles.main_container} onPress={handleCountryPress}>
      <View>
        <View style={styles.flag_container}>
          <View style={{paddingHorizontal: 6}}>
            <Image
              source={{uri: item?.flagurl ?? ''}}
              style={{width: 20, height: 20}}
            />
          </View>
          <View>
            <Text style={styles.name_text}>{item?.name}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default React.memo(RenderCountry);

const styles = StyleSheet.create({
  flag_text: {
    fontSize: 18,
  },
  name_text: {
    fontSize: 8,
    color: '#000',
    textAlign: 'center',
  },
  main_container: {
    justifyContent: 'flex-start',
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
  },
  flag_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    borderWidth: 1,
    borderRadius: 10,
    padding: 4,
    width: width * 0.27,
    overflow: 'hidden',
  },
});
