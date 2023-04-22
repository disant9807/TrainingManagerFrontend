import { middlewares } from '@/middlewares';
import { publicPath } from '../../vue.config';
import Vue from 'vue';
import VueRouter, { RouterMode } from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: process.env.VUE_APP_ROUTING_MODE as RouterMode,
  base: publicPath,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
  routes
});

router.beforeEach(async (to, from, next) => {
  for (const middleware of middlewares) {
    await middleware(to, from, next);
  }
});

export default router;
