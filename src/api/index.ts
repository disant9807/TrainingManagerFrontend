import base from '@/api/baseApi';
import { getInstance as getAuthApi } from '@/api/authApi';
import { getInstance as getExerciseApi } from '@/api/exerciseApi';
import { getInstance as getTrainingProgramApi } from '@/api/TrainingProgramApi';
import { getInstance as getTrainingApi } from '@/api/TrainingApi';
import { getInstance as getSizeApi } from '@/api/SizeApi';

export default {
  base,
  getAuthApi,
  getExerciseApi,
  getTrainingProgramApi,
  getTrainingApi,
  getSizeApi
};
