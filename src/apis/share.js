import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';
import axios from 'axios';
// addVideoShare
// addProfileShare
// addAudioShare
// addHastagShare
// addProfileInterested
// addProfileNotInterested
// reportUserProfile
// checkIsVideoSharedByUser
// getVideoIdFromVideoShareToken

const addVideoShare = async (
  token,
  user_id,
  video_id,
  sharing_platform,
  sharing_from,
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/share/addVideoShare`;
    const result = await axios.post(
      url,
      {video_id, user_id, sharing_platform, sharing_from},
      config,
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

const addProfileShare = async (
  token,
  shared_user_id,
  sharing_platform,
  sharing_from,
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/share/addProfileShare`;
    const result = await axios.post(
      url,
      {shared_user_id, sharing_from, sharing_platform},
      config,
    );

    return result.data;
  } catch (error) {
    throw error;
  }
};

const addAudioShare = async (token, sound_id) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/share/addAudioShare`;
  const result = await axios.post(url, {sound_id}, config);
  return result.data;
};

const addHastagShare = async (token, hastag_id) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/share/addHastagShare`;
  const result = await axios.post(url, {hastag_id}, config);
  return result.data;
};

const addProfileInterested = async (token, profile_id) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/share/addProfileInterested`;
  const result = await axios.post(url, {profile_id}, config);
  return result.data;
};

const addProfileNotInterested = async (token, profile_id) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/share/addProfileNotInterested`;
  const result = await axios.post(url, {profile_id}, config);
  return result.data;
};

const reportUserProfile = async (token, data) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };
  const url = `${SERVER_API_URL}/share/reportUserProfile`;
  const result = await axios.post(url, data, {headers});
  return result.data;
};

const getVideoIdFromVideoShareToken = async video_share_token => {
  const url = `${SERVER_API_URL}/share/getVideoIdFromVideoShareToken/${video_share_token}`;
  const result = await axios.get(url);
  return result.data;
};

const getUserIdFromUserShareToken = async profile_share_token => {
  try {
    const url = `${SERVER_API_URL}/share/getUserIdFromUserShareToken/${profile_share_token}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const checkIsVideoSharedByUser = async (token, videoId) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const data = {videoId: videoId};
    const url = `${SERVER_API_URL}/share/checkIsVideoSharedByUser`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  addVideoShare,
  addProfileShare,
  addAudioShare,
  addHastagShare,
  addProfileInterested,
  addProfileNotInterested,
  reportUserProfile,
  getVideoIdFromVideoShareToken,
  checkIsVideoSharedByUser,
  getUserIdFromUserShareToken,
};
