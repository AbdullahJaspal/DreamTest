import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const Addfavouritehashtag = async (tag_id, token) => {
  const url = `${SERVER_API_URL}/favouritehashtag/addfavouratehashtag`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.post(url, tag_id, config);
  return result.data;
};

const Removefavouritehashtag = async (tag_id, token) => {
  const url = `${SERVER_API_URL}/favouritehashtag/removefavouratehashtag`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.post(url, tag_id, config);
  return result.data;
};

const getfavouritehashtag = async token => {
  const url = `${SERVER_API_URL}/favouritehashtag/getfavouritehashtag`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const getHastagDetailsFromHastagText = async (token, hastag_text) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/favouritehashtag/getHastagDetailsFromHastagText`;

  const result = await axios.post(url, {hastag_text}, config);
  return result.data;
};

export {
  Addfavouritehashtag,
  getfavouritehashtag,
  Removefavouritehashtag,
  getHastagDetailsFromHastagText,
};
