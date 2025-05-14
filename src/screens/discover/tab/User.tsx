import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {COLOR, SPACING} from '../../../configs/styles';
import ItemUser from '../../../components/item/ItemUser';
import ListView from '../../../components/ListView';
import {useIsFocused} from '@react-navigation/native';
import * as searchApi from '../../../apis/searchApi';
import EmptyScreen from '../../../utils/emptyScreen';
import {icons} from '../../../assets/icons';
import {selectTxtSearch} from '../../../store/selectors';
import {useAppSelector} from '../../../store/hooks';

const User: React.FC = () => {
  const isFocusTab = useIsFocused();
  const [loading, setLoading] = useState(false);
  const txtSearch = useAppSelector(selectTxtSearch);

  const [users, setUsers] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const getUser = await searchApi.searchUser(txtSearch);
      const listUser = getUser.data.map(
        (e: {
          profile_pic: any;
          nickname: any;
          username: any;
          totalVideo: any;
        }) => {
          const u = {
            avatar: e.profile_pic,
            name: e.nickname,
            userName: e.username,
            follow: '14.9k',
            numVideo: e.totalVideo,
            ...e,
          };
          return u;
        },
      );
      setUsers(listUser);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [txtSearch]);

  useEffect(() => {
    if (isFocusTab) {
      fetchData();
    }
  }, [isFocusTab, fetchData]);

  return (
    <View style={styles.container}>
      {!loading && users.length === 0 && (
        <EmptyScreen
          message="You're all caught up!"
          imageSource={icons.user}
          imageStyle={{tintColor: '#ccc'}} // Example of overriding styles
        />
      )}
      {loading ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size={'large'} color={'#000'} />
        </View>
      ) : (
        <ListView
          data={users}
          renderItem={({item}) => <ItemUser item={item} />}
        />
      )}
    </View>
  );
};

export default React.memo(User);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: SPACING.S4,
    paddingTop: SPACING.S2,
  },
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
