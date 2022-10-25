<template>
  <v-dialog
    v-model="isOpen"
    :persistent="modalData.persistent !== undefined ? modalData.persistent : defaults.persistent"
    :max-width="modalData.maxWidth ? modalData.maxWidth : defaults.maxWidth"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs">
        <v-spacer />
        <v-icon
          color="white"
          class="mr-2"
          @click="isOpen = false"
        >
          mdi-close
        </v-icon>
      </slot>
    </template>
    <slot name="fullReplace">
      <v-card>
        <v-card-title v-if="modalData.title" class="modal-header">
          <v-icon v-if="modalData.titleIcon" color="white" class="mr-2">
            mdi-{{ modalData.titleIcon }}
          </v-icon>
          <span class="headline">{{ modalData.title }}</span>
          <v-spacer />
          <v-icon
            color="white"
            class="mr-2"
            @click="isOpen = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-card-text class="pa-6 text-h6">
          <slot>{{ modalData.content }}</slot>
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
import { Mutation, State } from 'vuex-class';
import CButton, { TButton } from './CustomButton.vue';

export type TModalView = {
  title: string,
  titleIcon?: string,
  content?: string,
  maxWidth?: number,
  persistent?: boolean,
  actions?: TButton[],
}

@Component({ components: { CButton } })
export default class Modal extends Vue {
  @Prop({
    type: Object,
  }) readonly modalData!: TModalView;

  @State readonly isCommonModal!: boolean;

  @Mutation('setCommonModalState') setCommonModalState!: (newState: boolean) => void;

  defaults = {
    persistent: true,
    maxWidth: 500,
    content: '',
  }

  get localData(): any {
    return {
      title: this.modalData.title,
      titleIcon: this.modalData.titleIcon ? this.modalData.titleIcon : null,
      content: this.modalData.content ? this.modalData.content : this.defaults.content,
      maxWidth: this.modalData.maxWidth ? this.modalData.maxWidth : this.defaults.maxWidth,
      persistent: this.isBooleanExist(this.modalData.persistent) ? this.modalData.persistent : this.defaults.persistent,
      actions: this.modalData.actions && this.modalData.actions.length ? this.modalData.actions : null,
    };
  }

  isBooleanExist(value: unknown): boolean {
    return typeof value === 'boolean';
  }

  get isOpen(): boolean {
    return this.isCommonModal;
  }

  set isOpen(value: boolean) {
    this.setCommonModalState(value);
  }
}
</script>

<style lang="scss">
.modal-header {
  background-color: var(--v-primary-base);
  color: white;
}
</style>
