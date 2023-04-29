<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn
        class="primary mr-3"
        @click="onClickAdd"
        small
      >
        <v-icon class="mr-1">mdi-plus</v-icon>
        Добавить
      </v-btn>
    </div>
    <v-list class="mt-1">
      <template v-if="items.length > 0">
        <v-list-group
          v-for="item, index in items"
          :key="index"
          v-model="item.active"
          :prepend-icon="item.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title> {{ `${item.value.name}` }} </v-list-item-title>
              <v-list-item-subtitle> {{ `Отдых ${item.value.dayRelax} ${getDay(item.value.dayRelax)}` }} </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div class="d-flex align-items">
                <v-btn
                  class="mr-2"
                  icon
                  @click="onClickEdit(item, index)"
                >
                  <v-icon color="primary lighten-1">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="onClickRemove(item, index)"
                >
                  <v-icon color="error lighten-1">mdi-trash-can</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </template>

          <v-list-item
            v-for="child in item.value.exercises"
            :key="child.id"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex align-start">
                <v-icon
                  class="mr-3"
                >
                  mdi-dumbbell
                </v-icon>
                <p class="mr-2">
                  {{ child.shortName ?? child.name }}
                </p>
                <p>
                  {{ child.description }}
                </p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
      <v-list-item v-else>
        <v-list-item-content>
          <v-list-item-title>Список тренировочных дней пуст</v-list-item-title>
          <v-list-item-subtitle>Нажмите кнопку "Добавить" для добавления тренировочного дня</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <ModalAddEditTrainingProgramDay
      :show.sync="stateModalAddDay"
      :is-edit="isEditDay"
      :max-number="maxItemDay"
      :selected.sync="editTrainingProgramDay"
      @select="onClickSelect"
      @cancel="onClickCancel"
    />
    <ModalDeleteTrainingProgramDay
      :show.sync="stateModalDeleteTrainingDay"
      :selected.sync="deletedTrainingDay"
      @select="onClickSelectDeleteTrainigDay"
      @canel="onClickCancleDeleteTrainingDay"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import { TTrainingProgramDay } from '@/controllers/TrainingProgramController';
import { TExercise } from '@/controllers/ExerciseController';
import Global from '@/mixins/GlobalMixin';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Loader from '@/components/Loader.vue';
import ModalAddEditTrainingProgramDay from './Modals/ModalAddEditTrainingProgramDay.vue';
import ModalDeleteTrainingProgramDay from './Modals/ModalDeleteTrainingProgramDay.vue';
import { getNoun } from '@/utils/helpers';

export type TTrainingProgramDayItem = {
  action: string | null,
  value: TTrainingProgramDay,
  active: boolean | null
}

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  ModalAddEditTrainingProgramDay,
  ModalDeleteTrainingProgramDay,
  Loader
  }
  })
export default class TrainingProgramDayAddEdit extends Global {
  @PropSync('TrainingProgramDays', {
    type: Array,
    default: []
  }) days!: TTrainingProgramDay[] | null;

  stateModalAddDay = false;
  isEditDay = false;
  daysEditIndex: number | null = null;
  editTrainingProgramDay: TTrainingProgramDay | null = null;

  stateModalDeleteTrainingDay = false;
  deletedTrainingDay: TTrainingProgramDay | null = null;
  daysDeleteIndex: number | null = null;

  get localTrainingPrograms(): TTrainingProgramDay[] | [] {
    return this.days ?? [];
  }

  get maxItemDay() {
    return this.days?.length ?? 0;
  }

  get items(): TTrainingProgramDayItem[] | [] {
    return this.localTrainingPrograms?.sort((p, s) => s.numberOfTrainingProgram - p.numberOfTrainingProgram)
      ?.map((e, index) => {
        return {
          action: 'mdi-calendar-today',
          value: e,
          active: index === 0
        } as TTrainingProgramDayItem;
      }) ?? [];
  }

  getDay(day: number) {
    return getNoun(day, 'день', 'дня', 'дней');
  }

  initModalAdd() {
    this.daysEditIndex = null;
    this.isEditDay = false;
    this.editTrainingProgramDay = null;
    this.stateModalAddDay = true;
  }

  initModalEdit(day: TTrainingProgramDay, indx: number) {
    this.daysEditIndex = indx;
    this.isEditDay = true;
    this.editTrainingProgramDay = day;
    this.stateModalAddDay = true;
  }

  initModalRemove(day: TTrainingProgramDay, indx: number) {
    this.daysDeleteIndex = indx;
    this.deletedTrainingDay = day;
    this.stateModalDeleteTrainingDay = true;
  }

  updateDays(item: TTrainingProgramDay) {
    if (this.days as TTrainingProgramDay[] && this.days && this.daysEditIndex !== null) {
      this.$set(this.days, this.daysEditIndex, item);
    } else if (this.days as TTrainingProgramDay[] && this.days && this.daysEditIndex === null) {
      this.days.push(item);
    } else {
      this.days = [item];
    }
  }

  onClickAdd() {
    this.initModalAdd();
  }

  onClickEdit(item: TTrainingProgramDayItem, index: number) {
    this.initModalEdit(item.value, index);
  }

  onClickRemove(item: TTrainingProgramDayItem, index: number) {
    this.initModalRemove(item.value, index);
  }

  onClickSelect() {
    if (this.editTrainingProgramDay) {
      this.updateDays(this.editTrainingProgramDay);
      this.stateModalAddDay = false;
    }
  }

  onClickCancel() {
    this.stateModalAddDay = false;
  }

  onClickSelectDeleteTrainigDay() {
    if (this.deletedTrainingDay) {
      this.$delete(this.days as TTrainingProgramDay[], this.daysDeleteIndex as number);
      this.stateModalDeleteTrainingDay = false;
    }
  }

  onClickCancleDeleteTrainingDay() {
    this.stateModalDeleteTrainingDay = false;
  }
}
</script>
