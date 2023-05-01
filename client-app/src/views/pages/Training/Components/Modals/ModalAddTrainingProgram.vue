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
          <div v-if="isEdit" class="header">Изменение выбранной ранее тренировочной программы</div>
          <div v-else class="header">Выбор тренировочной программы</div>
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
            <SelectTrainingProgram
              class="py-5"
              :loading="loading"
              :training-programs="trainingPrograms"
              :selected.sync="localSelectedTrainingPrograms"
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
import TrainingProgramControllel, { TTrainingProgram, TTrainingProgramFilterViewModel } from '@/controllers/TrainingProgramController';
import SelectTrainingProgram from '@/views/pages/Components/SelectTrainingprogram.vue';
import Filters from '@/views/pages/TrainingProgram/Components/Filters.vue';
import Sorter from '@/views/pages/Components/Sorter.vue';
import { Mutation, State } from 'vuex-class';
import { TOrder } from '@/types/globals';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  SelectTrainingProgram,
  Filters,
  Sorter,
  InlineTextField,
  InlineRadioButtonsField,
  InlineSliderField
  }
  })
export default class ModalAddTrainingProgram extends Global {
  @State readonly user!: TUser;
  @State readonly filters!: any;
  @Ref('form') readonly form!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedTrainingProgram!: TTrainingProgram | null;
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
  trainingPrograms: TTrainingProgram[] = [];
  localSelectedTrainingPrograms: TTrainingProgram[] = [];
  selectTrainingProgramId = '';

  view: TTrainingProgram = new TTrainingProgram();

  get filtersModel(): TTrainingProgramFilterViewModel {
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
    this.view = this.selectedTrainingProgram ?? new TTrainingProgram();
    this.localSelectedTrainingPrograms = this.selectedTrainingProgram
      ? [this.selectedTrainingProgram]
      : [];
  }

  packData(): boolean {
    if (this.localSelectedTrainingPrograms === null || this.localSelectedTrainingPrograms && this.localSelectedTrainingPrograms.length < 1) {
      this.showInfo('Пожалуйста выберите хотя-бы одно упражнение');
      return false;
    }

    this.view = this.localSelectedTrainingPrograms[0];
    this.selectedTrainingProgram = this.view;
    return true;
  }

  async filtersChange(): Promise<void> {
    this.loading = true;
    try {
      const response = await TrainingProgramControllel.GetTrainingProgram(this.filtersModel, this.order, this.user.id);
      if (response.success) {
        this.trainingPrograms = response?.data ?? [];
      } else {
        throw new Error();
      }
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список тренировочных программ');
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
