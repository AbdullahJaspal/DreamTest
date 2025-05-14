import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfile from '../screens/profile/edit_profile/EditProfile';
import ProfileCity from '../screens/profile/edit_profile/ProfileCity';
import ProfileCountry from '../screens/profile/edit_profile/ProfileCountry';
import Avatar from '../screens/profile/profile/screen/Avatar';
import Hobbies from '../screens/profile/profile/screen/Hobbies';
import Industries from '../screens/profile/profile/screen/Industries';
import Making_friend_intention from '../screens/profile/profile/screen/Making_friend_intention';
import MasteryOfLanguage from '../screens/profile/profile/screen/MasteryOfLanguage';
import Occupation from '../screens/profile/profile/screen/Occupation';

const ProfileStack = createNativeStackNavigator();

const ProfileStackNavigation: React.FC = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
      <ProfileStack.Screen name="ProfileCity" component={ProfileCity} />
      <ProfileStack.Screen name="ProfileCountry" component={ProfileCountry} />
      <ProfileStack.Screen name="Avatar" component={Avatar} />
      <ProfileStack.Screen name="Hobbies" component={Hobbies} />
      <ProfileStack.Screen name="Industries" component={Industries} />
      <ProfileStack.Screen
        name="Making_friend_intention"
        component={Making_friend_intention}
      />
      <ProfileStack.Screen
        name="MasteryOfLanguage"
        component={MasteryOfLanguage}
      />
      <ProfileStack.Screen name="Occupation" component={Occupation} />
    </ProfileStack.Navigator>
  );
};

export default React.memo(ProfileStackNavigation);
