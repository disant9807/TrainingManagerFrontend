<template>
  <FilterItem
    :menu-model="showMenu"
    :count="count"
    :chip-text="chipText"
    :menu-header-text="menuHeaderText"
    @apply="apply"
    @cancel="cancel"
    @clear="cancel"
  >
    <div class="d-flex justify-center">
      <v-btn class="ma-1" @click="setAll">Все</v-btn>
      <v-btn class="ma-1" @click="setToday">Сегодня</v-btn>
      <v-btn class="ma-1" @click="setMonth">Месяц</v-btn>
    </div>

    <DateTimePicker
      ref="from"
      :selected-date-time.sync="lstartDateTime"
    />
    <DateTimePicker
      ref="to"
      :selected-date-time.sync="lendDateTime"
      end-of-day
    />
  </FilterItem>
</template>

<script lang='ts'>
import FilterItem from '@/views/pages/Components/FilterItem.vue';
import { Vue, Component, Prop, PropSync, Ref } from 'vue-property-decorator';
import DateTimePicker from '@/components/DateTime/DateTimePicker.vue';
import { EBusEvents } from '@/plugins/eventbus';
import Global from '@/mixins/GlobalMixin';
import { mixins } from 'vue-class-component';
@Component({
  components: {
  FilterItem,
  DateTimePicker
  }
  })
export default class DateTimeFilter extends mixins(Global) {
  @Prop({ type: String, default: '' }) readonly chipText!: string;
  @Prop({ type: String, default: '' }) readonly menuHeaderText!: string;
  @Prop({ type: String, default: EBusEvents.CLEAR_FILTERS }) readonly clearEventName!: string;
  @PropSync('startDateTime', { type: String, default: '' }) lstartDateTime!: string;
  @PropSync('endDateTime', { type: String, default: '' }) lendDateTime!: string;
  @Prop() count!: number;
  @Ref() readonly from!: DateTimePicker
  @Ref() readonly to!: DateTimePicker
  showMenu = false;

  lastPeriod:string[]=[]

  created() {
    this.$eventbus.$on(this.clearEventName, this.cancel);
  }

  apply() {
    if (this.from.validate() && this.to.validate()) {
      this.$emit('change', [this.lstartDateTime, this.lendDateTime]);
    } else {
      this.showError(this.$localize('failed', 'validation'));
    }
  }

  cancel() {
    this.from ? this.from.clear() : this.lstartDateTime = '';
    this.to ? this.to.clear() : this.lendDateTime = '';
    this.$emit('change', ['', '']);
  }

  get number() {
    const startSelected = this.lstartDateTime ? 1 : 0;
    const endSelected = this.lendDateTime ? 1 : 0;
    return startSelected + endSelected;
  }

  setAll() {
    [this.from.date, this.to.date] = ['', ''];
  }

  setToday() {
    const currentDate = new Date();
    const currentDateString = this.formatDate(currentDate);
    [this.from.date, this.to.date] = [currentDateString, currentDateString];
  }

  setMonth() {
    const currentDate = new Date();
    const firstDayInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    [this.from.date, this.to.date] = [this.formatDate(firstDayInMonth), this.formatDate(lastDayInMonth)];
  }

  formatDate(date:Date):string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
</script>

<style>

</style>
