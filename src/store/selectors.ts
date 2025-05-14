// src/store/selectors.ts
import {createSelector} from '@reduxjs/toolkit';
import {RootState} from './store';
import {ExtendedMessage} from '../utils/chatUtils';

// Box Gift Selectors
export const selectShowBoxGift = (state: RootState) =>
  state.box_gift.show_box_gift;

// MainScreen Selectors
export const selectIsShowComment = (state: RootState) =>
  state.mainScreen.isShowComment;
export const selectCurrentComment = (state: RootState) =>
  state.mainScreen.currentComment;
export const selectShowReply = (state: RootState) => state.mainScreen.showReply;
export const selectCommentId = (state: RootState) =>
  state.mainScreen.comment_id;
export const selectCommentPrivacy = (state: RootState) =>
  state.mainScreen.commentPrivacy;
export const selectIsShowGift = (state: RootState) =>
  state.mainScreen.isShowGift;

// Video Selectors
export const selectVideo = (state: RootState) => state.video;
export const selectVideoUrl = (state: RootState) => state.video.video_url;
export const selectShowLoader = (state: RootState) => state.video.show_loader;
export const selectPlayVideo = (state: RootState) => state.video.play_video;
export const selectShowRecording = (state: RootState) =>
  state.video.show_recording;
export const selectTextOverlay = (state: RootState) => state.video.text_overlay;
export const selectGiftData = (state: RootState) => state.video.giftData;

// Index Selectors - Navigation
export const selectCurrentBottomTab = (state: RootState) =>
  state.index.currentBottomTab;

// Index Selectors - Auth UI
export const selectBottomSheetSignIn = (state: RootState) =>
  state.index.bottomSheetSignIn;
export const selectCurrentUser = (state: RootState) => state.index.currentUser;
export const selectModalSignIn = (state: RootState) => state.index.modalSignIn;
export const selectBottomSheetSettingProfile = (state: RootState) =>
  state.index.bottomSheetSettingProfile;
export const selectBottomSheetLogout = (state: RootState) =>
  state.index.bottomSheetLogout;

// Index Selectors - Video
export const selectCurrentVideo = (state: RootState) =>
  state.index.currentVideo;
export const selectVideoPlayback = (state: RootState) =>
  state.index.video_playback;
export const selectShowVideoSectionIcons = (state: RootState) =>
  state.index.showVideoSectionIcons;

// Index Selectors - Payment/Recharge
export const selectRechargeSheet = (state: RootState) =>
  state.index.rechargeSheet;
export const selectPaymentSelection = (state: RootState) =>
  state.index.paymentSelection;
export const selectSelectedRechargeData = (state: RootState) =>
  state.index.selected_recharge_sheet_data;

// Index Selectors - Sharing
export const selectShareSheet = (state: RootState) => state.index.shareSheet;
export const selectShareContent = (state: RootState) =>
  state.index.shareContent;
export const selectShowProfileShareSheet = (state: RootState) =>
  state.index.showProfileShareSheet;
export const selectProfileShareContent = (state: RootState) =>
  state.index.profileShareContent;
export const selectShowHastagShareSheet = (state: RootState) =>
  state.index.showHastagShareSheet;
export const selectHastagShareContent = (state: RootState) =>
  state.index.hastagShareContent;
export const selectShowSoundShareSheet = (state: RootState) =>
  state.index.showSoundShareSheet;
export const selectSoundShareContent = (state: RootState) =>
  state.index.soundShareContent;

// Index Selectors - Favorites
export const selectFavoriteSounds = (state: RootState) =>
  state.index.favoriteSound;
export const selectDreamSounds = (state: RootState) => state.index.dreamSound;
export const selectFavoriteUsers = (state: RootState) =>
  state.index.favoriteUser;

// Memoized selector for checking if a sound is in favorites
export const makeSelectIsSoundFavorite = () => {
  return createSelector(
    [selectFavoriteSounds, (_, soundId: number) => soundId],
    (favoriteSounds, soundId) =>
      favoriteSounds.some(
        sound => sound.id === soundId || sound.sound_id === soundId,
      ),
  );
};

// Memoized selector for checking if a user is in favorites
export const makeSelectIsUserFavorite = () => {
  return createSelector(
    [selectFavoriteUsers, (_, userId: number) => userId],
    (favoriteUsers, userId) =>
      favoriteUsers.some(user => user.favourite_user_id === userId),
  );
};

