import { RouteConfig } from 'vue-router';
import mainPage from '@/views/pages/main/mainPage.vue';
import Exercise from '@/views/pages/Exercise/Exercise.vue';
import ExerciseAddEdit from '@/views/pages/Exercise/ExerciseAddEdit.vue';

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
    meta: { title: 'Упражнения' }
  },
  {
    name: 'ExerciseAdd',
    path: '/exercise/add',
    component: ExerciseAddEdit,
    meta: { title: 'Добавление упражнения' }
  },
  {
    name: 'ExerciseEdit',
    path: '/exercise/:id/edit',
    component: ExerciseAddEdit,
    meta: { title: 'Редактирование упражнения' },
    props: true
  }
];

export default routes;
