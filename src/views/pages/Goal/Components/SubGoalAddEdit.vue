<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn
        class="primary mr-3"
        @click="onClickAddSubGoal"
        small
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Добавить цель
      </v-btn>
    </div>
    <v-card
      max-width="400"
      class="mx-auto"
    >
      <v-container
        v-for="item, index in items"
        :key="index"
      >
        <v-row dense>
          <v-col>
            <v-card>
              <v-card-title class="text-h5">
                Цель: {{ item.bodyCode }}
              </v-card-title>

              <v-card-subtitle>{{ item.bodyCode }} достичь размера {{ item.value }} {{ item.codeUnitsOfMeasurement }}</v-card-subtitle>

              <v-card-actions>
                <v-btn
                  variant="text"
                  @click="onClickEdlitSubGoal(index)"
                >
                  Изменить
                </v-btn>
                <v-btn
                  variant="text"
                  @click="onClickDeleteSubGoal(index)"
                >
                  Удалить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <ModalSubGoalAddEdit
      :show="stateModalAddGoal"
      :is-edit="isEditGoal"
      :selected.sync="editGoal"
      @select="onClickSelectGoal"
      @canel="onClickCanelGoal"
    />
    <ModalDeleteSubGoal
      :show="stateModalDeleteSubGoal"
      :selected.sync="deleteSubGoal"
      @select="onClickCancelDeleteSubGoal"
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
  }

  initModalDeleteSubSize(indexSubSize: number) {
    this.deleteSubGoal = this.goalItems ? this.goalItems[indexSubSize] : null;
    this.stateModalDeleteSubGoal = true;
  }

  initModalEditSubGoal(indexSubSize: number) {
    this.isEditGoal = true;
    this.editGoal = this.goalItems ? this.goalItems[indexSubSize] : null;
    this.stateModalAddGoal = true;
  }

  updateItems(item: TSubGoal) {
    const isSubGoalArray: boolean = Array.isArray(this.goalItems) && this.goalItems.every(i => i instanceof TSubGoal);

    if (isSubGoalArray && this.idxSubGoal !== null) {
      this.$set(this.goalItems as TSubGoal[], this.idxSubGoal, item);
    } else if (isSubGoalArray && this.idxSubGoal === null) {
      (this.goalItems as TSubGoal[]).push(item);
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
