<template>
  <div>
    <div class="d-flex justify-start">
      <v-btn
        class="primary mr-3"
        @click="onClickAddSubGoal"
        small
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Добавить подцель
      </v-btn>
    </div>
    <template v-if="items.length > 0">
      <v-card
        v-for="item, index in items"
        :key="index"
        class="mt-4"
      >
        <v-card-title style="width:100%;">
          <div class="d-flex align-center justify-space-between" style="width:100%;">
            <div v-if="item.body?.shortName.length !== 0">
              Цель по изменению: {{ item.body?.shortName }}
            </div>
            <div v-else>
              Цель по изменению: {{ item.body?.name }}
            </div>
            <div class="d-flex">
              <v-btn icon @click="onClickEdlitSubGoal(index)">
                <v-icon color="primary">mdi-pen</v-icon>
              </v-btn>
              <v-btn icon @click="onClickDeleteSubGoal(index)">
                <v-icon color="error">mdi-trash-can</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-subtitle>Показатель должен стать {{ item.value }} {{ item.unitsOfMeasurement?.value }}</v-card-subtitle>
      </v-card>
    </template>
    <v-card v-else class="mt-4" @click="onClickAddSubGoal">
      <v-card-title>
        Список подцелей пуст
      </v-card-title>
      <v-card-subtitle>Нажмите кнопку "Добавить" для добавления подцели</v-card-subtitle>
    </v-card>
    <ModalSubGoalAddEdit
      :show.sync="stateModalAddGoal"
      :is-edit="isEditGoal"
      :selected.sync="editGoal"
      @select="onClickSelectGoal"
      @cancel="onClickCanelGoal"
    />
    <ModalDeleteSubGoal
      :show.sync="stateModalDeleteSubGoal"
      :selected.sync="deleteSubGoal"
      @select="onClickSelectDeleteSubGoal"
      @canel="onClickCancelDeleteSubGoal"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import Loader from '@/components/Loader.vue';
import ModalSubGoalAddEdit from './Modals/ModalSubGoalAddEdit.vue';
import ModalDeleteSubGoal from './Modals/ModalDeleteSubGoal.vue';
import { TSubGoal } from '@/controllers/GoalController';

@Component({
  components: {
  ModalSubGoalAddEdit,
  ModalDeleteSubGoal,
  Loader
  }
  })
export default class SubGoalAddEdit extends Global {
  @PropSync('SubGoals', {
    type: Array,
    default: []
  }) goalItems!: TSubGoal[] | null;

  stateModalDeleteSubGoal = false;
  deleteSubGoal: TSubGoal | null = null;

  stateModalAddGoal = false;
  isEditGoal = false;
  editGoal: TSubGoal | null = null;
  idxSubGoal: number | null = null;

  get items(): TSubGoal[] {
    return this.goalItems ?? [];
  }

  initModalAddSubGoal() {
    this.isEditGoal = false;
    this.editGoal = null;
    this.stateModalAddGoal = true;
    this.idxSubGoal = null;
  }

  initModalDeleteSubSize(indexSubSize: number) {
    this.deleteSubGoal = this.goalItems ? this.goalItems[indexSubSize] : null;
    this.stateModalDeleteSubGoal = true;
  }

  initModalEditSubGoal(indexSubSize: number) {
    this.isEditGoal = true;
    this.idxSubGoal = indexSubSize;
    this.editGoal = this.goalItems ? this.goalItems[indexSubSize] : null;
    this.stateModalAddGoal = true;
  }

  updateItems(item: TSubGoal) {
    if (this.goalItems as TSubGoal[] && this.goalItems && this.idxSubGoal !== null) {
      this.$set(this.goalItems, this.idxSubGoal, item);
    } else if (this.goalItems as TSubGoal[] && this.goalItems && this.idxSubGoal === null) {
      this.goalItems.push(item);
    } else {
      this.goalItems = [item];
    }
  }

  deleteGoal(idSubSize: string) {
    const subSizeIndx = this.goalItems?.findIndex(e => e.id === idSubSize);
    this.$delete(this.goalItems as Array<TSubGoal>, subSizeIndx as number);
  }

  onClickAddSubGoal() {
    this.initModalAddSubGoal();
  }

  onClickDeleteSubGoal(indexSubSize: number) {
    this.initModalDeleteSubSize(indexSubSize);
  }

  onClickCancelDeleteSubGoal() {
    this.stateModalDeleteSubGoal = false;
  }

  onClickEdlitSubGoal(indexSubSize: number) {
    this.initModalEditSubGoal(indexSubSize);
  }

  onClickSelectGoal() {
    if (this.editGoal) {
      this.updateItems(this.editGoal);
      this.stateModalAddGoal = false;
    }
  }

  onClickCanelGoal() {
    this.stateModalAddGoal = false;
  }

  onClickSelectDeleteSubGoal() {
    if (this.deleteSubGoal) {
      this.deleteGoal(this.deleteSubGoal.id);
      this.stateModalDeleteSubGoal = false;
    }
  }
}
</script>
