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
    <v-slider
      v-model="lstart"
      max="100"
      min="-100"
      filled
      persistent-hint
    />
    <v-slider
      v-model="lend"
      max="100"
      min="-100"
      filled
      persistent-hint
    />
  </FilterItem>
</template>

<script lang='ts'>
import FilterItem from '@/components/FilterItem.vue';
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
export default class SliderFilter extends mixins(Global) {
  @Prop({ type: String, default: '' }) readonly chipText!: string;
  @Prop({ type: String, default: '' }) readonly menuHeaderText!: string;
  @Prop({ type: String, default: EBusEvents.CLEAR_FILTERS }) readonly clearEventName!: string;
  @PropSync('start', { type: String, default: '' }) lstart!: string;
  @PropSync('end', { type: String, default: '' }) lend!: string;
  @Prop() count!: number;
  showMenu = false;

  lastPeriod:string[]=[]

  created() {
    this.$eventbus.$on(this.clearEventName, this.cancel);
  }

  apply() {
    this.$emit('change', [this.lstart, this.lend]);
  }

  cancel() {
    this.$emit('change', ['', '']);
  }
}
</script>

<style>

</style>
