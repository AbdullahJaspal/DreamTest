import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import * as userApi from '../../../../../apis/userApi';
import {useAppSelector} from '../../../../../store/hooks';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ConfirmModal from '../../../../../components/ConfirmModal';
import {selectMyProfileData} from '../../../../../store/selectors';
import {removeFavouriteUser} from '../../../../../store/slices/ui/indexSlice';
import FastImage from '@d11/react-native-fast-image';

interface RenderFavUsersProps {
  data?: string[];
}

interface RenderUserProps {
  item: any;
  index: number;
}

const {width, height} = Dimensions.get('screen');

const RenderFavUsers: React.FC<RenderFavUsersProps> = ({data}) => {
  const navigation = useNavigation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const my_data = useAppSelector(selectMyProfileData);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const RenderUser: React.FC<RenderUserProps> = ({item, index}) => {
    const handlePress = () => {
      navigation.navigate('UserProfileMainPage', {user_id: item?.user?.id});
    };

    const handleLongPress = () => {
      setShowConfirmModal(true);
    };

    const handleRemoveFav = async (userId: number) => {
      try {
        const data = {
          favourite_user_id: userId,
        };
        const res = await userApi.removeFavouriteUser(
          data,
          my_data?.auth_token,
        );
        console.log(res);
        dispatch(removeFavouriteUser(userId));
        if (res.data) {
          Toast.show('User Removed from Favourites', Toast.LONG);
        }
      } catch (error) {
        console.error('Error adding favorite user:', error);
      } finally {
        setShowConfirmModal(false);
      }
    };

    return (
      <>
        <Pressable
          style={styles.main_container}
          onPress={handlePress}
          onLongPress={handleLongPress}>
          <View style={styles.left_container_sound}>
            <FastImage
              source={{uri: item?.user?.profile_pic}}
              style={styles.sound_pic}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.author_details_view}>
              <Text>Author: {item?.user?.nickname}</Text>
              <Text>{item?.user?.username}</Text>
            </View>
          </View>

          <View>
            <AntDesign name="right" size={15} color={'#000'} />
          </View>
        </Pressable>

        <ConfirmModal
          visible={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => handleRemoveFav(item?.user?.id)}
          title={t('Remove from favorites')}
          message={t(
            'Are you sure you want to remove this post from favorites?',
          )}
          confirmText={t('Remove')}
          confirmColor="#fff"
          cancelText={t('Cancel')}
        />
      </>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => <RenderUser item={item} index={index} />}
    />
  );
};

export default RenderFavUsers;

const styles = StyleSheet.create({
  main_container: {
    width: width,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sound_pic: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  left_container_sound: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author_details_view: {
    marginLeft: 15,
  },
  player_details: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
