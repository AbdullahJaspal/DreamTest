import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getAudios = async (q: any, limit: any, page: any) => {
  const url = `${SERVER_API_URL}/audio?q=${q}&page=${page}&limit=${limit}`;
  const result = await axios.get(url);
  return result.data;
};

const getAudioById = async (id: any) => {
  const url = `${SERVER_API_URL}/audio/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getCompleteRemixedAudioByVideoId = async (video_id: number) => {
  try {
    const url = `${SERVER_API_URL}/audio/getCompleteRemixedAudioByVideoId/${video_id}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

interface RequestFullAudioProps {
  video_id: number;
  respected_id: number;
  page: number;
  limit: number;
}
const getFullCompleteRemixedAudioByVideoId = async (
  data: RequestFullAudioProps,
) => {
  try {
    const url = `${SERVER_API_URL}/audio/getFullCompleteRemixedAudioByVideoId/${data.video_id}/${data.respected_id}/${data.page}/${data.limit}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getAudioFromVideoId = async (video_id: number | undefined) => {
  try {
    const url = `${SERVER_API_URL}/audio/getAudioFromVideoId/${video_id}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getallaudiodetail = async (text: any, page: number, pageSize: number) => {
  try {
    const url = `${SERVER_API_URL}/audio/getdiscoverbysound/${text}/${page}/${pageSize}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getallaudio = async (token: any, page: number, pageSize: number) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/audio/getAllAudio?page=${page}&pageSize=${pageSize}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  getAudios,
  getAudioById,
  getCompleteRemixedAudioByVideoId,
  getAudioFromVideoId,
  getallaudiodetail,
  getallaudio,
  getFullCompleteRemixedAudioByVideoId,
};
