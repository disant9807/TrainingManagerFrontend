import { RouteConfig } from 'vue-router';
import Exercise from '@/views/pages/Exercise/Exercise.vue';
import ExerciseAddEdit from '@/views/pages/Exercise/ExerciseAddEdit.vue';
import TrainingProgramAddEdit from '@/views/pages/TrainingProgram/TrainingProgramAddEdit.vue';
import TrainingProgram from '@/views/pages/TrainingProgram/TrainingProgram.vue';
import TrainingAddEdit from '@/views/pages/Training/TrainingAddEdit.vue';
import Training from '@/views/pages/Training/Training.vue';

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
    name: 'TrainingProgram',
    path: '/trainingprogram',
    component: TrainingProgram,
    meta: { title: 'Тренировочные программы' }
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
  },
  {
    name: 'Training',
    path: '/training',
    component: Training,
    meta: { title: 'Тренировки' }
  },
  {
    name: 'TrainingAdd',
    path: '/training/add',
    component: TrainingAddEdit,
    meta: { title: 'Добавление тренировки' }
  },
  {
    name: 'TrainingEdit',
    path: '/training/:id/edit',
    component: TrainingAddEdit,
    meta: { title: 'Редактирование тренировоки' },
    props: true
  }
];

export default routes;
