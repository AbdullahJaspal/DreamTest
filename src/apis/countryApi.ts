import axios from 'axios';
import {SERVER_API_URL} from '../constants/constants';

const getAllCountries = async () => {
  const url = `${SERVER_API_URL}/country/allCountry`;
  const result = await axios.get(url);
  return result.data;
};

const getCitiesByCountryCode = async (country_code: string) => {
  const url = `${SERVER_API_URL}/country/getCitiesByCode/${country_code}`;
  const result = await axios.get(url);
  return result.data;
};

const getAllArabiccountries = async () => {
  const url = `${SERVER_API_URL}/country/getAllArabiccountries`;
  const result = await axios.get(url);
  return result.data;
};

const getCountriesNameByID = async (id: number) => {
  const url = `${SERVER_API_URL}/country/getCountriesNameByID/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getCitiesNameByID = async (id: number) => {
  const url = `${SERVER_API_URL}/country/getCitiesNameByID/${id}`;
  const result = await axios.get(url);
  return result.data;
};

const getAllCities = async (page: number = 1, limit: number = 10) => {
  try {
    const url = `${SERVER_API_URL}/country/getAllCities?page=${page}&limit=${limit}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Error while fetching cities. Please try again later.');
  }
};

const searchCity = async (
  query: string,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const url = `${SERVER_API_URL}/country/searchCity?query=${encodeURIComponent(
      query,
    )}&page=${page}&limit=${limit}`;
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    console.error('Error searching city:', error);
    throw new Error('Error while searching city. Please try again later.');
  }
};

export {
  getAllCountries,
  getCitiesByCountryCode,
  getAllArabiccountries,
  getCountriesNameByID,
  getCitiesNameByID,
  getAllCities,
  searchCity,
};
