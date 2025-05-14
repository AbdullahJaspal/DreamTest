import axios from 'axios';
import {SERVER_API_URL} from '../../constants/constants';

export const getMedia = async (id: string, authToken?: string) => {
  try {
    const url = `${SERVER_API_URL}/users/getAllMedia/${id}`;
    console.log('Requesting URL:', url);

    const config = authToken
      ? {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      : {};

    const response = await axios.get(url, config);
    return response.data;
  } catch (error: any) {
    console.error(
      'Media fetch error:',
      error.response?.status,
      error.response?.data || error.message,
    );
    throw error;
  }
};

// export const uploadMedia = async (data, token) => {
//   const config = {
//     headers: {Authorization: `Bearer ${token}`},
//   };
//   const url = `${SERVER_API_URL}/comments/replyComment`;
//   const result = await axios.post(url, data, config);
//   return result.data;
// };
