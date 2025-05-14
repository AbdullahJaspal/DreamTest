import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ProfileImage from '../../../../components/ProfileImage';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

interface SuggestedtUserListProps {
  item: UserProfile;
  index: number;
}

interface UserProfile {
  id: number;
  nickname: string;
  profile_pic: string;
  username: string;
}

const {width} = Dimensions.get('screen');

const SuggestedtUserList: React.FC<SuggestedtUserListProps> = ({
  item,
  index,
}) => {
  const navigation = useNavigation();

  const handleProfilePress = async () => {
    navigation.navigate('UserProfileMainPage', {user_id: item?.user?.id});
  };

  return (
    <View style={styles.main_container}>
      <ProfileImage uri={item?.profile_pic} onPress={handleProfilePress} />

      <View style={styles.text_container}>
        <Text>{item.username}</Text>
        <Text>{item.nickname}</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.button_txt}>Following</Text>
      </Pressable>

      <Pressable style={styles.cross_button}>
        <Entypo name="cross" size={12} />
      </Pressable>
    </View>
  );
};

export default SuggestedtUserList;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingLeft: 30,
  },
  button: {
    width: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    backgroundColor: 'red',
  },
  button_txt: {
    color: '#fff',
    fontWeight: '600',
  },
  cross_button: {
    // width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_container: {
    width: width - 230,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
