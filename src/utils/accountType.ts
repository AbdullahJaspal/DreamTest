import {AccountType} from '../enum/accountTypes';
import {ImageProps} from 'react-native';
import {UserProfile} from '../types/UserProfileData';
import {icons} from '../assets/icons';

// Function to get the badge icon based on user data
export const accountTypeBadge = (
  user_data: UserProfile | null,
): AccountType | null => {
  // const badgeType: AccountType | null =
  //   user_data?.badge?.verified && user_data?.badge?.Badge_type
  //     ? user_data?.badge?.Badge_type
  //     : null;
  // return badgeType;
  const badgeType: AccountType | null = user_data?.badge?.Badge_type
    ? user_data?.badge?.Badge_type
    : null;
  return badgeType;
};

export const badgeIcon = (badgeType: AccountType | null): ImageProps | null => {
  if (!badgeType) return null;

  switch (badgeType) {
    case AccountType.TOP_ONE_ACCOUNT:
      return icons.verification;
    case AccountType.BUSINESS_ACCOUNT:
      return icons.businessVerification;
    case AccountType.PREMIUM_ACCOUNT:
      return icons.premiumVerification;
    case AccountType.AGENT_ACCOUNT:
      return icons.agentVerification;
    case AccountType.SIMPLE_ACCOUNT:
      return icons.simpleVerification;
    default:
      return null;
  }
};
