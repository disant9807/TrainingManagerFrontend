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
          v-for="child, indexz in item.items"
          :key="indexz"
        >
          <v-list-item-content>
            <v-list-item-title>{{ `Подход: ${child.value.numberOfApproach}; Вес: ${child.value.weight}; Время: ${child.value.time};` }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <div class="d-flex">
              <v-btn icon @click="onClickUpNumberApproachItem(index, indexz)">
                <v-icon color="grey lighten-1">mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn icon class="ml-2" @click="onClickDownNumberApproachItem(index, indexz)">
                <v-icon color="grey lighten-1">mdi-arrow-down</v-icon>
              </v-btn>
              <v-btn icon class="ml-2" @click="onClickEdlitApproachItem(index, indexz)">
                <v-icon color="grey lighten-1">mdi-pen</v-icon>
              </v-btn>
              <v-btn icon class="ml-2">
                <v-icon color="grey lighten-1">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-list-item-action>
        </v-list-item>
        <v-list-item link @click="onClickAddApproachItem(index)">
          <v-list-item-content>
            <v-list-item-title>Добавить подход</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">mdi-plus</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item link @click="onClickDeleteApproachItem(index)">
          <v-list-item-content>
            <v-list-item-title>Удалить подход</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="red lighten-1">mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
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
    <ModalAddEditApproachItem
      :show="stateModalAddApproachItem"
      :is-edit="isEditApproachItem"
      :number-of-approach="numberOfApproach"
      :selected.sync="editApproachItem"
      @select="onClickSelect"
      @cancel="onClickCancel"
    />
    <ModalDeleteApproach
      :show="stateModalDeleteApproach"
      :selected.sync="deleteApproach"
      @select="onClickSelectDeleteApproach"
      @canel="onClickCancelDeleteApproach"
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
import ModalAddEditApproachItem from './Modals/ModalAddEditApproachItem.vue';
import ModalAddExercise from './Modals/ModalAddExercise.vue';
import ModalDeleteApproach from './Modals/ModalDeleteApproach.vue';
import { TSizeItem } from '@/controllers/SizeController';

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
  ModalAddEditApproachItem,
  ModalAddExercise,
  ModalDeleteApproach,
  Loader
  }
  })
export default class ApproachAddEdit extends Global {
  @PropSync('Approachs', {
    type: Array,
    default: []
  }) approachs!: TApproach[] | null;

  stateModalDeleteApproach = false;
  deleteApproach: TApproach | null = null;

  stateModalAddExercise = false;
  isEditExercise = false;
  editExercise: TExercise | null = null;

  stateModalAddApproachItem = false;
  isEditApproachItem = false;
  editApproachItem: TApproachItem | null = null;
  numberOfApproach = 0;
  indexApproach: number | null = null;
  indexApproachItem = 0;
  keyApproachList = 0;

  get localApproach(): TApproach[] | [] {
    return this.approachs ?? [];
  }

  get items(): TApproachEl[] | [] {
    const sortedApproach = this.localApproach.sort((a, b) => a.numberOfTraining - b.numberOfTraining);
    const items: TApproachEl[] = sortedApproach.map((e, index) => {
      const sortedApproachItems = e.approachsItems.sort((a, b) => a.numberOfApproach - b.numberOfApproach);
      const approachItems = sortedApproachItems.map((z, indexz) => ({
        value: z,
        active: indexz === 0,
      } as TApproachItemEl));
      return {
        action: 'mdi-dumbbell',
        value: e,
        active: index === this.indexApproach,
        items: approachItems
      };
    });
    return items ?? [];
  }

  initModalAddApproachItem(indexApproach: number) {
    this.isEditApproachItem = false;
    this.editApproachItem = null;
    this.indexApproach = indexApproach;

    this.numberOfApproach = this.approachs ? this.approachs[indexApproach].approachsItems.length + 1 : 1;

    this.stateModalAddApproachItem = true;
  }

  initModalAddExercise() {
    this.isEditExercise = false;
    this.editExercise = null;
    this.stateModalAddExercise = true;
    this.indexApproach = null;
  }

  initModalEditApproachItem(indexApproach: number, indexApproachItem: number) {
    const approach = this.approachs?.[indexApproach];
    const approachItem = approach?.approachsItems?.[indexApproachItem];

    this.isEditApproachItem = true;
    this.indexApproach = indexApproach;
    this.indexApproachItem = indexApproachItem;
    this.editApproachItem = approachItem ?? null;
    this.numberOfApproach = approachItem?.numberOfApproach ?? 1;
    this.stateModalAddApproachItem = true;
}

