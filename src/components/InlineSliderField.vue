<template>
  <v-row class="mt-0">
    <v-col>
      <v-slider
        v-model="localValue"
        :hint="hint"
        :label="label"
        :rules="rules"
        :readonly="readonly"
        :disabled="disabled"
        :max="max"
        :min="min"
        :step="step"
        filled
        persistent-hint
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation';
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
@Component
export default class InlineSliderField extends Vue {
  @Prop({ type: String, default: '' }) hint!: string;
  @Prop({ type: String, required: false, default: '' }) label!:string;
  @Prop({ type: Array, required: false, default: () => [] }) rules!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) readonly!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) disabled!:TRuleFunction[];
  @Prop({ type: Number, required: false, default: 0 }) max!:number;
  @Prop({ type: Number, required: false, default: 0 }) min!:number;
  @Prop({ type: Number, required: false, default: 0 }) step!:number;
  @PropSync('value', { required: false, default: null }) localValue!:any;
}
</script>

<style>

</style>
