import base from '@/api/baseApi';
import { getInstance as getAuthApi } from '@/api/authApi';
import { getInstance as getExerciseApi } from '@/api/exerciseApi';
import { getInstance as getTrainingProgramApi } from '@/api/TrainingProgramApi';
import { getInstance as getTrainingApi } from '@/api/TrainingApi';
import { getInstance as getSizeApi } from '@/api/SizeApi';
import { getInstance as getGoalApi } from '@/api/GoalApi';
import { getInstance as getCategoryOfBodyApi } from '@/api/CategoryOfBodyApi';
import { getInstance as GetUnitsOfMeasurementApi } from '@/api/UnitsOfMeasurementApi';

export default {
  base,
  getAuthApi,
  getExerciseApi,
  getTrainingProgramApi,
  getTrainingApi,
  getSizeApi,
  getGoalApi,
  getCategoryOfBodyApi,
  GetUnitsOfMeasurementApi
};
