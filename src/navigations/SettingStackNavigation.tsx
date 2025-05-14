import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountScreen from '../screens/onboarding/AccountScreen';
import MainChangeAccountType from '../screens/onboarding/changeAccountType/MainChangeAccountType';
import MainInsightScreen from '../screens/profile/profile/Insights/MainInsightScreen';
import Balance from '../screens/profile/profile/balance/Balance';
import MainSecurity from '../screens/profile/profile/security/MainSecurity';
import PrivacyPolicy from '../screens/profile/profile/privacy/Privacy';
import Wallet_MainScreen from '../screens/profile/profile/wallet/Wallet_MainScreen';
import Backup_and_restore from '../screens/profile/profile/Backup/Backup_and _restore';
import Space_saving from '../screens/profile/profile/free_up_space/Space_saving';
import BlockUser from '../screens/profile/profile/Block_user/BlockUser';
import Video_Live_Allowed from '../screens/profile/profile/video_live_allowed/Video_Live_Allowed';
import QRScreen from '../screens/profile/profile/QR/QRScreen';
import LuckyWheel from '../screens/profile/profile/lucky_wheel/lucky_wheel';
import Wheelluckgift from '../screens/profile/profile/wheelLuck/Wheelluckgift';
import Question_answer from '../screens/profile/profile/Q&A/Question_answer';
import Payment_Method from '../screens/profile/profile/payment_method/Payment_Method';
import MainNotification from '../screens/profile/profile/notification/MainNotification';
import MainScreen from '../screens/profile/profile/download_all_information.js/MainScreen';
import ReportUser from '../screens/profile/profile/Report_user/ReportUser';
import UserVerification from '../screens/profile/profile/Verification/UserVerification';
import CloseAccount from '../screens/profile/profile/CloseAccount/CloseAccount';
import {SettingStackParamsList} from './types/SettingStackParamsList';
import HelpAndContact from '../screens/profile/profile/Help/HelpAndContact';
import Language from '../screens/profile/profile/Language/Language';
import Userblocked from '../screens/profile/profile/privacy/Userblocked';
import Messageme from '../screens/profile/profile/privacy/Messageme';
import Viewlist from '../screens/profile/profile/privacy/Viewlist';
const SettingStack = createNativeStackNavigator<SettingStackParamsList>();

const SettingStackNavigation: React.FC = () => {
  return (
    <SettingStack.Navigator
      initialRouteName="AccountScreen"
      screenOptions={{headerShown: false}}>
      <SettingStack.Screen name="AccountScreen" component={AccountScreen} />
      <SettingStack.Screen
        name="MainChangeAccountType"
        component={MainChangeAccountType}
      />
      <SettingStack.Screen
        name="MainInsightScreen"
        component={MainInsightScreen}
      />
      <SettingStack.Screen name="Balance" component={Balance} />
      <SettingStack.Screen name="MainSecurity" component={MainSecurity} />
      <SettingStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <SettingStack.Screen
        name="Wallet_MainScreen"
        component={Wallet_MainScreen}
      />
      <SettingStack.Screen name="HelpAndContact" component={HelpAndContact} />
      <SettingStack.Screen
        name="Backup_and_restore"
        component={Backup_and_restore}
      />
      <SettingStack.Screen name="Space_saving" component={Space_saving} />
      <SettingStack.Screen name="BlockUser" component={BlockUser} />
      <SettingStack.Screen
        name="Video_Live_Allowed"
        component={Video_Live_Allowed}
      />
      <SettingStack.Screen name="QRScreen" component={QRScreen} />
      <SettingStack.Screen name="LuckyWheel" component={LuckyWheel} />
      <SettingStack.Screen name="Wheelluckgift" component={Wheelluckgift} />
      <SettingStack.Screen name="Question_answer" component={Question_answer} />
      <SettingStack.Screen name="Payment_Method" component={Payment_Method} />
      <SettingStack.Screen
        name="MainNotification"
        component={MainNotification}
      />
      <SettingStack.Screen name="MainScreen" component={MainScreen} />
      <SettingStack.Screen name="ReportUser" component={ReportUser} />
      <SettingStack.Screen
        name="UserVerification"
        component={UserVerification}
      />
      <SettingStack.Screen name="Language" component={Language} />

      <SettingStack.Screen name="CloseAccount" component={CloseAccount} />
      <SettingStack.Screen name="Userblocked" component={Userblocked} />
      <SettingStack.Screen name="Messageme" component={Messageme} />
      <SettingStack.Screen name="Viewlist" component={Viewlist} />
    </SettingStack.Navigator>
  );
};

export default React.memo(SettingStackNavigation);
