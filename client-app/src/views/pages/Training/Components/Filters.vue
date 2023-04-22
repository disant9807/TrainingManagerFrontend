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
        <DateTimeFilter
          ref="dateTime"
          chip-text="Период тренировки"
          menu-header-text="Выбор периода"
          :start-date-time.sync="trainingFrom"
          :end-date-time.sync="trainingTo"
          :count="filterModel?.periodTrainingDate?.filter(d => d).length"
          @change="apply('periodTrainingDate')"
        />
        <SliderFilter
          chip-text="Период количество упражнений"
          menu-header-text="Период упражнений"
          :start.sync="minCountApproach"
          :end.sync="maxCountApproach"
          :count="filterModel?.periodApproachs?.filter(d => d).length"
          @change="apply('periodApproachs')"
        />
        <filter-item
          :menu-model="isExercise"
          :count="filterModel?.exercises?.length"
          chip-text="Упражнения"
          menu-header-text="Упражнения"
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
              readonly
              multiple
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
        <filter-item
          :menu-model="isTrainingProgram"
          :count="filterModel?.trainingPrograms?.length"
          chip-text="Тренировочные программы"
          menu-header-text="Тренировочные программы"
          @apply="apply('trainingPrograms')"
          @cancel="cancel('trainingPrograms')"
          @clear="clear('trainingPrograms')"
        >
          <div class="d-flex">
            <v-autocomplete
              v-model="trainingPrograms"
              :items="trainingProgramList"
              label="Тренировочные программы"
              item-text="text"
              item-value="value"
              readonly
              multiple
              filled
              @click="onOpenModalFilterTrainingProgram"
            />
            <v-btn
              color="darkblue"
              class="ml-3 mt-2"
              icon
              @click="clear('trainingPrograms')"
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
    <ModalFilterTrainingProgram
      :show.sync="selectTrainingProgramState"
      :selected.sync="selectTrainingProgram"
      :ids-selected="trainingPrograms"
      @select="onClickSelectTrainingProgram"
      @cancel="onClickCancelTrainingProgram"
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
import { TTraining, TTrainingFilterModel, TTrainingFilterViewModel } from '@/controllers/TrainingController';
import { TExercise } from '@/controllers/ExerciseController';
import { TTrainingProgram } from '@/controllers/TrainingProgramController';
import ModalFilterExercise from '@/views/pages/Components/ModalFilterExercise.vue';
import ModalFilterTrainingProgram from '@/views/pages/Components/ModalFilterTrainingProgram.vue';
import { TVuetifyOptionsList } from '@/types/globals';

type TFilterType = 'name' | 'period' | 'periodTrainingTime' | 'trainingPrograms' | 'isNoneTrainingProgram' | 'periodApproachs' | 'periodTrainingDate' | 'exercise';

export type TIncomingRouteName = 'New' | 'Handled' | 'Saved';

@Component({
  components: {
  FilterItem,
  DateTimePicker,
  DateTimeFilter,
  ModalFilterExercise,
  ModalFilterTrainingProgram,
  SliderFilter
  }
  })
