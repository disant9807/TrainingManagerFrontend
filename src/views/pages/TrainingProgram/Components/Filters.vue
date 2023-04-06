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
        <SliderFilter
          chip-text="Период тренировочных дней в программе"
          menu-header-text="Выбор периода"
          :start.sync="minCountTraining"
          :end.sync="maxCountTraining"
          :count="filterModel?.periodTraining?.filter(d => d).length"
          @change="apply('periodTraining')"
        />
        <filter-item
          :menu-model="isExercise"
          :count="filterModel?.exercises?.length"
          chip-text="Упражнения в тренировочной программе"
          menu-header-text="Выбор упражнений"
          @apply="apply('exercise')"
          @cancel="cancel('exercise')"
          @clear="clear('exercise')"
        >
          <div class="d-flex">
            <v-autocomplete
              v-model="exercise"
              :items="exercisesList"
              label="Упражнения"
              item-text="text"
              item-value="value"
              multiple
              readonly
              filled
              @click="onOpenModalFilterExercise"
            />
            <v-btn
              color="darkblue"
              class="ml-3 mt-2"
              icon
              @click="clear('exercise')"
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
    <ModalFilterExercise
      :show.sync="selectExercisesState"
      :selected.sync="selectExercise"
      :ids-selected="exercise"
      @select="onClickSelectExercise"
      @cancel="onClickCancelExercise"
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
import { TTrainingProgramFilterViewModel } from '@/controllers/TrainingProgramController';
import { TExercise } from '@/controllers/ExerciseController';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import ModalFilterExercise from '@/views/pages/Components/ModalFilterExercise.vue';
import { TVuetifyOptionsList } from '@/types/globals';

type TFilterType = 'name' | 'period' | 'exercise' | 'periodTraining';

export type TIncomingRouteName = 'New' | 'Handled' | 'Saved';

@Component({
  components: {
  FilterItem,
  DateTimePicker,
  DateTimeFilter,
  ModalFilterExercise,
  SliderFilter
  }
  })
export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  get filterModel(): TTrainingProgramFilterViewModel {
    return this.filters.trainingProgram;
  }

  set filterModel(value: TTrainingProgramFilterViewModel) {
    this.setFilters({ name: 'trainingProgram', value });
    this.$emit('change');
  }

  get loadingModel() {
    return this.loading.exercise;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'trainingProgram', name: 'list', value });
  }

  created(): void {
    this.name = this.filterModel.name || '';
    [this.createdFrom, this.createdTo] = this.filterModel.period || [];
    [this.minCountTraining, this.maxCountTraining] = this.filterModel.periodTraining || [];
    this.exercise = this.filterModel.exercises || [];
    this.categoryOfBodies = this.filterModel.categoryOfBodies || [];
  }

  name = '';

  createdFrom = '';
  createdTo = '';
  isPeriod = false;
  period = [];

  minCountTraining = '';
  maxCountTraining = '';
  isPeriodTraining = false;
  periodTraining = [];

  isExercise = false;
  exercise: string[] = [];

  categoryOfBodies: string[] = [];

  selectExercisesState = false;
  selectExercise: TExercise[] | null = [];

  get exercisesList(): TVuetifyOptionsList[] {
    return this.selectExercise?.map(e => {
      return { value: e.id, text: e.shortName ?? e.name };
    }) ?? [];
  }

  onOpenModalFilterExercise() {
    this.selectExercisesState = true;
  }

  onClickSelectExercise() {
    this.exercise = this.selectExercise?.map(e => e.id) ?? [];
    this.selectExercisesState = false;
    this.apply('exercise');
  }

  onClickCancelExercise() {
    this.selectExercisesState = false;
  }

  clearFilters(): void {
    this.name = '';
    this.period = [];
    this.periodTraining = [];
    this.exercise = [];
    this.categoryOfBodies = [];

    this.filterModel = {
      name: '',
      period: [],
      periodTraining: [],
      categoryOfBodies: [],
      exercises: []
    };

    this.$emit('change');
  }

  apply(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'name':
        this.filterModel = { ...this.filterModel, name: this.name };
        break;

      case 'period':
        this.filterModel = { ...this.filterModel, period: [this.createdFrom, this.createdTo] };
        break;

      case 'periodTraining':
        this.filterModel = { ...this.filterModel, periodTraining: [this.minCountTraining, this.maxCountTraining] };
        break;

      case 'exercise':
        this.filterModel = { ...this.filterModel, exercises: this.exercise };
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

      case 'period':
        [this.createdFrom, this.createdTo] = this.filterModel.period || [];
        break;

      case 'periodTraining':
        [this.minCountTraining, this.maxCountTraining] = this.filterModel.periodTraining || [];
        break;

      case 'exercise':
        this.exercise = this.filterModel.exercises || [];
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

      case 'period':
        [this.createdFrom, this.createdTo] = ['', ''];
        this.filterModel = { ...this.filterModel, period: [] };
        break;

      case 'periodTraining':
        [this.minCountTraining, this.maxCountTraining] = ['', ''];
        this.filterModel = { ...this.filterModel, periodTraining: [] };
        break;

      case 'exercise':
        this.exercise = [];
        this.filterModel = { ...this.filterModel, exercises: [] };
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
