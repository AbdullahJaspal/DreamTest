import {SERVER_API_URL} from '../constants/constants';
import axios from 'axios';

const searchUser = async (text: string) => {
  const url = `${SERVER_API_URL}/search/searchUser/${text}`;

  const result = await axios.get(url);
  return result.data;
};

const searchOnlyUser = async (text: string) => {
  const url = `${SERVER_API_URL}/search/searchOnlyUser/${text}`;

  const result = await axios.get(url);
  return result.data;
};

const searchUserForInfo = async (text: string) => {
  const url = `${SERVER_API_URL}/search/searchUserForInfo/${text}`;
  const result = await axios.get(url);
  return result.data;
};

const searchHashtagForInfo = async (text: string) => {
  const url = `${SERVER_API_URL}/search/searchHashtagForInfo/${text}`;
  const result = await axios.get(url);
  return result.data;
};

export {searchUser, searchOnlyUser, searchHashtagForInfo, searchUserForInfo};
