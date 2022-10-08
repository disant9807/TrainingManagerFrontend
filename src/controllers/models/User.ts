export type Role =
  'admin' |
  'user' |
  'trener';

export class TUser {
    id: string;

    blocked: boolean;

    password: string | null;

    surname: string;

    firstName: string;

    middleName: string;

    roles: Role[];

    email: string;

    phoneNumber: string;

    createdDatetime: string;

    lastLoginDatetime: string;

    lastUpdateDatetime: string;

    lastPasswordChangeDatetime: string;

    constructor () {
      this.id = ''
      this.surname = ''
      this.firstName = ''
      this.middleName = ''
      this.roles = [] as Role[]
      this.email = ''
      this.phoneNumber = ''
      this.createdDatetime = ''
      this.lastLoginDatetime = ''
      this.lastUpdateDatetime = ''
      this.lastPasswordChangeDatetime = ''
      this.password = null
      this.blocked = false
    }
}

export enum Group {
  'admin',
  'user'
}

const trenerGroup = ['trener'] as Role[]
export function getGroups (userRoles: Role[]): Group[] {
  const groups = [] as Group[]
  if (userRoles.includes('admin')) groups.push(Group.admin)
  if (userRoles.includes('user')) groups.push(Group.user)
  if (trenerGroup.filter(r => userRoles.includes(r)).length) groups.push(Group.user)
  return groups
}
