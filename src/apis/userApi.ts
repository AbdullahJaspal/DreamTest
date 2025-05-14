import axios from 'axios';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';
import {SetStateAction} from 'react';

const getUserInfo = async (token: any) => {
  const url = `${SERVER_API_URL}/users/info`;
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const result = await axios.get(url, config);
  return result.data;
};

const updateProfile = async (
  token: string | null | undefined,
  data: {name: string; value: any},
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/update`;
  const result = await axios.patch(url, data, config);
  return result.data;
};

const user_exist = async (email: string) => {
  const data = {email: email};
  const url = `${SERVER_API_URL}/users/userExist`;
  const result = await axios.get(url);
  return result.data;
};

const storePayments = async (
  data: {
    payment_id: any;
    link: any;
    country_code: any;
    email_address: any;
    first_name: any;
    last_name: any;
    payer_id: any;
    account_id: any;
    account_status: any;
    amount_value: any;
    currency_code: any;
    reference_id: any;
    status: any;
    address_line_1: any;
    admin_area_1: any;
    admin_area_2: any;
    postal_code: any;
    dimanond_value: any;
  },
  token: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/transaction`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const follow = async (
  data: {receiver_id: any; way_of_following?: string},
  token: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/follow`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const unfollow = async (data: {receiver_id: any}, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/unfollow`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getInfoById = async (id: any) => {
  const url = `${SERVER_API_URL}/users/infoById/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getFollowersDetails = async (id: number | undefined) => {
  const url = `${SERVER_API_URL}/users/followersDetails/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getFollowingsDetails = async (id: number | undefined) => {
  const url = `${SERVER_API_URL}/users/followingsDetails/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getAllMessages = async (id: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getAllMessages/${id}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getMyAllChatedPerson = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getMyAllChatedPerson`;
  const result = await axios.get(url, config);
  return result.data;
};

// FUNCTION FOR GETTING ALL THE FOLLOWING PERSONS
const getAllFollowingsUsers = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getAllFollowingsUsers`;
  const result = await axios.get(url, config);
  return result.data;
};

const addUserInteractionTime = async (
  data: {interaction_start: never; interacted_time: number},
  token: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/addUserInteractionTime`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const changeProfilePicture = async (
  data: FormData,
  token: string | null | undefined,
) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  const url = `${SERVER_API_URL}/users/changeProfilePicture`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const changeProfileVideo = async (
  data: FormData,
  token: string | null | undefined,
) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  const url = `${SERVER_API_URL}/users/changeProfileVideo`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const checkUsernameAvaliable = async (value: string) => {
  const url = `${SERVER_API_URL}/users/checkUsernameAvaliable/${value}`;
  const result = await axios.get(url);
  return result.data;
};

const getLanguageAllLanguageList = async (page_no = 1, page_size = 50) => {
  const url = `${SERVER_API_URL}/users/getLanguageAllLanguageList/${page_no}/${page_size}`;
  const result = await axios.get(url);
  return result.data;
};

const searchLanguage = async (search_text: any) => {
  const url = `${SERVER_API_URL}/users/searchLanguage/${search_text}`;
  const result = await axios.get(url);
  return result.data;
};

const getAllHobbiesList = async (page_no = 1, page_size = 50) => {
  const url = `${SERVER_API_URL}/users/getAllHobbiesList/${page_no}/${page_size}`;
  const result = await axios.get(url);
  return result.data;
};

const searchHobbies = async (search_text: any) => {
  const url = `${SERVER_API_URL}/users/searchHobbies/${search_text}`;
  const result = await axios.get(url);
  return result.data;
};

const addView = async (data: {video_id: any; viewers_id: any}) => {
  const url = `${SERVER_API_URL}/users/addView`;
  const result = await axios.post(url, data);
  return result.data;
};

const addProfileVisit = async (
  data: {visitor_user_id: any; visited_user_id: number},
  token: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/addProfileVisit`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const updatePicture = async (data: any) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const url = `${SERVER_API_URL}/users/updatePicture`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getUserShortInfo = async (ids: any) => {
  const url = `${SERVER_API_URL}/users/getUserShortInfo`;
  const result = await axios.post(url, ids);
  return result.data;
};

const getMultipleUsersDiamond = async (data: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getMultipleUsersDiamond`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const isUsersFollowings = async (id: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/isUsersFollowings/${id}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getAllUserDiamondsByRanked = async (
  token: any,
  duration: SetStateAction<string>,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getAllUserDiamondsByRanked/${duration}`;
  const result = await axios.get(url, config);
  return result.data;
};

const addBlockedUser = async (data: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/addBlockedUser`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const getBlockedMeUser = async (id: any) => {
  console.log(id, 'idfrom frontend');
  const url = `${SERVER_API_URL}/users/getBlockedMeUser/${id}`;
  const result = await axios.get(url);
  return result.data;
};
const removeBlockedUser = async (data: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/removeBlockedUser`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const addFavouriteUser = async (data: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/addFavouriteUser`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const removeFavouriteUser = async (data: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/removeFavouriteUser`;
  const result = await axios.post(url, data, config);
  return result.data;
};

const addUserReport = async (data: any, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_DOMAIN}/users/addUserReport`;
  const result = await axios.post(url, data, config);
  return result.data;
};
const getBlockedUserList = async (id: any) => {
  // console.log(id,"idfrom frontend")
  const url = `${SERVER_API_URL}/users/getBlockedUserList/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getBlockedMeUserList = async (id: any) => {
  // console.log(id,"idfrom frontend")
  const url = `${SERVER_API_URL}/users/getBlockedUserMeList/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const addPaypalAccount = async (formData: FormData, token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/addPaypalAccount`;
  const result = await axios.post(url, formData, config);
  return result.data;
};

const getPaypalAccount = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getPaypalAccount`;
  const result = await axios.get(url, config);
  return result.data;
};

const addDataUser = async (id: any, token: any) => {
  console.log(id, 'id');
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/addDataRequest`;

  const result = await axios.post(url, {user_id: id}, config);

  return result.data;
};

const checkDataStatus = async (id: any) => {
  console.log(id, 'idformcheckstatus');
  const url = `${SERVER_API_URL}/users/checkDataStatus/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const downloadUserData = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/downloadUserData`;
  const result = await axios.get(url, config);
  return result.data;
};

const getDataRequestStatus = async (id: any) => {
  const url = `${SERVER_API_URL}/users/getDataRequestStatus/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getWheelLuck = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/wheel_luck_user`;
  const result = await axios.get(url, config);
  return result.data;
};

const getShortUserInfo = async (id: number | undefined) => {
  const url = `${SERVER_API_URL}/users/userShortInfo/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getUserPersonalInfo = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getUserPersonalInfo`;
  const result = await axios.get(url, config);
  return result.data;
};

const getUserFavouriteUsers = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getUserFavouriteUsers`;
  const result = await axios.get(url, config);
  return result.data;
};

const createAccountDeletionProgress = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/createAccountDeletionProgress`;
  const result = await axios.delete(url, config);
  return result.data;
};

const getUserDiamondsValueByUserId = async (token: any, user_id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getUserDiamondsValueByUserId/${user_id}`;
  const result = await axios.get(url, config);
  return result.data;
};

const checkIsUserFriendOrNot = async (token: any, user_id: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/checkIsUserFriendOrNot/${user_id}`;
  const result = await axios.get(url, config);
  return result.data;
};

const getUserprofilerank = async (
  token: any,
  dataresult: any,
  indexvalue: any,
) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/userprofilerank`;
  const result = await axios.post(
    url,
    {dataresult: dataresult, indexvalue: indexvalue},
    config,
  );
  return result.data;
};

const sendUserGiftWalletCurrecyInDollarAndLocal = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/sendUserGiftWalletCurrecyInDollarAndLocal`;
  const result = await axios.get(url, config);
  return result.data;
};

const getGiftDiamondsIntoBalance = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/getGiftDiamondsIntoBalance`;
  const result = await axios.get(url, config);
  return result.data;
};

const getUserCountryByUserID = async (user_id: number | undefined) => {
  try {
    const url = `${SERVER_API_URL}/users/getUserCountryByUserID/${user_id}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

// ***************testing***************
const IsUserBlocked = async (token: any) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/isuserblock`;
  const result = await axios.get(url, config);
  return result.data;
};
// ***************testing***************

//**************** User Comment Mute From Admin*********/
const IsUserCommentMute = async (token: any, mute_for: string) => {
  const config = {
    headers: {Authorization: `Bearer ${token}`},
  };
  const url = `${SERVER_API_URL}/users/usermutecomment?mute_for=${mute_for}`;
  const result = await axios.get(url, config);
  return result.data;
};
//**************** User Comment Mute From Admin*********/
const UploadAndManageChatVideo = async (token: any, formData: FormData) => {
  console.log(formData, 'data');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Ensure multipart is specified
    },
  };
  const url = `${SERVER_API_URL}/users/uploadchatvideo`;
  const result = await axios.post(url, formData, config);
  return result.data;
};

const createDeviceinfo = async (
  token: any,
  data: {
    deviceBrand: string;
    deviceModel: string;
    osVersion: string;
    deviceName: string;
  },
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/users/createDeviceinfo`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};
const getUserAllLikeById = async (user_id: any) => {
  try {
    const url = `${SERVER_API_URL}/likes/getUserAllLikeById/${user_id}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getReportedUserList = async (user_id: any) => {
  try {
    const url = `${SERVER_API_URL}/share/getReportedUserList/${user_id}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getReportedMeUserList = async (user_id: any) => {
  try {
    const url = `${SERVER_API_URL}/share/getReportedMeUserList/${user_id}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getNoOfDiamondInGiftWalletByUserID = async (token: any) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/users/getNoOfDiamondInGiftWalletByUserID`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const createRequestForPayoutMoney = async (token: any) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/users/createRequestForPayoutMoney`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const getOccupations = async () => {
  try {
    const url = `${SERVER_API_URL}/users/getOccupations`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const searchSuggestion = async (
  token: string,
  query: string,
  page: number,
  limit: number,
) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/users/searchSuggestion?query=${query}&page=${page}&limit=${limit}`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  updateProfile,
  getUserInfo,
  user_exist,
  storePayments,
  follow,
  unfollow,
  getInfoById,
  getFollowersDetails,
  getFollowingsDetails,
  getAllMessages,
  getMyAllChatedPerson,
  getAllFollowingsUsers,
  addUserInteractionTime,
  changeProfilePicture,
  changeProfileVideo,
  checkUsernameAvaliable,
  getLanguageAllLanguageList,
  searchLanguage,
  getAllHobbiesList,
  searchHobbies,
  addView,
  addProfileVisit,
  updatePicture,
  getUserShortInfo,
  getMultipleUsersDiamond,
  isUsersFollowings,
  getAllUserDiamondsByRanked,
  addBlockedUser,
  removeBlockedUser,
  getBlockedMeUser,
  getBlockedUserList,
  getBlockedMeUserList,
  addFavouriteUser,
  removeFavouriteUser,
  addUserReport,
  addPaypalAccount,
  getPaypalAccount,
  addDataUser,
  checkDataStatus,
  downloadUserData,
  getDataRequestStatus,
  getWheelLuck,
  getShortUserInfo,
  getUserPersonalInfo,
  getUserFavouriteUsers,
  createAccountDeletionProgress,
  getUserDiamondsValueByUserId,
  checkIsUserFriendOrNot,
  sendUserGiftWalletCurrecyInDollarAndLocal,
  getGiftDiamondsIntoBalance,
  getUserprofilerank,
  getUserCountryByUserID,
  IsUserBlocked,
  IsUserCommentMute,
  UploadAndManageChatVideo,
  createDeviceinfo,
  getUserAllLikeById,
  getReportedUserList,
  getReportedMeUserList,
  getNoOfDiamondInGiftWalletByUserID,
  createRequestForPayoutMoney,
  getOccupations,
  searchSuggestion,
};
