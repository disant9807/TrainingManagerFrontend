<template>
  <v-menu
    v-model="isMenu"
    :close-on-content-click="false"
    :nudge-width="100"
    offset-x
  >
    <template v-slot:activator="{ on, attrs }">
      <v-badge
        :content="localCount"
        :value="localCount"
        color="green"
        overlap
        class="mr-1 my-1"
      >
        <v-chip
          class="my-2 mr-1"
          :close="!!localCount"
          small
          color="blue-grey"
          text-color="white"
          v-bind="attrs"
          v-on="on"
          @click:close="clear"
        >
          {{ chipText }}
        </v-chip>
      </v-badge>
    </template>
    <v-card
      class="mx-auto"
      min-width="400"
    >
      <v-toolbar
        flat
        color="darkblue"
        dark
      >
        <v-btn
          icon
          @click="isMenu = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ menuHeaderText }}</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <slot name="default"></slot>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          text
          color="primary"
          outlined
          @click="apply"
        >
          <v-icon class="mr-2" color="green">mdi-check</v-icon>
          Применить
        </v-btn>
        <v-btn
          text
          color="primary"
          outlined
          @click="cancel"
        >
          <v-icon class="mr-2" color="warning darken-1">mdi-cancel</v-icon>
          Отменить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Helper from '@/mixins/Helper'

@Component
export default class FilterItem extends mixins(Helper) {
  @Prop({
    type: Boolean,
    default: false
  }) readonly menuModel!: boolean;

  @Prop({
    type: String,
    default: ''
  }) readonly chipText!: string;

  @Prop({
    type: String,
    default: ''
  }) readonly menuHeaderText!: string;

  @Prop({
    type: Number,
    default: 0
  }) readonly count!: number;

  isMenu = false;

  @Watch('menuModel', { immediate: true })
  onModelChanged (value: boolean): void {
    this.isMenu = value
  }

  get localCount (): number {
    return this.count
  }

  apply (): void {
    this.isMenu = false
    this.$emit('apply')
  }

  cancel (): void {
    this.isMenu = false
    this.$emit('cancel')
  }

  clear (): void {
    this.$emit('clear')
  }
}
</script>

<style lang="scss" scoped>

</style>
