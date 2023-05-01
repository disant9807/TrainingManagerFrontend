<template>
  <v-dialog
    v-model="dialog"
    scrollable
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="900px"
  >
    <v-card class="pb-3">
      <v-card-title class="darkblue pl-3 py-0">
        <v-subheader class="white--text font-weight-light header-wrap">
          <div class="header">Удаление упражнения из подхода</div>
        </v-subheader>
      </v-card-title>
      <v-card-text style="height: 300px;">
        <h3>{{ `Вы действительно желаете удалить упражнение номер ${selectedApproachItem?.numberOfApproach ?? ''} из подхода?` }}</h3>
      </v-card-text>
      <v-card-actions class="ml-3">
        <slot name="controls">
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            :disabled="loading"
            @click="apply"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Удалить
          </v-btn>
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            :disabled="loading"
            @click="cancel"
          >
            <v-icon class="mr-2">mdi-cancel</v-icon>
            Отмена
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Component, PropSync } from 'vue-property-decorator';
import { TApproachItem } from '@/controllers/TrainingController';

@Component
export default class ModalDeleteApproachItem extends Global {
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: true }) selectedApproachItem!: TApproachItem | null;
  loading = false;

  apply() {
    this.$emit('select');
  }

  cancel() {
    this.$emit('cancel');
  }
}
</script>
