import axios from 'axios';
import base64 from 'base-64';
import {SERVER_API_URL, SERVER_DOMAIN} from '../constants/constants';

const baseUrl = 'https://api-m.sandbox.paypal.com';
const clientId =
  'ATRpxXW2lofjfsLkxJjtlt-Z9IXWJTtIQgjja0rlJRz8gCJXQtyxxYAQOn7KaagtfsfIiSpS_7DLyPZR';
const secretKey =
  'EHwatjN-VXVCKAZhFOn4b9myk7JeCJH5Z_JZwhJHYoZBUc1ol2ABB08vQNRPQwhOeHmr4CbbD-h03hp6';

// function for generating the access token
const generateToken = () => {
  var headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append(
    'Authorization',
    'Basic ' + base64.encode(`${clientId}:${secretKey}`),
  );

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: 'grant_type=client_credentials',
  };

  return new Promise((resolve, reject) => {
    fetch(baseUrl + '/v1/oauth2/token', requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("result print", result)
        const {access_token} = JSON.parse(result);
        resolve(access_token);
      })
      .catch(error => {
        console.log('error raised', error);
        reject(error);
      });
  });
};

// function for creating order
const createOrder = (token = '', value) => {
  let orderDetail = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        items: [
          {
            name: 'T-Shirt',
            description: 'Green XL',
            quantity: '1',
            unit_amount: {
              currency_code: 'USD',
              value: `${value}`,
            },
          },
        ],
        amount: {
          currency_code: 'USD',
          value: `${value}`,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: `${value}`,
            },
          },
        },
      },
    ],
    application_context: {
      return_url: 'https://example.com/return',
      cancel_url: 'https://example.com/cancel',
    },
  };
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderDetail),
  };

  return new Promise((resolve, reject) => {
    fetch(baseUrl + '/v2/checkout/orders', requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("result print", result)
        const res = JSON.parse(result);
        resolve(res);
      })
      .catch(error => {
        console.log('error raised', error);
        reject(error);
      });
  });
};

// function for capturing the payments
const capturePayment = (id, token = '') => {
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  return new Promise((resolve, reject) => {
    fetch(baseUrl + `/v2/checkout/orders/${id}/capture`, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("result print", result)
        const res = JSON.parse(result);
        resolve(res);
      })
      .catch(error => {
        console.log('error raised', error);
        reject(error);
      });
  });
};

const stripePaymentsCreateIntent = async (token, data) => {
  try {
    const config = {
      headers: {Authorization: `Bearer ${token}`},
    };
    const url = `${SERVER_API_URL}/payment/create_setup_intent`;
    const result = await axios.post(url, data, config);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export default {
  generateToken,
  createOrder,
  capturePayment,
  stripePaymentsCreateIntent,
};
