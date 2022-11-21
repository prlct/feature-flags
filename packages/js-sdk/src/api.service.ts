import axios, { AxiosRequestConfig } from 'axios';
import * as qs from 'qs';

const PROD_API_URL = 'https://api.growthflags.com';

const API_URL = PROD_API_URL;

class ApiError extends Error {
  name: string;
  data: unknown;
  status: number;
  __proto__: unknown;

  constructor(data: unknown, status: number = 500, statusText: string = 'Internal Server Error') {
    super(`${status} ${statusText}`);

    this.constructor = ApiError;
    this.__proto__ = ApiError.prototype; // eslint-disable-line no-proto

    this.name = this.constructor.name;
    this.data = data;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  inspect() {
    return this.stack;
  }
}
const throwApiError = ({ status, statusText, data }: { status: number; statusText: string; data: unknown}) => {
  console.error(`API Error: ${status} ${statusText}`, data); //eslint-disable-line
  throw new ApiError(data, status, statusText);
};

interface ErrorResponse {
  status: number;
  statusText: string;
  data: unknown;
}

class ApiClient {
  _handlers: any;
  _api: any;

  constructor(axiosConfig: AxiosRequestConfig<any>) {
    this._handlers = new Map();
    this._api = axios.create(axiosConfig);
    this._api.interceptors.response.use(
      (response: { data: unknown }) => response.data,
      (error: { response: ErrorResponse; code: number; message: string; data: unknown }) => {
        if (axios.isCancel(error)) {
          throw error;
        }
        // Axios Network Error & Timeout error don't have 'response' field
        // https://github.com/axios/axios/issues/383
        const errorResponse = error.response || {
          status: error.code,
          statusText: error.message,
          data: error.data,
        };

        const errorHandlers = this._handlers.get('error') || [];
        errorHandlers.forEach((handler: any) => {
          handler(errorResponse);
        });

        return throwApiError(errorResponse);
      },
    );
  }

  get(url: string, params = {}, requestConfig = {}) {
    return this._api({
      method: 'get',
      url,
      params,
      ...requestConfig,
    });
  }

  post(url: string, data = {}, requestConfig = {}) {
    return this._api({
      method: 'post',
      url,
      data,
      ...requestConfig,
    });
  }

  put(url: string, data = {}, requestConfig = {}) {
    return this._api({
      method: 'put',
      url,
      data,
      ...requestConfig,
    });
  }

  delete(url: string, data = {}, requestConfig = {}) {
    return this._api({
      method: 'delete',
      url,
      data,
      ...requestConfig,
    });
  }

  on(event: unknown, handler: unknown) {
    if (this._handlers.has(event)) {
      this._handlers.get(event).add(handler);
    } else {
      this._handlers.set(event, new Set([handler]));
    }

    return () => this._handlers.get(event).remove(handler);
  }
}

export default new ApiClient({
  baseURL: API_URL,
  withCredentials: true,
  responseType: 'json',
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
});
