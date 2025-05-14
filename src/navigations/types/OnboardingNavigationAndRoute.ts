import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamsList} from '../types/OnboardingStackParamList';

// LoginMainScreen
export type LoginMainScreenProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'LoginMainScreen'
>;
export type LoginMainScreenNavigationProps = LoginMainScreenProps['navigation'];
export type LoginMainScreenRouteProps = LoginMainScreenProps['route'];

// AccountScreen
export type AccountScreenProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'AccountScreen'
>;
export type AccountScreenNavigationProps = AccountScreenProps['navigation'];
export type AccountScreenRouteProps = AccountScreenProps['route'];

// ChooseAccount
export type ChooseAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'ChooseAccount'
>;
export type ChooseAccountNavigationProps = ChooseAccountProps['navigation'];
export type ChooseAccountRouteProps = ChooseAccountProps['route'];

// ChooseBasicAccount
export type ChooseBasicAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'ChooseBasicAccount'
>;
export type ChooseBasicAccountNavigationProps =
  ChooseBasicAccountProps['navigation'];
export type ChooseBasicAccountRouteProps = ChooseBasicAccountProps['route'];

// ChoosePremiumAccount
export type ChoosePremiumAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'ChoosePremiumAccount'
>;
export type ChoosePremiumAccountNavigationProps =
  ChoosePremiumAccountProps['navigation'];
export type ChoosePremiumAccountRouteProps = ChoosePremiumAccountProps['route'];

// ChooseBusinessAccount
export type ChooseBusinessAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'ChooseBusinessAccount'
>;
export type ChooseBusinessAccountNavigationProps =
  ChooseBusinessAccountProps['navigation'];
export type ChooseBusinessAccountRouteProps =
  ChooseBusinessAccountProps['route'];

// BasicAccount
export type BasicAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'BasicAccount'
>;
export type BasicAccountNavigationProps = BasicAccountProps['navigation'];
export type BasicAccountRouteProps = BasicAccountProps['route'];

// PremiumAccount
export type PremiumAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'PremiumAccount'
>;
export type PremiumAccountNavigationProps = PremiumAccountProps['navigation'];
export type PremiumAccountRouteProps = PremiumAccountProps['route'];

// BusinessAccount
export type BusinessAccountProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'BusinessAccount'
>;
export type BusinessAccountNavigationProps = BusinessAccountProps['navigation'];
export type BusinessAccountRouteProps = BusinessAccountProps['route'];

// BottomSheetSocialAuth
export type BottomSheetSocialAuthProps = NativeStackScreenProps<
  OnboardingStackParamsList,
  'BottomSheetSocialAuth'
>;
export type BottomSheetSocialAuthNavigationProps =
  BottomSheetSocialAuthProps['navigation'];
export type BottomSheetSocialAuthRouteProps =
  BottomSheetSocialAuthProps['route'];
