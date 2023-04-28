import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = `${process.env.VUE_APP_API}trainingmanager/`;
const trainingUrl = 'training';

let _instance: TrainingApi;

export const getInstance = () => {
  if (!_instance) _instance = new TrainingApi(new Api());
  return _instance;
};

export class TrainingApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    ArchiveTraining(id: string, status: boolean): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${trainingUrl}/${id}/archive/${status}`);
    }

    CreateTraining(trainingProgram: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${trainingUrl}/create`, trainingProgram);
    }

    UpdateTraining(trainingProgram: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${trainingUrl}/update`, trainingProgram);
    }

    GetTrainingById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${trainingUrl}/${id}`);
    }

    GetTraining(filter: any, userId: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${trainingUrl}/get/${userId}`, { ...filter });
    }
}
