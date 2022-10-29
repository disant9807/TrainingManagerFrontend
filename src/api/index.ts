import base from '@/api/baseApi';
import { getInstance as getAuthApi } from '@/api/authApi';
import { getInstance as getExerciseApi } from '@/api/exerciseApi';
import { getInstance as getTrainingProgramApi } from '@/api/TrainingProgramApi';

export default {
  base,
  getAuthApi,
  getExerciseApi,
  getTrainingProgramApi
};
