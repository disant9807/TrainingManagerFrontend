import { TrainingProgrammApi } from '@/api/TrainingProgrammApi';
import { Api } from '@/api/baseApi';
import { TTrainingProgramm } from '@/api/models/TrainingProgramm';
import { TTrainingProgramm as TTrainingProgrammModel } from '@/controllers/models/TrainingProgramm';
import { TrainingsFilter } from '@/api/models/Filter/TrainingProgrammFilter';
import { TrainingsFilter as TrainingsFilterModel } from './models/Filter/TrainingProgrammFilter';
import { BaseController } from './BaseController';

const api: Api = new Api();
const trainingProgrammApi: TrainingProgrammApi = new TrainingProgrammApi(api);

class TrainingModel extends BaseController {
  async GetByFilter(filter: TrainingsFilterModel): Promise<TTrainingProgrammModel[]> {
    return await this.handleAndResolve(() => trainingProgrammApi.GetByFilter(filter as TrainingsFilter));
  }

  async GetMainPage(count: number): Promise<TTrainingProgrammModel[]> {
    return await this.handleAndResolve(() => trainingProgrammApi.GetMainPage(count));
  }

  async GetById(id: string): Promise<TTrainingProgrammModel> {
    return await this.handleAndResolve(() => trainingProgrammApi.GetById(id));
  }

  async Update(training: TTrainingProgrammModel): Promise<string> {
    return await this.handleAndResolve(() => trainingProgrammApi.Update(training as TTrainingProgramm));
  }
}

const TrainingController = new TrainingModel();
export default TrainingController;
