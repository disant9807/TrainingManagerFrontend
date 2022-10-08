<template>
  <v-row class="mt-0">
    <v-col>
      <v-autocomplete
        v-model="localValue"
        :items="localItems"
        :rules="rules"
        :label="label"
        item-text="text"
        item-value="value"
        :menu-props="{ offsetY: true }"
        hide-selected
        :readonly="readonly"
        autocomplete="off"
        filled
        :clearable="!readonly"
        :multiple="multiple"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation'
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class InlineAutocompleteField extends Vue {
  @Prop({ type: String, required: false, default: '' }) label!: string;
  @Prop({ type: Boolean, required: false, default: false }) readonly!: boolean;
  @Prop({ type: Boolean, default: false }) multiple!: boolean;
  @PropSync('value', { required: false, default: () => (null) }) localValue!: any;
  @Prop({ type: Array, required: false, default: () => [] }) rules!: TRuleFunction[];
  @PropSync('items', { type: Array, required: false, default: () => [] }) localItems!: [];
}
</script>
