import { RouteConfig } from 'vue-router';
import Exercise from '@/views/pages/Exercise/Exercise.vue';
import ExerciseAddEdit from '@/views/pages/Exercise/ExerciseAddEdit.vue';
import TrainingProgramAddEdit from '@/views/pages/TrainingProgram/TrainingProgramAddEdit.vue';

const routes: Array<RouteConfig> = [
  {
    name: 'Home',
    path: '/',
    redirect: { name: 'Exercise' }
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
  },
  {
    name: 'TrainingProgramAdd',
    path: '/trainingprogram/add',
    component: TrainingProgramAddEdit,
    meta: { title: 'Добавление тренировочной программы' }
  },
  {
    name: 'TrainingProgramEdit',
    path: '/trainingprogram/:id/edit',
    component: TrainingProgramAddEdit,
    meta: { title: 'Редактирование тренировочной программы' },
    props: true
  }
];

export default routes;
