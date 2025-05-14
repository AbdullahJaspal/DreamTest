import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getAllGiftListByCategories = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/gift/getAllGiftListByCategories`;
  const result = await axios.get(url, config);
  return result.data;
};

const sendBoxGift = async (token, data) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/gift/sendBoxGift`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const checkBoxGiftAvalible = async (token, video_id) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/gift/checkBoxGiftAvalible/${video_id}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const claimedBoxGift = async (token, data) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/gift/claimedBoxGift`;
    const result = await axios.get(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAllGiftListByCategories,
  sendBoxGift,
  checkBoxGiftAvalible,
  claimedBoxGift,
};
