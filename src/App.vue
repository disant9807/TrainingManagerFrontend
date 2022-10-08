<template>
  <empty-layout v-if="isEmptyLayout">
    <router-view />
  </empty-layout>

  <base-layout v-else>
    <router-view />
  </base-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseLayout from '@/views/layouts/BaseLayout.vue'
import EmptyLayout from '@/views/layouts/EmptyLayout/EmptyLayout.vue'

@Component({
  components: { EmptyLayout, BaseLayout }
})
export default class App extends Vue {
  get isEmptyLayout (): boolean {
    return this.$route.meta?.emptyLayout
  }
}
</script>
