<template>
  <div class="text-center pa-1">
    <v-text-field
      v-model="name"
      name="searchfield"
      label="Введите название"
      outlined
      clearable
      class="ma-3 search-field"
      hide-details
      @keydown="onKeydown"
    >
      <template #append-outer>
        <v-btn
          color="primary"
          outlined
          fab
          small
          style="align-self: center"
          class="ml-3"
          @click="apply('name')"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <fieldset class="fieldset" aria-hidden="true">
      <legend style="width: 86.25px;text-align: -webkit-center;"><span>фильтры</span></legend>
      <div class="filterBlock pa-1 pb-4">
        <DateTimeFilter
          ref="dateTime"
          chip-text="Период создания"
          menu-header-text="Выбор периода"
          :start-date-time.sync="createdFrom"
          :end-date-time.sync="createdTo"
          :count="filterModel?.period?.filter(d => d).length"
          @change="apply('period')"
        />
        <filter-item
          :menu-model="isCategoryOfBodies"
          :count="filterModel?.categoryOfBodies?.length"
          chip-text="Часть измерения"
          menu-header-text="Выбор части"
          @apply="apply('categoryOfBodies')"
          @cancel="cancel('categoryOfBodies')"
          @clear="clear('categoryOfBodies')"
        >
          <div class="d-flex">
            <v-autocomplete
              v-model="categoryOfBodies"
              :items="bodiesList"
              label="Мышечные группы"
              item-text="text"
              item-value="value"
              multiple
              readonly
              filled
              @click="onOpenModalFilterBodies"
            />
            <v-btn
              color="darkblue"
              class="ml-3 mt-2"
              icon
              @click="clear('categoryOfBodies')"
            >
              <v-icon dark>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </filter-item>
      </div>
      <v-btn
        fab
        x-small
        class="secondary lighten-4 filterClose"
        outlined
        @click="clearFilters"
      >
        <v-icon class="white--text">mdi-close</v-icon>
      </v-btn>
    </fieldset>
    <ModalFilterCategoryOfBody
      :show.sync="selectBodiesState"
      :selected.sync="selectBodies"
      :ids-selected="categoryOfBodies"
      @select="onClickSelectBodies"
      @cancel="onClickCancelBodies"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helper from '@/mixins/Helper';
import DateTimePicker from '@/components/DateTime/DateTimePicker.vue';
import FilterItem from '../../../../components/FilterItem.vue';
import DateTimeFilter from '@/components/filters/DateTimeFilter.vue';
import SliderFilter from '@/components/filters/SliderFilter.vue';
import { Mutation, State } from 'vuex-class';
import { TGoalFilterModel, TGoalFilterViewModel } from '@/controllers/GoalController';
import ModalFilterUnitsOfMeasurement from '@/views/pages/Components/ModalFilterUnitsOfMeasurement.vue';
import ModalFilterCategoryOfBody from '@/views/pages/Components/ModalFilterCategoryOfBody.vue';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import { TUnitsOfMeasurement } from '@/controllers/UnitsOfMeasurementController';
import { TVuetifyOptionsList } from '@/types/globals';

type TFilterType = 'name' | 'period' | 'categoryOfBodies' | 'codeUnitsOfMeasurement' | 'description' | 'periodCompletion';

export type TIncomingRouteName = 'New' | 'Handled' | 'Saved';

@Component({
  components: {
  FilterItem,
  DateTimePicker,
  DateTimeFilter,
  SliderFilter,
  ModalFilterUnitsOfMeasurement,
  ModalFilterCategoryOfBody
  }
  })
