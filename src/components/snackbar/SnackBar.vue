<template>
  <v-snackbar
    v-model="isShown"
    :color="status"
    :timeout="timeout"
    top
    multi-line
  >
    <v-layout align-center py-3 class="v-alert--prominent">
      <v-icon dark class="v-alert__icon">{{ icon }}</v-icon>
      <div v-if="isHtml" v-html="message"></div>
      <div v-else>{{ message }}</div>
    </v-layout>

    <v-btn
      v-if="timeout === 0"
      fab
      x-small
      @click="isShown = !isShown"
    >
      <v-icon :color="status">mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'
import SnackBarController, { TSnackBar, TSnackBarStatuses } from '@/components/snackbar/SnackBar'

@Component
export default class SnackBar extends Vue {
  @State readonly snackBar!: TSnackBar;
  @Mutation('setSnackbarShow') setSnackbarShow!: (value: boolean) => void;

  get isShown (): boolean {
    return this.snackBar.show
  }

  set isShown (value: boolean) {
    this.setSnackbarShow(value)
  }

  get isHtml (): boolean {
    return this.snackBar.isHtml
  }

  get timeout (): number {
    return this.snackBar.timeout
  }

  get message (): string {
    return this.snackBar.message
  }

  get status (): TSnackBarStatuses {
    return this.snackBar.status
  }

  get icon (): string {
    return SnackBarController.icons[this.status]
  }
}
</script>
