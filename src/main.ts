import './assets/style/main.scss'
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from '@/plugins/vuetify'
import localize from '@/plugins/localize'
import eventbus from '@/plugins/eventbus'

Vue.use(localize)
Vue.use(eventbus)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
