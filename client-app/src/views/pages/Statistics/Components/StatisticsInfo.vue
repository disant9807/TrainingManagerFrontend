<template>
  <v-dialog
    v-model="dialog"
    scrollable
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card v-if="localStatistics != null" class="pb-3">
      <v-toolbar
        dark
        color="primary"
        style="max-height: 65px;"
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ `Статистика: ${localeDateFormat(localStatistics.generatedTime, true)}` }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="charts.length > 0">
        <div
          v-for="(chart, i) in charts"
          :key="`chart-${i}`"
          class="d-flex flex-column align-center mt-5 mb-4"
        >
          <h2>{{ chart.name }}</h2>
          <apexchart
            class="my-3"
            type="line"
            width="800"
            :options="chart.options"
            :series="chart.series"
          />
        </div>
      </v-card-text>
      <v-card-text v-else class="d-flex justify-center flex-column align-center h-100">
        <h2 style="font-size: 80px;">Данные отсутствуют...</h2>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Helper from '@/mixins/Helper';
import { Component, Prop, Watch, Model, PropSync } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { TGenStatistics } from '@/controllers/StatisticsController';

export type TChartsView = {
  name: string,
  options: {
    chart: {
      id: string
    },
    xaxis: {
      categories: string[]
    },
  },
  series: Array<{
    name: string,
    data: string[]
  }>,
}

@Component
export default class StatisticsInfo
  extends mixins(Helper) {
  @PropSync('genStatistics', { required: true, default: false }) genStatistic!: TGenStatistics | null;
  @PropSync('isOpenDialog', { required: true, default: false }) dialog!:boolean;

  charts: TChartsView[] = [];

  get localStatistics() {
    return this.genStatistic;
  }

  @Watch('dialog', { immediate: true })
  onDialogChanged(): void {
    if (this.dialog === true) {
      this.initCharts();
    }
  }

  initCharts() {
    if (this.localStatistics?.statistics.length === 0) {
      this.charts = [];
    } else {
      this.localStatistics?.statistics.forEach((e, indx) => {
        let categories: string[] = [];
        let series: string[] = [];
        e.statisticsIndicators.forEach(z => {
          categories.push(this.localeDateFormat(z.dateOfMeasurement, true));
          series.push(z.value);
        });

        this.charts.push({
          name: e.name,
          options: {
            chart: {
              id: `charts-${indx}`
            },
            xaxis: {
              categories
            },
          },
          series: [{
            name: `serise-${indx}`,
            data: series
          }]
        } as TChartsView);
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.hover:hover {
  background-color: #e2eff7;
}
</style>
