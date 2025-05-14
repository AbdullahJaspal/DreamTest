import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getHashtags = async (search_txt: any, page: number, limit: number) => {
  const url = `${SERVER_API_URL}/search/gethastag/${search_txt}/${page}/${limit}`;
  const result = await axios.get(url);
  return result.data;
};

const getVideoThroughTag = async (tag_id: number) => {
  const url = `${SERVER_API_URL}/search/getVideoThroughTag/${tag_id}`;
  const result = await axios.get(url);
  return result.data;
};

const getFullVideoThroughTag = async (
  tag_id: number,
  video_id: number,
  page: number,
  limit: number,
) => {
  const url = `${SERVER_API_URL}/search/getFullVideoThroughTag/${tag_id}/${video_id}/${page}/${limit}`;
  const result = await axios.get(url);
  return result.data;
};

export {getHashtags, getVideoThroughTag, getFullVideoThroughTag};
