import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const listTopics = async (page, limit) => {
  const url = `${SERVER_API_URL}/topic/listTopics/${page}/${limit}`;
  const result = await axios.get(url);
  return result.data;
};

const searchTopics = async search => {
  const url = `${SERVER_API_URL}/topic/searchTopics/${search}`;
  const result = await axios.get(url);
  return result.data;
};

export {listTopics, searchTopics};
