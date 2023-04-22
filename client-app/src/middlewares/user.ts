import { NavigationGuardNext, Route } from 'vue-router';
import store from '@/store';
import UserController from '@/controllers/UserController';

async function fetchUserIfUndefined(to: Route, from: Route, next: NavigationGuardNext) {
  if (!store.state.user?.id && to.name !== 'LoginPage') {
    const user = await UserController.getAuthorizedUser();
    store.commit('setCurrentUser', user);
  }
  next();
}

export default fetchUserIfUndefined;
