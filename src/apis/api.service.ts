import {Axios, AxiosRequestConfig} from 'axios';
import {UserModel} from '../models/User.model';

export enum Endpoints {
  SIGN_UP = '/auth/signup',
  SIGN_IN = '/auth/login',
}

export class ServerError {
  public code: string;
  public error: string | string[];
  constructor(code: string, error: string) {
    this.code = code;
    this.error = error;
  }

  getError(): string {
    if (typeof this.error === 'object') {
      return this.error[0];
    } else {
      return this.error;
    }
  }
}

class Api {
  private axios: Axios;
  private config: AxiosRequestConfig = {
    baseURL: 'http://192.168.42.95:8001/api',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };
  constructor() {
    this.axios = new Axios(this.config);
  }

  async get<Request, Response>(
    endpoint: Endpoints,
    data: Request,
  ): Promise<Response | ServerError> {
    try {
      let query = endpoint + '&';
      if (typeof data === 'object') {
        for (let [key, value] of Object.entries(data as ArrayLike<Request>)) {
          query = query + `${key}=${value}&`;
        }
        query = query.substring(0, query.length - 1);
      }
      this.log('get', query, 'DEBUG');
      const response = await this.axios.get(query);
      return response.data as Response;
    } catch (e: any) {
      this.log('get', e, 'ERROR');
      return new ServerError(e.code, e.message);
    }
  }

  async post<Request, Response>(
    endpoint: Endpoints,
    data: Request,
  ): Promise<Response | ServerError> {
    try {
      this.log('post', data, 'DEBUG');
      const response = await this.axios.post(
        endpoint,
        JSON.stringify(data),
        this.config,
      );
      let {status, data: axiosResponse} = response;
      axiosResponse = JSON.parse(axiosResponse);
      if ('error' in axiosResponse) {
        return new ServerError(String(status), axiosResponse.error);
      } else if (status >= 400 && status <= 600) {
        return new ServerError(
          String(status),
          axiosResponse.message || 'Unknown Server Error!',
        );
      } else {
        return axiosResponse as Response;
      }
    } catch (e: any) {
      this.log('post', e, 'ERROR');
      return new ServerError(e.code, e.message);
    }
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<UserModel | ServerError> {
    try {
      this.log('login', data, 'DEBUG');
      const response = await this.axios.post(
        Endpoints.SIGN_IN,
        JSON.stringify(data),
        this.config,
      );
      let {status, data: axiosResponse} = response;
      axiosResponse = JSON.parse(axiosResponse);
      if ('error' in axiosResponse) {
        return new ServerError(String(status), axiosResponse.error);
      } else if (status >= 400 && status <= 600) {
        return new ServerError(
          String(status),
          axiosResponse.message || 'Unknown Server Error!',
        );
      } else {
        this.config.headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${axiosResponse.accessToken}`,
        };
        return axiosResponse as UserModel;
      }
    } catch (err: any) {
      this.log('login', err, 'ERROR');
      return new ServerError(err.code, err.message);
    }
  }

  private log(fname: string, log: any, level: 'DEBUG' | 'ERROR') {
    console.log(
      `${new Date().toTimeString()} ApiService@${fname} [${level}] ${
        typeof log === 'object' ? JSON.stringify(log) : log
      }`,
    );
  }
}

export const ApiService = new Api();
