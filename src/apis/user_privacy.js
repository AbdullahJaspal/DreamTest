import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getUserPrivacy = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${SERVER_API_URL}/user_privacy/getUserPrivacy`;
  const result = await axios.get(url, config);
  return result.data;
};

const updateUserPrivacy = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${SERVER_API_URL}/user_privacy/updateUserPrivacy`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const updateUserCommentEnableAndDisable = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const value = {
    data: data,
  };
  const url = `${SERVER_API_URL}/user_privacy/updateUserUsercommentenableanddisable`;
  const result = await axios.patch(url, value, config);
  return result.data;
};

const updateHideLocationInProfile = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const value = {
    data: data,
  };
  const url = `${SERVER_API_URL}/user_privacy/updatehidelocationprofile`;
  const result = await axios.patch(url, value, config);
  return result.data;
};

const getUserPrivacyDetail = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${SERVER_API_URL}/user_privacy/getUserPrivacyDetail`;
  const result = await axios.get(url, config);
  return result.data;
};

const updateAllowScreenshotOrScreenRecording = async (token, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const value = {
    data: data,
  };
  const url = `${SERVER_API_URL}/user_privacy/updateAllowScreenshotOrScreenRecording`;
  const result = await axios.patch(url, value, config);
  return result.data;
};

const updateEnableOtherToSaveMyPost = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/user_privacy/updateEnableOtherToSaveMyPost`;
  const result = await axios.patch(url, {data}, config);
  return result.data;
};

const updateEnableOtherToDuetWithMyVideos = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/user_privacy/updateEnableOtherToDuetWithMyVideos`;
  const result = await axios.patch(url, {data}, config);
  return result.data;
};

const updateDontRecommendMeToMyFriends = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/user_privacy/updateDontRecommendMeToMyFriends`;
  const result = await axios.patch(url, {data}, config);
  return result.data;
};
export {
  getUserPrivacy,
  updateUserPrivacy,
  updateUserCommentEnableAndDisable,
  updateHideLocationInProfile,
  getUserPrivacyDetail,
  updateAllowScreenshotOrScreenRecording,
  updateEnableOtherToSaveMyPost,
  updateEnableOtherToDuetWithMyVideos,
  updateDontRecommendMeToMyFriends,
};
