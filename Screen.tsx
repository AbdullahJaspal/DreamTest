import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import 'intl-pluralrules';

import PreviewVideoScreen from './src/screens/newVideo/PreviewVideoScreen';

import IndexMainScreen from './src/screens/main/MainScreen';
import Hello from './Hello';

import PostVideoScreen from './src/screens/newVideo/PostVideoScreen';

import Promotion from './src/screens/promotion/Promotion';

import Payments from './src/screens/promotion/Payments';

import SelectingLocationScreen from './src/screens/newVideo/SelectingLocationScreen';

import SelectingCitiesScreen from './src/screens/newVideo/SelectingCitiesScreen';

import EditProfile from './src/screens/profile/edit_profile/EditProfile';

import CustomAudienceScreen from './src/screens/promotion/CustomAudienceScreen';

import InterestScreen from './src/screens/promotion/InterestScreen';

import Occupation from './src/screens/profile/profile/screen/Occupation';

import SelectingGender from './src/screens/promotion/SelectingGender';

import SelectingAge from './src/screens/promotion/SelectingAge';

import MainInsightScreen from './src/screens/profile/profile/Insights/MainInsightScreen';

import TotalSpendedTime from './src/screens/profile/profile/Insights/TotalSpendedTime';

import Avatar from './src/screens/profile/profile/screen/Avatar';

import BottomSheetSocialAuth from './src/components/bottomSheets/BottomSheetSocialAuth';

import Making_friend_intention from './src/screens/profile/profile/screen/Making_friend_intention';

import VideoEditorLandingPage from './src/screens/videoEditor/VideoEditorLandingPage';

import AccountScreen from './src/screens/profile/profile/screen/AccountScreen';

import ChooseAccount from './src/screens/profile/profile/screen/ChooseAccount';

import ChooseBasicAccount from './src/screens/profile/profile/screen/ChooseBasicAccount';

import ChoosePremiumAccount from './src/screens/profile/profile/screen/ChoosePremiumAccount';

import ChooseBusinessAccount from './src/screens/profile/profile/screen/ChooseBusinessAccount';

import Userprofile from './src/screens/other_user/UserProfileMainPage';

import BasicAccount from './src/screens/profile/profile/screen/BasicAccount';

import PremiumAccount from './src/screens/profile/profile/screen/PremiumAccount';

import BusinessAccount from './src/screens/profile/profile/screen/BusinessAccount';

import VideoGift from './src/screens/gift/VideoGift';

import Followers from './src/screens/profile/profile/screen/Followers';

import Followings from './src/screens/profile/profile/screen/Followings';

import GiftHistory from './src/screens/profile/profile/screen/GiftHistory';

import DiamondHistory from './src/screens/profile/profile/screen/DiamondHistory';

import LikesHistory from './src/screens/profile/profile/screen/LikesHistory';

import WatchProfileVideo from './src/screens/other_user/WatchProfileVideo';

import ChatScreen from './src/screens/inbox/screen/ChatScreen';

import ContactList from './src/screens/inbox/screen/ContactList';

import ColorPicking from './src/screens/inbox/component/ColorPicking';

import AudioCall from './src/screens/inbox/screen/AudioCall';

import VideoCall from './src/screens/inbox/screen/VideoCall';

import DiamondAnalytics from './src/screens/profile/profile/Insights/DiamondAnalytics';

import RenderTextInput from './src/screens/videoEditor/components/RenderTextInput';

import FontPicker from './src/screens/videoEditor/sticker/FontPicker';

import ColorPicker from './src/screens/videoEditor/sticker/ColorPicker';

import BusinessAccountCategories from './src/screens/profile/profile/screen/BusinessAccountCategories';

import BusinessAccount1 from './src/screens/profile/profile/screen/business/BusinessAccount1';

import BusinessAccount2 from './src/screens/profile/profile/screen/business/BusinessAccount2';

import BusinessAccount3 from './src/screens/profile/profile/screen/business/BusinessAccount3';

import PrivacyPolicy from './src/screens/profile/profile/privacy/Privacy';