// User Profile Selectors
export const MyProfileData = (state: RootState) => state.my_data;
export const selectMyProfileData = (state: RootState) =>
  state.my_data.my_profile_data;
export const selectIsLogin = (state: RootState) => state.my_data.isLogin;
export const selectBottomTabHeight = (state: RootState) =>
  state.my_data.bottomTabHeight;
export const selectBottomSectionHeight = (state: RootState) =>
  state.my_data.bottomSectionHeight;

// Memoized selectors for specific user profile fields
export const selectUserWallet = createSelector(
  [selectMyProfileData],
  profileData => profileData?.wallet || 0,
);

export const selectUserNickname = createSelector(
  [selectMyProfileData],
  profileData => profileData?.nickname || '',
);

export const selectUserUsername = createSelector(
  [selectMyProfileData],
  profileData => profileData?.username || '',
);

export const selectUserProfilePic = createSelector(
  [selectMyProfileData],
  profileData => profileData?.profile_pic || '',
);

export const selectUserBio = createSelector(
  [selectMyProfileData],
  profileData => profileData?.bio || '',
);

export const selectUserVerified = createSelector(
  [selectMyProfileData],
  profileData => profileData?.verified || false,
);

// Socket Selector
export const selectSocket = (state: RootState) => state.socket.socket;

// Follow Details Selectors
export const selectFollowers = (state: RootState) =>
  state.followDetails.followers;
export const selectFollowing = (state: RootState) =>
  state.followDetails.following;

// Memoized selector to check if a user is being followed
export const makeSelectIsUserFollowed = () => {
  return createSelector(
    [selectFollowing, (_, userId: string) => userId],
    (following, userId) => following.includes(userId),
  );
};

// Memoized selector to check if a user is a follower
export const makeSelectIsUserFollower = () => {
  return createSelector(
    [selectFollowers, (_, userId: string) => userId],
    (followers, userId) => followers.includes(userId),
  );
};

// Picture Post Selectors
export const selectPicturePostData = (state: RootState) =>
  state.picture_post.postData;
export const selectShowMoreOptions = (state: RootState) =>
  state.picture_post.showMoreOptions;
export const selectSelectedCommentData = (state: RootState) =>
  state.picture_post.selectedCommentData;
export const selectEnableEditComment = (state: RootState) =>
  state.picture_post.enableEditComment;
export const selectCurrentCommentUserIds = (state: RootState) =>
  state.picture_post.currentCommentUserIds;
export const selectTotalNoOfComment = (state: RootState) =>
  state.picture_post.totalNoOfComment;
export const selectSharePostRootId = (state: RootState) =>
  state.picture_post.sharePostRootId;
export const selectBlockedUserIds = (state: RootState) =>
  state.picture_post.blockedUserIds;
export const selectHiddenPostIds = (state: RootState) =>
  state.picture_post.hiddenPostIds;
export const selectRemovePostIds = (state: RootState) =>
  state.picture_post.removePostIds;
export const selectShowReportModal = (state: RootState) =>
  state.picture_post.showReportModal;
export const selectFavoritePosts = (state: RootState) =>
  state.picture_post.favoritePosts;
export const selectFavoritePostSocket = (state: RootState) =>
  state.picture_post.favoritePostSocket;
export const selectFavoritesPostCount = (state: RootState) =>
  state?.picture_post.favoritesPostCount;

// Memoized selectors for checking conditions
export const makeSelectIsPostFavorite = () => {
  return createSelector(
    [selectFavoritePosts, (_, postId: number) => postId],
    (favoritePosts, postId) => favoritePosts.some(post => post.id === postId),
  );
};

export const makeSelectIsUserBlocked = () => {
  return createSelector(
    [selectBlockedUserIds, (_, userId: number) => userId],
    (blockedUserIds, userId) => blockedUserIds.includes(userId),
  );
};

export const makeSelectIsPostHidden = () => {
  return createSelector(
    [selectHiddenPostIds, (_, postId: number) => postId],
    (hiddenPostIds, postId) => hiddenPostIds.includes(postId),
  );
};

// Live Manager Selectors
export const selectIsLocalMicEnabled = (state: RootState) =>
  state.live_manager.isLocalMicEnabled;
export const selectIsLocalVideoEnabled = (state: RootState) =>
  state.live_manager.isLocalVideoEnabled;
