import { NavigationGuardNext, Route } from 'vue-router';
import { getStorageItem } from '@/utils/storageUtil';
import { getAuthStorageKey, AuthTarget } from '@/controllers/Auth';

/**
 * запрашивать RT(refreshToken) при каждой навигации
 * @param to 
 * @param from 
 * @param next 
 * @returns 
 */
export const mAuth = (to: Route, from: Route, next: NavigationGuardNext) => {
  const rt = getStorageItem(getAuthStorageKey(AuthTarget.refreshToken));
  if (rt) {
    next();
    return;
  }

  if (!rt && to.name !== 'LoginPage') {
    next({
      name: 'LoginPage',
      params: { nextUrl: to.fullPath }
    });
    return;
  } 
  
  next();
};
