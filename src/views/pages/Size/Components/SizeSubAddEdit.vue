<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn
        class="primary mr-3"
        @click="onClickAddSubSize"
        small
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Добавить замер
      </v-btn>
    </div>
    <v-card
      v-for="item, index in items"
      :key="index"
      class="mt-4"
    >
      <v-card-title class="text-h5">
        <div class="d-flex align-center justify-space-between" style="width:100%;">
          <div>
            Замер: {{ item.body?.name }}
          </div>
          <div class="d-flex">
            <v-btn icon @click="onClickEdlitSubSizeItem(index)">
              <v-icon color="primary">mdi-pen</v-icon>
            </v-btn>
            <v-btn icon @click="onClickDeleteSubSize(index)">
              <v-icon color="error">mdi-trash-can</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-title>
      <v-card-subtitle>{{ item.body?.shortName ?? items.body?.name }} имеет размер {{ item.value }} {{ item.unitsOfMeasurement?.value }}</v-card-subtitle>
    </v-card>
    <ModalSizeSubAddEdit
      :show.sync="stateModalAddSize"
      :is-edit="isEditSize"
      :selected.sync="editSize"
      @select="onClickSelectSize"
      @cancel="onClickCanelSize"
    />
    <ModalDeleteSubSize
      :show.sync="stateModalDeleteSubSize"
      :selected.sync="deleteSubSize"
      @select="onClickSelectDeleteSubSize"
      @cancel="onClickCancelDeleteSubSize"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import Loader from '@/components/Loader.vue';
import ModalSizeSubAddEdit from './Modals/ModalSizeSubAddEdit.vue';
import ModalDeleteSubSize from './Modals/ModalDeleteSubSize.vue';
import { TSizeItem } from '@/controllers/SizeController';

@Component({
  components: {
  ModalSizeSubAddEdit,
  ModalDeleteSubSize,
  Loader
  }
  })
export default class SizeSubAddEdit extends Global {
  @PropSync('SizeItems', {
    type: Array,
    default: []
  }) sizeItems!: TSizeItem[] | null;

  stateModalDeleteSubSize = false;
  deleteSubSize: TSizeItem | null = null;

  stateModalAddSize = false;
  isEditSize = false;
  editSize: TSizeItem | null = null;
  idxSubSize: number | null = null;

  get items(): TSizeItem[] {
    return this.sizeItems ?? [];
  }

  initModalAddSubSize() {
    this.isEditSize = false;
    this.idxSubSize = null;
    this.editSize = null;
    this.stateModalAddSize = true;
  }

  initModalDeleteSubSize(indexSubSize: number) {
    this.deleteSubSize = this.sizeItems ? this.sizeItems[indexSubSize] : null;
    this.stateModalDeleteSubSize = true;
  }

  initModalEditSubSize(indexSubSize: number) {
    this.isEditSize = true;
    this.idxSubSize = indexSubSize;
    this.editSize = this.sizeItems ? this.sizeItems[indexSubSize] : null;
    this.stateModalAddSize = true;
  }

  updateItems(item: TSizeItem) {
    if (this.sizeItems as TSizeItem[] && this.sizeItems && this.idxSubSize !== null) {
      this.$set(this.sizeItems, this.idxSubSize, item);
    } else if (this.sizeItems as TSizeItem[] && this.sizeItems && this.idxSubSize === null) {
      this.sizeItems.push(item);
    } else {
      this.sizeItems = [item];
    }
  }

  deleteSizeItem(idSubSize: string) {
    const subSizeIndx = this.sizeItems?.findIndex(e => e.id === idSubSize);
    this.$delete(this.sizeItems as Array<TSizeItem>, subSizeIndx as number);
  }

  onClickAddSubSize() {
    this.initModalAddSubSize();
  }

  onClickDeleteSubSize(indexSubSize: number) {
    this.initModalDeleteSubSize(indexSubSize);
  }

  onClickCancelDeleteSubSize() {
    this.stateModalDeleteSubSize = false;
  }

  onClickEdlitSubSizeItem(indexSubSize: number) {
    this.initModalEditSubSize(indexSubSize);
  }

  onClickSelectSize() {
    if (this.editSize) {
      this.updateItems(this.editSize);
      this.stateModalAddSize = false;
    }
  }

  onClickCanelSize() {
    this.stateModalAddSize = false;
  }

  onClickSelectDeleteSubSize() {
    if (this.deleteSubSize) {
      this.deleteSizeItem(this.deleteSubSize.id);
      this.stateModalDeleteSubSize = false;
    }
  }
}
</script>
