
import { TUser, Group } from '@/controllers/models/User'
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
    incoming: {
      New: {
        state: 'New',
        typeCodes: [],
        period: [],
        kwds: [],
        source: '',
        applicant: '',
        reqNum: '',
        statuses: []
      },
      Handled: {
        state: 'Handled',
        typeCodes: [],
        period: [],
        kwds: [],
        source: '',
        applicant: '',
        reqNum: '',
        statuses: []
      },
      Saved: {
        state: 'Saved',
        typeCodes: [],
        period: [],
        kwds: [],
        source: '',
        applicant: '',
        reqNum: '',
        statuses: []
      }
    }
  }

  loading = {
    incoming: {
      list: true,
      selectedRequest: true
    },
    outgoing: {
      list: true,
      selectedRequest: true
    },
    fgisdo: {
      list: true,
      selectedRequest: true
    },
    gisgmp: {
      list: true,
      selectedRequest: true
    },
    settings: {
      list: true,
      selectedRequest: true
    }
  }
}
