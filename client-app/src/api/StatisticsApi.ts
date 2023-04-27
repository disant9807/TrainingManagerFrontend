import _Vue from 'vue';
import { Api, TResult } from '@/api/baseApi';

const baseUrl = `${process.env.VUE_APP_API}trainingmanager/`;
const statisticsUrl = 'statistics';

let _instance: StatisticsApi;

export const getInstance = () => {
  if (!_instance) _instance = new StatisticsApi(new Api());
  return _instance;
};

export class StatisticsApi {
    private api: Api;

    constructor(api: Api) {
      this.api = api;
    }

    GenGoalStatistics(dateFrom: string, dateTo: string, userId: string): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${statisticsUrl}/goal?datefrom=${dateFrom}&dateTo=${dateTo}&userId=${userId}`);
    }

    GenSizeStatistics(dateFrom: string, dateTo: string, userId: string): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${statisticsUrl}/size?datefrom=${dateFrom}&dateTo=${dateTo}&userId=${userId}`);
    }

    GenTrainingStatistics(dateFrom: string, dateTo: string, userId: string): Promise<TResult<any>> {
      return this.api.POST(baseUrl, `${statisticsUrl}/training?datefrom=${dateFrom}&dateTo=${dateTo}&userId=${userId}`);
    }

    GetStatisticsById(id: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${statisticsUrl}/${id}`);
    }

    GetStatisticsByCategory(categoryId: string, userId: string): Promise<TResult<any>> {
      return this.api.GET(baseUrl, `${statisticsUrl}/${userId}/${categoryId}`);
    }
}
