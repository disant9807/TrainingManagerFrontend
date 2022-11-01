<template>
  <v-container v-if="localTrainingProgram">
    <v-row class="hover">
      <v-col>Наименование:</v-col>
      <v-col>
        {{ localTrainingProgram.name }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Краткое наименование:</v-col>
      <v-col>
        {{ localTrainingProgram.shortName }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Дата создания:</v-col>
      <v-col>
        {{ localeDateFormat(localTrainingProgram.createdDate, false) }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Описание:</v-col>
      <v-col>
        {{ localTrainingProgram.description }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>
        <h3>Тренировочные дни:</h3>
        <v-list class="mt-1">
          <template v-if="items.length > 0">
            <v-list-group
              v-for="item, index in items"
              :key="index"
              v-model="item.active"
              :prepend-icon="item.action"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title> {{ `${item.value.name}` }} </v-list-item-title>
                  <v-list-item-subtitle> {{ `Отдых ${item.value.dayRelax} день/дня/дней` }} </v-list-item-subtitle>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="child in item.value.exercises"
                :key="child.id"
              >
                <v-list-item-content>
                  <v-list-item-title v-if="child.shortName" v-text="child.shortName"></v-list-item-title>
                  <v-list-item-title v-else v-text="child.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>Список тренировочных дней пуст</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Helper from '@/mixins/Helper';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import { TTrainingProgram, TTrainingProgramDay } from '@/controllers/TrainingProgramController';
import { TExercise } from '@/controllers/ExerciseController';
import { TResult } from '@/api/baseApi';

export type TTrainingProgramDayItem = {
  action: string | null,
  value: TTrainingProgramDay,
  active: boolean | null
}

@Component
export default class TrainingProgramInfo extends mixins(Helper) {
  @Prop({
    type: Object,
    default: null
  }) readonly request!: TTrainingProgram | null;

  get localTrainingProgram(): TTrainingProgram | null | undefined {
    return this.request;
  }

  get days(): TTrainingProgramDay[] {
    return this.localTrainingProgram?.days ?? [];
  }

  get items(): TTrainingProgramDayItem[] | [] {
    return this.days?.sort(e => e.numberOfTrainingProgram)
      ?.map((e, index) => {
        return {
          action: 'mdi-tag',
          value: e,
          active: index === 0
        } as TTrainingProgramDayItem;
      }) ?? [];
  }
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
