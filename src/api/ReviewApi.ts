import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';
import { TReview } from './models/Review';

const baseUrl = process.env.VUE_APP_API_GATEWAY;
const review = 'Review';

let _instance: ReviewApi;

export class ReviewApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    GetById(id: string): Promise<TResult<TReview>> {
      return this.api.GET(baseUrl, `${review}/Get/${id}`);
    }

    Update(review: TReview): Promise<TResult<string>> {
      return this.api.PUT(baseUrl, `${review}/Update`, review);
    }
}

export const getInstance = () => {
  if (!_instance) _instance = new ReviewApi(new Api());
  return _instance;
};

export default function reviewApi(Vue: typeof _Vue): void {
  Vue.prototype.$reviewApi = getInstance();
}
