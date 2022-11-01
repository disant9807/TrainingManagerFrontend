<template>
  <div class="pa-0 d-flex">
    <v-card class="left-main-container">
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-dumbbell
        </v-icon>
        <v-subheader class="white--text font-weight-light headerWrap">
          <div class="header">Упражнения</div>
        </v-subheader>
        <v-btn
          color="white"
          outlined
          @click="goToTrainingProgramAdd"
        >
          Добавить
        </v-btn>
      </v-card-title>
      <filters
        @change="filtersChange"
      />
      <Sorter
        :order.sync="order"
        @change="filtersChange"
      />
      <v-list
        v-if="trainingPrograms.list.length"
        dense
        class="requestList"
      >
        <v-list-item-group
          v-model="trainingPrograms.selectedItem"
          color="primary"
          mandatory
          @change="onSelectRequest"
        >
          <v-list-item
            v-for="(item, i) in trainingPrograms.list"
            :key="i"
            two-line
            :title="ItemName(item)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="right-main-container">
      <template v-if="trainingPrograms.list.length">
        <v-card>
          <v-card-title class="darkblue py-0">
            <v-subheader class="white--text font-weight-light">
              Карточка упражнения
            </v-subheader>
            <v-spacer />
            <v-btn
              small
              color="white"
              text
              class="mr-2"
              @click="onClickEditTrainingProgram"
            >
              <v-icon class="mr-3">mdi-pencil</v-icon>
              Редактировать
            </v-btn>
            <v-btn
              small
              color="red white--text"
              class="ml-2"
              @click="onClickDeleteTrainingProgram"
            >
              <v-icon class="mr-3">mdi-delete</v-icon>
              Удалить
            </v-btn>
          </v-card-title>
          <v-container
            class="details-container"
          >
            <TrainingProgramInfo
              :request="trainingPrograms.selectedTrainingProgram"
            />
            <TrainingProgramDelete
              :training-program-delete-state.sync="trainingProgramDeleteState"
              :request="trainingPrograms.selectedActionTrainingProgram"
              @refresh="onEmitRefresh"
            />
          </v-container>
        </v-card>
      </template>
      <div
        v-else
        rounded
        class="notfound-block blue-grey lighten-4 px-5 py-10 grey--text d-flex justify-center align-center"
        style="font-size: 50px; flex-direction: row"
        height="100%"
      >
        <v-card
          v-if="isAny(trainingPrograms.selectedTrainingProgram)"
          class="my-card"
        >
          <Loader :value="isRequestLoading" />
        </v-card>
        <div
          v-else
          class="d-flex column"
          style="flex-direction: column"
        >
          <v-icon size="80px">mdi-clipboard-outline</v-icon>
          Тренировочных программ не найдено...
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helper from '@/mixins/Helper';
import Global from '@/mixins/GlobalMixin';
import { TExercise } from '@/controllers/ExerciseController';
import TrainingProgramControllel, { TTrainingProgram, TTrainingProgramFilterViewModel } from '@/controllers/TrainingProgramController';

import Filters from './Components/Filters.vue';
import Sorter from '../Components/Sorter.vue';
import TrainingProgramInfo from './Components/TrainingProgramInfo.vue';
import TrainingProgramDelete from './TrainingProgramDelete.vue';

import { Mutation, State } from 'vuex-class';

import { TOrder } from '@/types/globals';
import { TResult } from '@/api/baseApi';

export type TTrainingProgramView = {
  selectedItem: number,
  selectedTrainingProgram: any | null,
  selectedActionTrainingProgram: any | null,
  list: TTrainingProgram[],
}

@Component({
  components: {
  Filters,
  Sorter,
  TrainingProgramInfo,
  TrainingProgramDelete
  }
  })
export default class TrainingProgram extends mixins(Helper, Global) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  trainingProgramDeleteState = false;

  order: TOrder = 'Desc';

  trainingPrograms: TTrainingProgramView = {
    selectedItem: 0,
    selectedTrainingProgram: null,
    selectedActionTrainingProgram: null,
    list: [],
  };

  ItemName(item: TTrainingProgram) {
    return item.shortName ?? item.name;
  }

  get filtersModel(): TTrainingProgramFilterViewModel {
    return this.filters.trainingProgram;
  }

  get loadingModel() {
    return this.loading.trainingProgram;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'trainingProgram', name: 'list', value });
  }

  get isRequestLoading() {
    return this.loadingModel.selectedExercise;
  }

  set isRequestLoading(value: boolean) {
    this.setLoading({ category: 'trainingProgram', name: 'selectedTrainingProgram', value });
  }

  mounted() {
    this.filtersChange();
  }

  async filtersChange(): Promise<void> {
    this.isListLoading = true;
    const response = await TrainingProgramControllel.GetTrainingProgram(this.filtersModel, this.order);
    if (response.success) {
      this.$set(this.trainingPrograms, 'list', response?.data || []);
      this.$set(this.trainingPrograms, 'selectedItem', 0);
      this.$set(this.trainingPrograms, 'selectedTrainingProgram', null);

      await this.onSelectRequest(this.trainingPrograms.selectedItem);
    }
  }

  deleteTrainingProgram(item: number) {
    const exercise = this.trainingPrograms.list[item];
    this.$set(this.trainingPrograms, 'selectedActionTrainingProgram', exercise);
    this.trainingProgramDeleteState = true;
  }

  editTrainingProgram(item: number) {
    const exercise = this.trainingPrograms.list[item];
    this.$set(this.trainingPrograms, 'selectedActionTrainingProgram', exercise);
    this.goToTrainingProgramEdit(exercise.id);
  }

  onEmitRefresh() {
    this.filtersChange();
  }

  onClickDeleteTrainingProgram() {
    this.$set(this.trainingPrograms, 'selectedActionTrainingProgram', null);
    this.deleteTrainingProgram(this.trainingPrograms.selectedItem);
  }

  onClickEditTrainingProgram() {
    this.$set(this.trainingPrograms, 'selectedActionTrainingProgram', null);
    this.editTrainingProgram(this.trainingPrograms.selectedItem);
  }

  async onSelectRequest(item: number): Promise<void> {
    if (this.trainingPrograms.list.length) {
      this.isRequestLoading = true;

      const selectedTrainingProgram = this.trainingPrograms.list[item];

      const responseRequestInfo = await TrainingProgramControllel.GetTrainingProgramById(selectedTrainingProgram.id);
      this.$set(this.trainingPrograms, 'selectedTrainingProgram', responseRequestInfo);
    }
    this.isRequestLoading = false;
  }

  goToTrainingProgramEdit(id: string) {
    this.$router.push({ name: 'TrainingProgramEdit', params: { id } });
  }

  goToTrainingProgramAdd() {
    this.$router.push({ name: 'TrainingProgramAdd' });
  }
}
</script>

<style lang="scss">
html, body {
  min-height: 100% !important;
  height: 100%;
}
.right-main-container {
  margin-left: 475px;
  min-width: 720px;
  // .notfound-block, .loading-block {
  //   min-height: 90vh;
  // }
}

.requestList {
  overflow-y: scroll;
  overflow-x: hidden;
  height: calc(100% - 290px);
}

.left-main-container {
  position: fixed;
  top: 84px;
  bottom: 50px;
  width: 450px;
  -webkit-transform: translateZ(0);
}

.header {
  font-size: 19px;
  font-weight: 700;
}

.headerWrap {
  flex: 1;
}
</style>
