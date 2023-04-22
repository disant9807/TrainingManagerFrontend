
import { Role, Group } from '@/controllers/UserController';
import store from '@/store';

export function userIn(group: Group): boolean {
  const groups = store.state.userGroups as Group[];
  return groups.includes(group);
}

export function userRolesIn(roles: Role[]): boolean {
  const userRoles = store.state.user.roles;
  return userRoles.some(role => roles.includes(role as Role));
}

export function userRoleIn(role: Role): boolean {
  const userRoles = store.state.user.roles;
  return userRoles.includes(role);
}
