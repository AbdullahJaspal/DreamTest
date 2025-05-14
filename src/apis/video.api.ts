import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

interface RequestTypeForFullVideo {
  token: string;
  user_id: string | number;
  video_id: string | number;
  page: number;
  limit: number;
}

const getVideo = async (page: number, pageSize: number) => {
  const url = `${SERVER_API_URL}/videos/userAllVideos?page=${page}&pageSize=${pageSize}`;
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getVideobyview = async (page: number, pageSize: number, token: any) => {
  const url = `${SERVER_API_URL}/search/discoverVideobyview/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const discoverFullVideobyview = async (
  video_id: number,
  page: number,
  pageSize: number,
  token: any,
) => {
  const url = `${SERVER_API_URL}/search/discoverFullVideobyview/${video_id}/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const getVideobycoins = async (page: number, pageSize: number, token: any) => {
  const url = `${SERVER_API_URL}/search/discoverVideobycoins/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const discoverFullVideobycoins = async (
  video_id: number,
  page: number,
  pageSize: number,
  token: any,
) => {
  const url = `${SERVER_API_URL}/search/discoverFullVideobycoins/${video_id}/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const getvideobycountrysearch = async (
  text: any,
  page: any,
  pageSize: any,
  token: any,
) => {
  const url = `${SERVER_API_URL}/search/discoversearchbycountry/${text}/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const getVideodiscover = async (
  text: any,
  page: number,
  pageSize: number,
  token: any,
) => {
  const url = `${SERVER_API_URL}/search/discoverVideo/${text}/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const getFullVideodiscover = async (
  text: string | number | undefined,
  page: number,
  pageSize: number,
  token: any,
  video_id: number,
) => {
  const url = `${SERVER_API_URL}/search/discoverFullVideo/${text}/${video_id}/${page}/${pageSize}`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const getVideoById = async (id: any) => {
  const url = `${SERVER_API_URL}/video/detail/${id}`;
  const result = await axios.get(url);
  return result;
};

const getVideoByUserId = async (id: any) => {
  const url = `${SERVER_API_URL}/video/list/user/${id}`;
  const result = await axios.get(url);
  return result;
};

const getVideoByUserAuth = async (token: any, privacy = false, page = 1) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const url = `${SERVER_API_URL}/video/list/user?privacy=${privacy}`;
  const result = await axios.get(url, config);
  return result;
};

const getVideoLikeByUserAuth = async (token: any, page = 1, limit = 40) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };

  const url = `${SERVER_API_URL}/like?page=${page}&q=${limit}`;
  const result = await axios.get(url, config);
  return result;
};

const getVideoLikeByIdUser = async (idUser: any, page = 1, limit = 40) => {
  const url = `${SERVER_API_URL}/like/${idUser}?page=${page}&q=${limit}`;
  const result = await axios.get(url);
  return result;
};

// Posting video and tracking the progress of uploading
const postVideo = async (
  data: any,
  token: any,
  onUploadProgress: (arg0: number) => void,
) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };
  const url = `${SERVER_API_URL}/videos/video`;

  const result = await axios.post(url, data, {
    headers,
    onUploadProgress: progressEvent => {
      if (progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onUploadProgress(progress);
      } else {
        onUploadProgress(0);
      }
    },
  });

  return result.data;
};

const draftVideos = async (data: FormData, token: any) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };

  const url = `${SERVER_API_URL}/videos/draftVideo`;

  const result = await axios.post(url, data, {headers});
  return result.data;
};

const getMyVideos = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/getMyVideos`;
  const result = await axios.get(url, config);
  return result;
};

const sendGifts = async (
  data: {diamonds: number | undefined; video_id: number; reciever_id: number},
  token: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/gifts`;
  const result = await axios.post(url, data, config);
  return result;
};

const uploadPicturePost = async (data: any, token: any) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };
  const url = `${SERVER_API_URL}/videos/uploadPicturePost`;
  const result = await axios.post(url, data, {headers});
  return result.data;
};

