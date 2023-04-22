import { NavigationGuardNext, Route } from 'vue-router';
import { userIn } from '@/utils/preferencesUtil';
import { Group } from '@/controllers/UserController';

export default function homeGuard(to: Route, from: Route, next: NavigationGuardNext) {
  if (userIn(Group.user)) {
    next({ path: '/training' });
    return;
  }
  if (userIn(Group.admin)) {
    next({ path: '/settings' });
  }
}