import Supperfollow from './src/screens/profile/profile/privacy/Supperfollow';

import Viewlist from './src/screens/profile/profile/privacy/Viewlist';

import Messageme from './src/screens/profile/profile/privacy/Messageme';

import Userblocked from './src/screens/profile/profile/privacy/Userblocked';

import MainSecurity from './src/screens/profile/profile/security/MainSecurity';

import LockScreen from './src/screens/profile/profile/security/LockScreen';

import ScreenLockType from './src/screens/profile/profile/security/ScreenLockType';

import SetPassword from './src/screens/profile/profile/security/SetPassword';

import SetPin from './src/screens/profile/profile/security/SetPassword';

import Swipe from './src/screens/profile/profile/security/Swipe';

import MainChangeAccountType from './src/screens/onboarding/changeAccountType/MainChangeAccountType';

import PremiumPaymentsPreviewScreen from './src/screens/onboarding/changeAccountType/PremiumPaymentsPreviewScreen';

import BusinessPaymentsPreviewScreen from './src/screens/onboarding/changeAccountType/BusinessPaymentsPreviewScreen';

import Back_up_data from './src/screens/profile/profile/Backup/Back_up_data';

import Backup_and_restore from './src/screens/profile/profile/Backup/Backup_and _restore';

import Backup_dream_account from './src/screens/profile/profile/Backup/Backup_dream_account';

import Backup_following from './src/screens/profile/profile/Backup/Backup_following';

import Backup_successfuly from './src/screens/profile/profile/Backup/Backup_successfuly';

import Restore_data from './src/screens/profile/profile/Backup/Restore_data';

import Backup_my_data from './src/screens/profile/profile/Backup/Backup_my_data';

import Switchpermission from './src/screens/profile/profile/Backup/Switchpermission';

import StripePayments from './src/screens/onboarding/changeAccountType/StripePayments';

import Wheelluckgift from './src/screens/profile/profile/wheelLuck/Wheelluckgift';

import Custom from './src/screens/profile/profile/wheelLuck/Custom';

import Balance from './src/screens/profile/profile/balance/Balance';

import Space_saving from './src/screens/profile/profile/free_up_space/Space_saving';

import MyPostMainScreen from './src/screens/profile/profile/Post/MyPostMainScreen';

// import CoverPicScreen from './src/screens/newVideo/store/CoverPicScreen';

import MasteryOfLanguage from './src/screens/profile/profile/screen/MasteryOfLanguage';

import Hobbies from './src/screens/profile/profile/screen/Hobbies';

import PostPictureScreen from './src/screens/newVideo/PostPictureScreen';

import ShareReportScreen from './src/screens/home/components/ShareReportScreen';

import ShareOtherReport from './src/screens/home/components/ShareOtherReport';

import Wallet_MainScreen from './src/screens/profile/profile/wallet/Wallet_MainScreen';

import GiftInformation from './src/screens/profile/profile/wallet/components/GiftInformation';

import Gift_for_friend from './src/screens/profile/profile/wallet/components/Gift_for_friend';

import GIft_more_friends from './src/screens/profile/profile/wallet/components/GIft_more_friends';

import Gift_choose_amount_coins from './src/screens/profile/profile/wallet/components/Gift_choose_amount_coins';

import Gift_recharge_sheet from './src/screens/profile/profile/wallet/components/Gift_recharge_sheet';

import ReportScreen from './src/screens/main/ReportScreen';

import MainNotification from './src/screens/profile/profile/notification/MainNotification';

import Video_Live_Allowed from './src/screens/profile/profile/video_live_allowed/Video_Live_Allowed';

import BlockUser from './src/screens/profile/profile/Block_user/BlockUser';

import ReportUser from './src/screens/profile/profile/Report_user/ReportUser';

import Withdrawal_Screen from './src/screens/profile/profile/balance/Withdrawal_Screen';

import WithdrawalForm from './src/screens/profile/profile/balance/WithdrawalForm';

import Payment_Method from './src/screens/profile/profile/payment_method/Payment_Method';

