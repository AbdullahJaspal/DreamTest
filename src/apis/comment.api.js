import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const fetchComment = async id => {
  const url = `${SERVER_API_URL}/comments/fetchComment/${id}`;
  const result = await axios.get(url);
  return result.data;
};
const fetchCommentPrivacy = async token => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/fetchCommentPrivacy`;
  const result = await axios.get(url, config);
  return result.data;
};
const createComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/createComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const replyComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/replyComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const likeComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/likeComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const unlikeComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/unlikeComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const dislikeComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/dislikeComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const undislikeComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/undislikeComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const editComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/editComment`;
  const result = await axios.put(url, data, config);
  return result.data;
};

const deleteComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/deleteComment`;
  const result = await axios.delete(url, data, config);
  return result.data;
};

const getComment = async (idComment, page = 1) => {
  const url = `${SERVER_API_URL}/comment/${idComment}?page=${page}`;
  const result = await axios.get(url);
  return result.data;
};

const postComment = async (video, comment, token) => {
  const data = {
    video,
    comment,
  };
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/commment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const sendRose = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/sendRose`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getCommentOfVideoByVideoId = async video_id => {
  const url = `${SERVER_API_URL}/comments/getCommentOfVideoByVideoId/${video_id}`;
  const result = await axios.get(url);
  return result.data;
};

const likeReplyComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/likeReplyComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const unLikeReplyComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/unLikeReplyComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const dislikeReplyComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/dislikeReplyComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const unDislikeReplyComment = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/unDislikeReplyComment`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const sendReplyCommentRose = async (data, token) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/comments/sendReplyCommentRose`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const checkIsVideoCommentedByUser = async (token, videoId) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/comments/checkIsVideoCommentedByUser`;
    const result = await axios.post(url, {videoId}, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  getComment,
  postComment,
  fetchComment,
  createComment,
  replyComment,
  likeComment,
  unlikeComment,
  editComment,
  deleteComment,
  dislikeComment,
  undislikeComment,
  sendRose,
  getCommentOfVideoByVideoId,
  likeReplyComment,
  unLikeReplyComment,
  dislikeReplyComment,
  unDislikeReplyComment,
  sendReplyCommentRose,
  checkIsVideoCommentedByUser,
  fetchCommentPrivacy,
};
