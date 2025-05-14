import {StyleSheet, View} from 'react-native';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {COLOR, SPACING} from '../../../configs/styles';
import ListView from '../../../components/ListView';
import ItemSearchSuggestions from '../../../components/item/ItemSearchSuggestions';
import * as userApi from '../../../apis/userApi';
import {useAppSelector} from '../../../store/hooks';
import {
  selectMyPrivacy,
  selectMyProfileData,
  selectTxtSearch,
} from '../../../store/selectors';

interface SuggestionsSearchProps {
  setIsFocus: Dispatch<SetStateAction<boolean>>;
}

const SuggestionsSearch: React.FC<SuggestionsSearchProps> = ({setIsFocus}) => {
  const txtSearch = useAppSelector(selectTxtSearch);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [data, setData] = useState([]);
  const my_data = useAppSelector(selectMyProfileData);

  const fetchData = async (text: string) => {
    try {
      const search = await userApi.searchSuggestion(
        my_data?.auth_token,
        text,
        1,
        10,
      );
      setData(search?.payload);
    } catch (error) {
      console.log('Error while doing search suggestion', error);
    }
  };

  useEffect(() => {
    if (txtSearch?.length > 0) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        fetchData(txtSearch);
      }, 500);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [txtSearch]);

  return (
    <View style={styles.container}>
      <ListView
        data={data}
        renderItem={({item}) => (
          <ItemSearchSuggestions item={item} setIsFocus={setIsFocus} />
        )}
      />
    </View>
  );
};

export default SuggestionsSearch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: SPACING.S4,
    flex: 1,
  },
});
