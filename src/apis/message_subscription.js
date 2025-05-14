import axios from 'axios';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';

const getMessageSubscription = async (data, token) => {
  const url = `${SERVER_API_URL}/message_subscription/getMessageSubscription`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.post(url, data, config);
  return result.data;
};

export {getMessageSubscription};
