import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NewVideoStackParamsList} from './NewVideoStackParamsList';
import {RootStackParamList} from '../../types/navigation';

// NewVideoScreen
export type NewVideoScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'NewVideoScreen'
>;
export type NewVideoScreenNavigationProps = NewVideoScreenProps['navigation'];
export type NewVideoScreenRouteProps = NewVideoScreenProps['route'];

// PreviewVideoScreen
export type PreviewVideoScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'PreviewVideoScreen'
>;
export type PreviewVideoScreenNavigationProps =
  PreviewVideoScreenProps['navigation'];
export type PreviewVideoScreenRouteProps = PreviewVideoScreenProps['route'];

// PostVideoScreen
export type PostVideoScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'PostVideoScreen'
>;
export type PostVideoScreenNavigationProps = PostVideoScreenProps['navigation'];
export type PostVideoScreenRouteProps = PostVideoScreenProps['route'];

// PostPictureScreen
export type PostPictureScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'PostPictureScreen'
>;
export type PostPictureScreenNavigationProps =
  PostPictureScreenProps['navigation'];
export type PostPictureScreenRouteProps = PostPictureScreenProps['route'];

// MediaPickupScreen
export type MediaPickupScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'MediaPickupScreen'
>;
export type MediaPickupScreenNavigationProps =
  MediaPickupScreenProps['navigation'];
export type MediaPickupScreenRouteProps = MediaPickupScreenProps['route'];

// SelectingCitiesScreen
export type SelectingCitiesScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'SelectingCitiesScreen'
>;
export type SelectingCitiesScreenNavigationProps =
  SelectingCitiesScreenProps['navigation'];
export type SelectingCitiesScreenRouteProps =
  SelectingCitiesScreenProps['route'];

// CoverPicScreen
export type CoverPicScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'CoverPicScreen'
>;
export type CoverPicScreenNavigationProps = CoverPicScreenProps['navigation'];
export type CoverPicScreenRouteProps = CoverPicScreenProps['route'];

// SelectingLocationScreen
export type SelectingLocationScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'SelectingLocationScreen'
>;
export type SelectingLocationScreenNavigationProps =
  SelectingLocationScreenProps['navigation'];
export type SelectingLocationScreenRouteProps =
  SelectingLocationScreenProps['route'];

// TrimVideo
export type TrimVideoScreenProps = NativeStackScreenProps<
  NewVideoStackParamsList,
  'TrimVideo'
>;
export type TrimVideoScreenNavigationProps = TrimVideoScreenProps['navigation'];
export type TrimVideoScreenRouteProps = TrimVideoScreenProps['route'];

export type NewVideoCompositeNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'NewVideoStackNavigation'>,
  StackNavigationProp<NewVideoStackNavigation>
>;
