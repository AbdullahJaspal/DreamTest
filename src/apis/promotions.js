import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const startPromotions = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/promotion/startPromotions`;
  const result = await axios.post(url, data, config);
  return result.data;
};

export {startPromotions};
