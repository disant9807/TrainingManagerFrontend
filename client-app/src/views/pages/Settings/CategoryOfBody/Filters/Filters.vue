<template>
  <div class="text-center pa-1">
    <v-text-field
      v-model="queryString"
      name="searchfield"
      label="Строка поиска"
      outlined
      clearable
      class="ma-3 search-field"
      hide-details
      @keydown="onKeydown"
    >
      <template #append-outer>
        <v-btn
          color="primary"
          outlined
          fab
          small
          style="align-self: center"
          class="ml-3"
          @click="apply('queryString')"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Helper from '@/mixins/Helper';
import { Mutation, State } from 'vuex-class';
import { TCategoryOfBodyFilterViewModel } from '@/controllers/CategoryOfBodyController';

type TFilterType = 'queryString'

export type TIncomingRouteName = 'New' | 'Handled' | 'Saved';

@Component
export default class Filters extends mixins(Helper) {
  @State readonly filters!: any;
  @Mutation('setFilters') setFilters!: (options: any) => void;
  @State readonly loading!: any;
  @Mutation('setLoading') setLoading!: (options: any) => void;

  get filterModel(): TCategoryOfBodyFilterViewModel {
    return this.filters.categoryofbody;
  }

  set filterModel(value: TCategoryOfBodyFilterViewModel) {
    this.setFilters({ name: 'categoryofbody', value });
    this.$emit('change');
  }

  get loadingModel() {
    return this.loading.unitsofmeasurement;
  }

  get isListLoading() {
    return this.loadingModel.list;
  }

  set isListLoading(value: boolean) {
    this.setLoading({ category: 'categoryofbody', name: 'list', value });
  }

  created(): void {
    this.queryString = this.filterModel.queryString || '';
  }

  queryString = '';

  clearFilters(): void {
    this.queryString = '';

    this.filterModel = {
      queryString: ''
    };

    this.$emit('change');
  }

  apply(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'queryString':
        this.filterModel = { ...this.filterModel, queryString: this.queryString };
        break;
    }

    this.$emit('change');
  }

  cancel(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'queryString':
        this.queryString = this.filterModel.queryString || '';
        break;

      default:
        break;
    }
  }

  clear(filter: TFilterType): void {
    this.isListLoading = true;
    switch (filter) {
      case 'queryString':
        this.queryString = '';
        this.filterModel = { ...this.filterModel, queryString: '' };
        break;

      default:
        break;
    }

    this.$emit('change');
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.apply('queryString');
    }
  }
}
</script>

<style lang="scss">
.chipGroupContent {
  & .v-slide-group__content {
    flex-direction: column;
  }
}
.list {
  overflow-y: auto;
}
.export-button {
  background-color: #c3c3c3;
  margin-top: 20px;
}
.search-field {
  display: flex;
  .v-input__append-outer {
    margin: 0 !important;
    padding: 0 !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-self: center;
    width: 50px;
  }
}
</style>
