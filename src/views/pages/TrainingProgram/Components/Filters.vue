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
        <filter-item
          :menu-model="isCreatedFrom"
          :count="+!!filterModel.createdFrom"
          chip-text="Добавлено от"
          menu-header-text="Дата добавления"
          @apply="apply('createdFrom')"
          @cancel="cancel('createdFrom')"
          @clear="clear('createdFrom')"
        >
          <DateTimePicker
            :selected-date-time.sync="createdFrom"
          />
        </filter-item>
        <filter-item
          :menu-model="isCreatedTo"
          :count="+!!filterModel.createdTo"
          chip-text="Добавлено до"
          menu-header-text="Дата добавления"
          @apply="apply('createdTo')"
          @cancel="cancel('createdTo')"
          @clear="clear('createdTo')"
        >
          <DateTimePicker
            :selected-date-time.sync="createdTo"
          />
        </filter-item>
        <filter-item
          :menu-model="isSelectBased"
          :count="+!!filterModel.isBased"
          chip-text="Базовое/Изолирующее"
          menu-header-text="Категория упражнения"
          @apply="apply('isBased')"
          @cancel="cancel('isBased')"
          @clear="clear('isBased')"
        >
          <v-radio-group
            v-model="isBased"
            column
          >
            <v-radio
              label="Базовое"
              :value="true"
            />
            <v-radio
              label="Изолирующее"
              :value="false"
            />
            <v-radio
              label="Не важно"
              :value="undefined"
            />
          </v-radio-group>
        </filter-item>

        <filter-item
          :menu-model="isHardSkills"
          :count="hardSkillsCount"
          chip-text="Сложность"
          menu-header-text="сложность"
          @apply="apply('hardSkills')"
          @cancel="cancel('hardSkills')"
          @clear="clear('hardSkills')"
        >
          <v-list dense height="350px" class="list">
            <v-list-item-group
              v-model="hardSkills"
              multiple
              active-class=""
            >
              <v-list-item
                v-for="(item, i) in Object.entries(exerciseHardSkills)"
                :key="`list-item-${i}`"
                :value="item[0]"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox
                      :key="`checkbox_${i}`"
                      color="primary"
                      :input-value="active"
                    />
                  </v-list-item-action>
                  <v-list-item-title class="secondary--text" v-text="item[1]" />
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helper from '@/mixins/Helper';
import DateTimePicker from '@/components/DateTime/DateTimePicker.vue';
import FilterItem from '../../../../components/FilterItem.vue';
import { Mutation, State } from 'vuex-class';
import { TTrainingProgramFilterViewModel } from '@/controllers/TrainingProgramController';

type TFilterType = 'name' | 'createdFrom' | 'createdTo' | 'isBased' | 'hardSkills' | 'categoryOfBodies';

export type TIncomingRouteName = 'New' | 'Handled' | 'Saved';

@Component({
  components: {
  FilterItem,
  DateTimePicker
  }
  })
export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  get filterModel(): TTrainingProgramFilterViewModel {
    return this.filters.exercise;
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
    this.createdFrom = this.filterModel.createdFrom || '';
    this.createdTo = this.filterModel.createdTo || '';
    this.isBased = this.filterModel.isBased || undefined;
    this.hardSkills = this.filterModel.hardSkills || [];
    this.categoryOfBodies = this.filterModel.categoryOfBodies || [];
  }

  name = '';

  isCreatedFrom = false;
  createdFrom = '';

  isCreatedTo = false;
  createdTo = '';

  isSelectBased = false;
  isBased: boolean | undefined = undefined;

  isHardSkills = false;
  hardSkills: any[] = [];
  categoryOfBodies: any[] = [];

  exerciseHardSkills = {
    easy: 'Легко',
    normal: 'Нормально',
    hard: 'Сложно',
  };

  get hardSkillsCount() {
    return this.filterModel.hardSkills?.length ?? 0;
  }

  clearFilters(): void {
    this.name = '';
    this.createdFrom = '';
    this.createdTo = '';
    this.isBased = undefined;
    this.hardSkills = [];
    this.categoryOfBodies = [];

    this.filterModel = {
      name: '',
      createdFrom: '',
      createdTo: '',
      isBased: undefined,
      hardSkills: [],
      categoryOfBodies: []
    };

    this.$emit('change');
  }

  apply(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'name':
        this.filterModel = { ...this.filterModel, name: this.name };
        break;

      case 'createdFrom':
        this.filterModel = { ...this.filterModel, createdFrom: this.createdFrom };
        break;

      case 'createdTo':
        this.filterModel = { ...this.filterModel, createdTo: this.createdTo };
        break;

      case 'isBased':
        this.filterModel = { ...this.filterModel, isBased: this.isBased };
        break;

      case 'hardSkills':
        this.filterModel = { ...this.filterModel, hardSkills: this.hardSkills };
        break;

      case 'categoryOfBodies':
        this.filterModel = { ...this.filterModel, categoryOfBodies: this.categoryOfBodies };
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

      case 'createdFrom':
        this.createdFrom = this.filterModel.createdFrom || '';
        break;

      case 'createdTo':
        this.createdTo = this.filterModel.createdTo || '';
        break;

      case 'isBased':
        this.isBased = this.filterModel.isBased || undefined;
        break;

      case 'hardSkills':
        this.hardSkills = this.filterModel.hardSkills || [];
        break;

      case 'categoryOfBodies':
        this.categoryOfBodies = this.filterModel.categoryOfBodies || [];
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

      case 'createdFrom':
        this.createdFrom = '';
        this.filterModel = { ...this.filterModel, createdFrom: '' };
        break;

      case 'createdTo':
        this.createdTo = '';
        this.filterModel = { ...this.filterModel, createdTo: '' };
        break;

      case 'isBased':
        this.isBased = undefined;
        this.filterModel = { ...this.filterModel, isBased: undefined };
        break;

      case 'hardSkills':
        this.hardSkills = [];
        this.filterModel = { ...this.filterModel, hardSkills: [] };
        break;

      case 'categoryOfBodies':
        this.categoryOfBodies = [];
        this.filterModel = { ...this.filterModel, categoryOfBodies: [] };
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
