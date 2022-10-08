import Api from '@/api'
import { stopAccessTokenRefresher } from '@/api/accessTokenRefresher'
import { recordStorageItem, getStorageItem, removeStorageItem } from '@/utils/storageUtil'

const api = Api.getAuthApi()

export type TLoginParams = {
  username: string,
  password: string,
  provider: number
}

export type TRefreshParams = {
  'accessToken': string,
  'refreshToken': string,
}

export type TLogoutParams = {
  'accessToken': string
}

type TLoginResponse = {
  'accessToken': string,
  'refreshToken': string,
  'username': string,
}

type TRefreshTokenResponse = {
  'accessToken': string,
  'refreshToken': string,
  'username': string,
}

type TLogoutResponse = {
  'username': string,
}

export enum AuthTarget {
  accessToken = 'jwt',
  refreshToken = 'rt'
}

export const getAuthStorageKey = (target: AuthTarget) => {
  return 'smev.auth.' + target
}

class AuthModel {
  async login (username: string, password: string): Promise<any> {
    try {
      const response = (await api.login({ username, password, provider: 1 } as TLoginParams)).data as TLoginResponse
      this.setStorageTokens(response.accessToken, response.refreshToken)
      recordStorageItem('username', username)
      return response
    } catch (error) {
      console.error({ error })
      this.removeStorageTokens()
      return { error }
    }
  }

  async refresh () {
    try {
      const refreshToken = getStorageItem(getAuthStorageKey(AuthTarget.refreshToken))
      const accessToken = getStorageItem(getAuthStorageKey(AuthTarget.accessToken))
      const response = (await api.refreshToken(
        {
          accessToken,
          refreshToken
        } as TRefreshParams)).data as TRefreshTokenResponse
      this.setStorageTokens(response.accessToken, response.refreshToken)
    } catch (error) {
      this.removeStorageTokens()
    }
  }

  setStorageTokens (accessToken: string, refreshToken: string) {
    recordStorageItem(getAuthStorageKey(AuthTarget.accessToken), accessToken)
    recordStorageItem(getAuthStorageKey(AuthTarget.refreshToken), refreshToken)
  }

  removeStorageTokens () {
    removeStorageItem(getAuthStorageKey(AuthTarget.accessToken))
    removeStorageItem(getAuthStorageKey(AuthTarget.refreshToken))
  }

  async logout () {
    try {
      const accessToken = getStorageItem(getAuthStorageKey(AuthTarget.accessToken))
      await api.logout({ accessToken } as TLogoutParams)
      this.removeStorageTokens()
      stopAccessTokenRefresher()
      removeStorageItem('username')
    } catch (error) {
      console.error({ error })
    }
  }
}

const AuthController = new AuthModel()

export default AuthController
