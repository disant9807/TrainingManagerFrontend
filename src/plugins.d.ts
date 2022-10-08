import _Vue from 'vue'
import { localizationGroups } from '@/plugins/localize'

declare module 'vue/types/vue' {
  interface Vue {
    $localize: (key: string, group: localizationGroups) => string;
    $eventbus: _Vue;
  }
}
