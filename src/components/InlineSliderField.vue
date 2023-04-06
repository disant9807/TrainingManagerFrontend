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
        :thumb-label="localValueStr"
        filled
        persistent-hint
        always-dirty
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation';
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';
@Component
export default class InlineSliderField extends Vue {
  @Prop({ type: String, default: '' }) hint!: string;
  @Prop({ type: String, required: false, default: '' }) label!:string;
  @Prop({ type: Array, required: false, default: () => [] }) rules!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) readonly!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) disabled!:TRuleFunction[];
  @Prop({ type: [Number, String], required: false, default: 0 }) max!:number;
  @Prop({ type: [Number, String], required: false, default: 0 }) min!:number;
  @Prop({ type: [Number, String], required: false, default: 0 }) step!:number;
  @Prop({ type: [Boolean, String], required: false, default: false }) thumbLabel!:any;
  @PropSync('value', { required: false, default: '' }) realValue!:any;
  localValue = '';

  get localValueStr() {
    return this.localValue += '';
  }

  @Watch('value', { immediate: true })
  updateLocalValue() {
    this.localValue = this.realValue;
  }

  @Watch('localValue', { immediate: true })
  updateRealValue() {
    this.realValue = this.localValue;
  }
}
</script>

<style>

</style>
