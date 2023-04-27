<template>
  <div>
    <v-card>
      <v-card-title class="darkblue py-0">
        <v-subheader class="white--text font-weight-light">
          Статистика
        </v-subheader>
        <v-spacer />
      </v-card-title>
      <container class="details-container px-7 py-5">
        <v-row>
          <v-col>
            <h3 class="mx-3">Статистика замеров</h3>
            <v-btn
              color="primary"
              class="ml-3 mt-3"
              @click="generateStatisticsSize()"
            >
              Сгенерировать статистику замеров
            </v-btn>
            <v-list lines="one" class="statisticsList">
              <v-list-item
                v-for="(item, i) in sizeStatisitcs"
                :key="item.userId + i"
                :title="item.generatedTime"
                @click="selectedStatistcs(item)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="`Статистика: ${localeDateFormat(item.generatedTime, true)}`" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <h3 class="mx-3">Статистика целей</h3>
            <v-btn
              color="primary"
              class="ml-3 mt-3"
              @click="generateStatisticsGoal()"
            >
              Сгенерировать статистику целей
            </v-btn>
            <v-list lines="one" class="statisticsList">
              <v-list-item
                v-for="(item, i) in goalStatisitcs"
                :key="item.userId + i"
                :title="item.generatedTime"
                @click="selectedStatistcs(item)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="`Статистика: ${localeDateFormat(item.generatedTime, true)}`" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <div class="row">
          <div class="col">
            <h3 class="mx-3">Статистика тренировок</h3>
            <v-btn
              color="primary"
              class="ml-3 mt-3"
              @click="generateStatisticsTraining()"
            >
              Сгенерировать статистику тренировок
            </v-btn>
            <v-list lines="one" class="statisticsList">
              <v-list-item
                v-for="(item, i) in trainingStatistics"
                :key="item.userId + i"
                :title="item.generatedTime"
                @click="selectedStatistcs(item)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="`Статистика: ${localeDateFormat(item.generatedTime, true)}`" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </container>
    </v-card>
    <StatisticsInfo
      :is-open-dialog.sync="isDialogOpen"
      :gen-statistics.sync="selectStatistics"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helper from '@/mixins/Helper';
import Global from '@/mixins/GlobalMixin';

import { Mutation, State } from 'vuex-class';

import { TOrder } from '@/types/globals';
import { TResult } from '@/api/baseApi';

import StatisticsController, { TObjectOfStatistics, TGenStatistics } from '@/controllers/StatisticsController';
import StatisticsInfo from '@/views/pages/Statistics/Components/StatisticsInfo.vue';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  StatisticsInfo
  }
  })
export default class Statistics extends mixins(Helper, Global) {
  @State readonly user!: TUser;

  isGoalLoading = false;
  goalStatisitcs: TGenStatistics[] = [];

  isSizeLoading = false;
  sizeStatisitcs: TGenStatistics[] = [];

  isTrainingLoading = false;
  trainingStatistics: TGenStatistics[] = [];

  isDialogOpen = false;
  selectStatistics: TGenStatistics | null = null;

  mounted() {
    this.loadData();
  }

  @Watch('isDialogOpen', { immediate: true })
  onDialogChanged(): void {
    if (this.isDialogOpen === false) {
      this.selectStatistics = null;
    }
  }

  async loadData() {
    await this.loadDataGoal();
    await this.loadDataSize();
    await this.loadDataTraining();
  }

  async loadDataGoal(): Promise<void> {
    this.isGoalLoading = true;
    const response = await StatisticsController
      .GetStatisticsByCategory('Goal', this.user.id);

    this.goalStatisitcs = response;
    this.isGoalLoading = false;
  }

  async loadDataSize(): Promise<void> {
    this.isSizeLoading = true;
    const response = await StatisticsController
      .GetStatisticsByCategory('Size', this.user.id);

    this.sizeStatisitcs = response;
    this.isSizeLoading = false;
  }

  async loadDataTraining(): Promise<void> {
    this.isTrainingLoading = true;
    const response = await StatisticsController
      .GetStatisticsByCategory('Training', this.user.id);

    this.trainingStatistics = response;
    this.isTrainingLoading = false;
  }

  async generateStatisticsSize(): Promise<void> {
    this.isSizeLoading = true;
    await StatisticsController
      .GenerateSizeStatistics('12-31-2022', '10-10-2023', this.user.id);

    this.loadDataSize();
    this.isSizeLoading = false;
  }

  async generateStatisticsGoal(): Promise<void> {
    this.isGoalLoading = true;
    await StatisticsController
      .GenerateGoalStatistics('12-31-2022', '10-10-2023', this.user.id);

    this.loadDataGoal();
    this.isGoalLoading = false;
  }

  async generateStatisticsTraining(): Promise<void> {
    this.isTrainingLoading = true;
    await StatisticsController
      .GenerateTrainingStatistics('12-31-2022', '10-10-2023', this.user.id);

    this.loadDataTraining();
    this.isTrainingLoading = false;
  }

  async selectedStatistcs(statistics: TGenStatistics) {
    let response = await StatisticsController
      .GetStatisticsById(statistics.id);

    this.selectStatistics = response;
    this.isDialogOpen = true;
  }
}
</script>

<style lang="scss">
html, body {
  min-height: 100% !important;
  height: 100%;
}

.statisticsList {
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 250px;
}
</style>
