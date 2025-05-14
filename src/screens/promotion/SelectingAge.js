import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Body from '../../components/Body/Body.components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {Slider} from '@miblanchard/react-native-slider';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('window');

const SelectingAge = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [age, setAge] = useState([18, 65]);

  const handleAgeChange = val => {
    setAge(val);
  };

  const handleConfirm = () => {};

  return (
    <Body>
      <Body applyPadding={false} style={styles.header}>
        <Body applyPadding={false} style={styles.leftHeader}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={20} />
          </TouchableOpacity>
          <Text style={[styles.headerText, {marginTop: 0}]}>{t('Age')}</Text>
        </Body>
        <TouchableOpacity onPress={handleConfirm}>
          <Text style={[styles.headerText, {color: 'rgba(26, 148, 236, 1)'}]}>
            Compl...
          </Text>
        </TouchableOpacity>
      </Body>

      <Body
        applyPadding={false}
        style={{
          width: width,
          paddingHorizontal: 20,
          marginTop: 20,
        }}>
        <Slider
          value={age}
          onValueChange={handleAgeChange}
          minimumValue={18}
          maximumValue={65}
          step={1}
          allowOverlap
          snapped
          sliderLength={200}
          selectedStyle={{backgroundColor: 'blue'}}
          unselectedStyle={{backgroundColor: 'gray'}}
          containerStyle={{height: 10}}
          trackStyle={{height: 5}}
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 40,
          }}
          minimumTrackTintColor="#FA3E60"
          maximumTrackTintColor="rgba(0, 0, 0, 0.2)"
          thumbTintColor="#C9B5B5"
          // renderThumbComponent={() => (
          //   <CustomThumb value={age} />
          // )}
          CustomThumb={CustomThumb}
        />

        <View
          style={{
            width: width,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
            }}>
            {t('Age')} {age[0]}-{age[1]}
          </Text>
        </View>
      </Body>
    </Body>
  );
};

export default SelectingAge;
const CustomThumb = ({value, isMinThumb}) => {
  const thumbStyle = isMinThumb ? styles.minThumb : styles.maxThumb;

  return (
    <View style={[styles.customThumb, thumbStyle]}>
      <Text style={styles.customThumbText}>{value}</Text>
    </View>
  );
};

// const CustomThumb = ({ value, isMinThumb }) => {
//   const thumbStyle = isMinThumb ? styles.minThumb : styles.maxThumb;
//   return (
//     <View style={styles1.thumbContainer}>
//       <Text style={styles1.thumbText}>{value}</Text>
//       <View style={styles1.thumb}>

//       </View>
//     </View>
//   );
// };
const styles1 = StyleSheet.create({
  thumbContainer: {
    width: 20,
    height: 60,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C9B5B5',
  },
  thumbText: {
    fontSize: 15,
  },
});

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 7,
    borderColor: 'rgba(217, 217, 217, 0.4)',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 25,
    marginTop: 5,
  },
  leftHeader: {
    flexDirection: 'row',
  },
});
