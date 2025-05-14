import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {HashtagProps} from '../types/CountrySelection';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {DiscoverScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {useTranslation} from 'react-i18next';
import {icons} from '../../../assets/icons';

interface RenderSearchHastagProps {
  item: HashtagProps;
  index: number;
}

const {width, height} = Dimensions.get('screen');

const RenderSearchHastag: React.FC<RenderSearchHastagProps> = ({item}) => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation<DiscoverScreenNavigationProps>();
  function handleHastagPress(_event: GestureResponderEvent): void {
    navigation.navigate('HashtagScreen', {
      hashtag_text: item.title,
      hashtag_id: item.id,
      no_of_videos: item.num_of_video,
    });
  }

  console.log('item', item.title);

  return (
    <View style={styles.itemsearchaudiocontainer}>
      <Pressable onPress={handleHastagPress}>
        <View style={styles.item_container}>
          <LinearGradient
            colors={[
              'rgba(53,34,195,1)',
              'rgba(241,45,253,0.6045918367346939)',
            ]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.imageContainer}>
            <Image source={icons.hashtag} style={styles.iconstyle} />
          </LinearGradient>

          <View style={styles.textContainer}>
            <View>
              <Text style={{color: '#000', fontSize: 15}}>{item.title}</Text>
            </View>
            <View>
              <Text>{item.title}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View>
              <Text>{item.num_of_video}</Text>
            </View>

            <View style={{paddingHorizontal: 3}}>
              <Text style={{fontSize: 15}}>{t('Videos')}</Text>
            </View>
          </View>
          <View>
            <Image source={icons.right} style={styles.iconstyle} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default RenderSearchHastag;

const styles = StyleSheet.create({
  itemsearchaudiocontainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.7,
    borderColor: 'gray',
    width: width,
  },
  item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
  },
  imageContainer: {
    marginRight: 10,
    width: width * 0.16,
    backgroundColor: '#3522c3',
    borderRadius: 10,
    height: height * 0.08,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -99,
  },
  textContainer: {
    width: width * 0.44,
    alignItems: 'flex-start',
  },
  statsContainer: {
    width: width * 0.25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgstyle: {
    width: width * 0.13,
    height: 70,
    resizeMode: 'cover',
    borderRadius: 13,
  },
  iconstyle: {
    width: 18,
    height: 18,
  },
});
