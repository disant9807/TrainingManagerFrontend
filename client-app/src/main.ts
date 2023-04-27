import './assets/style/main.scss';
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import vuetify from '@/plugins/vuetify';
import api from '@/api/baseApi';
import eventbus from '@/plugins/eventbus';
import { startAccessTokenRefresher } from './api/accessTokenRefresher';
import VueApexCharts from 'vue-apexcharts';

Vue.use(api);
Vue.use(eventbus);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

startAccessTokenRefresher();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