const editPicturePost = async (
  postId: string,
  data: {
    description?: string;
    post_topic?: string;
    privacy_type?: 'public' | 'private' | 'friends';
    allow_comment?: boolean;
    location?: string;
    current_location?: string;
    removed_image_ids?: string;
    new_images?: any[];
  },
  token: any,
) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };

  const url = `${SERVER_API_URL}/image_post/${postId}`;
  const formData = new FormData();

  // Add text fields
  if (data.description) formData.append('description', data.description);
  if (data.post_topic) formData.append('post_topic', data.post_topic);
  if (data.privacy_type) formData.append('privacy_type', data.privacy_type);
  if (data.allow_comment !== undefined)
    formData.append('allow_comment', data.allow_comment.toString());
  if (data.location) formData.append('location', data.location);
  if (data.current_location)
    formData.append('current_location', data.current_location);
  if (data.removed_image_ids)
    formData.append('removed_image_ids', data.removed_image_ids);

  // Add new image files
  if (data.new_images && data.new_images.length > 0) {
    data.new_images.forEach((image, index) => {
      formData.append('image', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `image_${index}.jpg`,
      });
    });
  }

  try {
    const result = await axios.put(url, formData, {headers});
    return result.data;
  } catch (error) {
    console.error('Error editing picture post:', error);
    throw error;
  }
};

const deletePicturePost = async (postId: string, token: any) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const url = `${SERVER_API_URL}/image_post/${postId}`;
  const result = await axios.delete(url, {headers});
  return result.data;
};

const getAllPicturePost = async (user_id: any) => {
  const url = `${SERVER_API_URL}/videos/getAllPicturePost/${user_id}`;
  const result = await axios.get(url);
  return result.data;
};

const getUserPicturePosts = async (
  token: any,
  pageNo: number,
  pageSize: number,
) => {
  const url = `${SERVER_API_URL}/image_post/getUserPicturePosts/${pageNo}/${pageSize}`;
  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
};

const makeReport = async (data: FormData, token: any) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  };

  const url = `${SERVER_API_URL}/videos/makeReport`;

  const result = await axios({
    method: 'post',
    url,
    headers,
    data,
  });
  return result.data;
};

const getVideoUrl = async (idVideo: any) => {
  const url = `${SERVER_API_URL}/videos/getVideoUrl/${idVideo}`;
  const result = await axios.get(url);
  return result.data;
};

const getVideoByVideoId = async (idVideo: any) => {
  const url = `${SERVER_API_URL}/videos/getVideoByVideoId/${idVideo}`;
  const result = await axios.get(url);
  return result.data;
};