import MainScreen from './src/screens/profile/profile/download_all_information.js/MainScreen';

import QRScreen from './src/screens/profile/profile/QR/QRScreen';

import QRScanner from './src/screens/profile/profile/QR/components/QRScanner';

import WithdrawalFormStripe from './src/screens/profile/profile/balance/WithdrawalFormStripe';

import lucky_wheel from './src/screens/profile/profile/lucky_wheel/lucky_wheel';

import Question_answer from './src/screens/profile/profile/Q&A/Question_answer';

import TrimVideo from './src/screens/newVideo/TrimVideo';

import SoundMainScreen from './src/screens/sounds/SoundMainScreen';

import UseSoundScreen from './src/screens/sounds/UseSoundScreen';

import HashtagScreen from './src/screens/hashtag/HashtagScreen';

import CloseAccount from './src/screens/profile/profile/CloseAccount/CloseAccount';

import Device_sound_screen from './src/screens/newVideo/components/sound_tab/DeviceSoundScreen';

import Dream_sound_screen from './src/screens/newVideo/components/sound_tab/DreamSoundScreen';

import ProfileReportListSelectionScreen from './src/screens/other_user/ProfileReportListSelectionScreen';

import ProfileReportScreen from './src/screens/other_user/ProfileReportScreen';

import FollowingNotification from './src/screens/inbox/notification/FollowingNotification';

import VideosNotification from './src/screens/inbox/notification/VideosNotification';

import SystemNotification from './src/screens/inbox/notification/SystemNotification';

import YourProfileNotification from './src/screens/inbox/notification/YourProfileNotification';

import GiftNotification from './src/screens/inbox/notification/GiftNotification';

import GiftRewardIntoCoinsScreen from './src/screens/profile/profile/wallet/GiftRewardIntoCoinsScreen';

import SwitchToBalanceScreen from './src/screens/profile/profile/wallet/SwitchToBalanceScreen';
import {RootStackParamList} from './src/types/navigation';
import {WatchVideoProfileActionEnum} from './src/enum/WatchProfileActionEnum';
import ProfileBigPicScreen from './src/screens/profile/ProfileBigPicScreen';
import MediaPickupScreen from './src/screens/newVideo/MediaPickupScreen';
import NewVideoScreen from './src/screens/newVideo/NewVideoScreen';
import PictureFeedScreen from './src/screens/picture_feed/screens/PictureFeedScreen';
import PicturePostDetails from './src/screens/picture_feed/screens/PicturePostDetails';
import CommentScreen from './src/screens/picture_feed/screens/CommentScreen';
import LikeDetailsScreen from './src/screens/picture_feed/screens/LikeDetailsScreen';
import ShareDetailsScreen from './src/screens/picture_feed/screens/ShareDetailsScreen';
import {MediaType} from './src/screens/newVideo/enum/MediaType';
import SwitchToMoneyScreen from './src/screens/profile/profile/wallet/SwitchToMoneyScreen';
import PreviousPayout from './src/screens/profile/profile/wallet/PreviousPayout';
import CoverPicScreen from './src/screens/newVideo/CoverPicScreen';
import ProfileCountry from './src/screens/profile/edit_profile/ProfileCountry';
import ProfileCity from './src/screens/profile/edit_profile/ProfileCity';
import UserVerification from './src/screens/profile/profile/Verification/UserVerification';
import BadgeStatus from './src/screens/profile/profile/Verification/BadgeStatus';
import IndexScreen from './src/screens/index';
import HelpAndContact from './src/screens/profile/profile/Help/HelpAndContact';
const Stack = createNativeStackNavigator<RootStackParamList>();

