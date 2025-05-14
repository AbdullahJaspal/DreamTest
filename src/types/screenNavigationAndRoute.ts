import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './navigation';

// Home Screen
export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;
export type HomeScreenNavigationProps = HomeScreenProps['navigation'];
export type HomeScreenRouteProps = HomeScreenProps['route'];

// Profile Screen
export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Me'
>;
export type ProfileScreenNavigationProps = ProfileScreenProps['navigation'];
export type ProfileScreenRouteProps = ProfileScreenProps['route'];

// Discover Screen
export type DiscoverScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Discover'
>;
export type DiscoverScreenNavigationProps = DiscoverScreenProps['navigation'];
export type DiscoverScreenRouteProps = DiscoverScreenProps['route'];

// NewVideo Screen
export type NewVideoProps = NativeStackScreenProps<
  RootStackParamList,
  'NewVideo'
>;
export type NewVideoNavigationProps = NewVideoProps['navigation'];
export type NewVideoRouteProps = NewVideoProps['route'];

// Inbox Screen
export type InboxScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Inbox'
>;
export type InboxScreenNavigationProps = InboxScreenProps['navigation'];
export type InboxScreenRouteProps = InboxScreenProps['route'];

// Payments Screen
export type PaymentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Payments'
>;
export type PaymentsScreenNavigationProps = PaymentsScreenProps['navigation'];
export type PaymentsScreenRouteProps = PaymentsScreenProps['route'];

// PreviewVideoScreen Screen
export type PreviewVideoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PreviewVideoScreen'
>;
export type PreviewVideoScreenNavigationProps =
  PreviewVideoScreenProps['navigation'];
export type PreviewVideoScreenRouteProps = PreviewVideoScreenProps['route'];

// SelectingLocationScreen Screen
export type SelectingLocationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SelectingLocationScreen'
>;
export type SelectingLocationScreenNavigationProps =
  SelectingLocationScreenProps['navigation'];
export type SelectingLocationScreenRouteProps =
  SelectingLocationScreenProps['route'];

// PostVideoScreen Screen
export type PostVideoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PostVideoScreen'
>;
export type PostVideoScreenNavigationProps = PostVideoScreenProps['navigation'];
export type PostVideoScreenRouteProps = PostVideoScreenProps['route'];

// SelectingCitiesScreen Screen
export type SelectingCitiesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SelectingCitiesScreen'
>;
export type SelectingCitiesScreenNavigationProps =
  SelectingCitiesScreenProps['navigation'];
export type SelectingCitiesScreenRouteProps =
  SelectingCitiesScreenProps['route'];

// EditProfile Screen
export type EditProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditProfile'
>;
export type EditProfileScreenNavigationProps =
  EditProfileScreenProps['navigation'];
export type EditProfileScreenRouteProps = EditProfileScreenProps['route'];

// CustomAudienceScreen Screen
export type CustomAudienceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CustomAudienceScreen'
>;
export type CustomAudienceScreenNavigationProps =
  CustomAudienceScreenProps['navigation'];
export type CustomAudienceScreenRouteProps = CustomAudienceScreenProps['route'];

// InterestScreen Screen
export type InterestScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InterestScreen'
>;
export type InterestScreenNavigationProps = InterestScreenProps['navigation'];
export type InterestScreenRouteProps = InterestScreenProps['route'];

// Industries Screen
export type IndustriesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Industries'
>;
export type IndustriesScreenNavigationProps =
  IndustriesScreenProps['navigation'];
export type IndustriesScreenRouteProps = IndustriesScreenProps['route'];

// SelectingGender Screen
export type SelectingGenderScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SelectingGender'
>;
export type SelectingGenderScreenNavigationProps =
  SelectingGenderScreenProps['navigation'];
export type SelectingGenderScreenRouteProps =
  SelectingGenderScreenProps['route'];

// SelectingAge Screen
export type SelectingAgeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SelectingAge'
>;
export type SelectingAgeScreenNavigationProps =
  SelectingAgeScreenProps['navigation'];
export type SelectingAgeScreenRouteProps = SelectingAgeScreenProps['route'];

// MainInsightScreen Screen
export type MainInsightScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainInsightScreen'
>;
export type MainInsightScreenNavigationProps =
  MainInsightScreenProps['navigation'];
export type MainInsightScreenRouteProps = MainInsightScreenProps['route'];

