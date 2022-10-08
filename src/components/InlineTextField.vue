<template>
  <v-row class="mt-0">
    <v-col>
      <v-text-field
        v-model="localValue"
        :hint="hint"
        :label="label"
        :dense="false"
        :rules="rules"
        :readonly="readonly"
        :disabled="disabled"
        :clearable="!readonly && !nonClear"
        :type="password ? 'password' : 'text'"
        :counter="maxlength>0"
        :maxlength="maxlength>0 ? maxlength : ''"
        filled
        persistent-hint
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation'
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'
@Component
export default class InlineTextField extends Vue {
  @Prop({ type: String, default: '' }) hint!: string;
  @Prop({ type: String, required: false, default: '' }) label!:string;
  @Prop({ type: Array, required: false, default: () => [] }) rules!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) readonly!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) disabled!:TRuleFunction[];
  @Prop({ type: Number, required: false, default: 0 }) maxlength!:number;
  @Prop({ type: Boolean, required: false, default: false }) password!:boolean;
  @Prop({ type: Boolean, required: false, default: false }) nonClear!:boolean;
  @PropSync('value', { required: false, default: null }) localValue!:any;
}
</script>

<style>

</style>
