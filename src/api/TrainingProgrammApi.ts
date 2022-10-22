import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';
import { TrainingsFilter } from './models/Filter/TrainingProgrammFilter';
import { TTrainingProgramm } from '@/api/models/TrainingProgramm';

const baseUrl = process.env.VUE_APP_API_GATEWAY;
const trainings = 'trainings';
const training = 'training';

let _instance: TrainingProgrammApi;

export class TrainingProgrammApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    GetMainPage(count: number): Promise<TResult<TTrainingProgramm[]>> {
      return this.api.GET(baseUrl, `${trainings}/getMainPage`, count);
    }

    GetByFilter(params: TrainingsFilter): Promise<TResult<TTrainingProgramm[]>> {
      return this.api.GET(baseUrl, `${trainings}/get`, params);
    }

    GetById(id: string): Promise<TResult<TTrainingProgramm>> {
      return this.api.GET(baseUrl, `${training}/Get/${id}`);
    }

    Update(program: TTrainingProgramm): Promise<TResult<string>> {
      return this.api.PUT(baseUrl, `${training}/Update`, program);
    }
}

export const getInstance = () => {
  if (!_instance) _instance = new TrainingProgrammApi(new Api());
  return _instance;
};

export default function trainingProgrammApi(Vue: typeof _Vue): void {
  Vue.prototype.$trainingProgrammApi = getInstance();
}
