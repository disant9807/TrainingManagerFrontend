<template>
  <v-container v-if="localTraining">
    <v-row v-if="localTrainingProgram" class="hover">
      <v-col>Тренировочная программа</v-col>
      <v-col>
        {{ localTrainingProgram.name }}
      </v-col>
    </v-row>
    <v-row v-else class="hover">
      <v-col>Свободная тренировка</v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Дата тренировки</v-col>
      <v-col>
        {{ localeDateFormat(localTraining.trainingDate, false) }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Время тренировки:</v-col>
      <v-col>
        {{ localTraining.time }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>
        <h3>Упражнения</h3>
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
                  <v-list-item-title> {{ `${item.value.exercise?.shortName}` }} </v-list-item-title>
                  <v-list-item-subtitle> {{ `Подробнее` }} </v-list-item-subtitle>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="child, index in item.items"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ `Подход: ${child.value.numberOfApproach}; Вес: ${child.value.weight}; Время: ${child.value.time};` }}</v-list-item-title>
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
import { TTraining, TApproach, TApproachItem } from '@/controllers/TrainingController';
import { TExercise } from '@/controllers/ExerciseController';
import { TResult } from '@/api/baseApi';

export type TApproachItemEl = {
  action: string | null,
  value: TApproachItem,
  active: boolean | null
}

export type TApproachEl = {
  action: string | null,
  value: TApproach,
  active: boolean | null,
  items: Array<TApproachItemEl>
}

@Component
export default class TrainingInfo
 extends mixins(Helper) {
  @Prop({
    type: Object,
    default: null
  }) readonly request!: TTraining | null;

  get localTraining(): TTraining | null | undefined {
    return this.request;
  }

  get localTrainingProgram(): TTrainingProgram | null | undefined {
    return this.localTraining?.trainingprogram;
  }

  get items(): TApproachEl[] | [] {
    if (!this.localTraining) return [];

    const approachs = this.localTraining.approachs.sort((a, b) => a.numberOfTraining - b.numberOfTraining);
    const items = approachs.map((e, index) => {
      return {
        action: 'mdi-tag',
        value: e,
        active: index === 0,
        items: e.approachsItems.map((z, indexz) => {
          return {
            action: 'mdi-tag',
            value: z,
            active: indexz === 0,
          } as TApproachItemEl;
        })
      } as TApproachEl;
    });
    return items;
  }
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
