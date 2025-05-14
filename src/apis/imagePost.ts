import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';
import {PicturePostCommentReqProps} from './types/imagePost';

// Posting video and tracking the progress of uploading
const createPicturePost = async (token: any, data: FormData) => {
  try {
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    };
    const url = `${SERVER_API_URL}/image_post/createPicturePost`;

    const result = await axios.post(url, data, {headers});
    return result.data;
  } catch (error) {
    throw error;
  }
};

// sendPicturePostComment
const sendPicturePostComment = async (
  token: any,
  data: PicturePostCommentReqProps,
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/sendPicturePostComment`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// likeCommentOrCommentReply
const likeCommentOrCommentReply = async (
  token: any,
  data: {
    comment_id: number;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/likeCommentOrCommentReply`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// disLikeCommentOrCommentReply
const disLikeCommentOrCommentReply = async (
  token: any,
  data: {
    comment_id: number;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/disLikeCommentOrCommentReply`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// sendRoseToPicturePostComment
const sendRoseToPicturePostComment = async (
  token: any,
  data: {
    comment_id: number;
    diamond_value: number;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/sendRoseToPicturePostComment`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// editCommentOrCommentReply
const editCommentOrCommentReply = async (
  token: any,
  data: {
    comment_id: number;
    updated_txt: string;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/editCommentOrCommentReply`;
    const result = await axios.patch(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// reportCommentOrCommentReply
const reportCommentOrCommentReply = async (
  token: any,
  data: {
    comment_id: number;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/reportCommentOrCommentReply`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// deleteCommentOrCommentreply
const deleteCommentOrCommentreply = async (
  token: any,
  data: {
    comment_id: number;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/deleteCommentOrCommentreply`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getPicturePost = async (token: any, pageNo: number, pageSize: number) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/getPicturePost/${pageNo}/${pageSize}`;

    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// getTotalNoOfPicturePostComments
const getTotalNoOfPicturePostComment = async (picture_post_id: number) => {
  try {
    const url = `${SERVER_API_URL}/image_post/getTotalNoOfPicturePostComment/${picture_post_id}`;

    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// getPicturePostComment
const getPicturePostComment = async (
  token: any,
  picture_post_id: number,
  pageNo: number,
  pageSize: number,
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/image_post/getPicturePostComment/${picture_post_id}/${pageNo}/${pageSize}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  createPicturePost,
  getPicturePost,
  sendPicturePostComment,
  getPicturePostComment,
  likeCommentOrCommentReply,
  disLikeCommentOrCommentReply,
  sendRoseToPicturePostComment,
  editCommentOrCommentReply,
  deleteCommentOrCommentreply,
  reportCommentOrCommentReply,
  getTotalNoOfPicturePostComment,
};
