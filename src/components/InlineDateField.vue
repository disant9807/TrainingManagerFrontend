<template>
  <v-row class="mt-0">
    <v-col>
      <v-menu
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateFormatted"
            :readonly="readonly"
            :label="label"
            :dense="false"
            :rules="rules.concat(isDate)"
            :hint="$localize('dateHint','validation')"
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            filled
            clearable
            persistent-hint
            @input="parseDate(dateFormatted)"
            @blur="localValue = parseDate(dateFormatted)"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="date"
          no-title
          :max="maxDate"
          :min="minDate"
          @input="updateStartDateTime"
        />
      </v-menu>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { TRuleFunction } from '@/mixins/Validation';
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';
import * as dateHelper from '@/utils/dateHelper';
@Component
export default class InlineDateField extends Vue {
  @Prop({ type: String, required: false, default: '' }) label!:string;
  @Prop({ type: String, required: false, default: '' }) minDate!:string;
  @Prop({ type: String, required: false, default: '' }) maxDate!:string;
  @Prop({ type: Array, required: false, default: () => [] }) rules!:TRuleFunction[];
  @Prop({ type: Boolean, required: false, default: false }) readonly!:TRuleFunction[];
  @PropSync('value', { required: false, default: '' }) localValue!:any;
  menu1=false;
  dateFormatted = '';
  date = '';

  @Watch('value', { immediate: true })
  updateFormattedDate() {
    this.dateFormatted = this.localValue && dateHelper.localeDateFormat(this.localValue, false);
  }

  parseDate(date: string):string {
    if (date && dateHelper.dateFromDDMMYYY(date)) {
      const [day, month, year] = date.split('.');
      const result = `${year}-${month}-${day}`;
      this.date = result;
    } else if (!date) {
      this.date = '';
    }
    return this.date;
  }

  updateStartDateTime(date:string) {
    if (date) {
      this.dateFormatted = this.formatDate(date) || '';
    }
    this.localValue = date;
    this.menu1 = false;
  }

  formatDate(date:string) {
    if (!date) return null;
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  }

  isDate(value: string): true | string {
    return !value || !!dateHelper.dateFromDDMMYYY(value) || this.$localize('date', 'validation');
  }
}
</script>

<style>

</style>
