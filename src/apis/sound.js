import axios from 'axios';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';

const addFavouriteSound = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/sound/addFavouriteSound`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const removeFavouriteSound = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/sound/removeFavouriteSound`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getFavouriteSound = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/sound/getFavouriteSound`;
  const result = await axios.get(url, config);
  return result.data;
};

export {getFavouriteSound, addFavouriteSound, removeFavouriteSound};