// TotalSpendedTime Screen
export type TotalSpendedTimeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TotalSpendedTime'
>;
export type TotalSpendedTimeScreenNavigationProps =
  TotalSpendedTimeScreenProps['navigation'];
export type TotalSpendedTimeScreenRouteProps =
  TotalSpendedTimeScreenProps['route'];

// Avatar Screen
export type AvatarScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Avatar'
>;
export type AvatarScreenNavigationProps = AvatarScreenProps['navigation'];
export type AvatarScreenRouteProps = AvatarScreenProps['route'];

// CountryAndRegion Screen
export type CountryAndRegionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CountryAndRegion'
>;
export type CountryAndRegionScreenNavigationProps =
  CountryAndRegionScreenProps['navigation'];
export type CountryAndRegionScreenRouteProps =
  CountryAndRegionScreenProps['route'];

// MakingFriendIntenttion Screen
export type MakingFriendIntenttionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MakingFriendIntenttion'
>;
export type MakingFriendIntenttionScreenNavigationProps =
  MakingFriendIntenttionScreenProps['navigation'];
export type MakingFriendIntenttionScreenRouteProps =
  MakingFriendIntenttionScreenProps['route'];

// VideoEditorLandingPage Screen
export type VideoEditorLandingPageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VideoEditorLandingPage'
>;
export type VideoEditorLandingPageScreenNavigationProps =
  VideoEditorLandingPageScreenProps['navigation'];
export type VideoEditorLandingPageScreenRouteProps =
  VideoEditorLandingPageScreenProps['route'];

// AccountScreen Screen
export type AccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AccountScreen'
>;
export type AccountScreenNavigationProps = AccountScreenProps['navigation'];
export type AccountScreenRouteProps = AccountScreenProps['route'];

// UserProfileMainPage Screen
export type UserProfileMainPageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UserProfileMainPage'
>;
export type UserProfileMainPageScreenNavigationProps =
  UserProfileMainPageScreenProps['navigation'];
export type UserProfileMainPageScreenRouteProps =
  UserProfileMainPageScreenProps['route'];

// VideoGift Screen
export type VideoGiftScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VideoGift'
>;
export type VideoGiftScreenNavigationProps = VideoGiftScreenProps['navigation'];
export type VideoGiftScreenRouteProps = VideoGiftScreenProps['route'];

// Followers Screen
export type FollowersScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Followers'
>;
export type FollowersScreenNavigationProps = FollowersScreenProps['navigation'];
export type FollowersScreenRouteProps = FollowersScreenProps['route'];

// Followings Screen
export type FollowingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Followings'
>;
export type FollowingsScreenNavigationProps =
  FollowingsScreenProps['navigation'];
export type FollowingsScreenRouteProps = FollowingsScreenProps['route'];

// GiftHistory Screen
export type GiftHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GiftHistory'
>;
export type GiftHistoryScreenNavigationProps =
  GiftHistoryScreenProps['navigation'];
export type GiftHistoryScreenRouteProps = GiftHistoryScreenProps['route'];

// DiamondHistory Screen
export type DiamondHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DiamondHistory'
>;
export type DiamondHistoryScreenNavigationProps =
  DiamondHistoryScreenProps['navigation'];
export type DiamondHistoryScreenRouteProps = DiamondHistoryScreenProps['route'];

// LikesHistory Screen
export type LikesHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LikesHistory'
>;
export type LikesHistoryScreenNavigationProps =
  LikesHistoryScreenProps['navigation'];
export type LikesHistoryScreenRouteProps = LikesHistoryScreenProps['route'];

// WatchProfileVideo Screen
export type WatchProfileVideoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WatchProfileVideo'
>;
export type WatchProfileVideoScreenNavigationProps =
  WatchProfileVideoScreenProps['navigation'];
export type WatchProfileVideoScreenRouteProps =
  WatchProfileVideoScreenProps['route'];

// ChatScreen Screen
export type ChatScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ChatScreen'
>;
export type ChatScreenNavigationProps = ChatScreenProps['navigation'];
export type ChatScreenRouteProps = ChatScreenProps['route'];

// ContactList Screen
export type ContactListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ContactList'
>;
export type ContactListScreenNavigationProps =
  ContactListScreenProps['navigation'];
export type ContactListScreenRouteProps = ContactListScreenProps['route'];

