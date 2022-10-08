import { ReviewApi } from '@/api/ReviewApi'
import { Api } from '@/api/baseApi'
import { TReview as TReviewModel } from './models/Review'
import { TReview } from '@/api/models/Review'
import { BaseController } from './BaseController'

const api: Api = new Api()
const reviewApi: ReviewApi = new ReviewApi(api)

class ReviewModel extends BaseController {
  async Update (review: TReviewModel): Promise<string> {
    return await this.handleAndResolve(() => reviewApi.Update(review as TReview))
  }

  async getReviewById (id: string): Promise<TReviewModel> {
    return await this.handleAndResolve(() => reviewApi.GetById(id))
  }
}

const UserController = new ReviewModel()
export default UserController
