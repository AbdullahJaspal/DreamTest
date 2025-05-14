import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {getAvatar} from '../../../../apis/avatarApi';
import {updateProfile} from '../../../../apis/userApi';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AvatarScreenNavigationProps} from '../../../../types/screenNavigationAndRoute';
import Toast from 'react-native-simple-toast';
import {update_profile_pic} from '../../../../store/slices/user/my_dataSlice';
import FastImage from '@d11/react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {useAppSelector} from '../../../../store/hooks';
import {selectMyProfileData} from '../../../../store/selectors';
import Header from '../components/Header';

interface AvatarListProps {
  avatar_url: string;
  createdAt: string;
  id: number;
  updatedAt: string;
}

const AvatarItem: React.FC<{
  item: AvatarListProps;
  isSelected: boolean;
  onPress: () => void;
}> = ({item, isSelected, onPress}) => {
  const {t, i18n} = useTranslation();

  const [imageLoaded, setImageLoaded] = useState(false);
  const uri = `https://dpcst9y3un003.cloudfront.net/${item.avatar_url}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.avatar,
        isSelected && {borderColor: 'red', borderWidth: 2},
      ]}>
      {!imageLoaded && (
        <ActivityIndicator
          size="small"
          color="gray"
          style={styles.image_loader}
        />
      )}
      <FastImage
        source={{uri}}
        style={styles.avatar_image}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          Toast.show(t('Failed to load avatar'), Toast.SHORT);
        }}
      />
    </TouchableOpacity>
  );
};

const Avatar: React.FC = () => {
  const {t, i18n} = useTranslation();

  const [avatarList, setAvatarList] = useState<AvatarListProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarListProps>();
  const my_data = useAppSelector(selectMyProfileData);
  const navigation = useNavigation<AvatarScreenNavigationProps>();
  const dispatch = useDispatch();

  const handleGetAvatar = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAvatar();
      setAvatarList(result.data.payload);
    } catch (error) {
      console.error('Failed to fetch avatars:', error);
      Toast.show('Failed to fetch avatars. Please try again.', Toast.SHORT);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetAvatar();
  }, [handleGetAvatar]);

  // pre load the avatar
  useEffect(() => {
    const avatarUris = avatarList.map(avatar => ({
      uri: `https://dpcst9y3un003.cloudfront.net/${avatar.avatar_url}`,
    }));
    FastImage.preload(avatarUris);
  }, [avatarList]);

  const handleAvatarSave = async () => {
    try {
      const data = {
        name: 'profile_pic',
        value: `https://dpcst9y3un003.cloudfront.net/${selectedAvatar?.avatar_url}`,
      };
      const result = await updateProfile(my_data?.auth_token, data);
      Toast.show(result?.message, Toast.SHORT);
      dispatch(update_profile_pic(data.value));
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Toast.show(
        'Failed to update profile picture. Please try again.',
        Toast.SHORT,
      );
    }
  };

  const renderAvatarItem = useCallback(
    ({item}: {item: AvatarListProps}) => (
      <AvatarItem
        item={item}
        isSelected={selectedAvatar?.id === item.id}
        onPress={() => setSelectedAvatar(item)}
      />
    ),
    [selectedAvatar],
  );

  return (
    <SafeAreaView style={styles.main_container}>
      <Header
        headertext={t('Avatar List')}
        thirdButton={true}
        onPress={handleAvatarSave}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={avatarList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderAvatarItem}
          numColumns={4}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty_list}>{t('No avatars found')}</Text>
          }
          ListFooterComponent={
            <Text style={styles.empty_list}>{t('No more avatars found')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatar: {
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: 'red',
    padding: 2,
  },
  avatar_image: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  empty_list: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 40,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_loader: {
    position: 'absolute',
    zIndex: 1,
  },
});
