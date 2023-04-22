import { NavigationGuardNext, Route } from 'vue-router';
import { userIn } from '@/utils/preferencesUtil';
import { Group } from '@/controllers/UserController';

const roleGuard = (to: Route, from: Route, next: NavigationGuardNext) => {
  if (toLoginPath(to)) {
    next();
    return;
  }

  if (userIn(Group.admin)) {
    next();
    return;
  }

  if (toUser(to) && userIn(Group.admin)) {
    next();
    return;
  }

  if (toTraining(to) && userIn(Group.user)) {
    next();
    return;
  }

  if (toTrainingprogram(to) && userIn(Group.user)) {
    next();
    return;
  }

  if (toExercise(to) && userIn(Group.user)) {
    next();
    return;
  }

  if (toSize(to) && userIn(Group.user)) {
    next();
    return;
  }

  if (toGoal(to) && userIn(Group.user)) {
    next();
    return;
  }

  if (!userIn(Group.admin)) {
    next({ name: 'Error404' });
    return;
  }

  next();
};

const toLoginPath = (to: Route): boolean => {
  return !!to.fullPath.match('/login*');
};

const toTraining = (to: Route): boolean => {
  return !!to.fullPath.match('/training*');
};

const toTrainingprogram = (to: Route): boolean => {
  return !!to.fullPath.match('/trainingprogram*');
};

const toExercise = (to: Route): boolean => {
  return !!to.fullPath.match('/exercise*');
};

const toSize = (to: Route): boolean => {
  return !!to.fullPath.match('/size*');
};

const toGoal = (to: Route): boolean => {
  return !!to.fullPath.match('/goal*');
};

const toUser = (to: Route): boolean => {
  return !!to.fullPath.match('/user*');
};

export default roleGuard;
