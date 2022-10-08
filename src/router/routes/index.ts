import { RouteConfig } from 'vue-router'
import mainPage from '@/views/pages/main/mainPage.vue'
import Exercise from '@/views/pages/Exercise/Exercise.vue'

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
  }
]

export default routes
