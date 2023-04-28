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
        primary: colors.green.lighten1,
        darkblue: colors.lightGreen.darken1,
        darkbluetext: colors.lightGreen.darken1,
        // darkbluetext: '#667f8e',
        darkbluelinks: colors.lightGreen.lighten5,
        // darkbluelinks: '#408FBA',
        menuAccent: colors.green.lighten5,
        background: colors.lightGreen.lighten5
      },
      dark: {
        primary: colors.indigo.base,
        secondary: colors.indigo.accent1,
        accent: colors.indigo.lighten4
      }
    }
  }
});
