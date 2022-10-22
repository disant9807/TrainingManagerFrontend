import { Api, TResult } from '@/api/baseApi';

const baseUrl = process.env.VUE_APP_API_GATEWAY;
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

  CreateExercise(exercise: any): Promise<TResult<string>> {
    return this.api.POST(baseUrl, exerciseUrl, exercise);
  }

  GetExerciseById(id: string): Promise<TResult<any>> {
    return this.api.GET(baseUrl, `${exerciseUrl}/id/${id}`);
  }
}