// ColorPicking Screen
export type ColorPickingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ColorPicking'
>;
export type ColorPickingScreenNavigationProps =
  ColorPickingScreenProps['navigation'];
export type ColorPickingScreenRouteProps = ColorPickingScreenProps['route'];

// AudioCall Screen
export type AudioCallScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AudioCall'
>;
export type AudioCallScreenNavigationProps = AudioCallScreenProps['navigation'];
export type AudioCallScreenRouteProps = AudioCallScreenProps['route'];

// VideoCall Screen
export type VideoCallScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VideoCall'
>;
export type VideoCallScreenNavigationProps = VideoCallScreenProps['navigation'];
export type VideoCallScreenRouteProps = VideoCallScreenProps['route'];

// DiamondAnalytics Screen
export type DiamondAnalyticsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DiamondAnalytics'
>;
export type DiamondAnalyticsScreenNavigationProps =
  DiamondAnalyticsScreenProps['navigation'];
export type DiamondAnalyticsScreenRouteProps =
  DiamondAnalyticsScreenProps['route'];

// RenderTextInput Screen
export type RenderTextInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RenderTextInput'
>;
export type RenderTextInputScreenNavigationProps =
  RenderTextInputScreenProps['navigation'];
export type RenderTextInputScreenRouteProps =
  RenderTextInputScreenProps['route'];

// FontPicker Screen
export type FontPickerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FontPicker'
>;
export type FontPickerScreenNavigationProps =
  FontPickerScreenProps['navigation'];
export type FontPickerScreenRouteProps = FontPickerScreenProps['route'];

// ColorPicker Screen
export type ColorPickerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ColorPicker'
>;
export type ColorPickerScreenNavigationProps =
  ColorPickerScreenProps['navigation'];
export type ColorPickerScreenRouteProps = ColorPickerScreenProps['route'];

// BusinessAccountCategories Screen
export type BusinessAccountCategoriesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BusinessAccountCategories'
>;
export type BusinessAccountCategoriesScreenNavigationProps =
  BusinessAccountCategoriesScreenProps['navigation'];
export type BusinessAccountCategoriesScreenRouteProps =
  BusinessAccountCategoriesScreenProps['route'];

// BusinessAccount1 Screen
export type BusinessAccount1ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BusinessAccount1'
>;
export type BusinessAccount1ScreenNavigationProps =
  BusinessAccount1ScreenProps['navigation'];
export type BusinessAccount1ScreenRouteProps =
  BusinessAccount1ScreenProps['route'];

// BusinessAccount2 Screen
export type BusinessAccount2ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BusinessAccount2'
>;
export type BusinessAccount2ScreenNavigationProps =
  BusinessAccount2ScreenProps['navigation'];
export type BusinessAccount2ScreenRouteProps =
  BusinessAccount2ScreenProps['route'];

// BusinessAccount3 Screen
export type BusinessAccount3ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BusinessAccount3'
>;
export type BusinessAccount3ScreenNavigationProps =
  BusinessAccount3ScreenProps['navigation'];
export type BusinessAccount3ScreenRouteProps =
  BusinessAccount3ScreenProps['route'];

// PrivacyPolicy Screen
export type PrivacyPolicyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PrivacyPolicy'
>;
export type PrivacyPolicyScreenNavigationProps =
  PrivacyPolicyScreenProps['navigation'];
export type PrivacyPolicyScreenRouteProps = PrivacyPolicyScreenProps['route'];

// Supperfollow Screen
export type SupperfollowScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Supperfollow'
>;
export type SupperfollowScreenNavigationProps =
  SupperfollowScreenProps['navigation'];
export type SupperfollowScreenRouteProps = SupperfollowScreenProps['route'];

// Viewlist Screen
export type ViewlistScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Viewlist'
>;
export type ViewlistScreenNavigationProps = ViewlistScreenProps['navigation'];
export type ViewlistScreenRouteProps = ViewlistScreenProps['route'];

// Userblocked Screen
export type UserblockedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Userblocked'
>;
export type UserblockedScreenNavigationProps =
  UserblockedScreenProps['navigation'];
export type UserblockedScreenRouteProps = UserblockedScreenProps['route'];

// Messageme Screen
export type MessagemeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Messageme'
>;
export type MessagemeScreenNavigationProps = MessagemeScreenProps['navigation'];
export type MessagemeScreenRouteProps = MessagemeScreenProps['route'];

