import axios from 'axios';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';

const SendverificationRequest = async (token, data) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/verificationrequest/sendrequestforverification`;
  const result = await axios.post(url, data, config);
  return result.data;
};

export {SendverificationRequest};
