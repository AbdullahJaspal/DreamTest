import {Image, StyleSheet, ImageStyle, TouchableOpacity} from 'react-native';
import React from 'react';
import {UserProfile} from '../types/UserProfileData';
import {accountTypeBadge} from '../utils/accountType';
import {AccountType} from '../enum/accountTypes';
import {useDispatch} from 'react-redux';
import {
  setBadgeType,
  toggleBadgeModal,
} from '../store/slices/common/locationSlice';
import {icons} from '../assets/icons';

interface BadgeProps {
  user_data?: UserProfile;
  style?: ImageStyle;
}

const Badge: React.FC<BadgeProps> = ({user_data, style}) => {
  const dispatch = useDispatch();
  // If no user data is provided, render nothing
  if (!user_data) return null;
  // Get the badge image for the user
  const badgeImage = accountTypeBadge(user_data);
  // console.log(badgeImage,'badgeImage')
  // If no badge is found, render nothing
  if (!badgeImage) return null;

  function handleBadgePress(): void {
    if (badgeImage) {
      dispatch(toggleBadgeModal(true));
      dispatch(setBadgeType(badgeImage));
    }
  }

  switch (badgeImage) {
    case AccountType.TOP_ONE_ACCOUNT:
      return (
        <TouchableOpacity onPress={handleBadgePress}>
          <Image
            source={icons.verification}
            style={[styles.top_one_badge, style]}
          />
        </TouchableOpacity>
      );
    case AccountType.BUSINESS_ACCOUNT:
      return (
        <TouchableOpacity onPress={handleBadgePress}>
          <Image
            source={icons.businessVerification}
            style={[styles.business_badge, style]}
          />
        </TouchableOpacity>
      );
    case AccountType.PREMIUM_ACCOUNT:
      return (
        <TouchableOpacity onPress={handleBadgePress}>
          <Image
            source={icons.premiumVerification}
            style={[styles.premium_badge, style]}
          />
        </TouchableOpacity>
      );
    case AccountType.AGENT_ACCOUNT:
      return (
        <TouchableOpacity onPress={handleBadgePress}>
          <Image
            source={icons.agentVerification}
            style={[styles.agent_badge, style]}
          />
        </TouchableOpacity>
      );
    case AccountType.SIMPLE_ACCOUNT:
      return (
        <TouchableOpacity onPress={handleBadgePress}>
          <Image
            source={icons.simpleVerification}
            style={[styles.simple_badge, style]}
          />
        </TouchableOpacity>
      );
    default:
      return null;
  }
};

export default Badge;

const styles = StyleSheet.create({
  top_one_badge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'center',
  },
  business_badge: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'center',
  },
  premium_badge: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'center',
  },
  agent_badge: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'center',
  },
  simple_badge: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
});
