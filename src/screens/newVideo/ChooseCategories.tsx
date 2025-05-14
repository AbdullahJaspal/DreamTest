import {
  StyleSheet,
  Modal,
  View,
  Dimensions,
  Pressable,
  TextInput,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useRef, useState, version} from 'react';
import {Image} from 'react-native';
import * as topicApi from '../../apis/topic';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {icons} from '../../assets/icons';
interface ChooseCategoriesProps {
  showCategories: boolean;
  setShowCategories: any;
  postTopic: React.MutableRefObject<string>;
}

interface TopicDetails {
  id: number;
  topic_name: string;
}
interface RenderCategoriesProps {
  item: TopicDetails;
  index: number;
}

const {width} = Dimensions.get('screen');

const ChooseCategories: React.FC<ChooseCategoriesProps> = ({
  showCategories,
  setShowCategories,
  postTopic,
}) => {
  const {t, i18n} = useTranslation();
  const data = useRef<TopicDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searched_data, setSearched_data] = useState<TopicDetails[]>([]);
  const [text_input, setText_input] = useState<string>('');

  const handleClose = () => {
    setShowCategories(false);
    setText_input('');
    setSearched_data([]);
  };

  const handleLayout = useCallback(async () => {
    try {
      const result = await topicApi.listTopics(1, 300);
      data.current = result?.data;
    } catch (error) {
      console.log('Error generated while getting categories details:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAdd = () => {
    postTopic.current = text_input;
    handleClose();
  };

  const handleSearch = async (v: any) => {
    setText_input(v);
    if (v.length > 1) {
      const result = await topicApi.searchTopics(v);
      setSearched_data(result?.data);
    } else {
      Toast.show('Enter at least 2 charachter to search...', Toast.LONG);
      setSearched_data([]);
    }
  };

  const RenderItem: React.FC<RenderCategoriesProps> = ({item, index}) => {
    const handleClick = () => {
      postTopic.current = item?.topic_name;
      handleClose();
    };

    return (
      <Pressable onPress={handleClick} style={styles.item_container}>
        <Text style={styles.item_text}>{item?.topic_name}</Text>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={showCategories}
      onRequestClose={handleClose}
      onShow={handleLayout}
      statusBarTranslucent={true}
      animationType="slide">
      <View style={styles.main_container}>
        <View style={styles.input_main_container}>
          <Pressable onPress={handleClose}>
            <Image source={icons.left} style={styles.back_button} />
          </Pressable>

          <TextInput
            placeholder={t('Search')}
            style={styles.input}
            onChangeText={handleSearch}
            value={text_input}
          />

          {text_input?.length > 2 && (
            <Pressable onPress={handleAdd}>
              <Text style={styles.add_button}>{t('Add')}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.list_container}>
          {loading ? (
            <ActivityIndicator size={'large'} color={'#000'} />
          ) : (
            <FlatList
              data={searched_data?.length > 0 ? searched_data : data.current}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <RenderItem item={item} index={index} />
              )}
              ListHeaderComponent={() => <View style={{height: 15}} />}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ChooseCategories);

const styles = StyleSheet.create({
  input_main_container: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  main_container: {
    flex: 1,
    paddingTop: 40,
  },
  back_button: {
    width: 25,
    height: 25,
  },
  input: {
    borderWidth: 0.4,
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 100,
    paddingLeft: 20,
    height: 40,
    fontSize: 14,
  },
  add_button: {
    color: 'red',
    fontSize: 15,
  },
  list_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_container: {
    width: width,
    paddingHorizontal: 30,
    marginVertical: 5,
  },
  item_text: {
    color: '#000',
    fontSize: 18,
  },
});
