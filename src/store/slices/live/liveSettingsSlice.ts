// src/store/slices/ui/liveSettingsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define nested interfaces
interface SupervisorRole {
  he_can_mute_all_comment_in_the_live: boolean;
  he_can_temporarily_mute_user_comment_in_the_live: boolean;
}

interface SecreterialRole extends SupervisorRole {
  he_can_delete_the_users_comment_in_the_live: boolean;
  he_can_temporarily_block_user_comment_in_the_live: boolean;
}

interface AdministrationRole {
  he_can_mute_all_comment_in_the_live: boolean;
  he_can_delete_the_users_comment_in_the_live: boolean;
  he_can_temporarily_block_the_user_in_the_live: boolean;
  he_can_expel_users_in_the_live: boolean;
  he_can_turn_off_the_live_while: boolean;
  mute_voice_guests: boolean;
  kick_the_guest_out_of_the_live_post: boolean;
}

interface LiveSettings {
  topic: string;
  description: string;
  live_gift_allowed: boolean;
  audience_control_only_eighteen_plus: boolean;
  comment_allowed: boolean;
  filter_comment_allowed: boolean;
  mute_voice: string;
  supervisors_role: SupervisorRole;
  secreterial_role: SecreterialRole;
  administration_role: AdministrationRole;
  supervisors_list: any[];
  secreterial_list: any[];
  administration_list: any[];
  main_stream_url: string;
  live_active: boolean;
}

// Define the state interface
export interface LiveSettingsState {
  settings: LiveSettings;
  result: string;
  viewable_item: any[];
  chnaged_item: any[]; // Note: There's a typo in the original - consider fixing to "changed_item"
  video_sdk_token: string;
}

// Initial state with type
const initialState: LiveSettingsState = {
  settings: {
    topic: '',
    description: '',
    live_gift_allowed: true,
    audience_control_only_eighteen_plus: true,
    comment_allowed: true,
    filter_comment_allowed: false,
    mute_voice: '',
    supervisors_role: {
      he_can_mute_all_comment_in_the_live: true,
      he_can_temporarily_mute_user_comment_in_the_live: true,
    },
    secreterial_role: {
      he_can_mute_all_comment_in_the_live: true,
      he_can_temporarily_mute_user_comment_in_the_live: true,
      he_can_delete_the_users_comment_in_the_live: true,
      he_can_temporarily_block_user_comment_in_the_live: true,
    },
    administration_role: {
      he_can_mute_all_comment_in_the_live: true,
      he_can_delete_the_users_comment_in_the_live: true,
      he_can_temporarily_block_the_user_in_the_live: true,
      he_can_expel_users_in_the_live: true,
      he_can_turn_off_the_live_while: true,
      mute_voice_guests: true,
      kick_the_guest_out_of_the_live_post: true,
    },
    supervisors_list: [],
    secreterial_list: [],
    administration_list: [],
    main_stream_url: '',
    live_active: true,
  },
  result: '',
  viewable_item: [],
  chnaged_item: [],
  video_sdk_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyYzVkZjk2OC04OThkLTQ5NzAtYmM5OS1lM2FhODVmMzQxM2MiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNzQ1NzEzMywiZXhwIjoxNzM4OTkzMTMzfQ.pzA1-8kwXBtzh9f0LGnM0HZgVZlMsKq4YlH9RxXYgFw',
};

/**
 * Live Settings slice manages settings for live streaming sessions
 */
