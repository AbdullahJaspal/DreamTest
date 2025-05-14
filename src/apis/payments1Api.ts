import {SERVER_API_URL} from '../constants/constants';
import axios from 'axios';

const stripePaymentsCreateIntent = async (data: any, token: string) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/payments/create_setup_intent`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    if (error?.response) {
      return error?.response;
    } else if (error.request) {
      throw new Error('Network error');
    } else {
      throw new Error('Unexpected error');
    }
  }
};

const changedStripeTransactionStatus = async (data: any, token: string) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/payments/changedStripeTransactionStatus`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

const generateGoogleplayPaymentsIntent = async (data: any, token: string) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/payments/generateGoogleplayPaymentsIntent`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    if (error?.response) {
      return error?.response;
    } else if (error.request) {
      throw new Error('Network error');
    } else {
      throw new Error('Unexpected error');
    }
  }
};

const createAccountForStipeAndLinkedIt = async (token: string) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/payments/createAccountForStipeAndLinkedIt`;
    const result = await axios.get(url, config);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export {
  stripePaymentsCreateIntent,
  changedStripeTransactionStatus,
  generateGoogleplayPaymentsIntent,
  createAccountForStipeAndLinkedIt,
};
