<template>
  <FilterItem
    :menu-model="isMenuOpen"
    :count="count"
    :chip-text="chipText"
    :menu-header-text="menuHeaderText"
    @apply="$emit('apply',itemsList)"
    @cancel="itemsList = [], $emit('cancel',itemsList)"
    @clear="itemsList = [], $emit('clear',itemsList)"
  >
    <v-list dense class="list treeOverflow">
      <v-list-item-group v-model="itemsList" multiple>
        <v-list-item
          v-for="(sourceItem, i) in itemsListText"
          :key="`list-item-${i}`"
          :value="sourceItem.value"
        >
          <template v-slot:default="{ active }">
            <v-list-item-action>
              <v-checkbox
                :key="`checkbox_${i}`"
                color="primary"
                :input-value="active"
              />
            </v-list-item-action>
            <v-list-item-title class="secondary--text" v-text="sourceItem.text" />
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </FilterItem>
</template>

<script lang="ts">
import FilterItem from '@/components/FilterItem.vue'
import Global from '@/mixins/GlobalMixin'
import { TVuetifyOptionsList } from '@/types/globals'
import { Component, Prop, PropSync } from 'vue-property-decorator'

@Component({
  components: {
    FilterItem
  }
})
export default class CheckboxListFilter extends Global {
@Prop({ type: Boolean, required: false, default: false }) readonly isMenuOpen!:boolean;
@Prop({ type: String, required: false, default: '' }) readonly chipText!:string;
@Prop({ type: String, required: false, default: '' }) readonly menuHeaderText!:string;
@Prop({ type: Number, required: false, default: 0 }) readonly count!:number;
@PropSync('selectedItems', { type: Array, required: false, default: () => [] }) readonly itemsList!:any[];
@Prop({ type: Array, required: false, default: () => [] }) readonly itemsListText!:TVuetifyOptionsList[];
}
</script>

<style>

</style>
