<template>
  <v-container v-if="localGoal">
    <v-row class="hover">
      <v-col>Цель</v-col>
      <v-col>
        {{ localGoal.name }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Описание цели</v-col>
      <v-col>
        {{ localGoal.description }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Дата создания цели</v-col>
      <v-col>
        {{ localeDateFormat(localGoal.createdDate, false) }}
      </v-col>
    </v-row>
    <v-row class="hover">
      <v-col>Дата достижения цели</v-col>
      <v-col>
        {{ localeDateFormat(localGoal.createdDate, false) }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Подцели:</h3>
        <v-list>
          <template v-if="items.length > 0">
            <v-card
              v-for="item, index in items"
              :key="index"
              class="mt-4"
            >
              <v-card-title class="text-h6">
                Цель по изменению: {{ item.body?.shortName ?? item.body?.name }}
              </v-card-title>
              <v-card-subtitle>Показатель {{ item.body?.shortName ?? item.body?.name }} должен стать {{ item.value }} {{ item.unitsOfMeasurement?.value }}</v-card-subtitle>
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
import { TGoal, TSubGoal } from '@/controllers/GoalController';

@Component
export default class GoalInfo
 extends mixins(Helper) {
  @Prop({
    type: Object,
    default: null
  }) readonly request!: TGoal | null;

  get localGoal(): TGoal | null | undefined {
    return this.request;
  }

  get items(): TSubGoal[] | [] {
    return this.localGoal?.subGoals ?? [];
  }
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
