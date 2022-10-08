import Vue from 'vue'
import Vuetify from 'vuetify'
import ru from 'vuetify/src/locale/ru'
import 'vuetify/dist/vuetify.min.css'
// import colors from 'vuetify/lib/util/color.js';

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    locales: { ru },
    current: 'ru'
  },
  theme: {
    dark: false,
    options: { customProperties: true },
    themes: {
      light: {
        primary: '#0188D1',
        darkblue: '#005987',
        darkbluetext: '#ecf8ff',
        // darkbluetext: '#667f8e',
        darkbluelinks: '#bcdae8',
        // darkbluelinks: '#408FBA',
        menuAccent: '#b9cddc',
        background: '#dbecf3'
      }
    }
  }
})
