<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn
        class="primary mr-3"
        @click="onClickAddExercise"
        small
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Добавить упражнение
      </v-btn>
    </div>
    <v-list class="mt-1">
      <v-list-group
        v-for="item, index in items"
        :key="index"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ item.value.exercise?.shortName ?? item.value.exercise?.name }}</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child, index in item.items"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>{{ `Подход: ${child.value.numberOfApproach}; Вес: ${child.value.weight}; Время: ${child.value.time};` }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="onClickAddApproachItem(index)">
          <v-list-item-icon>
            <v-icon>mdi-plus-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Добавить подход</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <ModalAddExercise
      :show="stateModalAddExercise"
      :is-edit="isEditExercise"
      :selected.sync="editExercise"
      @select="onClickSelectExercise"
      @canel="onClickCanelExercise"
    />
    <ModalAddEditApproach
      :show="stateModalAddApproach"
      :is-edit="isEditApproach"
      :number-of-approach="0"
      :selected.sync="editApproach"
      @select="onClickSelect"
      @cancel="onClickCancel"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import { TExercise } from '@/controllers/ExerciseController';
import { TApproachItem, TApproach, ApproachLvl } from '@/controllers/TrainingController';
import Global from '@/mixins/GlobalMixin';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Loader from '@/components/Loader.vue';
import ModalAddEditApproach from './Modals/ModalAddEditApproachItem.vue';
import ModalAddExercise from './Modals/ModalAddExercise.vue';

export type TApproachItemEl = {
  action: string | null,
  value: TApproachItem,
  active: boolean | null
}

export type TApproachEl = {
  action: string | null,
  value: TApproach,
  active: boolean | null,
  items: Array<TApproachItemEl>
}

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  ModalAddEditApproach,
  ModalAddExercise,
  Loader
  }
  })
export default class ApproachAddEdit extends Global {
  @PropSync('Approachs', {
    type: Array,
    default: []
  }) approachs!: TApproach[] | null;

  exercises: TExercise[] | null = null;
  stateModalAddExercise = false;
  isEditExercise = false;
  editExercise: TExercise | null = null;

  stateModalAddApproach = false;
  isEditApproach = false;
  approachEditIndex: number | null = null;
  editApproach: TApproachItem | null = null;

  indexApproach = 0;

  get localApproach(): TApproach[] | [] {
    return this.approachs ?? [];
  }

  get items(): TApproachEl[] | [] {
    return this.localApproach
      .map((e, index) => {
        return {
          action: 'mdi-tag',
          value: e,
          active: index === 0,
          items: e.approachItems.map((z, indexz) => {
            return {
              action: 'mdi-tag',
              value: z,
              active: indexz === 0,
            } as TApproachItemEl;
          })
        } as TApproachEl;
      }) ?? [];
  }

  initModalAddApproachItem(indexApproach: number) {
    this.approachEditIndex = null;
    this.isEditApproach = false;
    this.editApproach = null;
    this.indexApproach = indexApproach;
    this.stateModalAddApproach = true;
  }

  initModalAddExercise() {
    this.isEditExercise = false;
    this.editExercise = null;
    this.stateModalAddExercise = true;
  }

  initModalEdit(approach: TApproach, indx: number) {
    this.approachEditIndex = indx;
    this.isEditApproach = true;
    // this.editApproach = approach;
    this.stateModalAddApproach = true;
  }

  updateItems(item: TExercise) {
    let approach = new TApproach();
    approach.exercise = item;

    if (this.approachs as TApproach[] && this.approachs && this.approachEditIndex !== null) {
      approach.numberOfTraining = this.approachEditIndex;
      this.$set(this.approachs, this.approachEditIndex, approach);
    } else if (this.approachs as TApproach[] && this.approachs && this.approachEditIndex === null) {
      approach.numberOfTraining = this.approachs.length;
      this.approachs.push(approach);
    } else {
      approach.numberOfTraining = 0;
      this.approachs = [approach];
    }
  }

  updateApproachItem(item: TApproachItem) {
    if (this.approachs && this.approachs[this.indexApproach] && this.approachs[this.indexApproach].approachItems) {
      this.approachs[this.indexApproach].approachItems.push(item);
    } else if(this.approachs && this.approachs[this.indexApproach] && !this.approachs[this.indexApproach].approachItems) {
      this.approachs[this.indexApproach].approachItems = [item];
    }
  }

  onClickAddApproachItem(indexApproach: number) {
    this.initModalAddApproachItem(indexApproach);
  }

  onClickSelect() {
    if (this.editApproach) {
      this.updateApproachItem(this.editApproach);
      this.indexApproach = 0;
      this.stateModalAddApproach = false;
    }
  }

  onClickCancel() {
    this.stateModalAddApproach = false;
  }

  onClickAddExercise() {
    this.initModalAddExercise();
  }

  onClickSelectExercise() {
    if (this.editExercise) {
      this.updateItems(this.editExercise);
      this.stateModalAddExercise = false;
    }
  }

  onClickCanelExercise() {
    this.stateModalAddExercise = false;
  }
}
</script>
