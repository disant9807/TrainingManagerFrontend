<template>
  <v-dialog
    v-model="dialog"
    scrollable
    hide-overlay
    transition="dialog-bottom-transition"
    max-width="900px"
    min-height="1300px"
  >
    <v-card class="pb-3">
      <v-card-title class="darkblue pl-3 py-0">
        <v-subheader class="white--text font-weight-light header-wrap">
          <div v-if="isEdit" class="header">Изменение выбранного ранее упражнения</div>
          <div v-else class="header">Выбор упражнения</div>
        </v-subheader>
      </v-card-title>
      <v-card-text style="height: 300px;">
        <v-container>
          <v-sheet
            class="mt-3 pt-3"
            color="white"
            elevation="1"
            rounded
          >
            <h4>Упражнение в подходе</h4>
            <filters
              @change="filtersChange"
            />
            <Sorter
              :order.sync="order"
              @change="filtersChange"
            />
            <select-exercises
              class="py-5"
              :loading="loading"
              :exercises="exercises"
              :selected.sync="localSelectedExercises"
              :multiple="false"
            />
          </v-sheet>
        </v-container>
      </v-card-text>
      <v-card-actions class="ml-3">
        <slot name="controls">
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            :disabled="loading"
            @click="apply"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Применить
          </v-btn>
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            :disabled="loading"
            @click="cancel"
          >
            <v-icon class="mr-2">mdi-cancel</v-icon>
            Отмена
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Component, PropSync, Prop, Watch, Ref } from 'vue-property-decorator';
import ExerciseController, { TExercise, TExerciseFilterViewModel } from '@/controllers/ExerciseController';
import SelectExercises from '../../../Components/SelectExercises.vue';
import Filters from '@/views/pages/Exercise/Components/Filters.vue';
import Sorter from '@/views/pages/Components/Sorter.vue';
import { Mutation, State } from 'vuex-class';
import { TOrder } from '@/types/globals';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  SelectExercises,
  Filters,
  Sorter,
  InlineTextField,
  InlineRadioButtonsField,
  InlineSliderField
  }
  })
export default class ModalAddExercise extends Global {
  @State readonly user!: TUser;
  @State readonly filters!: any;
  @Ref('form') readonly form!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedExercise!: TExercise | null;
  @Prop({
    type: Boolean,
    default: false
  }) readonly isEdit!: boolean | null;

  @Prop({
    type: Number,
    default: 0
  }) readonly maxNumber!: number;

  loading = false;
  order: TOrder = 'Desc';
  exercises: TExercise[] = [];
  localSelectedExercises: TExercise[] = [];
  selectExerciseId = '';

  view: TExercise = new TExercise();

  get filtersModel(): TExerciseFilterViewModel {
    return this.filters.exercise;
  }

  @Watch('show')
  initComponent() {
    if (this.dialog) {
      this.unpackData();
      this.filtersChange();
    }
  }

  @Watch('selected')
  updateComponent() {
    this.unpackData();
  }

  unpackData() {
    this.view = this.selectedExercise ?? new TExercise();
    this.localSelectedExercises = this.selectedExercise
      ? [this.selectedExercise] : [];
  }

  packData(): boolean {
    if (this.localSelectedExercises === null || this.localSelectedExercises && this.localSelectedExercises.length < 1) {
      this.showInfo('Пожалуйста выберите хотя-бы одно упражнение');
      return false;
    }

    this.view = this.localSelectedExercises[0];
    this.selectedExercise = this.view;
    return true;
  }

  async filtersChange(): Promise<void> {
    this.loading = true;
    try {
      const response = await ExerciseController.GetExercise(this.filtersModel, this.order, this.user.id);
      if (response.success) {
        this.exercises = response?.data ?? [];
      } else {
        throw new Error();
      }
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список упражнений');
    } finally {
      this.loading = false;
    }
  }

  apply() {
    if (this.packData()) {
      this.$emit('select');
    }
  }

  cancel() {
    this.$emit('cancel');
  }

  async mounted() {
    this.unpackData();
    this.filtersChange();
  }
}
</script>
