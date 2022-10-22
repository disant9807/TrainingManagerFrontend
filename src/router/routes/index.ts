import { RouteConfig } from 'vue-router';
import mainPage from '@/views/pages/main/mainPage.vue';
import Exercise from '@/views/pages/Exercise/Exercise.vue';
import ExerciseAdd from '@/views/pages/Exercise/ExerciseAdd.vue';

const routes: Array<RouteConfig> = [
  {
    name: 'Home',
    path: '/',
    component: mainPage
  },
  {
    name: 'Exercise',
    path: '/exercise',
    component: Exercise,
    meta: { title: 'Архив' }
  },
  {
    name: 'ExerciseAdd',
    path: '/exercise/add',
    component: ExerciseAdd,
    meta: { title: 'Архив' }
  }
];

export default routes;
