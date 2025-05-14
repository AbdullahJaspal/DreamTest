import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Body from '../../components/Body/Body.components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Checkbox} from 'react-native-paper';

const {width, height} = Dimensions.get('window');

const InterestScreen = () => {
  const {t, i18n} = useTranslation();

  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState('');
  const [selected_cotuntry, setSelected_country] = useState(['s']);

  const hobbies = [
    {id: 1, name: t('Reading')},
    {id: 2, name: t('Playing sports')},
    {id: 3, name: t('Painting')},
    {id: 4, name: t('Cooking')},
    {id: 5, name: t('Gardening')},
    {id: 6, name: t('Photography')},
    {id: 7, name: t('Hiking')},
    {id: 8, name: t('Writing')},
    {id: 9, name: t('Playing musical instruments')},
    {id: 10, name: t('Dancing')},
    {id: 11, name: t('Singing')},
    {id: 12, name: t('Swimming')},
    {id: 13, name: t('Traveling')},
    {id: 14, name: t('Chess')},
    {id: 15, name: t('Yoga')},
    {id: 16, name: t('Knitting')},
    {id: 17, name: t('Birdwatching')},
    {id: 18, name: t('Running')},
    {id: 19, name: t('Fishing')},
    {id: 20, name: t('Collecting stamps')},
    {id: 21, name: t('Cycling')},
    {id: 22, name: t('Watching movies')},
    {id: 23, name: t('Pottery')},
    {id: 24, name: t('Calligraphy')},
    {id: 25, name: t('Origami')},
    {id: 26, name: t('Camping')},
    {id: 27, name: t('Playing video games')},
    {id: 28, name: t('Woodworking')},
    {id: 29, name: t('Embroidery')},
    {id: 30, name: t('Sculpting')},
    {id: 31, name: t('Sewing')},
    {id: 32, name: t('Playing board games')},
    {id: 33, name: t('Learning languages')},
    {id: 34, name: t('Meditation')},
    {id: 35, name: t('Playing chess')},
    {id: 36, name: t('Singing karaoke')},
    {id: 37, name: t('Mountain climbing')},
    {id: 38, name: t('Playing tennis')},
    {id: 39, name: t('Surfing')},
    {id: 40, name: t('Writing poetry')},
    {id: 41, name: t('Cooking/baking')},
    {id: 42, name: t('Painting miniatures')},
    {id: 43, name: t('Astronomy')},
    {id: 44, name: t('Playing card games')},
    {id: 45, name: t('Writing songs')},
    {id: 46, name: t('Archery')},
    {id: 47, name: t('Interior design')},
    {id: 48, name: t('Home brewing')},
    {id: 49, name: t('DIY crafts')},
    {id: 50, name: t('Volunteering')},
    {id: 51, name: t('Playing darts')},
    {id: 52, name: t('Stand-up comedy')},
    {id: 53, name: t('Wine tasting')},
    {id: 54, name: t('Magic tricks')},
    {id: 55, name: t('Geocaching')},
    {id: 56, name: t('Parkour')},
    {id: 57, name: t('Beekeeping')},
    {id: 58, name: t('Playing the drums')},
    {id: 59, name: t('Martial arts')},
    {id: 60, name: t('Geology')},
    {id: 61, name: t('Yoga')},
    {id: 62, name: t('Salsa dancing')},
    {id: 63, name: t('Playing the piano')},
    {id: 64, name: t('Rock climbing')},
    {id: 65, name: t('Collecting coins')},
    {id: 66, name: t('Astrology')},
    {id: 67, name: t('Scrapbooking')},
    {id: 68, name: t('Kayaking')},
    {id: 69, name: t('Learning magic')},
    {id: 70, name: t('Acting')},
    {id: 71, name: t('Writing fiction')},
    {id: 72, name: t('Skydiving')},
    {id: 73, name: t('Floral arranging')},
    {id: 74, name: t('Car restoration')},
    {id: 75, name: t('Surfing')},
    {id: 76, name: t('Ghost hunting')},
    {id: 77, name: t('Beekeeping')},
    {id: 78, name: t('Genealogy')},
    {id: 79, name: t('Playing the guitar')},
    {id: 80, name: t('Wine making')},
    {id: 81, name: t('Stand-up paddleboarding')},
    {id: 82, name: t('Crossword puzzles')},
    {id: 83, name: t('Geocaching')},
    {id: 84, name: t('Photography')},
    {id: 85, name: t('Writing letters')},
    {id: 86, name: t('Karate')},
    {id: 87, name: t('Canoeing')},
    {id: 88, name: t('Painting landscapes')},
    {id: 89, name: t('Reading biographies')},
    {id: 90, name: t('Table tennis')},
    {id: 91, name: t('Playing poker')},
    {id: 92, name: t('Learning a new programming language')},
    {id: 93, name: t('Horseback riding')},
    {id: 94, name: t('Collecting seashells')},
    {id: 95, name: t('Astronomy')},
    {id: 96, name: t('Ice skating')},
    {id: 97, name: t('Archery')},
    {id: 98, name: t('Stand-up paddleboarding')},
    {id: 99, name: t('Writing a journal')},
    {id: 100, name: t('Doing crossword puzzles')},
    {id: 101, name: t('Learning to code')},
    {id: 102, name: t('Skateboarding')},
    {id: 103, name: t('Beer tasting')},
    {id: 104, name: t('Quilting')},
  ];

  const Country_card = ({item, index}) => {
    const includesObject = (array, object) => {
      for (const item of array) {
        if (
          typeof item === 'object' &&
          JSON.stringify(item) === JSON.stringify(object)
        ) {
          return true;
        }
      }
      return false;
    };

    const toggle_switch = val => {
      if (includesObject(selected_country, item)) {
        console.log('true');
        setSelected_country(selected_country.filter(it => it.id !== item.id));
      } else {
        setSelected_country([...selected_country, item]);
      }
    };

    return (
      <View style={styles.cities_card}>
        <Text>{item.name}</Text>
        <Checkbox
          status={
            includesObject(selected_cotuntry, item) ? 'checked' : 'unchecked'
          }
          onPress={toggle_switch}
          color="red"
          uncheckedColor="black"
        />
      </View>
    );
  };

  // console.log(selected_country)

  const handleSearch = text => {
    setSearchText(text);

    const filteredData = hobbie.filter(user =>
      user.name.toLowerCase().startsWith(text.toLowerCase()),
    );

    setFilteredUsers(filteredData);
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

          <TextInput
            placeholder="Search"
            onChangeText={handleSearch}
            style={{
              width: '100%',
              marginLeft: 10,
              width: width * 0.6,
            }}
          />
        </Body>
        <TouchableOpacity onPress={handleConfirm}>
          <Text style={[styles.headerText, {color: 'rgba(26, 148, 236, 1)'}]}>
            {t('Compl')}...
          </Text>
        </TouchableOpacity>
      </Body>

      <View style={styles.countries}>
        <View
          style={{
            width: width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: width * 0.1,
            marginTop: 10,
          }}>
          <Text>Select All</Text>
          <CheckBox
            value={selected_country.length === hobbies.length ? true : false}
            tintColors={{true: 'red', false: 'black'}}
            onValueChange={() => {
              if (selected_country.length === hobbies.length) {
                setSelected_country([]);
              } else {
                setSelected_country(hobbies);
              }
            }}
          />
        </View>
        <FlatList
          data={filteredUsers ? filteredUsers : hobbies}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <Country_card item={item} index={index} />
          )}
        />
      </View>
    </Body>
  );
};

export default InterestScreen;

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
    alignItems: 'center',
  },
  countries: {
    width: width,
    height: height,
    alignItems: 'center',
  },
  cities_card: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.1,
  },
});
