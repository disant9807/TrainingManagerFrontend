
import { TUser, Group } from '@/controllers/models/User';
import { TSnackBar } from '@/components/snackbar/SnackBar';
export default class State {
  user: TUser = {
    id: '',
    // newId: '',
    password: null,
    surname: '',
    firstName: '',
    middleName: '',
    roles: [],
    email: '',
    phoneNumber: '',
    blocked: false,
    createdDatetime: '',
    lastUpdateDatetime: '',
    lastPasswordChangeDatetime: '',
    lastLoginDatetime: ''
  }

  userGroups: Group[] = [];

  isDrawerMini = true;

  filters: Record<string, any> = {
    exercise: {
      categoryOfBodies: [],
      name: '',
      createdFrom: '',
      createdTo: '',
      isBased: '',
      hardSkills: []
    },
    trainingProgram: {
      categoryOfBodies: [],
      name: '',
      period: [],
      periodTraining: [],
      exercises: []
    },
    training: {
      name: '',
      createdFrom: '',
      createdTo: '',
      period: [],
      trainingFrom: '',
      trainingTo: '',
      periodTrainingTime: [],
      minTimeSec: '',
      maxTimeSec: '',
      trainingPrograms: [],
      isNoneTrainingProgram: null,
      minCountApproach: '',
      maxCountApproach: '',
      periodApproachs: [],
      periodTrainingDate: [],
      exercise: [],
      categoryOfBodies: []
    },
    size: {
      name: '',
      createdFrom: '',
      createdTo: '',
      period: [],
      categoryOfBodies: [],
      codeUnitsOfMeasurement: []
    },
    goal: {
      name: '',
      description: '',
      period: [],
      periodCompletion: [],
      categoryOfBodies: [],
      codeUnitsOfMeasurement: [],
      createdFrom: '',
      createdTo: '',
      completionFrom: '',
      completionTo: ''
    },
    unitsofmeasurement: {
      queryString: ''
    },
    categoryofbody: {
      queryString: ''
    }
  }

  loading = {
    exercise: {
      list: true,
      selectedExercise: true
    },
    trainingProgram: {
      list: true,
      selectedTrainingProgram: true
    },
    training: {
      list: true,
      selectedTraining: true
    },
    size: {
      list: true,
      selectedSize: true
    },
    goal: {
      list: true,
      selectedGoal: true
    },
    unitsofmeasurement: {
      list: true,
      selectedUnitsOfMeasurement: true
    },
    categoryofbody: {
      list: true,
      selectedategoryofbody: true
    }
  }

  snackBar: TSnackBar = {
    show: false,
    status: 'info',
    message: '',
    isHtml: false,
    timeout: -1,
  };
}
