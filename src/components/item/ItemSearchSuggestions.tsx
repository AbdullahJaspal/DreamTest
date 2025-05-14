import React, {Dispatch, SetStateAction} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {BORDER, COLOR, SPACING, TEXT} from '../../configs/styles';

import {setTxtSearch} from '../../store/slices/common/searchSlice';
import {UserProfile} from '../../types/UserProfileData';
import {DiscoverScreenNavigationProps} from '../../types/screenNavigationAndRoute';

import Icon from '../Icon';
import CText from '../CText';
import ProfileImage from '../ProfileImage';
import {icons} from '../../assets/icons';

interface ItemSearchSuggestionsProps {
  item: UserProfile;
  setIsFocus: Dispatch<SetStateAction<boolean>>;
}

const ItemSearchSuggestions: React.FC<ItemSearchSuggestionsProps> = ({
  item,
  setIsFocus,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<DiscoverScreenNavigationProps>();

  function handleProfilePress(): void {
    navigation.navigate('UserProfileMainPage', {user_id: item.id});
  }

  function handleSearchPress(): void {
    dispatch(setTxtSearch(item.nickname));
    setIsFocus(false);
  }

  return (
    <Pressable style={styles.container} onPress={handleSearchPress}>
      <Icon
        source={icons.search}
        tintColor={COLOR.setOpacity(COLOR.BLACK, 0.6)}
        height={22}
        width={22}
      />
      <CText
        flex={1}
        marginLeft={SPACING.S2}
        text={TEXT.REGULAR}
        color={COLOR.setOpacity(COLOR.BLACK, 0.8)}
        fontSize={16}
        numberOfLines={1}>
        {`${item.nickname} (@${item.username})`}
      </CText>
      <View style={styles.avatar}>
        <ProfileImage
          uri={item?.profile_pic}
          allowCover={false}
          onPress={handleProfilePress}
        />
      </View>
      <Icon
        source={icons.topLeft}
        tintColor={COLOR.setOpacity(COLOR.BLACK, 0.6)}
        height={22}
        width={22}
        onPress={handleSearchPress}
      />
    </Pressable>
  );
};

export default ItemSearchSuggestions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.S1,
    alignItems: 'center',
    marginVertical: 5,
  },
  txt: {
    flex: 1,
    marginLeft: SPACING.S2,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: BORDER.PILL,
    marginRight: SPACING.S4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