const liveSettingsSlice = createSlice({
  name: 'live_settings',
  initialState,
  reducers: {
    setTopic: (state, action: PayloadAction<string>) => {
      state.settings.topic = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.settings.description = action.payload;
    },
    setLiveGiftAllowed: (state, action: PayloadAction<boolean>) => {
      state.settings.live_gift_allowed = action.payload;
    },
    setAudienceControlEighteenPlus: (state, action: PayloadAction<boolean>) => {
      state.settings.audience_control_only_eighteen_plus = action.payload;
    },
    setCommentAllowed: (state, action: PayloadAction<boolean>) => {
      state.settings.comment_allowed = action.payload;
    },
    setFilterCommentAllowed: (state, action: PayloadAction<boolean>) => {
      state.settings.filter_comment_allowed = action.payload;
    },
    setMuteVoice: (state, action: PayloadAction<string>) => {
      state.settings.mute_voice = action.payload;
    },
    // Reducers for supervisors_role
    setSupervisorsRoleMuteAllComment: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.supervisors_role.he_can_mute_all_comment_in_the_live =
        action.payload;
    },
    setSupervisorsRoleTemporarilyMuteUser: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.supervisors_role.he_can_temporarily_mute_user_comment_in_the_live =
        action.payload;
    },
    // Reducers for secreterial_role
    setSecreterialRoleMuteAllComment: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.secreterial_role.he_can_mute_all_comment_in_the_live =
        action.payload;
    },
    setSecreterialRoleTemporarilyMuteUser: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.secreterial_role.he_can_temporarily_mute_user_comment_in_the_live =
        action.payload;
    },
    setSecreterialRoleDeleteUserComment: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.secreterial_role.he_can_delete_the_users_comment_in_the_live =
        action.payload;
    },
    setSecreterialRoleTemporarilyBlockUser: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.secreterial_role.he_can_temporarily_block_user_comment_in_the_live =
        action.payload;
    },
    // Reducers for administration_role
    setAdministrationRoleMuteAllComment: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.he_can_mute_all_comment_in_the_live =
        action.payload;
    },
    setAdministrationRoleDeleteUserComment: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.he_can_delete_the_users_comment_in_the_live =
        action.payload;
    },
    setAdministrationRoleTemporarilyBlockUser: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.he_can_temporarily_block_the_user_in_the_live =
        action.payload;
    },
    setAdministrationRoleExpelUsers: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.he_can_expel_users_in_the_live =
        action.payload;
    },
    setAdministrationRoleTurnOffLive: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.he_can_turn_off_the_live_while =
        action.payload;
    },
    setAdministrationRoleMuteVoiceGuests: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.mute_voice_guests = action.payload;
    },
    setAdministrationRoleKickGuestOut: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.administration_role.kick_the_guest_out_of_the_live_post =
        action.payload;
    },
    setSupervisorsList: (state, action: PayloadAction<any[]>) => {
      state.settings.supervisors_list = action.payload;
    },
    setSecreterialList: (state, action: PayloadAction<any[]>) => {
      state.settings.secreterial_list = action.payload;
    },
    setAdministrationList: (state, action: PayloadAction<any[]>) => {
      state.settings.administration_list = action.payload;
    },
    setMainStreamUrl: (state, action: PayloadAction<string>) => {
      state.settings.main_stream_url = action.payload;
    },
    setLiveActive: (state, action: PayloadAction<boolean>) => {
      state.settings.live_active = action.payload;
    },
    changeTopic: (state, action: PayloadAction<string>) => {
      state.settings.topic = action.payload;
    },
    setResult: (state, action: PayloadAction<string>) => {
      state.result = action.payload;
    },
    setViewableItem: (state, action: PayloadAction<any[]>) => {
      state.viewable_item = action.payload;
    },
    setChangedItem: (state, action: PayloadAction<any[]>) => {
      state.chnaged_item = action.payload;
    },
    setVideoSdkLiveToken: (state, action: PayloadAction<string>) => {
      state.video_sdk_token = action.payload;
    },
  },
});

// Export actions
export const {
  setTopic,
  setDescription,
  setLiveGiftAllowed,
  setAudienceControlEighteenPlus,
  setCommentAllowed,
  setFilterCommentAllowed,
  setMuteVoice,
  setSupervisorsRoleMuteAllComment,
  setSupervisorsRoleTemporarilyMuteUser,
  setSecreterialRoleMuteAllComment,
  setSecreterialRoleTemporarilyMuteUser,
  setSecreterialRoleDeleteUserComment,
  setSecreterialRoleTemporarilyBlockUser,
  setAdministrationRoleMuteAllComment,
  setAdministrationRoleDeleteUserComment,
  setAdministrationRoleTemporarilyBlockUser,
  setAdministrationRoleExpelUsers,
  setAdministrationRoleTurnOffLive,
  setAdministrationRoleMuteVoiceGuests,
  setAdministrationRoleKickGuestOut,
  setSupervisorsList,
  setSecreterialList,
  setAdministrationList,
  setMainStreamUrl,
  setLiveActive,
  changeTopic,
  setResult,
  setViewableItem,
  setChangedItem,
  setVideoSdkLiveToken,
} = liveSettingsSlice.actions;

// Export reducer
export default liveSettingsSlice.reducer;
