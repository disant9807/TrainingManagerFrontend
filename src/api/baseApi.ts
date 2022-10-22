/* eslint camelcase: "off" */
import _Vue from 'vue';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
/*
import { getAuthStorageKey, AuthTarget } from '@/controllers/Auth';
import { getStorageItem } from '@/utils/storageUtil';
*/

interface RequestOptions extends AxiosRequestConfig {
  isFormData?: boolean;
}

export type Payload<Options> = { isNoCache?: boolean } & Options;

export type TResult<TData> = {
  data: TData,
  success: boolean,
}

export enum EApiMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export const SUCCESS_CODES = [200, 201, 204];
export const AUTH_ERROR_CODES = [401];
type Func = () => Promise<any>;

export class Api {
  private axiosInstance: AxiosInstance;
  SUCCESS_CODES = SUCCESS_CODES;

  constructor() {
    this.axiosInstance = axios.create();
  }

  private async _execute(options: RequestOptions): Promise<any> {
    const method = options.method || 'get';
    const baseURL = options.baseURL || this.axiosInstance.defaults.baseURL;
    // const jwt = getStorageItem(getAuthStorageKey(AuthTarget.accessToken));
    const responseType = options.responseType;

    const requestParams: RequestOptions = {
      baseURL,
      url: options.url,
      method,
      [['get', 'delete'].includes(method) ? 'params' : 'data']: options.params,
      headers: {
        // Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      },
      responseType
    };

    if (options.isFormData) {
      const formData = new FormData();
      formData.append('file', options.params);
      requestParams.data = formData;
    }

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        return Promise.reject(error);
      }
    );

    try {
      const response = await this.axiosInstance.request(requestParams);
      return response;
    } catch (error: any) {
      console.error('API error:', error?.response || error || 'Неизвестная ошибка');
      return error?.response || error;
    }
  }

  private async _handle(callback: Func): Promise<any> {
    try {
      const response = await callback();
      if (SUCCESS_CODES.includes(response?.status)) {
        return Promise.resolve({
          data: response.data,
          success: true
        });
      } else {
        throw new Error(response?.statusText || 'Ошибка при создании запроса');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  POST(baseURL: string, url: string, params: any = null, isFormData = false): Promise<any> {
    return this._handle(() => this._execute({
      baseURL,
      method: EApiMethods.POST,
      isFormData,
      params,
      url
    }));
  }

  PUT(baseURL: string, url: string, params: any = null): Promise<any> {
    return this._handle(() => this._execute({
      baseURL,
      method: EApiMethods.PUT,
      params,
      url
    }));
  }

  GET(baseURL: string, url: string, params: any = null): Promise<any> {
    return this._handle(() => this._execute({
      baseURL,
      params,
      method: EApiMethods.GET,
      url,
      responseType: params?.responseType
    }));
  }

  DELETE(baseURL: string, url: string): Promise<any> {
    return this._handle(() => this._execute({
      baseURL,
      method: EApiMethods.DELETE,
      url
    }));
  }
}

export default function apiPlugin(Vue: typeof _Vue): void {
  Vue.prototype.$api = new Api();
}
