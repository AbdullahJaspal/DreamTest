import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewVideoScreen from '../screens/newVideo/NewVideoScreen';
import PreviewVideoScreen from '../screens/newVideo/PreviewVideoScreen';
import PostVideoScreen from '../screens/newVideo/PostVideoScreen';
import PostPictureScreen from '../screens/newVideo/PostPictureScreen';
import MediaPickupScreen from '../screens/newVideo/MediaPickupScreen';
import CoverPicScreen from '../screens/newVideo/CoverPicScreen';
import SelectingCitiesScreen from '../screens/newVideo/SelectingCitiesScreen';
import SelectingLocationScreen from '../screens/newVideo/SelectingLocationScreen';
import {NewVideoStackParamsList} from './types/NewVideoStackParamsList';
import TrimVideo from '../screens/newVideo/TrimVideo';

const NewVideoStack = createNativeStackNavigator<NewVideoStackParamsList>();

const NewVideoStackNavigation: React.FC = () => {
  return (
    <NewVideoStack.Navigator
      initialRouteName="NewVideoScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <NewVideoStack.Screen name="NewVideoScreen" component={NewVideoScreen} />
      <NewVideoStack.Screen
        name="PreviewVideoScreen"
        component={PreviewVideoScreen}
      />
      <NewVideoStack.Screen
        name="PostVideoScreen"
        component={PostVideoScreen}
      />
      <NewVideoStack.Screen
        name="PostPictureScreen"
        component={PostPictureScreen}
      />
      <NewVideoStack.Screen
        name="MediaPickupScreen"
        component={MediaPickupScreen}
      />
      <NewVideoStack.Screen name="CoverPicScreen" component={CoverPicScreen} />
      <NewVideoStack.Screen
        name="SelectingCitiesScreen"
        component={SelectingCitiesScreen}
      />
      <NewVideoStack.Screen
        name="SelectingLocationScreen"
        component={SelectingLocationScreen}
      />
      <NewVideoStack.Screen name="TrimVideo" component={TrimVideo} />
    </NewVideoStack.Navigator>
  );
};

export default React.memo(NewVideoStackNavigation);
