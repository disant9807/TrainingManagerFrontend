import _Vue from 'vue'
import { Api, TResult } from '@/api/baseApi'
import { TUser } from '@/controllers/models/User'

const baseUrl = process.env.VUE_APP_API_GATEWAY
const usersUrl = 'users'
const rolesUrl = 'roles'
const userUrl = 'user'

let _instance: UsersApi

export class UsersApi {
    private api: Api;

    constructor (api: Api) {
      this.api = api
    }

    getUserById (id: string): Promise<TResult<TUser>> {
      return this.api.GET(baseUrl, `${usersUrl}/${id}`)
    }
    /*
    getUsers(filter: TUserRequestFilter): Promise<TResult<TUser[]>> {
      return this.api.GET(baseUrl, usersUrl, filter);
    }
    */

    saveUser (user: TUser, isNewUser: boolean) {
      return this.api.POST(baseUrl, `${usersUrl}/${isNewUser}`, user)
    }

    removeUser (userId: string, isArchive = true) {
      return this.api.DELETE(baseUrl, `${usersUrl}/${userId}/${isArchive}`)
    }

    userBlockToggle (userId: string, block: boolean) {
      return this.api.PUT(baseUrl, `${usersUrl}/${userId}/${block}`)
    }

    getRoles () {
      return this.api.GET(baseUrl, rolesUrl)
    }

    /**
     * Получить пользователя по его идентификатору
     * @returns Данные пользователя по текущей метке авторизации
     */
    getUser (): Promise<TResult<TUser>> {
      return this.api.GET(baseUrl, userUrl)
    }
}

export const getInstance = () => {
  if (!_instance) _instance = new UsersApi(new Api())
  return _instance
}

export default function userApi (Vue: typeof _Vue): void {
  Vue.prototype.$userApi = getInstance()
}
