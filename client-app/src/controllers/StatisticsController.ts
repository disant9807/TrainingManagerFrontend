import { BaseController } from './BaseController';
import Api from '@/api';
import { TOrder } from '@/types/globals';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';
import { TExercise } from '@/controllers/ExerciseController';
import { TTrainingProgram } from './TrainingProgramController';

const statisticsApi = Api.getStatisticsApi();

export class Category {
  code: string;
  name: string;
  description: string;
  constructor() {
    this.code = '';
    this.name = '';
    this.description = '';
  }
}

export class TStatisticsIndicator {
  id: string;
  value: string;
  dateOfMeasurement: string;
  createOrUpdate: string;
  constructor() {
    this.id = '';
    this.value = '';
    this.dateOfMeasurement = '';
    this.createOrUpdate = '';
  }
}

export class TObjectOfStatistics {
  id: string;
  categoryCode: string;
  category: Category | null;
  name: string;
  description: string;
  code: string;
  userId: string;
  isArchived: boolean;
  createOrUpdate: string;
  statisticsIndicators: TStatisticsIndicator[]
  constructor() {
    this.id = '';
    this.categoryCode = '';
    this.category = null;
    this.name = '';
    this.description = '';
    this.code = '';
    this.userId = '';
    this.isArchived = false;
    this.createOrUpdate = '';
    this.statisticsIndicators = [];
  }
}

export class TGenStatistics {
  id: string;
  cratedTime: string;
  generatedTime: string;
  categoryCode: string;
  userId: string;
  statistics: TObjectOfStatistics[]

  constructor() {
    this.id = '';
    this.cratedTime = '';
    this.categoryCode = '';
    this.generatedTime = '';
    this.userId = '';
    this.statistics = [];
  }
}

class StatisticsModel extends BaseController {
  async GenerateGoalStatistics(datefrom: string, dateTo: string, userId: string): Promise<TResult<TGenStatistics[]>> {
    return await this.handleAndResolve(() => statisticsApi.GenGoalStatistics(datefrom, dateTo, userId));
  }

  async GenerateSizeStatistics(datefrom: string, dateTo: string, userId: string): Promise<TResult<TGenStatistics[]>> {
    return await this.handleAndResolve(() => statisticsApi.GenSizeStatistics(datefrom, dateTo, userId));
  }

  async GenerateTrainingStatistics(datefrom: string, dateTo: string, userId: string): Promise<TResult<TGenStatistics[]>> {
    return await this.handleAndResolve(() => statisticsApi.GenTrainingStatistics(datefrom, dateTo, userId));
  }

  async GetStatisticsById(id: string): Promise<TGenStatistics> {
    return await this.handleAndResolve(() => statisticsApi.GetStatisticsById(id));
  }

  async GetStatisticsByCategory(categoryId: string, userId: string): Promise<TGenStatistics[]> {
    return await this.handleAndResolve(() => statisticsApi.GetStatisticsByCategory(categoryId, userId));
  }
}

const StatisticsController = new StatisticsModel();
export default StatisticsController;