// MainSecurity Screen
export type MainSecurityScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainSecurity'
>;
export type MainSecurityScreenNavigationProps =
  MainSecurityScreenProps['navigation'];
export type MainSecurityScreenRouteProps = MainSecurityScreenProps['route'];

// LockScreen Screen
export type LockScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LockScreen'
>;
export type LockScreenScreenNavigationProps =
  LockScreenScreenProps['navigation'];
export type LockScreenScreenRouteProps = LockScreenScreenProps['route'];

// ScreenLockType Screen
export type ScreenLockTypeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ScreenLockType'
>;
export type ScreenLockTypeScreenNavigationProps =
  ScreenLockTypeScreenProps['navigation'];
export type ScreenLockTypeScreenRouteProps = ScreenLockTypeScreenProps['route'];

// SetPassword Screen
export type SetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SetPassword'
>;
export type SetPasswordScreenNavigationProps =
  SetPasswordScreenProps['navigation'];
export type SetPasswordScreenRouteProps = SetPasswordScreenProps['route'];

// SetPin Screen
export type SetPinScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SetPin'
>;
export type SetPinScreenNavigationProps = SetPinScreenProps['navigation'];
export type SetPinScreenRouteProps = SetPinScreenProps['route'];

// Swipe Screen
export type SwipeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Swipe'
>;
export type SwipeScreenNavigationProps = SwipeScreenProps['navigation'];
export type SwipeScreenRouteProps = SwipeScreenProps['route'];

// MainChangeAccountType Screen
export type MainChangeAccountTypeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainChangeAccountType'
>;
export type MainChangeAccountTypeScreenNavigationProps =
  MainChangeAccountTypeScreenProps['navigation'];
export type MainChangeAccountTypeScreenRouteProps =
  MainChangeAccountTypeScreenProps['route'];

// PremiumPaymentsPreviewScreen Screen
export type PremiumPaymentsPreviewScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PremiumPaymentsPreviewScreen'
>;
export type PremiumPaymentsPreviewScreenScreenNavigationProps =
  PremiumPaymentsPreviewScreenScreenProps['navigation'];
export type PremiumPaymentsPreviewScreenScreenRouteProps =
  PremiumPaymentsPreviewScreenScreenProps['route'];

// BusinessPaymentsPreviewScreen Screen
export type BusinessPaymentsPreviewScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BusinessPaymentsPreviewScreen'
>;
export type BusinessPaymentsPreviewScreenScreenNavigationProps =
  BusinessPaymentsPreviewScreenScreenProps['navigation'];
export type BusinessPaymentsPreviewScreenScreenRouteProps =
  BusinessPaymentsPreviewScreenScreenProps['route'];

// Back_up_data Screen
export type Back_up_dataScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Back_up_data'
>;
export type Back_up_dataScreenNavigationProps =
  Back_up_dataScreenProps['navigation'];
export type Back_up_dataScreenRouteProps = Back_up_dataScreenProps['route'];

// MainNotification Screen
export type MainNotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainNotification'
>;
export type MainNotificationScreenNavigationProps =
  MainNotificationScreenProps['navigation'];
export type MainNotificationScreenRouteProps =
  MainNotificationScreenProps['route'];

// Backup_and_restore Screen
export type Backup_and_restoreScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Backup_and_restore'
>;
export type Backup_and_restoreScreenNavigationProps =
  Backup_and_restoreScreenProps['navigation'];
export type Backup_and_restoreScreenRouteProps =
  Backup_and_restoreScreenProps['route'];

// Backup_dream_account Screen
export type Backup_dream_accountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Backup_dream_account'
>;
export type Backup_dream_accountScreenNavigationProps =
  Backup_dream_accountScreenProps['navigation'];
export type Backup_dream_accountScreenRouteProps =
  Backup_dream_accountScreenProps['route'];

// Backup_following Screen
export type Backup_followingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Backup_following'
>;
export type Backup_followingScreenNavigationProps =
  Backup_followingScreenProps['navigation'];
export type Backup_followingScreenRouteProps =
  Backup_followingScreenProps['route'];

// Restore_data Screen
export type Restore_dataScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Restore_data'
>;
export type Restore_dataScreenNavigationProps =
  Restore_dataScreenProps['navigation'];
export type Restore_dataScreenRouteProps = Restore_dataScreenProps['route'];

