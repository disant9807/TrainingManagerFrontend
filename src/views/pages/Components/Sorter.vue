<template>
  <div class="sorting-block py-2 px-4 d-flex">
    <span class="mr-5">Сортировать:</span>
    <v-switch
      v-model="isAscending"
      dense
      hide-details
      :label="orderLabels"
      class="my-0 py-0"
    />
  </div>
</template>

<script lang="ts">
import { TOrder } from '@/types/globals'
import { Vue, Component, Watch, PropSync } from 'vue-property-decorator'

@Component
export default class ComponentName extends Vue {
  @PropSync('order', { type: String }) localOrder!: TOrder

  isAscending = false;

  get orderLabels (): string {
    return this.isAscending
      ? 'По возрастанию'
      : 'По убыванию'
  }

  @Watch('isAscending')
  onChange (newValue: boolean): void {
    this.localOrder = newValue ? 'Asc' : 'Desc'
    this.$emit('change')
  }
}
</script>

<style lang="scss">
.sorting-block {
  background: #f5f5f5;
  color: #5b5b5b;
}
</style>