export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  get filterModel(): TGoalFilterViewModel {
    return this.filters.goal;
  }

  set filterModel(value: TGoalFilterViewModel) {
    this.setFilters({ name: 'goal', value });
    this.$emit('change');
  }

  get loadingModel() {
    return this.loading.exercise;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'goal', name: 'list', value });
  }

  created(): void {
    this.name = this.filterModel.name || '';
    this.description = this.filterModel.description || '';
    [this.createdFrom, this.createdTo] = this.filterModel.period || [];
    this.categoryOfBodies = this.filterModel.categoryOfBodies || [];
    this.codeUnitsOfMeasurement = this.filterModel.codeUnitsOfMeasurement || [];
    [this.completionFrom, this.completionTo] = this.filterModel.periodCompletion || [];
  }

  name = '';

  description = '';

  createdFrom = '';
  createdTo = '';
  isPeriod = false;
  period = [];

  completionFrom = '';
  completionTo = '';
  isPeriodCompletion = [];
  periodCompletion = [];

  isCategoryOfBodies = false;
  categoryOfBodies: string[] = [];
  selectBodiesState = false;
  selectBodies: TCategoryOfBody[] | null = [];

  isСodeUnitsOfMeasurement = false;
  codeUnitsOfMeasurement: string[] = [];

  get bodiesList(): TVuetifyOptionsList[] {
    return this.selectBodies?.map(e => {
      return { value: e.code, text: e.shortName ?? e.name };
    }) ?? [];
  }

  onOpenModalFilterBodies() {
    this.selectBodiesState = true;
  }

  onClickSelectBodies() {
    this.categoryOfBodies = this.selectBodies?.map(e => e.code) ?? [];
    this.selectBodiesState = false;
    this.apply('categoryOfBodies');
  }

  onClickCancelBodies() {
    this.selectBodiesState = false;
  }

  clearFilters(): void {
    this.name = '';
    this.description = '';
    this.createdFrom = '';
    this.createdTo = '';
    this.period = [];
    this.completionFrom = '';
    this.completionTo = '';
    this.periodCompletion = [];
    this.categoryOfBodies = [];
    this.codeUnitsOfMeasurement = [];

    this.filterModel = {
      name: '',
      description: '',
      period: [],
      periodCompletion: [],
      categoryOfBodies: [],
      codeUnitsOfMeasurement: [],
      createdFrom: '',
      createdTo: '',
      completionFrom: '',
      completionTo: ''
    };

    this.$emit('change');
  }

  apply(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'name':
        this.filterModel = { ...this.filterModel, name: this.name };
        break;

      case 'description':
        this.filterModel = { ...this.filterModel, description: this.name };
        break;

      case 'period':
        this.filterModel = { ...this.filterModel, period: [this.createdFrom, this.createdTo] };
        break;

      case 'periodCompletion':
        this.filterModel = { ...this.filterModel, periodCompletion: [this.completionFrom, this.completionTo] };
        break;

      case 'categoryOfBodies':
        this.filterModel = { ...this.filterModel, categoryOfBodies: this.categoryOfBodies };
        break;

      case 'codeUnitsOfMeasurement':
        this.filterModel = { ...this.filterModel, categoryOfBodies: this.codeUnitsOfMeasurement };
        break;

      default:
        break;
    }

    this.$emit('change');
  }

  cancel(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'name':
        this.name = this.filterModel.name || '';
        break;

      case 'description':
        this.description = this.filterModel.description || '';
        break;

      case 'periodCompletion':
        [this.completionFrom, this.completionTo] = this.filterModel.periodCompletion || [];
        break;

      case 'period':
        [this.createdFrom, this.createdTo] = this.filterModel.period || [];
        break;

      case 'categoryOfBodies':
        this.categoryOfBodies = this.filterModel.categoryOfBodies || [];
        break;

      case 'codeUnitsOfMeasurement':
        this.codeUnitsOfMeasurement = this.filterModel.codeUnitsOfMeasurement || [];
        break;

      default:
        break;
    }
  }

  clear(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'name':
        this.name = '';
        this.filterModel = { ...this.filterModel, name: '' };
        break;

      case 'description':
        this.description = '';
        this.filterModel = { ...this.filterModel, description: '' };
        break;

      case 'periodCompletion':
        [this.completionFrom, this.completionTo] = ['', ''];
        this.filterModel = { ...this.filterModel, periodCompletion: [] };
        break;

      case 'period':
        [this.createdFrom, this.createdTo] = ['', ''];
        this.filterModel = { ...this.filterModel, period: [] };
        break;

      case 'categoryOfBodies':
        this.categoryOfBodies = [];
        this.filterModel = { ...this.filterModel, categoryOfBodies: [] };
        break;

      case 'codeUnitsOfMeasurement':
        this.filterModel = { ...this.filterModel, codeUnitsOfMeasurement: [] };
        break;

      default:
        break;
    }

    this.$emit('change');
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.apply('name');
    }
  }
}
</script>

<style lang="scss">
.chipGroupContent {
  & .v-slide-group__content {
    flex-direction: column;
  }
}
.list {
  overflow-y: auto;
}
.export-button {
  background-color: #c3c3c3;
  margin-top: 20px;
}
.search-field {
  display: flex;
  .v-input__append-outer {
    margin: 0 !important;
    padding: 0 !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-self: center;
    width: 50px;
  }
}
</style>
