import axios from 'axios';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';

const getAllMySuggestionAccount = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/suggestion/getAllMySuggestionAccount`;
  const result = await axios.get(url, config);

  return result.data;
};

const syncUserContact = async (token, contact) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/suggestion/syncUserContact`;
  const result = await axios.post(url, {contact}, config);

  return result.data;
};

export {getAllMySuggestionAccount, syncUserContact};
