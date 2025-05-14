import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

import ItemSearchHistory from '../../../components/item/ItemSearchHistory';
import ItemSearchTrend from '../../../components/item/ItemSearchTrend';
import Title from './Title';

import {COLOR, SPACING} from '../../../configs/styles';
import {KEY_STORAGE} from '../../../constants/constants';
import {setTxtSearch} from '../../../store/slices/common/searchSlice';

const DefaultSearch = () => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const [searchHis, setSearchHis] = useState([]);

  const fetchSearchHis = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(KEY_STORAGE.SEARCH_HIS);
      if (data) {
        setSearchHis(JSON.parse(data).reverse());
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchSearchHis();
  }, [fetchSearchHis]);

  const handleRemoveSearchHis = useCallback(
    async (index: number) => {
      try {
        const newSearchHis = [...searchHis];
        newSearchHis.splice(index, 1);
        setSearchHis(newSearchHis);
        await AsyncStorage.setItem(
          KEY_STORAGE.SEARCH_HIS,
          JSON.stringify(newSearchHis),
        );
      } catch (error) {
        console.log(error);
      }
    },
    [searchHis],
  );

  return (
    <View style={styles.container}>
      {/* Display only the first 5 search history items */}
      {searchHis?.slice(0, 5).map((s, i) => {
        return (
          <ItemSearchHistory
            key={i}
            text={s}
            handleRemoveSearchHis={() => handleRemoveSearchHis(i)}
            onPress={() => dispatch(setTxtSearch(s))}
          />
        );
      })}

      <Title label={t('Recommended search')} />
      <ItemSearchTrend
        text={t('football match schedule')}
        dotColor={COLOR.DANGER}
      />
      <ItemSearchTrend
        text={t('Funny statuses love life')}
        dotColor={COLOR.DANGER2}
      />
      <ItemSearchTrend text={t('Best mood music')} dotColor={COLOR.TOMATO} />
      <ItemSearchTrend
        text={t('Current trends on dream')}
        dotColor={COLOR.ORANGE}
      />
      <ItemSearchTrend text={t('hairstyle for men')} />
    </View>
  );
};

export default React.memo(DefaultSearch);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.S4,
  },
});
