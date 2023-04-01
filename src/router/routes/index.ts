import { RouteConfig } from 'vue-router';
import Exercise from '@/views/pages/Exercise/Exercise.vue';
import ExerciseAddEdit from '@/views/pages/Exercise/ExerciseAddEdit.vue';
import TrainingProgramAddEdit from '@/views/pages/TrainingProgram/TrainingProgramAddEdit.vue';
import TrainingProgram from '@/views/pages/TrainingProgram/TrainingProgram.vue';
import TrainingAddEdit from '@/views/pages/Training/TrainingAddEdit.vue';
import Training from '@/views/pages/Training/Training.vue';
import Size from '@/views/pages/Size/Size.vue';
import SizeAddEdit from '@/views/pages/Size/SizeAddEdit.vue';
import Goal from '@/views/pages/Goal/Goal.vue';
import GoalAddEdit from '@/views/pages/Goal/GoalAddEdit.vue';
import Settings from '@/views/pages/Settings/Settings.vue';
import UnitsOfMeasurementGuide from '@/views/pages/Settings/UnitsOfMeasurement/UnitsOfMeasurementGuide.vue';

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
  },
  {
    name: 'Size',
    path: '/size',
    component: Size,
    meta: { title: 'Замеры' }
  },
  {
    name: 'SizeAdd',
    path: '/size/add',
    component: SizeAddEdit,
    meta: { title: 'Добавление замера' }
  },
  {
    name: 'SizeEdit',
    path: '/size/:id/edit',
    component: SizeAddEdit,
    meta: { title: 'Редактирование замера' },
    props: true
  },
  {
    name: 'Goal',
    path: '/goal',
    component: Goal,
    meta: { title: 'Цели' }
  },
  {
    name: 'GoalAdd',
    path: '/goal/add',
    component: GoalAddEdit,
    meta: { title: 'Добавление цели' }
  },
  {
    name: 'GoalEdit',
    path: '/goal/edit',
    component: GoalAddEdit,
    meta: { title: 'Редактирование цели' },
    props: true
  },
  {
    name: 'Settings',
    path: '/settings',
    component: Settings,
    meta: { title: 'Настройки' }
  },
  {
    name: 'Units',
    path: '/unitsofmeasurement',
    component: UnitsOfMeasurementGuide,
    meta: { title: 'Показатели' }
  }
];

export default routes;
