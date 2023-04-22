import { mAuth } from './auth';
import fetchUserIfUndefined from './user';
import roleGuard from './roleGuard';

export const middlewares = [
  mAuth,
  fetchUserIfUndefined,
  roleGuard
];
