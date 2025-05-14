import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getLikeAnalytics = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getLikeAnalytics/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getTotalLikedPosts = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getTotalLikedPosts/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getTotalLikesReceived = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getTotalLikesReceived/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const ViewersSubmitComment = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/ViewersSubmitComment/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getCoinAnalytics = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getCoinAnalytics/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getSentCoinsAnalytics = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getSentCoinsAnalytics/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getFollowAnalytics = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getFollowAnalytics/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getFollowAnalyticsByUser = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getFollowAnalyticsByUser/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getUserInteractions = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getUserInteractions/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getReceivedCommentsByUser = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getReceivedCommentsByUser/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  // console.log("RESULT", result.data);
  return result.data;
};

const getSentCommentsByUser = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getSentCommentsByUser/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  // console.log("RESULT", result.data.payload);
  return result.data;
};

const getTotalSharesSentByUser = async (token, startingtime, endingTime) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getTotalSharesSentByUser/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  // console.log("RESULT", result.data.payload);
  return result.data;
};

const getTotalSharesReceivedByUser = async (
  token,
  startingtime,
  endingTime,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/analytics/getTotalSharesReceivedByUser/${startingtime}/${endingTime}`;
  const result = await axios.get(url, config);
  // console.log("RESULT SHARE RECIVED", result.data);
  return result.data;
};

const getViewersDetails = async token => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/analytics/getViewersDetails`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    console.error('Error fetching viewers details:', error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch viewers details.',
    );
  }
};

export {
  ViewersSubmitComment,
  getLikeAnalytics,
  getCoinAnalytics,
  getFollowAnalytics,
  getFollowAnalyticsByUser,
  getUserInteractions,
  getTotalLikedPosts,
  getTotalLikesReceived,
  getReceivedCommentsByUser,
  getSentCommentsByUser,
  getSentCoinsAnalytics,
  getTotalSharesSentByUser,
  getTotalSharesReceivedByUser,
  getViewersDetails,
};
