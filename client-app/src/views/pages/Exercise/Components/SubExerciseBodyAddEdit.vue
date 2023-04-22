<template>
  <div>
    <div class="d-flex justify-start">
      <v-btn
        class="primary mr-3"
        @click="onClickAddBody"
        small
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Изменить части тела
      </v-btn>
    </div>
    <v-card
      v-for="item, index in items"
      :key="index"
      class="mt-4"
    >
      <v-card-title style="width:100%;">
        <div class="d-flex align-center justify-space-between" style="width:100%;">
          <div>
            Часть тела : {{ item.shortName ?? item.name }}
          </div>
          <div class="d-flex">
            <v-btn icon @click="onClickDeleteBody(index)">
              <v-icon color="error">mdi-trash-can</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-card-subtitle> {{ item.shortName ?? item.name }} это {{ item.decsription }} </v-card-subtitle>
    </v-card>
    <ModalFilterCategoryOfBody
      :show.sync="stateModalAddBody"
      :selected.sync="bodyItems"
      :multiple="true"
      @select="onClickCanelBody"
      @cancel="onClickCanelBody"
    />
    <ModalDeleteBody
      :show="stateModalDeleteBody"
      :selected.sync="deleteBody"
      @select="onClickSelectDeleteBody"
      @canel="onClickCancelDeleteBody"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import Loader from '@/components/Loader.vue';
import ModalFilterCategoryOfBody from '../../Components/ModalFilterCategoryOfBody.vue';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import ModalDeleteBody from './ModalDeleteBody.vue';

@Component({
  components: {
  ModalFilterCategoryOfBody,
  Loader,
  ModalDeleteBody
  }
  })
export default class SubExerciseBodyAddEdit extends Global {
  @PropSync('bodies', {
    type: Array,
    default: []
  }) bodyItems!: TCategoryOfBody[] | null;

  stateModalDeleteBody = false;
  deleteBody: TCategoryOfBody | null = null;
  idxSubGoal: number | null = null;

  stateModalAddBody = false;
  addBodies: TCategoryOfBody | null = null;

  get items(): TCategoryOfBody[] {
    return this.bodyItems ?? [];
  }

  initModalAddBody() {
    this.stateModalAddBody = true;
    this.idxSubGoal = null;
  }

  initModalDeleteBody(indexSubSize: number) {
    this.deleteBody = this.bodyItems ? this.bodyItems[indexSubSize] : null;
    this.stateModalDeleteBody = true;
  }

  updateItems(item: TCategoryOfBody) {
    if (this.bodyItems as TCategoryOfBody[] && this.bodyItems && this.idxSubGoal !== null) {
      this.$set(this.bodyItems, this.idxSubGoal, item);
    } else if (this.bodyItems as TCategoryOfBody[] && this.bodyItems && this.idxSubGoal === null) {
      this.bodyItems.push(item);
    } else {
      this.bodyItems = [item];
    }
  }

  delete(codeBody: string) {
    const bodyIndx = this.bodyItems?.findIndex(e => e.code === codeBody);
    this.$delete(this.bodyItems as TCategoryOfBody[], bodyIndx as number);
  }

  onClickAddBody() {
    this.initModalAddBody();
  }

  onClickDeleteBody(indexSubSize: number) {
    this.initModalDeleteBody(indexSubSize);
  }

  onClickCancelDeleteBody() {
    this.stateModalDeleteBody = false;
  }

  onClickCanelBody() {
    this.stateModalAddBody = false;
  }

  onClickSelectDeleteBody() {
    if (this.deleteBody) {
      this.delete(this.deleteBody.code);
      this.stateModalDeleteBody = false;
    }
  }
}
</script>
