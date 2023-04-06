import { BaseController } from './BaseController';
import Api from '@/api';
import { TOrder } from '@/types/globals';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';
import { TCategoryOfBody } from './CategoryOfBodyController';

const exerciseApi = Api.getExerciseApi();

export type TExerciseFilterViewModel = {
  categoryOfBodies?: string[],
  name?: string,
  createdFrom?: string,
  createdTo?: string,
  isBased?: boolean,
  hardSkills?: HardSkill[]
}

export type TExerciseFilterModel = {
  categoryOfBodies?: string[],
  name?: string,
  createdFrom?: string,
  createdTo?: string,
  isBased?: boolean,
  hardSkills?: HardSkill[],
  hardSkill?: HardSkill,
  order: TOrder,
  start?: string,
  count?: string
}

export enum HardSkill {
  easy = 1,
  normal = 2,
  hard = 3
}

export class TExercise {
  id: string;
  name: string;
  shortName: string;
  isBased: boolean | null;
  description: string | null;
  imagesIds: string[] | null;
  hardSkill: HardSkill | null;
  categoryOfBodiesIds: string [] | null;
  categoryOfBodies: TCategoryOfBody[];
  createdDate: string;

  constructor() {
    this.id = '';
    this.name = '';
    this.shortName = '';
    this.isBased = false;
    this.description = '';
    this.imagesIds = [];
    this.hardSkill = HardSkill.normal;
    this.categoryOfBodiesIds = [];
    this.categoryOfBodies = [];
    this.createdDate = '';
  }
}

class ExerciseModel extends BaseController {
  async ArchiveExercise(id: string, status: boolean) {
    return await this.handleAndResolve(() => exerciseApi.ArchiveExercise(id, status));
  }

  async CreateExercise(exercise: TExercise) {
    return await this.handleAndResolve(() => exerciseApi.CreateExercise(exercise));
  }

  async UpdateExercise(id: string, exercise: TExercise) {
    return await this.handleAndResolve(() => exerciseApi.UpdateExercise(exercise));
  }

  async GetExerciseById(id: string): Promise<TExercise> {
    return await this.handleAndResolve(() => exerciseApi.GetExerciseById(id));
  }

  async GetExercise(filter: TExerciseFilterViewModel, order: TOrder): Promise<TResult<TExercise[]>> {
    const { categoryOfBodies, name, createdFrom, createdTo, isBased, hardSkills } = filter;

    const filterModel: TExerciseFilterModel | undefined = {
      categoryOfBodies: categoryOfBodies ?? [],
      name,
      createdFrom,
      createdTo,
      isBased,
      hardSkill: hardSkills?.length === 1 ? hardSkills[0] : undefined,
      hardSkills: hardSkills ?? [],
      order
    };

    return await exerciseApi.GetExercise(filterModel);
  }
}

const ExerciseController = new ExerciseModel();
export default ExerciseController;
