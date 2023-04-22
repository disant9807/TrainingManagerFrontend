/* eslint-disable camelcase */
import Api from '@/api';
import { toRequestDateFormat } from '@/utils/dateHelper';
import store from '@/store';
export function isAdmin() {
  return store.state.user.roles.includes('admin');
}

const userApi = Api.getUsersApi();

export type Role =
  'admin' |
  'user' |
  'сontroller' |
  'operator';

export enum Group {
    'admin',
    'user',
    'сontroller',
    'operator'
}

export enum HumanReadableRole {
    'admin' = 'Администратор АИС СМЭВ',
    'user' = 'Пользователь АИС СМЭВ',
    'сontroller' = 'Контролер ГИС ГМП',
    'operator' = 'Оператор ГИС ГМП'
  }

const сontrollerGroup = ['сontroller'] as Role[];
const operatorGroup = ['operator'] as Role[];
export function getGroups(userRoles: Role[]): Group[] {
  const groups = [] as Group[];
  if (userRoles.includes('admin')) groups.push(Group.admin);
  if (userRoles.includes('user')) groups.push(Group.user);
  if (сontrollerGroup.filter(r => userRoles.includes(r)).length) groups.push(Group.сontroller);
  if (operatorGroup.filter(r => userRoles.includes(r)).length) groups.push(Group.operator);
  return groups;
}

// список уведомлений хранится на сервере как Flags (степени двойки) enum
export enum Notifications {
  None = 0,
  Certificate = 1,
  Request = 2
}

export type TUserRequestFilter = {
  certificateFrom?: string | null,
  certificateTo?: string | null,
  FIO: string | null,
  isCertificateExpired: boolean | null,
  department: string | null,
  isArchive: boolean | null,
  isBlocked: boolean | null,
  roles: []
}

export type TUserSettings = {
  lackOfActivityDay: number;
  passwordActivityDay: number;
  passwordCountError: number;
  passwordMinimumLength: number;
  passwordIsLowercases: boolean;
  passwordIsUpperCases: boolean;
  passwordIsNumbers: boolean;
  passwordIsSymbols: boolean;
}

export type TUserSettingsFields = {
  lackOfActivityDay: string | null;
  passwordActivityDay: string | null;
  passwordCountError: string | null;
  passwordMinimumLength: string | null;
  passwordIsLowercases: boolean | null;
  passwordIsUpperCases: boolean | null;
  passwordIsNumbers: boolean | null;
  passwordIsSymbols: boolean | null;
}

export class TUser {
  id: string;
  newId: string;
  surname: string;
  firstName: string;
  middleName: string;
  password: string | null;
  roles: Role[];
  archive: boolean;
  blocked: boolean;
  departmentId: string;
  department: string;
  organization: string;
  email: string;
  phoneNumber: string;
  /** DateTime */
  certificateFrom: string;
  /** DateTime */
  certificateTo: string;
  /** допускается ли рассылка по email */
  notifications: Notifications | null;
  /** доступ только к собственным запросам */
  ownRequests: boolean;
  /** признак пользователя из active directory */
  fromAD: boolean;

  createdDatetime: string;
  lastUpdateDatetime: string;
  lastPasswordChangeDatetime: string;
  lastLoginDatetime: string;

  constructor() {
    this.id = '';
    this.newId = '';
    this.surname = '';
    this.firstName = '';
    this.middleName = '';
    this.roles = [];
    this.archive = false;
    this.blocked = false;
    this.department = '';
    this.departmentId = '';
    this.organization = '';
    this.password = null;
    this.email = '';
    this.phoneNumber = '';
    this.certificateFrom = '';
    this.certificateTo = '';
    this.notifications = null;
    this.ownRequests = false;
    this.fromAD = false;
    this.createdDatetime = '';
    this.lastUpdateDatetime = '';
    this.lastPasswordChangeDatetime = '';
    this.lastLoginDatetime = '';
  }
}
export const toApiUser = (obj: TUserEditModel): TUser => {
  const notifications = obj.access_notify.certificateNotify
    ? Notifications.Certificate
    : Notifications.None;

  return {
    id: obj.basic.id,
    newId: obj.basic.id,
    surname: obj.basic.surname,
    firstName: obj.basic.firstName,
    middleName: obj.basic.middleName,
    roles: obj.basic.userRoles,
    archive: obj.basic.archive,
    blocked: obj.basic.blocked,
    departmentId: obj.basic.departmentId,
    department: obj.basic.department,
    password: obj.basic.password,
    organization: obj.basic.organization,
    email: obj.basic.email,
    phoneNumber: obj.basic.phoneNumber,
    certificateFrom: obj.basic.certificateFrom,
    certificateTo: obj.basic.certificateTo,
    fromAD: obj.basic.fromAD,
    notifications: notifications,
    ownRequests: obj.access_notify.ownRequests,
    createdDatetime: obj.system_info.createdDatetime,
    lastUpdateDatetime: obj.system_info.lastUpdateDatetime,
    lastPasswordChangeDatetime: obj.system_info.lastPasswordChangeDatetime,
    lastLoginDatetime: obj.system_info.lastLoginDatetime
  };
};

