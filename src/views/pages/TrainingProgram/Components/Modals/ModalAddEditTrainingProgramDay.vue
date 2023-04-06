<template>
  <v-dialog
    v-model="dialog"
    scrollable
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-3">
      <v-card-title class="darkblue pl-3 py-0">
        <v-subheader class="white--text font-weight-light header-wrap">
          <div v-if="isEdit" class="header">Редактирование тренировочного дня</div>
          <div v-else class="header">Создание тренировочного дня</div>
        </v-subheader>
      </v-card-title>
      <v-card-text style="height: 300px;">
        <v-container>
          <v-row>
            <v-col>
              <v-form
                ref="form"
                lazy-validation
                class="mt-6"
              >
                <InlineTextField
                  label="Название тренировочного дня*"
                  :value.sync="view.name"
                  :rules="[rules.required]"
                />
                <InlineTextField
                  label="Описание тренировочного дня"
                  :value.sync="view.description"
                />
                <InlineSliderField
                  label="Отдых в днях"
                  min="1"
                  max="7"
                  step="1"
                  hint="После тренировочного дня"
                  :value.sync="view.dayRelax"
                />
              </v-form>
            </v-col>
            <v-col>
              <v-sheet
                style="min-height: 680px;"
                class="mt-3 pt-3"
                color="white"
                elevation="1"
                rounded
              >
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
                />
              </v-sheet>
            </v-col>
          </v-row>
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
import { TTrainingProgramDay } from '@/controllers/TrainingProgramController';
import SelectExercises from '../../../Components/SelectExercises.vue';
import Filters from '@/views/pages/Exercise/Components/Filters.vue';
import Sorter from '@/views/pages/Components/Sorter.vue';
import { Mutation, State } from 'vuex-class';
import { TOrder } from '@/types/globals';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';

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
export default class ModalAddEditTrainingProgramDay extends Global {
  @State readonly filters!: any;
  @Ref('form') readonly form!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedTrainingProgramDay!: TTrainingProgramDay | null;
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
  localSelectedExercises: TExercise[] | null = null;

  view: TTrainingProgramDay = new TTrainingProgramDay();

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
    this.view = this.selectedTrainingProgramDay ?? new TTrainingProgramDay();
    this.localSelectedExercises = this.selectedTrainingProgramDay?.exercises ?? [];
  }

  packData(): boolean {
    if (!this.form.validate()) {
      this.showInfo("Пожалуйста заполните обязательные поля.");
      return false;
    }

    if (!this.localSelectedExercises || this.localSelectedExercises?.length === 0) {
      this.showInfo("Пожалуйста выберите хотя-бы одно упражнение");
      return false;
    }

    this.$set(this.view, 'exercises', this.localSelectedExercises || []);
    this.selectedTrainingProgramDay = this.view;
    return true;
  }

  async filtersChange(): Promise<void> {
    this.loading = true;
    try {
      const response = await ExerciseController.GetExercise(this.filtersModel, this.order);
      if (response.success) {
        this.exercises = response?.data ?? [];
      } else {
        throw new Error();
      }
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список тренировок');
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
    if (this.view?.numberOfTrainingProgram === 0) {
      this.view.numberOfTrainingProgram += 1;
    }
  }
}
</script>
