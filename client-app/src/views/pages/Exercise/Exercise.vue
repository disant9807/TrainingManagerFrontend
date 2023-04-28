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
          @click="goToExerciseAdd"
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
        v-if="exercises.list.length"
        dense
        class="requestList"
      >
        <v-list-item-group
          v-model="exercises.selectedItem"
          color="primary"
          mandatory
          @change="onSelectRequest"
        >
          <v-list-item
            v-for="(item, i) in exercises.list"
            :key="i"
            two-line
            :title="exerciseItemName(item)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name" />
              <v-list-item-subtitle v-text="exerciseItemIsBase(item)" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="right-main-container">
      <template v-if="exercises.list.length">
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
              @click="onClickEditExercise"
            >
              <v-icon class="mr-3">mdi-pencil</v-icon>
              Редактировать
            </v-btn>
            <v-btn
              small
              color="red white--text"
              class="ml-2"
              @click="onClickDeleteExerecise"
            >
              <v-icon class="mr-3">mdi-delete</v-icon>
              Удалить
            </v-btn>
          </v-card-title>
          <v-container
            class="details-container"
          >
            <ExerciseInfo
              :request="exercises.selectedExercise"
            />
            <ExerciseDelete
              :exercise-delete-state.sync="exerciseDeleteState"
              :request="exercises.selectedActionExercise"
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
          v-if="isAny(exercises.selectedExercise)"
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
          Упражнений не найдено...
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
import ExerciseController, { TExercise, HardSkill, TExerciseFilterViewModel } from '@/controllers/ExerciseController';

import Filters from './Components/Filters.vue';
import Sorter from '../Components/Sorter.vue';
import ExerciseInfo from './Components/ExerciseInfo.vue';
import ExerciseDelete from './ExerciseDelete.vue';

import { Mutation, State } from 'vuex-class';

import { TOrder } from '@/types/globals';
import { TUser } from '@/controllers/UserController';

export type TExercisesView = {
  selectedItem: number,
  selectedExercise: any | null,
  selectedActionExercise: any | null,
  list: TExercise[],
}

@Component({
  components: {
  Filters,
  Sorter,
  ExerciseInfo,
  ExerciseDelete
  }
  })
export default class Exercise extends mixins(Helper, Global) {
  @State readonly user!: TUser;
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  exerciseDeleteState = false;

  order: TOrder = 'Desc';

  exercises: TExercisesView = {
    selectedItem: 0,
    selectedExercise: null,
    selectedActionExercise: null,
    list: [],
  };

  exerciseItemName(item: TExercise) {
    return item.shortName ?? item.name;
  }

  exerciseItemIsBase(item: TExercise) {
    return item.isBased ? 'Базовое' : 'Изолирующее';
  }

  get filtersModel(): TExerciseFilterViewModel {
    return this.filters.exercise;
  }

  get loadingModel() {
    return this.loading.exercise;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'exercise', name: 'list', value });
  }

  get isRequestLoading() {
    return this.loadingModel.selectedExercise;
  }

  set isRequestLoading(value: boolean) {
    this.setLoading({ category: 'exercise', name: 'selectedExercise', value });
  }

  mounted() {
    this.filtersChange();
  }

  async filtersChange(): Promise<void> {
    this.isListLoading = true;
    const response = await ExerciseController.GetExercise(this.filtersModel, this.order, this.user.id);
    if (response.success) {
      this.$set(this.exercises, 'list', response?.data || []);
      this.$set(this.exercises, 'selectedItem', 0);
      this.$set(this.exercises, 'selectedExercise', null);

      await this.onSelectRequest(this.exercises.selectedItem);
    }
  }

  deleteExercise(item: number) {
    const exercise = this.exercises.list[item];
    this.$set(this.exercises, 'selectedActionExercise', exercise);
    this.exerciseDeleteState = true;
  }

  editExercise(item: number) {
    const exercise = this.exercises.list[item];
    this.$set(this.exercises, 'selectedActionExercise', exercise);
    this.goToExerciseEdit(exercise.id);
  }

  onEmitRefresh() {
    this.filtersChange();
  }

  onClickDeleteExerecise() {
    this.$set(this.exercises, 'selectedActionExercise', null);
    this.deleteExercise(this.exercises.selectedItem);
  }

  onClickEditExercise() {
    this.$set(this.exercises, 'selectedActionExercise', null);
    this.editExercise(this.exercises.selectedItem);
  }

  async onSelectRequest(item: number): Promise<void> {
    if (this.exercises.list.length) {
      this.isRequestLoading = true;

      const selectedExercise = this.exercises.list[item];

      const responseRequestInfo = await ExerciseController.GetExerciseById(selectedExercise.id);
      this.$set(this.exercises, 'selectedExercise', responseRequestInfo);
    }
    this.isRequestLoading = false;
  }

  goToExerciseEdit(id: string) {
    this.$router.push({ name: 'ExerciseEdit', params: { id } });
  }

  goToExerciseAdd() {
    this.$router.push({ name: 'ExerciseAdd' });
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
