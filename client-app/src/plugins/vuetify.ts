import Vue from 'vue';
import Vuetify from 'vuetify';
import ru from 'vuetify/src/locale/ru';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    locales: { ru },
    current: 'ru'
  },
  theme: {
    options: { customProperties: true },
    themes: {
      light: {
        error: colors.lime.darken3,
        red: colors.lime.darken3,
        primary: colors.green.darken1,
        darkblue: colors.green.lighten1,
        darkbluetext: '#ecf8ff',
        // darkbluetext: '#667f8e',
        darkbluelinks: colors.green.lighten5,
        // darkbluelinks: '#408FBA',
        menuAccent: colors.green.lighten5,
        background: colors.green.lighten5
      },
      dark: {
        primary: colors.indigo.base,
        secondary: colors.indigo.accent1,
        accent: colors.indigo.lighten4
      }
    }
  }
});
