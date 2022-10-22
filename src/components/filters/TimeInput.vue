<template>
  <v-text-field
    v-model="localTime"
    :disabled="disabled"
    :label="label"
    :hint="$localize('timeHintShort', 'messages')"
    persistent-hint
    prepend-icon="mdi-clock-time-four-outline"
    :rules="isRequired ? [rules.required, validateTime, validateGap] : [validateTime, validateGap]"
    @blur="parse"
  />
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import { isHHMMTime, parseStringToTimeString, maxTime, minTime } from '@/utils/dateHelper';
import Validation from '@/mixins/Validation';

@Component
export default class TimeInput extends Validation {
  @PropSync('time') localTime!: string;
  @Prop({ type: String, default: maxTime }) max!: string;
  @Prop({ type: String, default: minTime }) min!: string;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Prop({ type: String, default: 'Время' }) label!: string;
  @Prop({ type: Boolean, default: false }) isRequired!: boolean;

  get notBefore(): boolean {
    const parsedMin = parseStringToTimeString(this.min || minTime);
    return this.localTime >= parsedMin;
  }

  get notLater(): boolean {
    const parsedMax = parseStringToTimeString(this.max || maxTime);
    return this.localTime <= parsedMax;
  }

  validateTime(): boolean | string {
    return (this.localTime && isHHMMTime(this.localTime)) || this.$localize('timeHint', 'validation');
  }

  validateGap(): boolean | string {
    return (this.notBefore && this.notLater) || this.$localize('gapHint', 'validation');
  }

  parse() {
    if (!this.localTime) return;
    this.localTime = parseStringToTimeString(this.localTime);
    this.$emit('update');
  }
}
</script>
