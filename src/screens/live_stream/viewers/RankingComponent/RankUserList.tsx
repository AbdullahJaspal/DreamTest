import {
  Dimensions,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {JSXElementConstructor, ReactElement} from 'react';
import {UserRankData} from '../types/ranking';
import ProfileImage from '../../component/ProfileImage';
import {truncateText} from '../../../../utils/truncateText';
import {formatNumber} from '../../../../utils/formatNumber';
import {HomeScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

export default function RankUserList(
  info: ListRenderItemInfo<UserRankData>,
): ReactElement<any, string | JSXElementConstructor<any>> | null {
  const {item, index} = info;
  const navigation = useNavigation<HomeScreenNavigationProps>();

  function handleProfilePress(): void {
    navigation.navigate('UserProfileMainPage', {user_id: item.user.id});
  }

  return (
    <View style={styles.ranking_list_main_container}>
      <View style={[styles.left_view, {}]}>
        <Text style={styles.rank_text}>{index + 4}</Text>
        <View style={{width: 60}}>
          <ProfileImage
            uri={item?.user.profile_pic}
            onPress={handleProfilePress}
          />
        </View>
        <Text style={styles.name_text}>
          {truncateText(item?.user?.username?.toUpperCase(), 10)}
        </Text>
      </View>
      <Text style={styles.diamond_text}>{formatNumber(item?.diamonds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ranking_list_main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingRight: 20,
  },
  left_view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.6,
    justifyContent: 'space-evenly',
  },
  rank_text: {
    color: '#020202',
    fontSize: 16,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  name_text: {
    color: '#020202',
    fontWeight: '500',
    fontSize: 14,
    width: width * 0.35,
    textAlign: 'left',
  },
  diamond_text: {
    color: '#020202',
    fontWeight: '500',
    fontSize: 14,
  },
});
