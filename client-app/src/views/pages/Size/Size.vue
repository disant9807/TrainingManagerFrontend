<template>
  <div class="pa-0 d-flex">
    <v-card class="left-main-container">
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-ruler
        </v-icon>
        <v-subheader class="white--text font-weight-light headerWrap">
          <div class="header">Замеры</div>
        </v-subheader>
        <v-btn
          color="white"
          outlined
          @click="goToSizeAdd"
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
        v-if="size.list.length"
        dense
        class="requestList"
      >
        <v-list-item-group
          v-model="size.selectedItem"
          color="primary"
          mandatory
          @change="onSelectRequest"
        >
          <v-list-item
            v-for="(item, i) in size.list"
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
      <template v-if="size.list.length">
        <v-card>
          <v-card-title class="darkblue py-0">
            <v-subheader class="white--text font-weight-light">
              Карточка замера
            </v-subheader>
            <v-spacer />
            <v-btn
              small
              color="white"
              text
              class="mr-2"
              @click="onClickEditSize"
            >
              <v-icon class="mr-3">mdi-pencil</v-icon>
              Редактировать
            </v-btn>
            <v-btn
              small
              color="red white--text"
              class="ml-2"
              @click="onClickDeleteSize"
            >
              <v-icon class="mr-3">mdi-delete</v-icon>
              Удалить
            </v-btn>
          </v-card-title>
          <v-container
            class="details-container"
          >
            <SizeInfo
              :request="size.selectedSize"
            />
            <SizeDelete
              :size-delete-state.sync="trainingDeleteState"
              :request="size.selectedActionSize"
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
          v-if="isAny(size.selectedSize)"
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
import Filters from './Components/Filters.vue';
import Sorter from '../Components/Sorter.vue';

import { Mutation, State } from 'vuex-class';

import { TOrder } from '@/types/globals';
import { TResult } from '@/api/baseApi';
import SizeController, { TSize, TSizeFilterViewModel } from '@/controllers/SizeController';
import SizeInfo from './Components/SizeInfo.vue';
import SizeDelete from './SizeDelete.vue';

export type TSizeView = {
  selectedItem: number,
  selectedSize: any | null,
  selectedActionSize: any | null,
  list: TSize[],
}

@Component({
  components: {
  Filters,
  Sorter,
  SizeInfo,
  SizeDelete
  }
  })
export default class Size extends mixins(Helper, Global) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  trainingDeleteState = false;

  order: TOrder = 'Desc';

  size: TSizeView = {
    selectedItem: 0,
    selectedSize: null,
    selectedActionSize: null,
    list: [],
  };

  ItemName(item: TSize) {
    return this.localeDateFormat(item.createdDate, false);
  }

  get filtersModel(): TSizeFilterViewModel {
    return this.filters.size;
  }

  get loadingModel() {
    return this.loading.size;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'size', name: 'list', value });
  }

  get isRequestLoading() {
    return this.loadingModel.selectedExercise;
  }

  set isRequestLoading(value: boolean) {
    this.setLoading({ category: 'size', name: 'selectedSize', value });
  }

  mounted() {
    this.filtersChange();
  }

  async filtersChange(): Promise<void> {
    this.isListLoading = true;
    const response = await SizeController.GetSize(this.filtersModel, this.order);
    if (response.success) {
      this.$set(this.size, 'list', response?.data || []);
      this.$set(this.size, 'selectedItem', 0);
      this.$set(this.size, 'selectedSize', null);

      await this.onSelectRequest(this.size.selectedItem);
    }
  }

  deleteTraining(item: number) {
    const training = this.size.list[item];
    this.$set(this.size, 'selectedActionSize', training);
    this.trainingDeleteState = true;
  }

  editSize(item: number) {
    const size = this.size.list[item];
    this.$set(this.size, 'selectedActionSize', size);
    this.goToSizeEdit(size.id);
  }

  onEmitRefresh() {
    this.filtersChange();
  }

  onClickDeleteSize() {
    this.$set(this.size, 'selectedActionSize', null);
    this.deleteTraining(this.size.selectedItem);
  }

  onClickEditSize() {
    this.$set(this.size, 'selectedActionSize', null);
    this.editSize(this.size.selectedItem);
  }

  async onSelectRequest(item: number): Promise<void> {
    if (this.size.list.length) {
      this.isRequestLoading = true;

      const selectedSize = this.size.list[item];

      const responseRequestInfo = await SizeController.GetSizeById(selectedSize.id);
      this.$set(this.size, 'selectedSize', responseRequestInfo);
    }
    this.isRequestLoading = false;
  }

  goToSizeEdit(id: string) {
    this.$router.push({ name: 'SizeEdit', params: { id } });
  }

  goToSizeAdd() {
    this.$router.push({ name: 'SizeAdd' });
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