// Backup_my_data Screen
export type Backup_my_dataScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Backup_my_data'
>;
export type Backup_my_dataScreenNavigationProps =
  Backup_my_dataScreenProps['navigation'];
export type Backup_my_dataScreenRouteProps = Backup_my_dataScreenProps['route'];

// Switchpermission Screen
export type SwitchpermissionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Switchpermission'
>;
export type SwitchpermissionScreenNavigationProps =
  SwitchpermissionScreenProps['navigation'];
export type SwitchpermissionScreenRouteProps =
  SwitchpermissionScreenProps['route'];

// StripePayments Screen
export type StripePaymentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'StripePayments'
>;
export type StripePaymentsScreenNavigationProps =
  StripePaymentsScreenProps['navigation'];
export type StripePaymentsScreenRouteProps = StripePaymentsScreenProps['route'];

// Wheelluckgift Screen
export type WheelluckgiftScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Wheelluckgift'
>;
export type WheelluckgiftScreenNavigationProps =
  WheelluckgiftScreenProps['navigation'];
export type WheelluckgiftScreenRouteProps = WheelluckgiftScreenProps['route'];

// Video_Live_Allowed Screen
export type Video_Live_AllowedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Video_Live_Allowed'
>;
export type Video_Live_AllowedScreenNavigationProps =
  Video_Live_AllowedScreenProps['navigation'];
export type Video_Live_AllowedScreenRouteProps =
  Video_Live_AllowedScreenProps['route'];

// Custom Screen
export type CustomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Custom'
>;
export type CustomScreenNavigationProps = CustomScreenProps['navigation'];
export type CustomScreenRouteProps = CustomScreenProps['route'];

// Balance Screen
export type BalanceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Balance'
>;
export type BalanceScreenNavigationProps = BalanceScreenProps['navigation'];
export type BalanceScreenRouteProps = BalanceScreenProps['route'];

// Lucky_wheel Screen
export type Lucky_wheelScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'lucky_wheel'
>;
export type Lucky_wheelScreenNavigationProps =
  Lucky_wheelScreenProps['navigation'];
export type Lucky_wheelScreenRouteProps = Lucky_wheelScreenProps['route'];

// Withdrawal_Screen Screen
export type Withdrawal_ScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Withdrawal_Screen'
>;
export type Withdrawal_ScreenScreenNavigationProps =
  Withdrawal_ScreenScreenProps['navigation'];
export type Withdrawal_ScreenScreenRouteProps =
  Withdrawal_ScreenScreenProps['route'];

// WithdrawalForm Screen
export type WithdrawalFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WithdrawalForm'
>;
export type WithdrawalFormScreenNavigationProps =
  WithdrawalFormScreenProps['navigation'];
export type WithdrawalFormScreenRouteProps = WithdrawalFormScreenProps['route'];

// WithdrawalFormStripe Screen
export type WithdrawalFormStripeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'WithdrawalFormStripe'
>;
export type WithdrawalFormStripeScreenNavigationProps =
  WithdrawalFormStripeScreenProps['navigation'];
export type WithdrawalFormStripeScreenRouteProps =
  WithdrawalFormStripeScreenProps['route'];

// Payment_Method Screen
export type Payment_MethodScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Payment_Method'
>;
export type Payment_MethodScreenNavigationProps =
  Payment_MethodScreenProps['navigation'];
export type Payment_MethodScreenRouteProps = Payment_MethodScreenProps['route'];

// Wallet_MainScreen Screen
export type Wallet_MainScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Wallet_MainScreen'
>;
export type Wallet_MainScreenScreenNavigationProps =
  Wallet_MainScreenScreenProps['navigation'];
export type Wallet_MainScreenScreenRouteProps =
  Wallet_MainScreenScreenProps['route'];

// Gift_recharge_sheet Screen
export type Gift_recharge_sheetScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Gift_recharge_sheet'
>;
export type Gift_recharge_sheetScreenNavigationProps =
  Gift_recharge_sheetScreenProps['navigation'];
export type Gift_recharge_sheetScreenRouteProps =
  Gift_recharge_sheetScreenProps['route'];

// GiftInformation Screen
export type GiftInformationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GiftInformation'
>;
export type GiftInformationScreenNavigationProps =
  GiftInformationScreenProps['navigation'];
export type GiftInformationScreenRouteProps =
  GiftInformationScreenProps['route'];

