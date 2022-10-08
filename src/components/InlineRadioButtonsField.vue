<template>
  <v-radio-group
    v-model="localSelected"
    :label="label"
    :rules="rules"
    mandatory
    dense
    row
  >
    <div class="mb-4">
      <v-radio
        v-for="(radioItem, i) in objects"
        :key="i"
        :label="radioItem.text"
        :value="radioItem.value"
      />
    </div>
  </v-radio-group>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation'
import { TVuetifyOptionsList } from '@/types/globals'
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'
@Component
export default class InlineRadioButtonsField extends Vue {
  @Prop({ type: String, required: false, default: '' }) label!:string;
  @Prop({ type: Array, required: false, default: () => [] }) objects!:TVuetifyOptionsList[];
  @Prop({ type: Array, required: false, default: () => [] }) rules!:TRuleFunction[];
  @PropSync('selected', { type: [String, Boolean, Number], required: false, default: '' }) localSelected!:string;
}
</script>

<style>

</style>