export const selectActiveStyleNo = (state: RootState) =>
  state.live_manager.activeStyleNo;
export const selectNoOfActiveGuest = (state: RootState) =>
  state.live_manager.noOfActiveGuest;
export const selectActiveStyleName = (state: RootState) =>
  state.live_manager.activeStyleName;

// Notification Selectors
export const selectNotificationData = (state: RootState) =>
  state.notification.notification_data;
export const selectUnreadNotification = (state: RootState) =>
  state.notification.unread_notification;

// Location Selection Selectors
export const locationSelection = (state: RootState) => state.location_selection;
export const selectNoOfCountryAllowedToSelect = (state: RootState) =>
  state.location_selection.noOFCountryAllowedToSelect;
export const selectIsAllSelectionAllowedInCountry = (state: RootState) =>
  state.location_selection.isAllSelectionAllowedInCountry;
export const selectNoOfCitiesAllowedToSelect = (state: RootState) =>
  state.location_selection.noOFCitiesAllowedToSelect;
export const selectIsAllSelectionAllowedInCities = (state: RootState) =>
  state.location_selection.isAllSelectionAllowedInCities;
export const selectShowBadgeModal = (state: RootState) =>
  state.location_selection.showBadgeModal;
export const selectBadgeType = (state: RootState) =>
  state.location_selection.badgeType;

// External Sound Selectors
export const selectExternalAudio = (state: RootState) =>
  state.externalaudio_url;
export const selectExternalAudioUrl = (state: RootState) =>
  state.externalaudio_url.external_audio_url;
export const selectNickname = (state: RootState) =>
  state.externalaudio_url.nickname;
export const selectRemixedVideoId = (state: RootState) =>
  state.externalaudio_url.remixedVideoId;
export const selectSoundRemoteUrl = (state: RootState) =>
  state.externalaudio_url.soundRemoteUrl;

// Favorite Hashtags Selectors
export const selectFavoriteHashtags = (state: RootState) =>
  state.favoriteHashtags.hashtags;

// Helper selector to find a specific hashtag by id
export const selectFavoriteHashtagById = (state: RootState, id: number) =>
  state.favoriteHashtags.hashtags.find(hashtag => hashtag.tag_id === id);

// Live Multi Button Selectors
export const selectShowVoiceEffect = (state: RootState) =>
  state.live_multi_button.show_voice_effect;
export const selectShowPrivateRoom = (state: RootState) =>
  state.live_multi_button.show_private_room;
export const selectShowVoteMatch = (state: RootState) =>
  state.live_multi_button.show_vote_match;
export const selectShowMultiGuest = (state: RootState) =>
  state.live_multi_button.show_multi_guest;
export const selectShowVoiceChatRoom = (state: RootState) =>
  state.live_multi_button.show_voice_chat_room;
export const selectShowGamesRoom = (state: RootState) =>
  state.live_multi_button.show_games_room;
export const selectShowVote = (state: RootState) =>
  state.live_multi_button.show_vote;
export const selectShowQuestionsAndAnswers = (state: RootState) =>
  state.live_multi_button.show_questions_and_answers;
export const selectShowBuyFrame = (state: RootState) =>
  state.live_multi_button.show_buy_frame;
export const selectShowAdministration = (state: RootState) =>
  state.live_multi_button.show_administration;
export const selectShowColorFont = (state: RootState) =>
  state.live_multi_button.show_color_font;
export const selectShowNote = (state: RootState) =>
  state.live_multi_button.show_note;
export const selectShowBlackOut = (state: RootState) =>
  state.live_multi_button.show_black_out;
export const selectShowFont = (state: RootState) =>
  state.live_multi_button.show_font;
export const selectShowBackgroundPicture = (state: RootState) =>
  state.live_multi_button.show_background_picture;
export const selectShowVideoBackground = (state: RootState) =>
  state.live_multi_button.show_video_background;
export const selectShowGifBackground = (state: RootState) =>
  state.live_multi_button.show_gif_background;
export const selectShowMusic = (state: RootState) =>
  state.live_multi_button.show_music;
export const selectShowGift = (state: RootState) =>
  state.live_multi_button.show_gift;
export const selectShowWheelBox = (state: RootState) =>
  state.live_multi_button.show_wheel_box;
export const selectShowLuckyWheel = (state: RootState) =>
  state.live_multi_button.show_lucky_wheel;
