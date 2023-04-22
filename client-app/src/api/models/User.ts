export class TUser {
    id: string;

    surname: string;

    firstName: string;

    middleName: string;

    roles: string[];

    email: string;

    phoneNumber: string;

    createdDatetime: string;

    lastLoginDatetime: string;

    lastUpdateDatetime: string;

    lastPasswordChangeDatetime: string;

    constructor() {
      this.id = '';
      this.surname = '';
      this.firstName = '';
      this.middleName = '';
      this.roles = [];
      this.email = '';
      this.phoneNumber = '';
      this.createdDatetime = '';
      this.lastLoginDatetime = '';
      this.lastUpdateDatetime = '';
      this.lastPasswordChangeDatetime = '';
    }
}