// Gift_for_friend Screen
export type Gift_for_friendScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Gift_for_friend'
>;
export type Gift_for_friendScreenNavigationProps =
  Gift_for_friendScreenProps['navigation'];
export type Gift_for_friendScreenRouteProps =
  Gift_for_friendScreenProps['route'];

// Gift_more_friends Screen
export type Gift_more_friendsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GIft_more_friends'
>;
export type Gift_more_friendsScreenNavigationProps =
  Gift_more_friendsScreenProps['navigation'];
export type Gift_more_friendsScreenRouteProps =
  Gift_more_friendsScreenProps['route'];

// Gift_choose_amount_coins Screen
export type Gift_choose_amount_coinsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Gift_choose_amount_coins'
>;
export type Gift_choose_amount_coinsScreenNavigationProps =
  Gift_choose_amount_coinsScreenProps['navigation'];
export type Gift_choose_amount_coinsScreenRouteProps =
  Gift_choose_amount_coinsScreenProps['route'];

// Space_saving Screen
export type Space_savingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Space_saving'
>;
export type Space_savingScreenNavigationProps =
  Space_savingScreenProps['navigation'];
export type Space_savingScreenRouteProps = Space_savingScreenProps['route'];

// BlockUser Screen
export type BlockUserScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BlockUser'
>;
export type BlockUserScreenNavigationProps = BlockUserScreenProps['navigation'];
export type BlockUserScreenRouteProps = BlockUserScreenProps['route'];

// MyPostMainScreen Screen
export type MyPostMainScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MyPostMainScreen'
>;
export type MyPostMainScreenScreenNavigationProps =
  MyPostMainScreenScreenProps['navigation'];
export type MyPostMainScreenScreenRouteProps =
  MyPostMainScreenScreenProps['route'];

// CoverPicScreen Screen
export type CoverPicScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CoverPicScreen'
>;
export type CoverPicScreenScreenNavigationProps =
  CoverPicScreenScreenProps['navigation'];
export type CoverPicScreenScreenRouteProps = CoverPicScreenScreenProps['route'];

// MasteryOfLanguage Screen
export type MasteryOfLanguageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MasteryOfLanguage'
>;
export type MasteryOfLanguageScreenNavigationProps =
  MasteryOfLanguageScreenProps['navigation'];
export type MasteryOfLanguageScreenRouteProps =
  MasteryOfLanguageScreenProps['route'];

// Hobbies Screen
export type HobbiesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Hobbies'
>;
export type HobbiesScreenNavigationProps = HobbiesScreenProps['navigation'];
export type HobbiesScreenRouteProps = HobbiesScreenProps['route'];

// PostPictureScreen Screen
export type PostPictureScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PostPictureScreen'
>;
export type PostPictureScreenScreenNavigationProps =
  PostPictureScreenScreenProps['navigation'];
export type PostPictureScreenScreenRouteProps =
  PostPictureScreenScreenProps['route'];

// ReportScreen Screen
export type ReportScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ReportScreen'
>;
export type ReportScreenScreenNavigationProps =
  ReportScreenScreenProps['navigation'];
export type ReportScreenScreenRouteProps = ReportScreenScreenProps['route'];

// ShareReportScreen Screen
export type ShareReportScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ShareReportScreen'
>;
export type ShareReportScreenScreenNavigationProps =
  ShareReportScreenScreenProps['navigation'];
export type ShareReportScreenScreenRouteProps =
  ShareReportScreenScreenProps['route'];

// ShareOtherReport Screen
export type ShareOtherReportScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ShareOtherReport'
>;
export type ShareOtherReportScreenNavigationProps =
  ShareOtherReportScreenProps['navigation'];
export type ShareOtherReportScreenRouteProps =
  ShareOtherReportScreenProps['route'];

// MainScreen Screen
export type MainScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainScreen'
>;
export type MainScreenScreenNavigationProps =
  MainScreenScreenProps['navigation'];
export type MainScreenScreenRouteProps = MainScreenScreenProps['route'];

// QRScanner Screen
export type QRScannerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'QRScanner'
>;
export type QRScannerScreenNavigationProps = QRScannerScreenProps['navigation'];
export type QRScannerScreenRouteProps = QRScannerScreenProps['route'];

// Question_answer Screen
export type Question_answerScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Question_answer'
>;
export type Question_answerScreenNavigationProps =
  Question_answerScreenProps['navigation'];