const Screen: React.FC = () => {
  return (
    <>
      <Stack.Navigator initialRouteName={'Index'}>
        <Stack.Screen
          name="Index"
          component={IndexMainScreen}
          options={{headerShown: false, freezeOnBlur: true}}
        />

        <Stack.Screen
          name="Payments"
          component={Payments}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PreviewVideoScreen"
          component={PreviewVideoScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SelectingLocationScreen"
          component={SelectingLocationScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PostVideoScreen"
          component={PostVideoScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SelectingCitiesScreen"
          component={SelectingCitiesScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CustomAudienceScreen"
          component={CustomAudienceScreen}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen
        name="Promotion"
        component={Promotion}
        options={{headerShown: false, title: ''}}
      /> */}
        <Stack.Screen
          name="InterestScreen"
          component={InterestScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Industries"
          component={Occupation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SelectingGender"
          component={SelectingGender}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SelectingAge"
          component={SelectingAge}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MainInsightScreen"
          component={MainInsightScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TotalSpendedTime"
          component={TotalSpendedTime}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Avatar"
          component={Avatar}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen
          name="BottomSheetSocialAuth"
          component={BottomSheetSocialAuth}
          options={{ headerShown: false, animationEnabled: false, title: 'Insight' }}
        /> */}

        <Stack.Screen
          name="MakingFriendIntenttion"
          component={Making_friend_intention}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="VideoEditorLandingPage"
          component={VideoEditorLandingPage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen
          name="ChooseAccount"
          component={ChooseAccount}
          options={{ headerShown: false, animationEnabled: false, title: 'Insight' }}
        /> */}
        <Stack.Screen
          name="ChooseBasicAccount"
          component={ChooseBasicAccount}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ChoosePremiumAccount"
          component={ChoosePremiumAccount}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ChooseBusinessAccount"
          component={ChooseBusinessAccount}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="UserProfileMainPage"
          component={Userprofile}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen
          name="BasicAccount"
          component={BasicAccount}
          options={{
            headerShown: false,
            animationEnabled: false,
          }} />

        <Stack.Screen
          name="PremiumAccount"
          component={PremiumAccount}
          options={{
            headerShown: false,
            animationEnabled: false,
          }} />

        <Stack.Screen
          name="BusinessAccount"
          component={BusinessAccount}
          options={{
            headerShown: false,
            animationEnabled: false,
          }} /> */}

        <Stack.Screen
          name="VideoGift"
          component={VideoGift}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Followers"
          component={Followers}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Followings"
          component={Followings}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GiftHistory"
          component={GiftHistory}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="DiamondHistory"
          component={DiamondHistory}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="LikesHistory"
          component={LikesHistory}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WatchProfileVideo"
          component={WatchProfileVideo}
          initialParams={{
            action_name: WatchVideoProfileActionEnum.SHARE_VIDEO,
            current_index: 0,
          }}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ContactList"
          component={ContactList}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ColorPicking"
          component={ColorPicking}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="AudioCall"
          component={AudioCall}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="VideoCall"
          component={VideoCall}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="DiamondAnalytics"
          component={DiamondAnalytics}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="RenderTextInput"
          component={RenderTextInput}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="FontPicker"
          component={FontPicker}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ColorPicker"
          component={ColorPicker}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BusinessAccountCategories"
          component={BusinessAccountCategories}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BusinessAccount1"
          component={BusinessAccount1}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BusinessAccount2"
          component={BusinessAccount2}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BusinessAccount3"
          component={BusinessAccount3}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Supperfollow"
          component={Supperfollow}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Viewlist"
          component={Viewlist}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Userblocked"
          component={Userblocked}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Messageme"
          component={Messageme}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MainSecurity"
          component={MainSecurity}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="LockScreen"
          component={LockScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ScreenLockType"
          component={ScreenLockType}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SetPassword"
          component={SetPassword}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SetPin"
          component={SetPin}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Swipe"
          component={Swipe}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MainChangeAccountType"
          component={MainChangeAccountType}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PremiumPaymentsPreviewScreen"
          component={PremiumPaymentsPreviewScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BusinessPaymentsPreviewScreen"
          component={BusinessPaymentsPreviewScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Back_up_data"
          component={Back_up_data}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MainNotification"
          component={MainNotification}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Backup_and_restore"
          component={Backup_and_restore}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Backup_dream_account"
          component={Backup_dream_account}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Backup_following"
          component={Backup_following}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Backup_successfuly"
          component={Backup_successfuly}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Restore_data"
          component={Restore_data}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Backup_my_data"
          component={Backup_my_data}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Switchpermission"
          component={Switchpermission}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="StripePayments"
          component={StripePayments}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Wheelluckgift"
          component={Wheelluckgift}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Video_Live_Allowed"
          component={Video_Live_Allowed}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Custom"
          component={Custom}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Balance"
          component={Balance}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="lucky_wheel"
          component={lucky_wheel}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Withdrawal_Screen"
          component={Withdrawal_Screen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WithdrawalForm"
          component={WithdrawalForm}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WithdrawalFormStripe"
          component={WithdrawalFormStripe}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Payment_Method"
          component={Payment_Method}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Wallet_MainScreen"
          component={Wallet_MainScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Gift_recharge_sheet"
          component={Gift_recharge_sheet}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GiftInformation"
          component={GiftInformation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Gift_for_friend"
          component={Gift_for_friend}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GIft_more_friends"
          component={GIft_more_friends}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Gift_choose_amount_coins"
          component={Gift_choose_amount_coins}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Space_saving"
          component={Space_saving}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="BlockUser"
          component={BlockUser}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ReportUser"
          component={ReportUser}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MyPostMainScreen"
          component={MyPostMainScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CoverPicScreen"
          component={CoverPicScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MasteryOfLanguage"
          component={MasteryOfLanguage}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Hobbies"
          component={Hobbies}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PostPictureScreen"
          component={PostPictureScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ReportScreen"
          component={ReportScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ShareReportScreen"
          component={ShareReportScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ShareOtherReport"
          component={ShareOtherReport}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="QRScanner"
          component={QRScanner}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Question_answer"
          component={Question_answer}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="QRScreen"
          component={QRScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TrimVideo"
          component={TrimVideo}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SoundMainScreen"
          component={SoundMainScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="UseSoundScreen"
          component={UseSoundScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="HashtagScreen"
          component={HashtagScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CloseAccount"
          component={CloseAccount}
          options={{headerShown: false}}
        />

        {/* <Stack.Screen
        name="Device_sound_screen"
        component={Device_sound_screen}
        options={{
          headerShown: false,
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Dream_sound_screen"
        component={Dream_sound_screen}
        options={{
          headerShown: false,
        }}
      /> */}

        <Stack.Screen
          name="Hello"
          component={Hello}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ProfileReportListSelectionScreen"
          component={ProfileReportListSelectionScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ProfileReportScreen"
          component={ProfileReportScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="FollowingNotification"
          component={FollowingNotification}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="VideosNotification"
          component={VideosNotification}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SystemNotification"
          component={SystemNotification}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="YourProfileNotification"
          component={YourProfileNotification}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GiftNotification"
          component={GiftNotification}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="GiftRewardIntoCoinsScreen"
          component={GiftRewardIntoCoinsScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SwitchToBalanceScreen"
          component={SwitchToBalanceScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ProfileBigPicScreen"
          component={ProfileBigPicScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MediaPickupScreen"
          component={MediaPickupScreen}
          options={{headerShown: false}}
          initialParams={{mediaType: MediaType.All}}
        />

        <Stack.Screen
          name="NewVideoScreen"
          component={NewVideoScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PictureFeedScreen"
          component={PictureFeedScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PicturePostDetails"
          component={PicturePostDetails}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="CommentScreen"
          component={CommentScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="LikeDetailsScreen"
          component={LikeDetailsScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ShareDetailsScreen"
          component={ShareDetailsScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="SwitchToMoneyScreen"
          component={SwitchToMoneyScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="PreviousPayout"
          component={PreviousPayout}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ProfileCountry"
          component={ProfileCountry}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ProfileCity"
          component={ProfileCity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Verification"
          component={UserVerification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BadgeCheckStatus"
          component={BadgeStatus}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="HelpAndContact"
          component={HelpAndContact}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <IndexScreen />
    </>
  );
};

export default Screen;