export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  get filterModel(): TTrainingFilterViewModel {
    return this.filters.training;
  }

  set filterModel(value: TTrainingFilterViewModel) {
    this.setFilters({ name: 'training', value });
    this.$emit('change');
  }

  get loadingModel() {
    return this.loading.exercise;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'training', name: 'list', value });
  }

  created(): void {
    this.name = this.filterModel.name || '';
    [this.createdFrom, this.createdTo] = this.filterModel.period || [];
    [this.trainingFrom, this.trainingTo] = this.filterModel.periodTrainingDate || [];
    this.trainingPrograms = this.filterModel.trainingPrograms || [];
    this.isNoneTrainingProgram = this.filterModel.isNoneTrainingProgram || null;
    [this.minCountApproach, this.maxCountApproach] = this.filterModel.periodApproachs || [];
    [this.minTimeSec, this.maxTimeSec] = this.filterModel.periodTrainingTime || [];
    this.exercise = this.filterModel.exercises || [];
    this.categoryOfBodies = this.filterModel.categoryOfBodies || [];
  }

  name = '';

  createdFrom = '';
  createdTo = '';
  isPeriod = false;
  period = [];

  trainingFrom = '';
  trainingTo = '';
  periodTrainingDate = [];

  isTrainingProgram = false;
  trainingPrograms: string[] = [];

  isNoneTrainingProgram: boolean | null = null;

  periodApproachs = [];
  minCountApproach = '';
  maxCountApproach = '';

  periodTrainingTime = [];
  minTimeSec = '';
  maxTimeSec = '';

  isExercise = false;
  exercise: string[] = [];

  categoryOfBodies: string[] = [];

  selectExercisesState = false;
  selectExercise: TExercise[] | null = [];

  selectTrainingProgramState = false;
  selectTrainingProgram: TTrainingProgram[] | null = [];

  get exercisesList(): TVuetifyOptionsList[] {
    return this.selectExercise?.map(e => {
      return { value: e.id, text: e.shortName ?? e.name };
    }) ?? [];
  }

  get trainingProgramList(): TVuetifyOptionsList[] {
    return this.selectTrainingProgram?.map(e => {
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

  onOpenModalFilterTrainingProgram() {
    this.selectTrainingProgramState = true;
  }

  onClickSelectTrainingProgram() {
    this.trainingPrograms = this.selectTrainingProgram?.map(e => e.id) ?? [];
    this.selectTrainingProgramState = false;
    this.apply('trainingPrograms');
  }

  onClickCancelTrainingProgram() {
    this.selectTrainingProgramState = false;
  }

  clearFilters(): void {
    this.name = '';
    this.createdFrom = '';
    this.createdTo = '';
    this.period = [];
    this.trainingFrom = '';
    this.trainingTo = '';
    this.periodTrainingTime = [];
    this.minTimeSec = '';
    this.maxTimeSec = '';
    this.trainingPrograms = [];
    this.isNoneTrainingProgram = null;
    this.minCountApproach = '';
    this.maxCountApproach = '';
    this.periodApproachs = [];
    this.periodTrainingDate = [];
    this.exercise = [];
    this.categoryOfBodies = [];

    this.filterModel = {
      name: '',
      period: [],
      periodTrainingTime: [],
      trainingPrograms: [],
      isNoneTrainingProgram: undefined,
      periodApproachs: [],
      periodTrainingDate: [],
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

      case 'periodTrainingTime':
        this.filterModel = { ...this.filterModel, periodTrainingTime: [this.minTimeSec, this.maxTimeSec] };
        break;

      case 'trainingPrograms':
        this.filterModel = { ...this.filterModel, trainingPrograms: this.trainingPrograms };
        break;

      case 'isNoneTrainingProgram':
        this.filterModel = { ...this.filterModel, isNoneTrainingProgram: this.isNoneTrainingProgram ?? undefined };
        break;

      case 'periodApproachs':
        this.filterModel = { ...this.filterModel, periodApproachs: [this.minCountApproach, this.maxCountApproach] };
        break;

      case 'periodTrainingDate':
        this.filterModel = { ...this.filterModel, periodTrainingDate: [this.trainingFrom, this.trainingTo] };
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

      case 'periodTrainingTime':
        [this.minTimeSec, this.maxTimeSec] = this.filterModel.periodTrainingTime || [];
        break;

      case 'trainingPrograms':
        this.trainingPrograms = this.filterModel.trainingPrograms || [];
        break;

      case 'isNoneTrainingProgram':
        this.isNoneTrainingProgram = this.filterModel.isNoneTrainingProgram || null;
        break;

      case 'periodApproachs':
        [this.minCountApproach, this.maxCountApproach] = this.filterModel.periodApproachs || [];
        break;

      case 'periodTrainingDate':
        [this.trainingFrom, this.trainingTo] = this.filterModel.periodTrainingDate || [];
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

      case 'periodTrainingTime':
        [this.minTimeSec, this.maxTimeSec] = ['', ''];
        this.filterModel = { ...this.filterModel, periodTrainingTime: [] };
        break;

      case 'trainingPrograms':
        this.trainingPrograms = [];
        this.filterModel = { ...this.filterModel, trainingPrograms: [] };
        break;

      case 'isNoneTrainingProgram':
        this.isNoneTrainingProgram = null;
        this.filterModel = { ...this.filterModel, isNoneTrainingProgram: undefined };
        break;

      case 'periodApproachs':
        [this.minCountApproach, this.maxCountApproach] = ['', ''];
        this.filterModel = { ...this.filterModel, periodApproachs: [] };
        break;

      case 'periodTrainingDate':
        [this.trainingFrom, this.trainingTo] = ['', ''];
        this.filterModel = { ...this.filterModel, periodTrainingDate: [] };
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
