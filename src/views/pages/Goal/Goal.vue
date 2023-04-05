<template>
  <div class="pa-0 d-flex">
    <v-card class="left-main-container">
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-flag-checkered
        </v-icon>
        <v-subheader class="white--text font-weight-light headerWrap">
          <div class="header">Цели</div>
        </v-subheader>
        <v-btn
          color="white"
          outlined
          @click="goToGoalAdd"
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
        v-if="goal.list.length"
        dense
        class="requestList"
      >
        <v-list-item-group
          v-model="goal.selectedItem"
          color="primary"
          mandatory
          @change="onSelectRequest"
        >
          <v-list-item
            v-for="(item, i) in goal.list"
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
      <template v-if="goal.list.length">
        <v-card>
          <v-card-title class="darkblue py-0">
            <v-subheader class="white--text font-weight-light">
              Карточка цели
            </v-subheader>
            <v-spacer />
            <v-btn
              small
              color="white"
              text
              class="mr-2"
              @click="onClickEditGoal"
            >
              <v-icon class="mr-3">mdi-pencil</v-icon>
              Редактировать
            </v-btn>
            <v-btn
              small
              color="red white--text"
              class="ml-2"
              @click="onClickDeleteGoal"
            >
              <v-icon class="mr-3">mdi-delete</v-icon>
              Удалить
            </v-btn>
          </v-card-title>
          <v-container
            class="details-container"
          >
            <GoalInfo
              :request="goal.selectedGoal"
            />
            <GoalDelete
              :goal-delete-state.sync="trainingDeleteState"
              :request="goal.selectedActionGoal"
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
          v-if="isAny(goal.selectedGoal)"
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
          Целей не найдено...
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
import Filters from './Components/Filters.vue';
import Sorter from '../Components/Sorter.vue';

import { Mutation, State } from 'vuex-class';

import { TOrder } from '@/types/globals';
import { TResult } from '@/api/baseApi';
import GoalController, { TGoal, TSubGoal, TGoalFilterViewModel } from '@/controllers/GoalController';
import GoalInfo from './Components/GoalInfo.vue';
import GoalDelete from './GoalDelete.vue';

export type TGoalView = {
  selectedItem: number,
  selectedGoal: any | null,
  selectedActionGoal: any | null,
  list: TGoal[],
}

@Component({
  components: {
  Filters,
  Sorter,
  GoalInfo,
  GoalDelete
  }
  })
export default class Goal extends mixins(Helper, Global) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  trainingDeleteState = false;

  order: TOrder = 'Desc';

  goal: TGoalView = {
    selectedItem: 0,
    selectedGoal: null,
    selectedActionGoal: null,
    list: [],
  };

  ItemName(item: TGoal) {
    return this.localeDateFormat(item.createdDate, false);
  }

  get filtersModel(): TGoalFilterViewModel {
    return this.filters.goal;
  }

  get loadingModel() {
    return this.loading.goal;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'goal', name: 'list', value });
  }

  get isRequestLoading() {
    return this.loadingModel.selectedExercise;
  }

  set isRequestLoading(value: boolean) {
    this.setLoading({ category: 'goal', name: 'selectedGoal', value });
  }

  mounted() {
    this.filtersChange();
  }

  async filtersChange(): Promise<void> {
    this.isListLoading = true;
    const response = await GoalController.GetGoal(this.filtersModel, this.order);
    if (response.success) {
      this.$set(this.goal, 'list', response?.data || []);
      this.$set(this.goal, 'selectedItem', 0);
      this.$set(this.goal, 'selectedSize', null);

      await this.onSelectRequest(this.goal.selectedItem);
    }
  }

  deleteGoal(item: number) {
    const training = this.goal.list[item];
    this.$set(this.goal, 'selectedActionGoal', training);
    this.trainingDeleteState = true;
  }

  editGoal(item: number) {
    const size = this.goal.list[item];
    this.$set(this.goal, 'selectedActionGoal', size);
    this.goToGoalEdit(size.id);
  }

  onEmitRefresh() {
    this.filtersChange();
  }

  onClickDeleteGoal() {
    this.$set(this.goal, 'selectedActionGoal', null);
    this.deleteGoal(this.goal.selectedItem);
  }

  onClickEditGoal() {
    this.$set(this.goal, 'selectedActionGoal', null);
    this.editGoal(this.goal.selectedItem);
  }

  async onSelectRequest(item: number): Promise<void> {
    if (this.goal.list.length) {
      this.isRequestLoading = true;

      const selectedGoal = this.goal.list[item];

      const responseRequestInfo = await GoalController.GetGoalById(selectedGoal.id);
      this.$set(this.goal, 'selectedGoal', responseRequestInfo);
    }
    this.isRequestLoading = false;
  }

  goToGoalEdit(id: string) {
    this.$router.push({ name: 'GoalEdit', params: { id } });
  }

  goToGoalAdd() {
    this.$router.push({ name: 'GoalAdd' });
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
