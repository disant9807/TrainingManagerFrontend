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
    <v-row class="hover">
      <v-col>
        <h3>Подцели:</h3>
        <v-list class="mt-1">
          <template v-if="items.length > 0">
            <v-container
              v-for="item, index in items"
              :key="index"
            >
              <v-row dense>
                <v-col>
                  <v-card>
                    <v-card-title class="text-h5">
                      Цель по изменению: {{ item.bodyCode }}
                    </v-card-title>
                    <v-card-subtitle>{{ item.bodyCode }} должен стать {{ item.value }} {{ item.codeUnitsOfMeasurement }}</v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>Список замеров пуст</v-list-item-title>
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
