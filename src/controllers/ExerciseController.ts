import { BaseController } from './BaseController';
import Api from '@/api';

const exerciseApi = Api.getExerciseApi();

export type TExerciseFilterViewModel = {
  state: '',
  source?: '',
  kwds?: string,
  period?: string[],
  typeCodes?: '',
  applicant?: string,
  reqNum?: string,
  statuses?: string[],
}

export enum HardSkill {
  easy = 'easy',
  normal = 'normal',
  hard = 'hard'
}

export class TExercise {
  id: string;
  name: string;
  shortName: string;
  isBased: boolean | null;
  description: string | null;
  ImagesIds: string[] | null;
  HardSkill: HardSkill | null;
  CategoryOfBodiesIds: string [] | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.shortName = '';
    this.isBased = null;
    this.description = null;
    this.ImagesIds = null;
    this.HardSkill = null;
    this.CategoryOfBodiesIds = null;
  }
}

class ExerciseModel extends BaseController {
  async CreateExercise(exercise: TExercise) {
    return await this.handleAndResolve(() => exerciseApi.CreateExercise(exercise));
  }
}

const ExerciseController = new ExerciseModel();
export default ExerciseController;
