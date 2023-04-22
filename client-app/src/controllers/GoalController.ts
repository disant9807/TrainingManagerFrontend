import { TOrder } from '@/types/globals';
import Api from '@/api';
import { BaseController } from './BaseController';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import { TUnitsOfMeasurement } from './UnitsOfMeasurementController';

const goalApi = Api.getGoalApi();

export type TGoalFilterViewModel = {
  categoryOfBodies?: string[],
  name?: string,
  description?: string,
  period?: string[],
  periodCompletion?: string[],
  codeUnitsOfMeasurement?: string[],
  createdFrom?: string,
  createdTo?: string,
  completionFrom?: string,
  completionTo?: string,
}

export type TGoalFilterModel = {
  categoryOfBodies?: string[],
  codeUnitsOfMeasurement?: string[],
  name?: string,
  description?: string,
  createdFrom?: string;
  createdTo?: string;
  completionFrom?: string,
  completionTo?: string,
  order: TOrder,
  start?: string,
  count?: string
}

export class TGoal {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  completionDate: string;
  subGoals: Array<TSubGoal>;
  isArchived: boolean;
  constructor() {
    this.id = '';
    this.name = '';
    this.createdDate = '';
    this.completionDate = '';
    this.subGoals = [];
    this.isArchived = false;
    this.description = '';
  }
}

export class TSubGoal {
  id: string;
  sizeId: string;
  bodyCode: string;
  body?: TCategoryOfBody;
  value: string;
  codeUnitsOfMeasurement: string;
  unitsOfMeasurement?: TUnitsOfMeasurement;
  goalId: string;
  constructor() {
    this.id = '';
    this.sizeId = '';
    this.bodyCode = '';
    this.body = new TCategoryOfBody();
    this.value = '';
    this.codeUnitsOfMeasurement = '';
    this.unitsOfMeasurement = new TUnitsOfMeasurement();
    this.goalId = '';
  }
}

class GoalModel extends BaseController {
  async ArchiveGoal(id: string, status: boolean) {
    return await this.handleAndResolve(() => goalApi.ArchiveGoal(id, status));
  }

  async CreateGoal(size: TGoal) {
    return await this.handleAndResolve(() => goalApi.CreateGoal(size));
  }

  async UpdateGoal(id: string, size: TGoal) {
    return await this.handleAndResolve(() => goalApi.UpdateGoal(size));
  }

  async GetGoalById(id: string): Promise<TGoal> {
    return await this.handleAndResolve(() => goalApi.GetGoalById(id));
  }

  async GetGoal(filter: TGoalFilterViewModel, order: TOrder): Promise<TResult<TGoal[]>> {
    const { categoryOfBodies, name, period, codeUnitsOfMeasurement } = filter;
    const [createdFrom, createdTo] = period || [];

    const filterModel: TGoalFilterModel | undefined = {
      codeUnitsOfMeasurement: codeUnitsOfMeasurement ?? [],
      categoryOfBodies: categoryOfBodies ?? [],
      name,
      createdFrom,
      createdTo,
      order
    };

    return await goalApi.GetGoal(filterModel);
  }
}

const GoalController = new GoalModel();
export default GoalController;
