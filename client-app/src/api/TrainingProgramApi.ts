import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = `${process.env.VUE_APP_API}trainingmanager/`;
const trainingUrl = 'trainingProgram';

let _instance: TrainingProgramApi;

export const getInstance = () => {
  if (!_instance) _instance = new TrainingProgramApi(new Api());
  return _instance;
};

export class TrainingProgramApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    ArchiveTrainingProgram(id: string, status: boolean): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${trainingUrl}/${id}/archive/${status}`);
    }

    CreateTrainingProgram(trainingProgram: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${trainingUrl}/create`, trainingProgram);
    }

    UpdateTrainingProgram(trainingProgram: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${trainingUrl}/update`, trainingProgram);
    }

    GetTrainingProgramById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${trainingUrl}/${id}`);
    }

    GetTrainingProgram(filter: any): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${trainingUrl}`, { ...filter });
    }
}
