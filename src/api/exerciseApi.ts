import { Api, TResult } from '@/api/baseApi';

const baseUrl = process.env.VUE_APP_API;
const exerciseUrl = 'exercise';

let _instance: ExerciseApi;

export const getInstance = () => {
  if (!_instance) _instance = new ExerciseApi(new Api());
  return _instance;
};

export class ExerciseApi {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  ArchiveExercise(id: string, status: boolean): Promise<TResult<any>> {
    return this.api.POST(baseUrl, `${exerciseUrl}/${id}/archive/${status}`);
  }

  CreateExercise(exercise: any): Promise<TResult<string>> {
    return this.api.POST(baseUrl, `${exerciseUrl}/create`, exercise);
  }

  UpdateExercise(exercise: any): Promise<TResult<string>> {
    return this.api.POST(baseUrl, `${exerciseUrl}/update`, exercise);
  }

  GetExerciseById(id: string): Promise<TResult<any>> {
    return this.api.GET(baseUrl, `${exerciseUrl}/${id}`);
  }

  GetExercise(filter: any): Promise<TResult<any>> {
    return this.api.GET(baseUrl, `${exerciseUrl}`, { ...filter });
  }
}
