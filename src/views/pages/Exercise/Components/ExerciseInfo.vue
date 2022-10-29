<template>
  <v-container v-if="localExercise">
    <v-row class="hover">
      <v-col>Наименование</v-col>
      <v-col>
        {{ localExercise.name }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Краткое наименование</v-col>
      <v-col>
        {{ localExercise.shortName }}
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
    <v-row class="hover">
      <v-col>Группы мышц:</v-col>
      <v-col>
        в разработке...
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Helper from '@/mixins/Helper';
import { Component, Prop, Watch, Model } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';

import { TExercise, HardSkill } from '@/controllers/ExerciseController';
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
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
