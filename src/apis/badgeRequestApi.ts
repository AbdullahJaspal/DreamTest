import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const createBadgeRequest = async (token: string, data: any) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/badgeRequest/createBadgeRequest`;

    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getBadgeRequestStatus = async (token: string, id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/badgeRequest/getBadgeRequestStatus/${id}`;
  const result = await axios.get(url, config);
  return result.data;
};

export {createBadgeRequest, getBadgeRequestStatus};
