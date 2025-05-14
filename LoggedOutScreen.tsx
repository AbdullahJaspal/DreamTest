import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginMainScreen from './src/screens/login/LoginMainScreen';
import AccountScreen from './src/screens/profile/profile/screen/AccountScreen';
import ChooseAccount from './src/screens/profile/profile/screen/ChooseAccount';
import ChooseBasicAccount from './src/screens/profile/profile/screen/ChooseBasicAccount';
import ChoosePremiumAccount from './src/screens/profile/profile/screen/ChoosePremiumAccount';
import ChooseBusinessAccount from './src/screens/profile/profile/screen/ChooseBusinessAccount';
import BasicAccount from './src/screens/profile/profile/screen/BasicAccount';
import PremiumAccount from './src/screens/profile/profile/screen/PremiumAccount';
import BusinessAccount from './src/screens/profile/profile/screen/BusinessAccount';
import BottomSheetSocialAuth from './src/components/bottomSheets/BottomSheetSocialAuth';

const Stack = createNativeStackNavigator();

const LoggedOutScreen: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginMainScreen"
        component={LoginMainScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AccountScreen"
        component={AccountScreen}
        options={{
          headerShown: false,
          title: 'Insight',
        }}
      />

      <Stack.Screen
        name="ChooseAccount"
        component={ChooseAccount}
        options={{
          headerShown: false,
          title: 'Insight',
        }}
      />

      <Stack.Screen
        name="ChooseBasicAccount"
        component={ChooseBasicAccount}
        options={{
          headerShown: false,
          title: 'Insight',
        }}
      />

      <Stack.Screen
        name="ChoosePremiumAccount"
        component={ChoosePremiumAccount}
        options={{
          headerShown: false,
          title: 'Insight',
        }}
      />
      <Stack.Screen
        name="ChooseBusinessAccount"
        component={ChooseBusinessAccount}
        options={{
          headerShown: false,
          title: 'Insight',
        }}
      />

      <Stack.Screen
        name="BasicAccount"
        component={BasicAccount}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PremiumAccount"
        component={PremiumAccount}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BusinessAccount"
        component={BusinessAccount}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="BottomSheetSocialAuth"
        component={BottomSheetSocialAuth}
        options={{
          headerShown: false,
          title: 'Insight',
        }}
      />
    </Stack.Navigator>
  );
};

export default LoggedOutScreen;

const styles = StyleSheet.create({});
