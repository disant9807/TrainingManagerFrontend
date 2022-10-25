
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
    }
  }

  loading = {
    exercise: {
      list: true,
      selectedExercise: true
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
