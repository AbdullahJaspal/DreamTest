import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingStackParamsList} from './types/OnboardingStackParamList';
import LoginMainScreen from '../screens/onboarding/LoginMainScreen';
import AccountScreen from '../screens/onboarding/AccountScreen';
import ChooseAccount from '../screens/onboarding/ChooseAccount';
import ChooseBasicAccount from '../screens/onboarding/ChooseBasicAccount';
import ChoosePremiumAccount from '../screens/onboarding/ChoosePremiumAccount';
import ChooseBusinessAccount from '../screens/onboarding/ChooseBusinessAccount';
import BasicAccount from '../screens/onboarding/BasicAccount';
import PremiumAccount from '../screens/onboarding/PremiumAccount';
import BusinessAccount from '../screens/onboarding/BusinessAccount';
import BottomSheetSocialAuth from '../screens/onboarding/BottomSheetSocialAuth';
import PremiumPaymentsPreviewScreen from '../screens/onboarding/changeAccountType/PremiumPaymentsPreviewScreen';
import BusinessPaymentsPreviewScreen from '../screens/onboarding/changeAccountType/BusinessPaymentsPreviewScreen';
import BusinessAccountCategories from '../screens/onboarding/changeAccountType/BusinessAccountCategories';
import PrivacyPolicy from '../screens/settings/PrivacyPolicy';

const Stack = createNativeStackNavigator<OnboardingStackParamsList>();
const OnboardingNavigation: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginMainScreen" component={LoginMainScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="ChooseAccount" component={ChooseAccount} />
      <Stack.Screen name="ChooseBasicAccount" component={ChooseBasicAccount} />
      <Stack.Screen
        name="ChoosePremiumAccount"
        component={ChoosePremiumAccount}
      />
      <Stack.Screen
        name="ChooseBusinessAccount"
        component={ChooseBusinessAccount}
      />
      <Stack.Screen name="BasicAccount" component={BasicAccount} />
      <Stack.Screen name="PremiumAccount" component={PremiumAccount} />
      <Stack.Screen name="BusinessAccount" component={BusinessAccount} />
      <Stack.Screen
        name="BottomSheetSocialAuth"
        component={BottomSheetSocialAuth}
      />
      <Stack.Screen
        name="BusinessAccountCategories"
        component={BusinessAccountCategories}
      />
      <Stack.Screen
        name="PremiumPaymentsPreviewScreen"
        component={PremiumPaymentsPreviewScreen}
      />
      <Stack.Screen
        name="BusinessPaymentsPreviewScreen"
        component={BusinessPaymentsPreviewScreen}
      />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    </Stack.Navigator>
  );
};

export default React.memo(OnboardingNavigation);
