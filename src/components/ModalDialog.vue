<template>
  <v-dialog
    v-model="isOpen"
    :persistent="modalData.persistent !== undefined ? modalData.persistent : defaults.persistent"
    :max-width="modalData.maxWidth ? modalData.maxWidth : defaults.maxWidth"
  >
    <slot name="fullReplace">
      <v-card>
        <v-card-title class="modal-header">
          <v-icon v-if="modalData.titleIcon" color="white" class="mr-2">
            mdi-{{ modalData.titleIcon }}
          </v-icon>
          <span class="headline">{{ modalData.title }}</span>
          <v-spacer />
          <v-icon
            color="white"
            class="mr-2"
            @click="$emit('close')"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text class="pa-6 text-h6">
          <slot>Контент не определен</slot>
        </v-card-text>
        <v-card-actions
          v-if="modalData.actions"
          class="pa-6"
        >
          <slot name="actions">
            <v-spacer />
            <CButton
              v-for="(buttonData, buttonIndex) in modalData.actions"
              :key="buttonIndex"
              :button-data="buttonData"
              @click="buttonData.onClick"
            />
          </slot>
        </v-card-actions>
      </v-card>
    </slot>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import CButton, { TButton } from './CustomButton.vue';

export type TModalView = {
  title: string,
  titleIcon?: string,
  maxWidth?: number,
  persistent?: boolean,
  actions?: TButton[],
}

@Component({ components: { CButton } })
export default class ModalDialog extends Vue {
  @Prop({ type: Object }) readonly modalData!: TModalView;
  @Prop({ required: true, default: false }) isOpen!: boolean

  defaults = {
    persistent: true,
    maxWidth: 500,
    content: '',
  }

  get localData(): any {
    return {
      title: this.modalData.title,
      titleIcon: this.modalData.titleIcon ? this.modalData.titleIcon : null,
      maxWidth: this.modalData.maxWidth ? this.modalData.maxWidth : this.defaults.maxWidth,
      persistent: this.isBooleanExist(this.modalData.persistent) ? this.modalData.persistent : this.defaults.persistent,
      actions: this.modalData.actions && this.modalData.actions.length ? this.modalData.actions : null,
    };
  }

  isBooleanExist(value: unknown): boolean {
    return typeof value === 'boolean';
  }
}
</script>

<style lang="scss">
.modal-header {
  background-color: var(--v-primary-base);
  color: white;
}
</style>
