import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const like = async (
  data: {video_id: any; reciever_id: any; unlike: boolean},
  token: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/likes/video_like`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getUserAllLike = async (user_id: any) => {
  const url = `${SERVER_API_URL}/likes/getUserAllLike/${user_id}`;
  const result = await axios.get(url);
  return result.data;
};

const getAllLikeOfVideoByVideoId = async (video_id: any) => {
  const url = `${SERVER_API_URL}/likes/getAllLikeOfVideoByVideoId/${video_id}`;
  const result = await axios.get(url);
  return result.data;
};

export {like, getUserAllLike, getAllLikeOfVideoByVideoId};
