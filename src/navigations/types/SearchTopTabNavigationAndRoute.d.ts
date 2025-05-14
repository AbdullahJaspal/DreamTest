import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {} from './SearchTopTabParamsList';

// Individual Screens
export type TopScreenProps = MaterialTopTabScreenProps<
  SearchTopTabParamsList,
  'Top'
>;
export type TopScreenNavigationProps = TopScreenProps['navigation'];
export type TopScreenRouteProps = TopScreenProps['route'];

export type UserScreenProps = MaterialTopTabScreenProps<
  SearchTopTabParamsList,
  'User'
>;
export type UserScreenNavigationProps = UserScreenProps['navigation'];
export type UserScreenRouteProps = UserScreenProps['route'];

export type VideoScreenProps = MaterialTopTabScreenProps<
  SearchTopTabParamsList,
  'Video'
>;
export type VideoScreenNavigationProps = VideoScreenProps['navigation'];
export type VideoScreenRouteProps = VideoScreenProps['route'];

export type AudioScreenProps = MaterialTopTabScreenProps<
  SearchTopTabParamsList,
  'Audio'
>;
export type AudioScreenNavigationProps = AudioScreenProps['navigation'];
export type AudioScreenRouteProps = AudioScreenProps['route'];

export type HashtagScreenProps = MaterialTopTabScreenProps<
  SearchTopTabParamsList,
  'Hashtag'
>;
export type HashtagScreenNavigationProps = HashtagScreenProps['navigation'];
export type HashtagScreenRouteProps = HashtagScreenProps['route'];
