import { Api, TResult } from '@/api/baseApi';

const baseUrl = process.env.VUE_APP_API_GATEWAY;
const loginUrl = 'auth/login';
const logoutUrl = 'auth/logout';
const refreshUrl = 'auth/refresh-token';

export class AuthApi {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  login(params: any) {
    return this._api.POST(baseUrl, loginUrl, params);
  }

  logout(params: any) {
    return this._api.POST(baseUrl, logoutUrl, params);
  }

  refreshToken(params: any) {
    return this._api.POST(baseUrl, refreshUrl, params);
  }
}

let _instance: AuthApi;

export const getInstance = () => {
  if (!_instance) _instance = new AuthApi(new Api());
  return _instance;
};
