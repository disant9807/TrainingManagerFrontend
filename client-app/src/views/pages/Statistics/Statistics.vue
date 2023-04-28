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
              @click="onClickOpenGenerate(generateStatisticsSize)"
            >
              Сгенерировать статистику замеров
            </v-btn>
            <Loader :value="isSizeLoading" />
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
              @click="onClickOpenGenerate(generateStatisticsGoal)"
            >
              Сгенерировать статистику целей
            </v-btn>
            <Loader :value="isGoalLoading" />
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
              @click="onClickOpenGenerate(generateStatisticsTraining)"
            >
              Сгенерировать статистику тренировок
            </v-btn>
            <Loader :value="isTrainingLoading" />
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
      :genStatistics.sync="selectStatistics"
    />
    <v-dialog
      v-model="isDialogGeneratedOpen"
      persistent
      width="720"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Генерация статистики</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <InlineDateField
                  label="Дата выборки от"
                  :value.sync="generatedDateFrom"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <InlineDateField
                  label="Дата выборки до"
                  :value.sync="generatedDateTo"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="isDialogGeneratedOpen = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="onClickGenerateStatisticsBtn"
          >
            Генерация
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helper from '@/mixins/Helper';
import Global from '@/mixins/GlobalMixin';
import Loader from '@/components/Loader.vue';

import { Mutation, State } from 'vuex-class';

import InlineDateField from '@/components/InlineDateField.vue';
import StatisticsController, { TObjectOfStatistics, TGenStatistics } from '@/controllers/StatisticsController';
import StatisticsInfo from '@/views/pages/Statistics/Components/StatisticsInfo.vue';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  StatisticsInfo,
  Loader,
  InlineDateField
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

  generatedDateFrom = '';
  generatedDateTo = '';
  isDialogGeneratedOpen = false;
  generatedMethod: Function = () => '';

  onClickOpenGenerate(generateMethod: Function) {
    this.generatedDateFrom = '';
    this.generatedDateTo = '';
    this.isDialogGeneratedOpen = true;
    this.generatedMethod = generateMethod;
  }

  onClickGenerateStatisticsBtn() {
    this.isDialogGeneratedOpen = false;
    this.generatedMethod(this.generatedDateFrom, this.generatedDateTo);
  }

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
    try {
      const response = await StatisticsController
        .GetStatisticsByCategory('Goal', this.user.id);

      this.goalStatisitcs = response;
    } catch {
      this.showError("Ошибка загрузки статистики целей");
    } finally {
      this.isGoalLoading = false;
    }
  }

  async loadDataSize(): Promise<void> {
    this.isSizeLoading = true;
    try {
      const response = await StatisticsController
        .GetStatisticsByCategory('Size', this.user.id);

      this.sizeStatisitcs = response;
    } catch {
      this.showError("Ошибка загрузки статистики замеров");
    } finally {
      this.isSizeLoading = false;
    }
  }

  async loadDataTraining(): Promise<void> {
    this.isTrainingLoading = true;
    try {
      const response = await StatisticsController
        .GetStatisticsByCategory('Training', this.user.id);

      this.trainingStatistics = response;
    } catch {
      this.showError("Ошибка загрузки статистики тренировок");
    } finally {
      this.isTrainingLoading = false;
    }
  }

  async generateStatisticsSize(dateFrom: string, dateTo: string): Promise<void> {
    this.isSizeLoading = true;
    try {
      await StatisticsController
        .GenerateSizeStatistics(dateFrom, dateTo, this.user.id);
      this.showSuccess("Статисти успешно сгенерирована");
      this.loadDataSize();
    } catch {
      this.showError("Ошибка генерации статистики");
    } finally {
      this.isSizeLoading = false;
    }
  }

  async generateStatisticsGoal(dateFrom: string, dateTo: string): Promise<void> {
    this.isGoalLoading = true;
    try {
      await StatisticsController
        .GenerateGoalStatistics(dateFrom, dateTo, this.user.id);
      this.showSuccess("Статисти успешно сгенерирована");
      this.loadDataGoal();
    } catch {
      this.showError("Ошибка генерации статистики");
    } finally {
      this.isGoalLoading = false;
    }
  }

  async generateStatisticsTraining(dateFrom: string, dateTo: string): Promise<void> {
    this.isTrainingLoading = true;
    try {
      await StatisticsController
        .GenerateTrainingStatistics(dateFrom, dateTo, this.user.id);
      this.showSuccess("Статисти успешно сгенерирована");
      this.loadDataTraining();
    } catch {
      this.showError("Ошибка генерации статистики");
    } finally {
      this.isTrainingLoading = false;
    }
  }

  async selectedStatistcs(statistics: TGenStatistics) {
    this.isTrainingLoading = true;
    try {
      const response = await StatisticsController
        .GetStatisticsById(statistics.id);

      this.selectStatistics = response;
      this.isDialogOpen = true;
    } catch {
      this.showError("Ошибка загрузки статистики");
    } finally {
      this.isTrainingLoading = false;
    }
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
