import base from './baseApi'
import { getInstance as getAuthApi } from './authApi'
import { getInstance as getTrainingProgrammApi } from './TrainingProgrammApi'
import { getInstance as getReviewApi } from './ReviewApi'

export default {
  base,
  getAuthApi,
  getTrainingProgrammApi,
  getReviewApi
}
