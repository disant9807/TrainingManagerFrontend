import { BaseController } from './BaseController';
import Api from '@/api';
import { TOrder } from '@/types/globals';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';
import { TExercise } from '@/controllers/ExerciseController';

const trainingProgramApi = Api.getTrainingProgramApi();

export type TTrainingProgramFilterViewModel = {
  categoryOfBodies?: string[],
  name?: string,
  exercises?: string[];
  periodTraining?: string[];
  period?: string[];
}

export type TTrainingProgramFilterModel = {
  categoryOfBodies?: string[],
  name?: string,
  createdFrom?: string;
  createdTo?: string;
  exercises?: string[];
  maxCountTrainingDays?: string;
  minCountTrainingDays?: string;
  order: TOrder,
  start?: string,
  count?: string
}

export class TTrainingProgram {
  id: string;
  userId: string;
  name: string;
  shortName: string;
  avatarId: string;
  description: string | null;
  images: string[] | null;
  createdDate: string;
  days: TTrainingProgramDay[] | null

  constructor() {
    this.id = '';
    this.userId = '';
    this.name = '';
    this.shortName = '';
    this.avatarId = '';
    this.description = '';
    this.images = [];
    this.createdDate = '';
    this.days = [];
  }
}

export class TTrainingProgramDay {
  id: string;
  exercises: TExercise[] | null;
  name: string;
  description: string;
  dayRelax: number;
  numberOfTrainingProgram: number;

  constructor() {
    this.id = '';
    this.name = '';
    this.exercises = [];
    this.description = '';
    this.dayRelax = 0;
    this.numberOfTrainingProgram = 0;
  }
}

class ExerciseModel extends BaseController {
  async ArchiveTrainingProgram(id: string, status: boolean) {
    return await this.handleAndResolve(() => trainingProgramApi.ArchiveTrainingProgram(id, status));
  }

  async CreateTrainingProgram(exercise: TTrainingProgram) {
    return await this.handleAndResolve(() => trainingProgramApi.CreateTrainingProgram(exercise));
  }

  async UpdateTrainingProgram(id: string, exercise: TTrainingProgram) {
    return await this.handleAndResolve(() => trainingProgramApi.UpdateTrainingProgram(exercise));
  }

  async GetTrainingProgramById(id: string): Promise<TTrainingProgram> {
    return await this.handleAndResolve(() => trainingProgramApi.GetTrainingProgramById(id));
  }

  async GetTrainingProgram(filter: TTrainingProgramFilterViewModel, order: TOrder, userId: string): Promise<TResult<TTrainingProgram[]>> {
    const { categoryOfBodies, name, periodTraining, exercises, period } = filter;
    const [createdFrom, createdTo] = period || [];
    const [minCountTrainingDays, maxCountTrainingDays] = periodTraining || [];

    const filterModel: TTrainingProgramFilterModel | undefined = {
      categoryOfBodies: categoryOfBodies ?? [],
      name,
      createdFrom,
      createdTo,
      exercises,
      minCountTrainingDays,
      maxCountTrainingDays,
      order
    };

    return await trainingProgramApi.GetTrainingProgram(filterModel, userId);
  }
}

const ExerciseController = new ExerciseModel();
export default ExerciseController;