export type Question_answerScreenRouteProps =
  Question_answerScreenProps['route'];

// QRScreen Screen
export type QRScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'QRScreen'
>;
export type QRScreenScreenNavigationProps = QRScreenScreenProps['navigation'];
export type QRScreenScreenRouteProps = QRScreenScreenProps['route'];

// TrimVideo Screen
export type TrimVideoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TrimVideo'
>;
export type TrimVideoScreenNavigationProps = TrimVideoScreenProps['navigation'];
export type TrimVideoScreenRouteProps = TrimVideoScreenProps['route'];

// SoundMainScreen Screen
export type SoundMainScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SoundMainScreen'
>;
export type SoundMainScreenScreenNavigationProps =
  SoundMainScreenScreenProps['navigation'];
export type SoundMainScreenScreenRouteProps =
  SoundMainScreenScreenProps['route'];

// UseSoundScreen Screen
export type UseSoundScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UseSoundScreen'
>;
export type UseSoundScreenScreenNavigationProps =
  UseSoundScreenScreenProps['navigation'];
export type UseSoundScreenScreenRouteProps = UseSoundScreenScreenProps['route'];

// HashtagScreen Screen
export type HashtagScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HashtagScreen'
>;
export type HashtagScreenScreenNavigationProps =
  HashtagScreenScreenProps['navigation'];
export type HashtagScreenScreenRouteProps = HashtagScreenScreenProps['route'];

// Favouratehashtag Screen
export type FavouratehashtagScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Favouratehashtag'
>;
export type FavouratehashtagScreenNavigationProps =
  FavouratehashtagScreenProps['navigation'];
export type FavouratehashtagScreenRouteProps =
  FavouratehashtagScreenProps['route'];

// Favouritesound Screen
export type FavouritesoundScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Favouritesound'
>;
export type FavouritesoundScreenNavigationProps =
  FavouritesoundScreenProps['navigation'];
export type FavouritesoundScreenRouteProps = FavouritesoundScreenProps['route'];

// CloseAccount Screen
export type CloseAccountScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CloseAccount'
>;
export type CloseAccountScreenNavigationProps =
  CloseAccountScreenProps['navigation'];
export type CloseAccountScreenRouteProps = CloseAccountScreenProps['route'];

// Favtab Screen
export type FavtabScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Favtab'
>;
export type FavtabScreenNavigationProps = FavtabScreenProps['navigation'];
export type FavtabScreenRouteProps = FavtabScreenProps['route'];

// Hello Screen
export type HelloScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Hello'
>;
export type HelloScreenNavigationProps = HelloScreenProps['navigation'];
export type HelloScreenRouteProps = HelloScreenProps['route'];

// ProfileReportListSelectionScreen Screen
export type ProfileReportListSelectionScreenScreenProps =
  NativeStackScreenProps<
    RootStackParamList,
    'ProfileReportListSelectionScreen'
  >;
export type ProfileReportListSelectionScreenScreenNavigationProps =
  ProfileReportListSelectionScreenScreenProps['navigation'];
export type ProfileReportListSelectionScreenScreenRouteProps =
  ProfileReportListSelectionScreenScreenProps['route'];

// ProfileReportScreen Screen
export type ProfileReportScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfileReportScreen'
>;
export type ProfileReportScreenScreenNavigationProps =
  ProfileReportScreenScreenProps['navigation'];
export type ProfileReportScreenScreenRouteProps =
  ProfileReportScreenScreenProps['route'];

// FollowingNotification Screen
export type FollowingNotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FollowingNotification'
>;
export type FollowingNotificationScreenNavigationProps =
  FollowingNotificationScreenProps['navigation'];
export type FollowingNotificationScreenRouteProps =
  FollowingNotificationScreenProps['route'];

// VideosNotification Screen
export type VideosNotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'VideosNotification'
>;
export type VideosNotificationScreenNavigationProps =
  VideosNotificationScreenProps['navigation'];
export type VideosNotificationScreenRouteProps =
  VideosNotificationScreenProps['route'];

// SystemNotification Screen
export type SystemNotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SystemNotification'
>;
export type SystemNotificationScreenNavigationProps =
  SystemNotificationScreenProps['navigation'];
export type SystemNotificationScreenRouteProps =
  SystemNotificationScreenProps['route'];

