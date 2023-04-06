import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = process.env.VUE_APP_API;
const sizeUrl = 'unitsofmeasurement';

let _instance: UnitsOfMeasurementApi;

export const getInstance = () => {
  if (!_instance) _instance = new UnitsOfMeasurementApi(new Api());
  return _instance;
};

export class UnitsOfMeasurementApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    RemoveUnitsOfMeasurementApiApi(code: string): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${code}/remove`);
    }

    ArchiveUnitsOfMeasurementApiApi(code: string, state: boolean): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${code}/archive/${state}`);
    }

    CreateUnitsOfMeasurementApi(size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/create`, size);
    }

    UpdateUnitsOfMeasurementApi(code: string, size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${code}/update`, size);
    }

    GetUnitsOfMeasurementApiById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}/${id}`);
    }

    GetUnitsOfMeasurementApi(filter: any): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}`, { ...filter });
    }
}
