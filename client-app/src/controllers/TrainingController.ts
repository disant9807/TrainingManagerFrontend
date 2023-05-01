import { BaseController } from './BaseController';
import Api from '@/api';
import { TOrder } from '@/types/globals';
import { SUCCESS_CODES, TResult } from '@/api/baseApi';
import { TExercise } from '@/controllers/ExerciseController';
import { TTrainingProgram } from './TrainingProgramController';

const trainingApi = Api.getTrainingApi();

export type TTrainingFilterViewModel = {
  categoryOfBodies?: string[],
  name?: string,
  exercises?: string[];
  periodTrainingTime?: string[];
  period?: string[];
  trainingPrograms?: string[];
  isNoneTrainingProgram?: boolean;
  periodApproachs?: string[];
  periodTrainingDate?: string[];
}

export type TTrainingFilterModel = {
  categoryOfBodies?: string[],
  name?: string,
  createdFrom?: string;
  createdTo?: string;
  trainingFrom?: string;
  trainingTo?: string;
  exercises?: string[];
  trainingPrograms?: string[];
  isNoneTrainingProgram?: boolean;
  maxCountApproach?: string;
  minCountApproach?: string;
  maxTimeSec: string;
  minTimeSec: string;
  order: TOrder,
  start?: string,
  count?: string
}

export class TTraining {
  id: string;
  userId: string;
  isEveryone: boolean;
  name: string;
  shortName: string;
  description: string | null;
  createdDate: string;
  trainingDate: string;
  time: string;
  trainingProgramIdFK: string;
  trainingProgramDayFK: string;
  trainingprogram: TTrainingProgram | null;
  approachs: TApproach[];
  constructor() {
    this.id = '';
    this.userId = '';
    this.isEveryone = false;
    this.name = '';
    this.shortName = '';
    this.description = '';
    this.createdDate = '';
    this.trainingDate = '';
    this.time = '';
    this.trainingProgramIdFK = '';
    this.trainingProgramDayFK = '';
    this.trainingprogram = null;
    this.approachs = [];
  }
}

export class TApproach {
  id: string;
  numberOfTraining: number;
  exercise: TExercise | null;
  approachsItems: TApproachItem[];
  constructor() {
    this.id = '';
    this.numberOfTraining = 0;
    this.exercise = null;
    this.approachsItems = [];
  }
}

export class TApproachItem {
  id: string;
  time: number;
  weight: number;
  numberOfApproach: number;
  hard: number;
  technicality: ApproachLvl | null;
  constructor() {
    this.id = '';
    this.time = 0;
    this.weight = 0;
    this.numberOfApproach = 0;
    this.hard = 0;
    this.technicality = null;
  }
}

export enum ApproachLvl {
  good = 'good',
  normal = 'normal',
  bad = 'bad'
}

class TrainingModel extends BaseController {
  async ArchiveTraining(id: string, status: boolean) {
    return await this.handleAndResolve(() => trainingApi.ArchiveTraining(id, status));
  }

  async CreateTraining(exercise: TTraining) {
    return await this.handleAndResolve(() => trainingApi.CreateTraining(exercise));
  }

  async UpdateTraining(id: string, exercise: TTraining) {
    return await this.handleAndResolve(() => trainingApi.UpdateTraining(exercise));
  }

  async GetTrainingById(id: string): Promise<TTraining> {
    return await this.handleAndResolve(() => trainingApi.GetTrainingById(id));
  }

  async GetTraining(filter: TTrainingFilterViewModel, order: TOrder, userId: string): Promise<TResult<TTraining[]>> {
    const { categoryOfBodies, name, exercises, periodTrainingTime, period, trainingPrograms, isNoneTrainingProgram, periodApproachs, periodTrainingDate } = filter;
    const [createdFrom, createdTo] = period || [];
    const [trainingFrom, trainingTo] = periodTrainingDate || [];
    const [minCountApproach, maxCountApproach] = periodApproachs || [];
    const [minTimeSec, maxTimeSec] = periodTrainingTime || [];

    const filterModel: TTrainingFilterModel | undefined = {
      categoryOfBodies: categoryOfBodies ?? [],
      name,
      createdFrom,
      createdTo,
      trainingFrom,
      trainingTo,
      exercises,
      trainingPrograms,
      isNoneTrainingProgram,
      maxCountApproach,
      minCountApproach,
      maxTimeSec,
      minTimeSec,
      order
    };

    return await trainingApi.GetTraining(filterModel, userId);
  }
}

const TrainingController = new TrainingModel();
export default TrainingController;
