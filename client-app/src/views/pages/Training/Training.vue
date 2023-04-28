<template>
  <div class="pa-0 d-flex">
    <v-card class="left-main-container">
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-weight-lifter
        </v-icon>
        <v-subheader class="white--text font-weight-light headerWrap">
          <div class="header">Тренировки</div>
        </v-subheader>
        <v-btn
          color="white"
          outlined
          @click="goToTrainingAdd"
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
        v-if="training.list.length"
        dense
        class="requestList"
      >
        <v-list-item-group
          v-model="training.selectedItem"
          color="primary"
          mandatory
          @change="onSelectRequest"
        >
          <v-list-item
            v-for="(item, i) in training.list"
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
      <template v-if="training.list.length">
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
              @click="onClickEditTraining"
            >
              <v-icon class="mr-3">mdi-pencil</v-icon>
              Редактировать
            </v-btn>
            <v-btn
              small
              color="red white--text"
              class="ml-2"
              @click="onClickDeleteTraining"
            >
              <v-icon class="mr-3">mdi-delete</v-icon>
              Удалить
            </v-btn>
          </v-card-title>
          <v-container
            class="details-container"
          >
            <TrainingInfo
              :request="training.selectedTraining"
            />
            <TrainingDelete
              :training-delete-state.sync="trainingDeleteState"
              :request="training.selectedActionTraining"
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
          v-if="isAny(training.selectedTraining)"
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
          Тренировок не найдено...
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
import TrainingController, { TTraining, TTrainingFilterViewModel } from '@/controllers/TrainingController';
import Filters from './Components/Filters.vue';
import Sorter from '../Components/Sorter.vue';
import TrainingInfo from './Components/TrainingInfo.vue';
import TrainingDelete from './TrainingDelete.vue';

import { Mutation, State } from 'vuex-class';

import { TOrder } from '@/types/globals';
import { TResult } from '@/api/baseApi';
import { TUser } from '@/controllers/UserController';


export type TTrainingView = {
  selectedItem: number,
  selectedTraining: any | null,
  selectedActionTraining: any | null,
  list: TTraining[],
}

@Component({
  components: {
  Filters,
  Sorter,
  TrainingInfo,
  TrainingDelete
  }
  })
export default class Training extends mixins(Helper, Global) {
  @State readonly user!: TUser;
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  trainingDeleteState = false;

  order: TOrder = 'Desc';

  training: TTrainingView = {
    selectedItem: 0,
    selectedTraining: null,
    selectedActionTraining: null,
    list: [],
  };

  ItemName(item: TTraining) {
    return this.localeDateFormat(item.trainingDate, false);
  }

  get filtersModel(): TTrainingFilterViewModel {
    return this.filters.training;
  }

  get loadingModel() {
    return this.loading.training;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'training', name: 'list', value });
  }

  get isRequestLoading() {
    return this.loadingModel.selectedExercise;
  }

  set isRequestLoading(value: boolean) {
    this.setLoading({ category: 'training', name: 'selectedTraining', value });
  }

  mounted() {
    this.filtersChange();
  }

  async filtersChange(): Promise<void> {
    this.isListLoading = true;
    const response = await TrainingController.GetTraining(this.filtersModel, this.order, this.user.id);
    if (response.success) {
      this.$set(this.training, 'list', response?.data || []);
      this.$set(this.training, 'selectedItem', 0);
      this.$set(this.training, 'selectedTraining', null);

      await this.onSelectRequest(this.training.selectedItem);
    }
  }

  deleteTraining(item: number) {
    const training = this.training.list[item];
    this.$set(this.training, 'selectedActionTraining', training);
    this.trainingDeleteState = true;
  }

  editTraining(item: number) {
    const training = this.training.list[item];
    this.$set(this.training, 'selectedActionTraining', training);
    this.goToTrainingEdit(training.id);
  }

  onEmitRefresh() {
    this.filtersChange();
  }

  onClickDeleteTraining() {
    this.$set(this.training, 'selectedActionTraining', null);
    this.deleteTraining(this.training.selectedItem);
  }

  onClickEditTraining() {
    this.$set(this.training, 'selectedActionTraining', null);
    this.editTraining(this.training.selectedItem);
  }

  async onSelectRequest(item: number): Promise<void> {
    if (this.training.list.length) {
      this.isRequestLoading = true;

      const selectedTraining = this.training.list[item];

      const responseRequestInfo = await TrainingController.GetTrainingById(selectedTraining.id);
      this.$set(this.training, 'selectedTraining', responseRequestInfo);
    }
    this.isRequestLoading = false;
  }

  goToTrainingEdit(id: string) {
    this.$router.push({ name: 'TrainingEdit', params: { id } });
  }

  goToTrainingAdd() {
    this.$router.push({ name: 'TrainingAdd' });
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