  initModalDeleteApproachItem(indexApproach: number) {
    this.deleteApproach = this.approachs ? this.approachs[indexApproach] : null;
    this.stateModalDeleteApproach = true;
  }

  updateItems(input: TExercise) {
    let approach = new TApproach();
    approach.exercise = input;

    if (this.approachs && this.indexApproach !== null) {
      approach.numberOfTraining = this.indexApproach;
      this.$set(this.approachs, this.indexApproach, approach);
    } else if (this.approachs && this.indexApproach === null) {
      approach.numberOfTraining = this.approachs.length;
      this.approachs.push(...[approach]);
    } else {
      approach.numberOfTraining = 0;
      this.approachs = [approach];
    }
  }

  updateApproachItem(item: TApproachItem) {
    const approach = this.approachs?.[this.indexApproach as number];

    if (this.indexApproach && approach) {
      const approachItems = approach.approachsItems;

      if (approachItems) {
        if (this.isEditApproachItem) {
          approachItems[this.indexApproachItem] = item;
        } else {
          approachItems.push(item);
        }
      } else {
        approach.approachsItems = [item];
      }
    }
  }

  updateNumberApproachItem(indexApproach: number, indexApproachItem: number, value: number) {
    const hasApproachs = this.approachs && Array.isArray(this.approachs);
    if (!hasApproachs) return;

    const currentApproach = (this.approachs as TApproach[])[indexApproach];
    const hasCurrentApproach = currentApproach && Array.isArray(currentApproach.approachsItems);
    if (!hasCurrentApproach) return;

    const isValueWithinBounds = value > 0 && value <= currentApproach.approachsItems.length;
    if (!isValueWithinBounds) return;

    const currentApproachItem = currentApproach.approachsItems[indexApproachItem];
    const oldValue = currentApproachItem.numberOfApproach;

    const indexOfOtherValue = currentApproach.approachsItems.findIndex(item => item.numberOfApproach === value);
    const hasOtherValue = indexOfOtherValue >= 0 && indexOfOtherValue !== indexApproachItem;
    if (!hasOtherValue) return;

    this.$set(currentApproach.approachsItems[indexOfOtherValue], 'numberOfApproach', oldValue);
    this.$set(currentApproachItem, 'numberOfApproach', value);

    this.keyApproachList++;
  }

  deleteApproachItem(idApproach: string) {
    const approachIndx = this.approachs?.findIndex(e => e.id === idApproach);
    this.$delete(this.approachs as Array<TApproach>, approachIndx as number);
  }

  onClickDeleteApproachItem(indexApproach: number) {
    this.initModalDeleteApproachItem(indexApproach);
  }

  onClickAddApproachItem(indexApproach: number) {
    this.initModalAddApproachItem(indexApproach);
  }

  onClickEdlitApproachItem(indexApproach: number, indexApproachItem: number) {
    this.initModalEditApproachItem(indexApproach, indexApproachItem);
  }

  onClickSelect() {
    if (this.editApproachItem) {
      this.updateApproachItem(this.editApproachItem);
      this.stateModalAddApproachItem = false;
    }
  }

  onClickCancel() {
    this.stateModalAddApproachItem = false;
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

  onClickSelectDeleteApproach() {
    if (this.deleteApproach) {
      this.deleteApproachItem(this.deleteApproach.id);
      this.stateModalDeleteApproach = false;
    }
  }

  onClickCancelDeleteApproach() {
    this.stateModalDeleteApproach = false;
  }

  onClickCanelExercise() {
    this.stateModalAddExercise = false;
  }

  onClickDownNumberApproachItem(indexApproach: number, indexApproachItem: number) {
    if (this.approachs) {
      this.updateNumberApproachItem(indexApproach, indexApproachItem,
        this.approachs[indexApproach].approachsItems[indexApproachItem].numberOfApproach + 1);
    }
  }

  onClickUpNumberApproachItem(indexApproach: number, indexApproachItem: number) {
    if (this.approachs) {
      this.updateNumberApproachItem(indexApproach, indexApproachItem,
        this.approachs[indexApproach].approachsItems[indexApproachItem].numberOfApproach - 1);
    }
  }
}
</script>
