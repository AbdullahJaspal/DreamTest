import axios, {AxiosResponse} from 'axios';

export const getLocationInformationFromOSM = async (
  lng: number,
  lat: number,
): Promise<LocationInformation> => {
  try {
    const url: string = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    // Fetch data from the API using Axios
    const response: AxiosResponse<LocationInformation> =
      await axios.get<LocationInformation>(url);

    // Extract the data from the response
    const data: LocationInformation = response.data;

    // Return the data
    return data;
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching location information:', error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export interface LocationInformation {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    road: string;
    city_district: string;
    ISO3166_2_lvl8: string;
    city: string;
    state_district: string;
    village: string;
    state: string;
    ISO3166_2_lvl4: string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: [string, string, string, string];
}
