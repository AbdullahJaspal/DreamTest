import axios from 'axios';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';

const getAllNotification = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllNotification`;
  const result = await axios.get(url, config);

  return result.data;
};

const readNotification = async (token, ids) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/readNotification`;
  const result = await axios.post(url, {ids}, config);
  return result.data;
};

const getAllUnreadNotificationByCategories = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllUnreadNotificationByCategories`;
  const result = await axios.get(url, config);
  return result.data;
};

const getAllFollowingNotification = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllFollowingNotification`;
  const result = await axios.get(url, config);
  return result.data;
};

const getAllSystemNotification = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllSystemNotification`;
  const result = await axios.get(url, config);
  return result.data;
};

const getAllVideosNotification = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllVideosNotification`;
  const result = await axios.get(url, config);
  return result.data;
};

const getAllYourProfileNotification = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllYourProfileNotification`;
  const result = await axios.get(url, config);
  return result.data;
};

const getAllYourGiftNotification = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/notification/getAllYourGiftNotification`;
  const result = await axios.get(url, config);
  return result.data;
};

export {
  getAllNotification,
  readNotification,
  getAllUnreadNotificationByCategories,
  getAllYourProfileNotification,
  getAllVideosNotification,
  getAllSystemNotification,
  getAllFollowingNotification,
  getAllYourGiftNotification,
};
