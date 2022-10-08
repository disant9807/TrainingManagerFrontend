import { Api } from '@/api/baseApi'

import { TLoginParams, TRefreshParams, TLogoutParams } from '@/controllers/Auth'

const baseUrl = process.env.VUE_APP_API_GATEWAY
const loginUrl = 'auth/login'
const logoutUrl = 'auth/logout'
const refreshUrl = 'auth/refresh-token'
const createTokenUrl = 'auth/token/create'

let _instance: AuthApi

export const getInstance = () => {
  if (!_instance) _instance = new AuthApi(new Api())
  return _instance
}

export class AuthApi {
  private _api: Api;

  constructor (api: Api) {
    this._api = api
  }

  login (params: TLoginParams) {
    return this._api.POST(baseUrl, loginUrl, params)
  }

  logout (params: TLogoutParams) {
    return this._api.POST(baseUrl, logoutUrl, params)
  }

  refreshToken (params: TRefreshParams) {
    return this._api.POST(baseUrl, refreshUrl, params)
  }

  async createToken (): Promise<string> {
    const result = await this._api.POST(baseUrl, createTokenUrl)
    return result.data
  }
}
