<template>
  <v-row class="mt-0">
    <v-col>
      <v-icon slot="prepend" class="mr-2" style="margin-bottom:10px">mdi-text</v-icon>
      <v-checkbox
        v-model="localValue"
        style="display: inline-block"
        :label="label"
        :readonly="readonly"
        filled
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation';
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator';
@Component
export default class InlineCheckField extends Vue {
  @Prop({ type: String, required: false, default: '' }) label!:string;
  @Prop({ type: Boolean, required: false, default: false }) readonly!:TRuleFunction[];
  @PropSync('value', { required: false, default: null }) localValue!:any;
}
</script>

<style>

</style>
