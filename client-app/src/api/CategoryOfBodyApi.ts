import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = `${process.env.VUE_APP_API}trainingmanager/`;
const sizeUrl = 'categoryOfBody';

let _instance: CategoryOfBodyApi;

export const getInstance = () => {
  if (!_instance) _instance = new CategoryOfBodyApi(new Api());
  return _instance;
};

export class CategoryOfBodyApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    RemoveCategoryOfBodyApi(code: string): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${code}/remove`);
    }

    ArchiveCategoryOfBodyApi(code: string, state: boolean): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${code}/archive/${state}`);
    }

    CreateCategoryOfBody(size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/create`, size);
    }

    UpdateCategoryOfBody(code: string, size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${code}/update`, size);
    }

    GetCategoryOfBodyById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}/${id}`);
    }

    GetCategoryOfBody(filter: any): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}`, { ...filter });
    }
}
