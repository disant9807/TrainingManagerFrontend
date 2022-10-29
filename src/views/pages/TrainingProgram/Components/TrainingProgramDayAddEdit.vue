<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn
        small
        color="white"
        text
        @click="onClickAdd"
      >
        <v-icon class="mr-3">mdi-plus</v-icon>
        Добавить
      </v-btn>
    </div>
    <v-list three-line>
      <v-list-group
        v-for="item in items"
        :key="item.value.id"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title> {{ `${item.value.name}` }} </v-list-item-title>
            <v-list-item-subtitle> {{ `Отдых ${item.value.dayRelax} день/дня/дней` }} </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              color="white"
              text
              @click="onClickEdit(item)"
            >
              <v-icon color="grey lighten-1">mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>
        </template>

        <v-list-item
          v-for="child in item.value.exercises"
          :key="child.id"
        >
          <v-list-item-content>
            <v-list-item-title v-if="child.shortName" v-text="child.shortName"></v-list-item-title>
            <v-list-item-title v-else v-text="child.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <ModalAddEditTrainingProgramDay
      :show="stateModalAddDay"
      :is-edit="isEditDay"
      :max-number="maxItemDay"
      :selected.sync="editTrainingProgramDay"
      @select="onClickSelect"
      @cancel="onClickCancel"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from 'vue-property-decorator';
import TrainingProgramController, { TTrainingProgramDay } from '@/controllers/TrainingProgramController';
import { TExercise } from '@/controllers/ExerciseController';
import Global from '@/mixins/GlobalMixin';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Loader from '@/components/Loader.vue';
import ModalAddEditTrainingProgramDay from './Modals/ModalAddEditTrainingProgramDay.vue';

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
  editTrainingProgramDay: TTrainingProgramDay | null = null;

  get localTrainingPrograms(): TTrainingProgramDay[] | [] {
    return this.days ?? [];
  }

  get maxItemDay() {
    return Math
      .max.apply(Math, this.localTrainingPrograms?.map(e => e.numberOfTrainingProgram)) ??
      0;
  }

  get items(): TTrainingProgramDayItem[] | [] {
    return this.localTrainingPrograms?.sort(e => e.numberOfTrainingProgram)
      ?.map((e, index) => {
        return {
          action: 'mdi-tag',
          value: e,
          active: index === 0
        } as TTrainingProgramDayItem;
      }) ?? [];
  }

  initModalAdd() {
    this.isEditDay = false;
    this.editTrainingProgramDay = null;
    this.stateModalAddDay = true;
  }

  initModalEdit(day: TTrainingProgramDay) {
    this.isEditDay = true;
    this.editTrainingProgramDay = day;
    this.stateModalAddDay = true;
  }

  updateDays(item: TTrainingProgramDay) {
    const indx = this.days?.findIndex(e => e.id === item.id);
    if (this.days as TTrainingProgramDay[] && this.days && indx) {
      this.days[indx] = item;
    } else if (this.days as TTrainingProgramDay[] && this.days && !indx) {
      this.days.push(item);
    } else {
      this.days = [item];
    }
  }

  onClickAdd() {
    this.initModalAdd();
  }

  onClickEdit(item: TTrainingProgramDayItem) {
    this.initModalEdit(item.value);
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
}
</script>