export type TUserGuideFilterModel = {
  period: string[],
  FIO: string | null,
  isCertificateExpired: boolean | null,
  department: string | null,
  isArchive: boolean | null,
  isBlocked: boolean | null,
  roles: string[]
}

const defaultUserGuideFilter: TUserGuideFilterModel = {
  FIO: null,
  department: null,
  isArchive: false,
  isCertificateExpired: false,
  period: [],
  isBlocked: false,
  roles: []
};

export const radioSelection = [
  {
    label: 'Да',
    value: true
  },
  {
    label: 'Нет',
    value: false
  }
];

export type TUserEditModel = {
  basic: {
    id: string,
    surname: string,
    firstName: string,
    middleName: string,
    userRoles: Role[],
    archive: boolean,
    blocked: boolean,
    password: string | null,
    departmentId: string,
    department: string,
    organization: string,
    email: string,
    phoneNumber: string,
    certificateFrom: string,
    certificateTo: string,
    fromAD: boolean,
    createdDatetime: string,
    lastUpdateDatetime: string,
    lastPasswordChangeDatetime: string,
    lastLoginDatetime: string,
  },
  access_notify: {
    certificateNotify: boolean,
    ownRequests: boolean,
    fgisdoNotify: boolean
  },
  system_info: {
    createdDatetime: string,
    lastUpdateDatetime: string,
    lastPasswordChangeDatetime: string,
    lastLoginDatetime: string,
  }
}

export type TRoleModel = {
  basic: {
    name: string,
  },
  access_notify: {
  }
}
export const filterName = 'userGuide';

export class BaseController {
  public async handleAndResolve(func: () => Promise<any>) {
    const response = await this.handle(func);
    return this.resolve(response, response.data);
  }

  private async handle(callback: () => Promise<any>): Promise<any> {
    try {
      return await callback();
    } catch (error) {
      return Promise.reject({ error, success: false });
    }
  }

  private async resolve(response: any, data?: any): Promise<any> {
    if (response.success) return Promise.resolve(data ?? response);
    else throw new Error(response.error);
  }
}

class UserModel extends BaseController {
  async getUsers(filter: TUserGuideFilterModel = defaultUserGuideFilter): Promise<TUser[]> {
    const [certificateFrom, certificateTo] = filter.period || [];
    const params = {
      certificateFrom: certificateFrom ? toRequestDateFormat(certificateFrom) : null,
      certificateTo: certificateTo ? toRequestDateFormat(certificateTo) : null,
      FIO: filter.FIO,
      isCertificateExpired: filter.isCertificateExpired,
      department: filter.department,
      isArchive: filter.isArchive,
      isBlocked: filter.isBlocked,
      roles: filter.roles
    } as TUserRequestFilter;
    return await this.handleAndResolve(() => userApi.getUsers(params));
  }

  async removeUser(userId: string, isArchive = true) {
    return await this.handleAndResolve(() => userApi.removeUser(userId, isArchive));
  }

  async saveUser(user: TUser, isNewUser = false) {
    return await this.handleAndResolve(() => userApi.saveUser(user, isNewUser));
  }

  async getUserById(id: string): Promise<TUser> {
    return await this.handleAndResolve(() => userApi.getUserById(id));
  }

  async getRoles() {
    return await this.handleAndResolve(() => userApi.getRoles());
  }

  /**
   * Получить пользователя по его идентификатору
   * @returns Данные пользователя по текущей метке авторизации
   */
  async getAuthorizedUser() {
    return await this.handleAndResolve(() => userApi.getUser());
  }

  async checkUserLoginExists(userId: string): Promise<boolean> {
    return await this.handleAndResolve(() => userApi.checkUserLoginExists(userId));
  }

  async userBlockToggle(userId: string, block: boolean) {
    return await this.handleAndResolve(() => userApi.userBlockToggle(userId, block));
  }

  async getSettings() {
    return await this.handleAndResolve(() => userApi.getSettings());
  }

  async setSettings(settings: TUserSettings) {
    return await this.handleAndResolve(() => userApi.setSettings(settings));
  }
}

const UserController = new UserModel();
export default UserController;