const shareVideo = async (
  token: any,
  data: {user_ids: never[] | number[]; video_id: any; shared_people_id: any},
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/shareVideo`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const makeVideoFavourite = async (token: any, data: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/makeVideoFavourite`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const makeVideoUnFavourite = async (token: any, data: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/makeVideoUnfavourite`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getVideoShortInfo = async (id: any) => {
  const url = `${SERVER_API_URL}/videos/getVideoShortInfo/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getFavouriteVideo = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/getFavouriteVideo`;

  const result = await axios.get(url, config);
  return result.data;
};

const getFullFavouriteVideo = async (data: RequestTypeForFullVideo) => {
  const config = {
    headers: {Authorization: `Bearer ${data.token}`},
  };
  const url = `${SERVER_API_URL}/videos/getFullFavouriteVideo/${data.user_id}/${data.video_id}/${data.page}/${data.limit}`;

  const result = await axios.get(url, config);
  return result.data;
};

type RequestSearchProps = {
  countryId: number;
  sortedType: 'view' | 'diamond_value';
  pageNo: number;
  pageSize: number;
  video_id?: number;
};

async function discoverSearchByCountryID(data: RequestSearchProps) {
  const url = `${SERVER_API_URL}/search/discoverSearchByCountryID/${data.countryId}/${data.sortedType}/${data.pageNo}/${data.pageSize}`;
  const result = await axios.get(url);
  return result.data;
}

async function discoverSearchFullVideoByCountryID(data: RequestSearchProps) {
  const url = `${SERVER_API_URL}/search/discoverSearchFullVideoByCountryID/${data.countryId}/${data.video_id}/${data.sortedType}/${data.pageNo}/${data.pageSize}`;
  const result = await axios.get(url);
  return result.data;
}

const deleteVideo = async (token: any, video_id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/video/${video_id}`;
  const result = await axios.delete(url, config);
  return result.data;
};

const makeVideoInterested = async (token: any, video_id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const data = {
    video_id: video_id,
  };
  const url = `${SERVER_API_URL}/videos/makeVideoInterested`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const makeVideoNotInterested = async (token: any, video_id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/makeVideoNotInterested`;
  const result = await axios.post(url, {video_id}, config);
  return result.data;
};

const getAllDraftVideoOfUser = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/getAllDraftVideoOfUser`;
  const result = await axios.get(url, config);
  return result.data;
};

const removeDraftVideos = async (token: any, draft_video_id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/videos/removeDraftVideos`;
  const result = await axios.post(url, {draft_video_id}, config);
  return result.data;
};

const getUserUploadedVideos = async (token: any, user_id: any) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/videos/getUserUploadedVideos/${user_id}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getUserUploadedFeeds = async (token: any, user_id: number) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/users/${user_id}/posts`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getUserFullUploadedVideos = async (data: RequestTypeForFullVideo) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${data.token}`},
    };
    const url = `${SERVER_API_URL}/videos/getUserFullUploadedVideos/${data.user_id}/${data.video_id}/${data.page}/${data.limit}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getUserLikedVideos = async (token: any, user_id: any) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/videos/getUserLikedVideos/${user_id}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getUserFullLikedVideos = async (data: RequestTypeForFullVideo) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${data.token}`},
    };
    const url = `${SERVER_API_URL}/videos/getUserFullLikedVideos/${data.user_id}/${data.video_id}/${data.page}/${data.limit}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getUserPrivateVideos = async (token: any) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/videos/getUserPrivateVideos`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getUserFullPrivateVideos = async (data: RequestTypeForFullVideo) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${data.token}`},
    };
    const url = `${SERVER_API_URL}/videos/getUserFullPrivateVideos/${data.user_id}/${data.video_id}/${data.page}/${data.limit}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  getVideo,
  postVideo,
  getVideoById,
  getVideoByUserId,
  getVideoByUserAuth,
  getVideoLikeByIdUser,
  getVideoLikeByUserAuth,
  getMyVideos,
  sendGifts,
  uploadPicturePost,
  getAllPicturePost,
  makeReport,
  getVideoUrl,
  getVideoByVideoId,
  shareVideo,
  getVideobyview,
  getVideobycoins,
  getvideobycountrysearch,
  makeVideoFavourite,
  getVideoShortInfo,
  getVideodiscover,
  getFavouriteVideo,
  discoverSearchByCountryID,
  deleteVideo,
  makeVideoInterested,
  makeVideoNotInterested,
  draftVideos,
  getAllDraftVideoOfUser,
  removeDraftVideos,
  getUserUploadedVideos,
  getUserUploadedFeeds,
  getUserLikedVideos,
  getUserPrivateVideos,
  getUserFullUploadedVideos,
  getUserFullLikedVideos,
  getUserFullPrivateVideos,
  getFullFavouriteVideo,
  getFullVideodiscover,
  discoverSearchFullVideoByCountryID,
  discoverFullVideobycoins,
  discoverFullVideobyview,
  getUserPicturePosts,
  editPicturePost,
  deletePicturePost,
  makeVideoUnFavourite,
};