export const selectShowRecordLive = (state: RootState) =>
  state.live_multi_button.show_record_live;
export const selectShowCustomWheelLuck = (state: RootState) =>
  state.live_multi_button.show_custom_wheel_luck;

// Group selector for related UI elements
export const selectWheelRelatedVisibility = (state: RootState) => ({
  showWheelBox: state.live_multi_button.show_wheel_box,
  showLuckyWheel: state.live_multi_button.show_lucky_wheel,
  showCustomWheelLuck: state.live_multi_button.show_custom_wheel_luck,
});

// Group selector for background-related UI elements
export const selectBackgroundRelatedVisibility = (state: RootState) => ({
  showBackgroundPicture: state.live_multi_button.show_background_picture,
  showVideoBackground: state.live_multi_button.show_video_background,
  showGifBackground: state.live_multi_button.show_gif_background,
});

// Post Hashtag Selectors
export const selectHashtagTitle = (state: RootState) =>
  state.Hashtag.Hashtag_title;

// Post Data Selectors
export const selectPostProgressValue = (state: RootState) =>
  state.post_data.progreess_value;
export const selectShowUploadingInfo = (state: RootState) =>
  state.post_data.show_uploading_info;

// Search Selectors
export const selectTxtSearch = (state: RootState) => state.search.txtSearch;

// Privacy Selectors
export const selectMyPrivacy = (state: RootState) =>
  state.user_privacy.my_privacy;

// Individual privacy settings selectors
export const selectCommentEnabled = (state: RootState) =>
  state.user_privacy.my_privacy?.enable_other_to_comment_on_my_post;

export const selectLocationHidden = (state: RootState) =>
  state.user_privacy.my_privacy?.hide_location_in_profile;

export const selectScreenshotAllowed = (state: RootState) =>
  state.user_privacy.my_privacy
    ?.allow_screenshot_or_screen_recording_of_my_content;

export const selectSavePostAllowed = (state: RootState) =>
  state.user_privacy.my_privacy?.enable_other_to_save_my_post;

export const selectDuetAllowed = (state: RootState) =>
  state.user_privacy.my_privacy?.enable_other_to_duet_with_my_videos;

export const selectDontRecommendToFriends = (state: RootState) =>
  state.user_privacy.my_privacy?.dont_recommened_me_to_my_friends;

// Main selectors
export const selectLiveSettings = (state: RootState) =>
  state.live_settings.settings;
export const selectLiveResult = (state: RootState) =>
  state.live_settings.result;
export const selectLiveViewableItems = (state: RootState) =>
  state.live_settings.viewable_item;
export const selectLiveChangedItems = (state: RootState) =>
  state.live_settings.chnaged_item;
export const selectVideoSdkToken = (state: RootState) =>
  state.live_settings.video_sdk_token;

// Basic settings
export const selectLiveTopic = (state: RootState) =>
  state.live_settings.settings.topic;
export const selectLiveDescription = (state: RootState) =>
  state.live_settings.settings.description;
export const selectLiveGiftAllowed = (state: RootState) =>
  state.live_settings.settings.live_gift_allowed;
export const selectAudienceControlEighteenPlus = (state: RootState) =>
  state.live_settings.settings.audience_control_only_eighteen_plus;
export const selectCommentAllowed = (state: RootState) =>
  state.live_settings.settings.comment_allowed;
export const selectFilterCommentAllowed = (state: RootState) =>
  state.live_settings.settings.filter_comment_allowed;
export const selectMuteVoice = (state: RootState) =>
  state.live_settings.settings.mute_voice;
export const selectMainStreamUrl = (state: RootState) =>
  state.live_settings.settings.main_stream_url;
export const selectLiveActive = (state: RootState) =>
  state.live_settings.settings.live_active;

// Role selectors
export const selectSupervisorsRole = (state: RootState) =>
  state.live_settings.settings.supervisors_role;
export const selectSecreterialRole = (state: RootState) =>
  state.live_settings.settings.secreterial_role;
export const selectAdministrationRole = (state: RootState) =>
  state.live_settings.settings.administration_role;

// Lists selectors
export const selectSupervisorsList = (state: RootState) =>
  state.live_settings.settings.supervisors_list;
export const selectSecreterialList = (state: RootState) =>
  state.live_settings.settings.secreterial_list;
export const selectAdministrationList = (state: RootState) =>
  state.live_settings.settings.administration_list;