// YourProfileNotification Screen
export type YourProfileNotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'YourProfileNotification'
>;
export type YourProfileNotificationScreenNavigationProps =
  YourProfileNotificationScreenProps['navigation'];
export type YourProfileNotificationScreenRouteProps =
  YourProfileNotificationScreenProps['route'];

// GiftNotification Screen
export type GiftNotificationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GiftNotification'
>;
export type GiftNotificationScreenNavigationProps =
  GiftNotificationScreenProps['navigation'];
export type GiftNotificationScreenRouteProps =
  GiftNotificationScreenProps['route'];

// GiftRewardIntoCoinsScreen Screen
export type GiftRewardIntoCoinsScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'GiftRewardIntoCoinsScreen'
>;
export type GiftRewardIntoCoinsScreenScreenNavigationProps =
  GiftRewardIntoCoinsScreenScreenProps['navigation'];
export type GiftRewardIntoCoinsScreenScreenRouteProps =
  GiftRewardIntoCoinsScreenScreenProps['route'];

// SwitchToBalanceScreen Screen
export type SwitchToBalanceScreenScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwitchToBalanceScreen'
>;
export type SwitchToBalanceScreenScreenNavigationProps =
  SwitchToBalanceScreenScreenProps['navigation'];
export type SwitchToBalanceScreenScreenRouteProps =
  SwitchToBalanceScreenScreenProps['route'];

// ProfileBigPicScreen
export type ProfileBigPicScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfileBigPicScreen'
>;
export type ProfileBigPicScreenNavigationProps =
  ProfileBigPicScreenProps['navigation'];
export type ProfileBigPicScreenRouteProps = ProfileBigPicScreenProps['route'];

// MediaPickupScreen
export type MediaPickupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MediaPickupScreen'
>;
export type MediaPickupScreenNavigationProps =
  MediaPickupScreenProps['navigation'];
export type MediaPickupScreenRouteProps = MediaPickupScreenProps['route'];

// NewVideoScreen
export type NewVideoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NewVideoScreen'
>;
export type NewVideoScreenNavigationProps = NewVideoScreenProps['navigation'];
export type NewVideoScreenRouteProps = NewVideoScreenProps['route'];

//PictureFeedScreen
export type PictureFeedScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PictureFeedScreen'
>;
export type PictureFeedScreenNavigationProps =
  PictureFeedScreenProps['navigation'];
export type PictureFeedScreenRouteProps = PictureFeedScreenProps['route'];

// PicturePostDetails
export type PicturePostDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PicturePostDetails'
>;
export type PicturePostDetailsScreenNavigationProps =
  PicturePostDetailsScreenProps['navigation'];
export type PicturePostDetailsScreenRouteProps =
  PicturePostDetailsScreenProps['route'];

// CommentScreen
export type CommentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CommentScreen'
>;
export type CommentScreenNavigationProps = CommentScreenProps['navigation'];
export type CommentScreenRouteProps = CommentScreenProps['route'];

// LikeDetailsScreen
export type LikeDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LikeDetailsScreen'
>;
export type LikeDetailsScreenNavigationProps =
  LikeDetailsScreenProps['navigation'];
export type LikeDetailsScreenRouteProps = LikeDetailsScreenProps['route'];

//ShareDetailsScreen
export type ShareDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ShareDetailsScreen'
>;
export type ShareDetailsScreenNavigationProps =
  ShareDetailsScreenProps['navigation'];
export type ShareDetailsScreenRouteProps = ShareDetailsScreenProps['route'];

// SwitchToMoneyScreen
export type SwitchToMoneyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwitchToMoneyScreen'
>;
export type SwitchToMoneyScreenNavigationProps =
  SwitchToMoneyScreenProps['navigation'];
export type SwitchToMoneyScreenRouteProps = SwitchToMoneyScreenProps['route'];

// PreviousPayout
export type PreviousPayoutScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SwitchToMoneyScreen'
>;
export type PreviousPayoutScreenNavigationProps =
  PreviousPayoutScreenProps['navigation'];
export type PreviousPayoutScreenRouteProps = PreviousPayoutScreenProps['route'];

// HelpAndContact Screen
export type HelpAndContactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HelpAndContact'
>;
export type HelpAndContactScreenNavigationProps =
  HelpAndContactScreenProps['navigation'];
export type HelpAndContactScreenRouteProps = HelpAndContactScreenProps['route'];
