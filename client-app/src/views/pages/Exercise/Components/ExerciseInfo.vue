<template>
  <v-container v-if="localExercise">
    <v-row class="hover">
      <v-col>Наименование</v-col>
      <v-col>
        {{ localExercise.name }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Дата создания</v-col>
      <v-col>
        {{ localeDateFormat(localExercise.createdDate, false) }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Категория:</v-col>
      <v-col>
        {{ isBasedLocalExercise }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Сложность:</v-col>
      <v-col>
        {{ hardSkillsLocalExercise }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Описание:</v-col>
      <v-col>
        {{ localExercise.description }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Задействуемые мышечные группы:</h3>
        <v-list>
          <template v-if="items.length > 0">
            <v-card
              v-for="item, index in items"
              :key="index"
              class="mt-4"
            >
              <v-card-title class="text-h6">
                {{ item.shortName ?? item.name }}
              </v-card-title>
              <v-card-subtitle> {{ item.decsription }} </v-card-subtitle>
            </v-card>
          </template>
          <h4 v-else class="mt-4">Список пуст...</h4>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Helper from '@/mixins/Helper';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import { TExercise, HardSkill } from '@/controllers/ExerciseController';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import { TResult } from '@/api/baseApi';

@Component
export default class ExerciseInfo extends mixins(Helper) {
  @Prop({
    type: Object,
    default: null
  }) readonly request!: TExercise | null;

  get localExercise(): TExercise | null | undefined {
    return this.request;
  }

  get isBasedLocalExercise(): string {
    return this.localExercise?.isBased ? 'Базовое' : 'Изолирующее';
  }

  get hardSkillsLocalExercise() {
    if (this.localExercise?.hardSkill === HardSkill.easy) { return 'Легко'; } else if (this.localExercise?.hardSkill === HardSkill.normal) { return 'Нормально'; } else if (this.localExercise?.hardSkill === HardSkill.hard) { return 'Сложно'; }
  }

  get items(): TCategoryOfBody[] {
    return this.localExercise?.categoryOfBodies ?? [];
  }
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
