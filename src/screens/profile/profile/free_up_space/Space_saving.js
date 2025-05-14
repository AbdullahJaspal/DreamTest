import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';

const {width, height} = Dimensions.get('screen');

const Space_saving = () => {
  const {t, i18n} = useTranslation();

  const [cacheData, setCacheData] = useState([
    {
      id: 1,
      type: t('Space Cache'),
      description:
        'Clearing this cache does not interfere with your Dream project.',
      key: '@cache/space',
      isDeleteAllEnabled: false,
    },
    {
      id: 2,
      type: t('Downloads'),
      description:
        'Clearing this cache does not interfere with your Dream project.',
      key: '@cache/downloads',
      isDeleteAllEnabled: false,
    },
    {
      id: 3,
      type: t('Saving Data Space Dream'),
      description:
        'If you enable this option, you will delete all the storages in your account, including your name. Your account remains working on Dream.',
      key: '@cache/spaceDream',
      isDeleteAllEnabled: false,
    },
  ]);

  useEffect(() => {
    updateCacheNumbers();
  }, []);

  const updateCacheNumbers = async () => {
    try {
      const updatedCacheData = await Promise.all(
        cacheData.map(async item => {
          const cacheValue = await AsyncStorage.getItem(item.key);
          return {...item, cache: cacheValue ? parseInt(cacheValue) : 0};
        }),
      );
      setCacheData(updatedCacheData);
    } catch (error) {
      console.error('Error fetching cache numbers:', error);
    }
  };

  const handleWipeCache = async type => {
    try {
      const selectedCache = cacheData.find(item => item.type === type);

      switch (type) {
        case 'Space Cache':
        case 'Downloads':
          await AsyncStorage.removeItem(selectedCache.key);
          break;

        case 'Saving Data Space Dream':
          if (selectedCache.isDeleteAllEnabled) {
            // Example: Clear all relevant AsyncStorage keys
            const keysToDelete = [
              '@userData/name',
              '@userData/details' /* add other keys */,
            ];

            await Promise.all(
              keysToDelete.map(async key => {
                await AsyncStorage.removeItem(key);
              }),
            );

            setCacheData(prevData =>
              prevData.map(item =>
                item.type === type
                  ? {...item, isDeleteAllEnabled: false}
                  : item,
              ),
            );

            Alert.alert(
              'Data Deleted',
              'All storages and details deleted successfully',
            );
          } else {
            Alert.alert(
              'Info',
              'Please enable the option to delete all storages and details.',
            );
          }
          break;

        default:
          break;
      }

      setCacheData(prevData =>
        prevData.map(item => (item.type === type ? {...item, cache: 0} : item)),
      );

      Alert.alert('Cache Wiped', `${type} cache wiped successfully`);
    } catch (error) {
      console.error(`Error wiping ${type} cache:`, error);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.container}>
      <View style={{marginTop: 15, borderBottomWidth: 0.5}}>
        <View style={styles.cache_wipe}>
          <Text style={styles.no_txt}>{item.type}</Text>
          <Text style={styles.no_txt}>
            {t('Cache')}: {t(item.cache)}
          </Text>
          {item.type === 'Saving Data Space Dream' && (
            <TouchableOpacity
              style={styles.toggle}
              onPress={() => handleToggleDeleteAll(item.type)}>
              <Text style={styles.toggleText}>
                {item.isDeleteAllEnabled ? 'Disable' : 'Enable'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.wipe}
            onPress={() => handleWipeCache(item.type)}>
            <Text style={styles.wipe_txt}>{t('Wipe')}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: width * 0.9,
            alignSelf: 'center',
            paddingVertical: 20,
          }}>
          <Text style={styles.txt_btw}>{t(item.description)}</Text>
        </View>
      </View>
    </View>
  );

  const handleToggleDeleteAll = type => {
    setCacheData(prevData =>
      prevData.map(item =>
        item.type === type
          ? {...item, isDeleteAllEnabled: !item.isDeleteAllEnabled}
          : item,
      ),
    );
  };

  return (
    <View style={styles.main_container}>
      <Header headertext={t('Space saving')} />
      <FlatList
        data={cacheData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    backgroundColor: '#fff',
    flex: 1,
  },
  cache_wipe: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
    alignSelf: 'center',
  },
  toggle: {
    backgroundColor: '#3498db',
    width: width * 0.15,
    height: height * 0.032,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleText: {
    color: '#fff',
    fontWeight: '500',
  },
  wipe: {
    backgroundColor: '#a7acb5',
    width: width * 0.15,
    height: height * 0.032,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  wipe_txt: {
    color: '#fff',
    fontWeight: '500',
  },
  no_txt: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  txt_btw: {
    fontWeight: '500',
  },
});

export default Space_saving;
