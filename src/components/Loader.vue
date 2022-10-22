<template>
  <v-overlay absolute :value="isLoading">
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator';

@Component
export default class ComponentName extends Vue {
  @PropSync('value', { type: Boolean }) isLoading!: boolean
}
</script>
