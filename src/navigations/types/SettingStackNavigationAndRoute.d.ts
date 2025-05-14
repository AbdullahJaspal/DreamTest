import {CompositeNavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigation';
import {SettingStackParamsList} from './SettingStackParamsList';

export type SettingCompositeNavigationProp = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, 'SettingStackNavigation'>,
  StackNavigationProp<SettingStackParamsList>
>;
