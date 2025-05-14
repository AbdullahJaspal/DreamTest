import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const addLiveSettings = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/live_stream/addLiveSettings`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const updateActiveLive = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/live_stream/updateActiveLive`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getAllActiveLiveStream = async (pageNo, pageSize) => {
  const url = `${SERVER_API_URL}/live_stream/getAllActiveLiveStream/${pageNo}/${pageSize}`;
  const result = await axios.get(url);
  return result;
};

const getAllLiveStreamGift = async data => {
  const url = `${SERVER_API_URL}/live_stream/getAllLiveStreamGift/${data}`;
  const result = await axios.get(url);
  return result;
};

const generateToken = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/live_stream/generateAgoraToken`;
  const result = await axios.post(url, data, config);
  return result;
};

export {
  addLiveSettings,
  updateActiveLive,
  getAllActiveLiveStream,
  getAllLiveStreamGift,
  generateToken,
};
