<template>
  <v-app>
    <v-main class="text-center">
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EmptyLayout extends Vue {

}
</script>

<style scoped>

</style>
