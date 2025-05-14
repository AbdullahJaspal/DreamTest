import {View, Text, Image, Dimensions, StyleSheet} from 'react-native';
import React from 'react';
import BiggerProfileImage from '../../../components/BiggerProfileImage';
import {capitalize} from '../../../utils/captalize';
import {formatNumber} from '../../../utils/formatNumber';
import {truncateText} from '../../../utils/truncateText';
import {HomeScreenNavigationProps} from '../../../types/screenNavigationAndRoute';
import {useNavigation} from '@react-navigation/native';
import {icons} from '../../../assets/icons';

const {width} = Dimensions.get('screen');

interface TopThreeViewProps {
  data: any[];
}

const TopThreeView: React.FC<TopThreeViewProps> = ({data}) => {
  const navigation = useNavigation<HomeScreenNavigationProps>();

  const handleProfileClick = (id: any) => {
    if (id) {
      navigation.navigate('UserProfileMainPage', {user_id: id});
    }
  };

  const handleTop1ProfileClick = () => {
    handleProfileClick(data[0]?.user.id);
  };

  const handleTop2ProfileClick = () => {
    handleProfileClick(data[1]?.user.id);
  };

  const handleTop3ProfileClick = () => {
    handleProfileClick(data[2]?.user.id);
  };

  return (
    <View style={styles.top_three_viewers}>
      <View style={styles.second_user_card}>
        <Text style={[styles.super_rank_text, styles.top_2_txt_color]}>2</Text>
        <View style={styles.card_view}>
          <BiggerProfileImage
            uri={data[1]?.user?.profile_pic}
            coverPic={icons.rank2}
            onPress={handleTop2ProfileClick}
          />
          <Text style={styles.super_name_test}>
            {capitalize(truncateText(data[1]?.user.username, 7))}
          </Text>
          <View style={styles.coin_with_text}>
            <Image source={icons.coin} style={styles.coin_img} />
            <Text style={styles.coins_text}>
              {formatNumber(data[1]?.diamonds)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.first_user_card}>
        <Text style={[styles.super_rank_text, styles.top_1_txt_color]}>1</Text>
        <View style={styles.card_view}>
          <BiggerProfileImage
            uri={data[0]?.user.profile_pic}
            coverPic={icons.rank3}
            onPress={handleTop1ProfileClick}
          />
          <Text style={styles.super_name_test}>
            {capitalize(truncateText(data[0]?.user.username, 7))}
          </Text>
          <View style={styles.coin_with_text}>
            <Image source={icons.coin} style={styles.coin_img} />
            <Text style={styles.coins_text}>
              {formatNumber(data[0]?.diamonds)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.second_user_card}>
        <Text style={[styles.super_rank_text, styles.top_3_txt_color]}>3</Text>
        <View style={styles.card_view}>
          <BiggerProfileImage
            uri={data[2]?.user.profile_pic}
            coverPic={icons.rank1}
            onPress={handleTop3ProfileClick}
          />
          <Text style={styles.super_name_test}>
            {capitalize(truncateText(data[2]?.user?.username, 7))}
          </Text>
          <View style={styles.coin_with_text}>
            <Image source={icons.coin} style={styles.coin_img} />
            <Text style={styles.coins_text}>
              {formatNumber(data[2]?.diamonds)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(TopThreeView);

const styles = StyleSheet.create({
  coin_img: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  coins_text: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: '600',
    fontSize: 12,
  },
  rank_text: {
    color: '#020202',
    fontSize: 16,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  top_three_viewers: {
    width: width,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 10,
    marginBottom: 10,
  },
  second_user_card: {
    backgroundColor: '#f1f1f1',
    width: width / 3.5,
    height: width / 3.5 + 25,
    marginHorizontal: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    alignItems: 'center',
  },
  first_user_card: {
    backgroundColor: '#f1f1f1',
    width: width / 3.5,
    height: width / 3.5 + 35,
    marginHorizontal: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    alignItems: 'center',
  },
  super_rank_text: {
    fontSize: 40,
    fontWeight: 'bold',
    marginLeft: 5,
    position: 'absolute',
    right: 5,
    top: -5,
  },
  card_view: {
    alignItems: 'center',
    marginTop: 20,
  },
  super_name_test: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '800',
    fontSize: 14,
    marginTop: 12,
  },
  coin_with_text: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top_container: {
    flex: 1,
  },
  top_1_txt_color: {
    color: '#591613',
  },
  top_3_txt_color: {
    color: '#548a25',
  },
  top_2_txt_color: {
    color: 'grey',
  },
});
