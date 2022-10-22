/* eslint-disable import/no-duplicates */

import Vue from 'vue';
import _Vue from 'vue';

const $eventbus = new Vue();

export enum EBusEvents {
  ACCRED_CLEAR_FILTERS = 'accred_clear_filters',
  SOAPLOG_CLEAR_FILTERS = 'soaplog_clear_filters',
  AUDITLOG_CLEAR_FILTERS = 'auditlog_clear_filters',
  CLEAR_FILTERS = 'clear_filters',
}

export default function eventBusPlugin(Vue: typeof _Vue.prototype): void {
  Vue.prototype.$eventbus = $eventbus;
}
