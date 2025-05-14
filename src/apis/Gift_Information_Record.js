import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getPurchaseCoins = async () => {
  const url = `${SERVER_API_URL}/users/getPurchaseCoins`;
  const result = await axios.get(url);
  return result.data;
};
const getRewardFromVideo = async () => {
  const url = `${SERVER_API_URL}/users/getRewardFromVideo`;
  const result = await axios.get(url);
  return result.data;
};
const getRewardFromRose = async () => {
  const url = `${SERVER_API_URL}/users/getRewardFromRoseMessage`;
  const result = await axios.get(url);
  return result.data;
};
const getRewardFromMessage = async () => {
  const url = `${SERVER_API_URL}/users/getRewardFromMessge`;
  const result = await axios.get(url);
  return result.data;
};
const getAllRewards = async user_id => {
  const url = `${SERVER_API_URL}/users/getAllTypesRewards`;
  const result = await axios.get(url, {params: {user_id}});
  return result.data;
};
const getUserFriendTransaction = async () => {
  const url = `${SERVER_API_URL}/users/getUserFriendTransaction`;
  const result = await axios.get(url);
  return result.data;
};
const UserFriendDiamond = async (data, token) => {
  console.log(data, 'datafromfrontendedapis');
  const url = `${SERVER_API_URL}/users/UserFriendSendDiamond`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.post(url, data, config);
  return result.data;
};
const Check_Username_Email = async (username, email) => {
  const url = `${SERVER_API_URL}/users/Check_Username_Email`;
  try {
    const result = await axios.get(url, {params: {username, email}});
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  getPurchaseCoins,
  getRewardFromVideo,
  getRewardFromRose,
  getRewardFromMessage,
  getAllRewards,
  UserFriendDiamond,
  Check_Username_Email,
};
