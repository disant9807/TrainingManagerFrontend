import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = process.env.VUE_APP_API;
const sizeUrl = 'size';

let _instance: SizeApi;

export const getInstance = () => {
  if (!_instance) _instance = new SizeApi(new Api());
  return _instance;
};

export class SizeApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    ArchiveSize(id: string, status: boolean): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${id}/archive/${status}`);
    }

    CreateSize(size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/create`, size);
    }

    UpdateSize(size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/update`, size);
    }

    GetSizeById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}/${id}`);
    }

    GetSize(filter: any): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}`, { ...filter });
    }
}
