import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';
import axios from 'axios';

const getAvatar = async () => {
  const url = `${SERVER_API_URL}/users/avatar`;
  const result = await axios.get(url);
  return result;
};

export {getAvatar};
