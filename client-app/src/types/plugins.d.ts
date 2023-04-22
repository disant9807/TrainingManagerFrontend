import _Vue from 'vue';
import { Api } from '@/api/baseApi';
import { localizationGroups } from '@/plugins/localize';

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api;
    $localize: (key: string, group: localizationGroups) => string;
    $eventbus: _Vue;
  }
}
