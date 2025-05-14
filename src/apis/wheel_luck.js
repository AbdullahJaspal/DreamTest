import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const purchaseWheelLuck = async (token, data) => {
  const url = `${SERVER_API_URL}/wheel_luck/purchaseWheelLuck`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.post(url, data, config);
  return result.data;
};

const getWheelLuck = async user_id => {
  const url = `${SERVER_API_URL}/wheel_luck/getWheelLuck/${user_id}`;

  const result = await axios.get(url);
  return result.data;
};

export {purchaseWheelLuck, getWheelLuck};
