import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = `${process.env.VUE_APP_API}trainingmanager/`;
const sizeUrl = 'goal';

let _instance: GoalApi;

export const getInstance = () => {
  if (!_instance) _instance = new GoalApi(new Api());
  return _instance;
};

export class GoalApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    ArchiveGoal(id: string, status: boolean): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${sizeUrl}/${id}/archive/${status}`);
    }

    CreateGoal(size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/create`, size);
    }

    UpdateGoal(size: any): Promise<TResult<string>> {
      return this.api.POST(baseUrl, `${sizeUrl}/update`, size);
    }

    GetGoalById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}/${id}`);
    }

    GetGoal(filter: any, userId: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${sizeUrl}/get/${userId}`, { ...filter });
    }
}