// Group selector for basic settings
export const selectLiveBasicSettings = (state: RootState) => ({
  topic: state.live_settings.settings.topic,
  description: state.live_settings.settings.description,
  liveGiftAllowed: state.live_settings.settings.live_gift_allowed,
  audienceControlEighteenPlus:
    state.live_settings.settings.audience_control_only_eighteen_plus,
  commentAllowed: state.live_settings.settings.comment_allowed,
  filterCommentAllowed: state.live_settings.settings.filter_comment_allowed,
  muteVoice: state.live_settings.settings.mute_voice,
  mainStreamUrl: state.live_settings.settings.main_stream_url,
  liveActive: state.live_settings.settings.live_active,
});

// Live Viewers Manager Selectors
export const selectViewerRole = (state: RootState) =>
  state.live_viewers_manager.role;

// Group selector for all viewer settings
export const selectViewerSettings = (state: RootState) => ({
  role: state.live_viewers_manager.role,
  isLocalVideoEnabled: state.live_viewers_manager.isLocalVideoEnabled,
  activeStyleNo: state.live_viewers_manager.activeStyleNo,
  noOfActiveGuest: state.live_viewers_manager.noOfActiveGuest,
  activeStyleName: state.live_viewers_manager.activeStyleName,
});

// Chat Theme Selectors
export const selectChatThemeColor = (state: RootState) =>
  state.themeColor.chatThemeColor;
export const selectDefaultChatColor = (state: RootState) =>
  state.themeColor.defaultChatColor;
export const selectRecentColors = (state: RootState) =>
  state.themeColor.recentColors;
export const selectIsDarkMode = (state: RootState) => state.themeColor.darkMode;

// Group selector for all theme settings
export const selectThemeSettings = (state: RootState) => ({
  chatThemeColor: state.themeColor.chatThemeColor,
  defaultChatColor: state.themeColor.defaultChatColor,
  recentColors: state.themeColor.recentColors,
  darkMode: state.themeColor.darkMode,
});

export const selectFavoritesUpdateCount = (state: RootState) =>
  state?.index.favoritesUpdateCount;

// Basic selectors for messages
export const selectAllMessages = (state: RootState) => state.messages.messages;
export const selectLoadingEarlier = (state: RootState) =>
  state.messages.loadingEarlier;
export const selectHasMoreMessages = (state: RootState) =>
  state.messages.hasMoreMessages;
export const selectMessagesPage = (state: RootState) => state.messages.page;
export const selectIsUploading = (state: RootState) =>
  state.messages.isUploading;

// Memoized selector to get messages for a specific room
export const makeSelectMessagesForRoom = () => {
  return createSelector(
    [selectAllMessages, (_, roomId: string) => roomId],
    (allMessages, roomId): ExtendedMessage[] => allMessages[roomId] || [],
  );
};

// Memoized selector to get loading state for a specific room
export const makeSelectLoadingEarlierForRoom = () => {
  return createSelector(
    [selectLoadingEarlier, (_, roomId: string) => roomId],
    (loadingEarlier, roomId): boolean => loadingEarlier[roomId] || false,
  );
};

// Memoized selector to check if there are more messages for a specific room
export const makeSelectHasMoreMessagesForRoom = () => {
  return createSelector(
    [selectHasMoreMessages, (_, roomId: string) => roomId],
    (hasMoreMessages, roomId): boolean => hasMoreMessages[roomId] || false,
  );
};

// Memoized selector to get page number for a specific room
export const makeSelectPageForRoom = () => {
  return createSelector(
    [selectMessagesPage, (_, roomId: string) => roomId],
    (pages, roomId): number => pages[roomId] || 1,
  );
};

// Memoized selector to get uploading status for a specific room
export const makeSelectIsUploadingForRoom = () => {
  return createSelector(
    [selectIsUploading, (_, roomId: string) => roomId],
    (isUploading, roomId): boolean => isUploading[roomId] || false,
  );
};

// Memoized selector to find a specific message in a room
export const makeSelectMessageById = () => {
  return createSelector(
    [
      selectAllMessages,
      (_, params: {roomId: string; messageId: string}) => params,
    ],
    (allMessages, {roomId, messageId}): ExtendedMessage | undefined => {
      const roomMessages = allMessages[roomId] || [];
      return roomMessages.find(msg => msg._id === messageId);
    },
  );
};
