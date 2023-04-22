import AuthController, { AuthTarget, getAuthStorageKey } from '@/controllers/Auth';
import { getStorageItem } from '@/utils/storageUtil';

export const LAST_REFRESH_TIME_KEY = 'lastRefreshTime';
export const ACCESS_TOKEN_LIFETIME = 60 * 5; // IN SECS

async function accessTokenRefresher() {
  const refreshToken = getStorageItem(getAuthStorageKey(AuthTarget.refreshToken));
  const accessToken = getStorageItem(getAuthStorageKey(AuthTarget.accessToken));

  if (refreshToken && accessToken) {
    console.log('accessTokenRefresher');
    await AuthController.refresh();
  }
  /*
  const lastRefreshTime: string | null | undefined = getStorageItem(LAST_REFRESH_TIME_KEY);

  if (!lastRefreshTime) {
    recordStorageItem(LAST_REFRESH_TIME_KEY, new Date().toISOString());
    await AuthController.refresh();
  } else {
    const elapsedMsecs = Date.now() - new Date(lastRefreshTime).valueOf();
    if (elapsedMsecs / 1000 > ACCESS_TOKEN_LIFETIME) {
      recordStorageItem(LAST_REFRESH_TIME_KEY, new Date().toISOString());
      await AuthController.refresh();
    }
  }
  */
}

let timerId : number;

export function startAccessTokenRefresher() {
  accessTokenRefresher();
  timerId = setInterval(accessTokenRefresher, ACCESS_TOKEN_LIFETIME * 1000);
}

export function stopAccessTokenRefresher() {
  clearInterval(timerId);
}
