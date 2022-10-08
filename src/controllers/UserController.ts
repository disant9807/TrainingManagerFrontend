import { UsersApi } from '@/api/userApi'
import { Api } from '@/api/baseApi'
import { TUser } from './models/User'
import { BaseController } from './BaseController'

const api: Api = new Api()
const userApi: UsersApi = new UsersApi(api)

class UserModel extends BaseController {
  async getAuthorizedUser () {
    return await this.handleAndResolve(() => userApi.getUser())
  }

  async getUserById (id: string): Promise<TUser> {
    return await this.handleAndResolve(() => userApi.getUserById(id))
  }
}

const UserController = new UserModel()
export default UserController
