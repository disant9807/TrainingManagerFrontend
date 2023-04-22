import { Api } from '@/api/baseApi';
import { TLoginParams, TRefreshparams, TLogoutparams } from '@/controllers/Auth';

const baseUrl = process.env.VUE_APP_API;
const loginUrl = 'auth/login';
const logoutUrl = 'auth/logout';
const refreshUrl = 'auth/refresh-token';

let _instance: AuthApi;

export const getInstance = () => {
  if (!_instance) _instance = new AuthApi(new Api());
  return _instance;
};

export class AuthApi {
  private _api: Api;

  constructor(api: Api) {
    this._api = api;
  }

  login(params: TLoginParams) {
    return this._api.POST(baseUrl, loginUrl, params);
  }

  logout(params: TLogoutparams) {
    return this._api.POST(baseUrl, logoutUrl, params);
  }

  refreshToken(params: TRefreshparams) {
    return this._api.POST(baseUrl, refreshUrl, params);
  }
}
