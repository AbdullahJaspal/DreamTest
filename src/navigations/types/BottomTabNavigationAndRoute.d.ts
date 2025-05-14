import {BottomTabParamsList} from './BottomTabParamsList';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

// HomeStackNavigation
export type HomeStackNavigationProps = BottomTabScreenProps<
  BottomTabParamsList,
  'HomeStackNavigation'
>;
export type HomeStackNavigationNavigationProps =
  HomeStackNavigationProps['navigation'];
export type HomeStackNavigationRouteProps = HomeStackNavigationProps['route'];

// DiscoverScreen
export type DiscoverScreenProps = BottomTabScreenProps<
  BottomTabParamsList,
  'DiscoverScreen'
>;
export type DiscoverScreenNavigationProps = DiscoverScreenProps['navigation'];
export type DiscoverScreenRouteProps = DiscoverScreenProps['route'];

// NewVideoScreen
export type NewVideoStackNavigationProps = BottomTabScreenProps<
  BottomTabParamsList,
  'NewVideoStackNavigation'
>;
export type NewVideoStackNavigationNavigationProps =
  NewVideoStackNavigationProps['navigation'];
export type NewVideoStackNavigationRouteProps =
  NewVideoStackNavigationProps['route'];

// InboxStackNavigation
export type InboxStackNavigationProps = BottomTabScreenProps<
  BottomTabParamsList,
  'InboxStackNavigation'
>;
export type InboxStackNavigationNavigationProps =
  InboxStackNavigationProps['navigation'];
export type InboxStackNavigationRouteProps = InboxStackNavigationProps['route'];

// ProfileStackNavigation
export type ProfileStackNavigationProps = BottomTabScreenProps<
  BottomTabParamsList,
  'ProfileStackNavigation'
>;
export type ProfileStackNavigationNavigationProps =
  ProfileStackNavigationProps['navigation'];
export type ProfileStackNavigationRouteProps =
  ProfileStackNavigationProps['route'];
