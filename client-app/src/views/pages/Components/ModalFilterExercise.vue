<template>
  <v-dialog
    v-model="dialog"
    scrollable
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-3">
      <v-card-title class="darkblue pl-3 py-0">
        <v-subheader class="white--text font-weight-light header-wrap">
          <div class="header">Выбор упражнений</div>
        </v-subheader>
      </v-card-title>
      <v-card-text style="height: 400px;">
        <v-container>
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
            multiple
          />
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
            Готово
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
import SelectExercises from '@/views/pages/Components/SelectExercises.vue';
import Filters from '@/views/pages/Exercise/Components/Filters.vue';
import Sorter from '@/views/pages/Components/Sorter.vue';
import { State } from 'vuex-class';
import { TOrder } from '@/types/globals';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  SelectExercises,
  Filters,
  Sorter
  }
  })
export default class ModalFilterExercise extends Global {
  @State readonly user!: TUser;
  @State readonly filters!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedExercise!: TExercise[] | null;
  @Prop({
    type: Array,
    default: null
  }) readonly idsSelected!: string[] | null;

  @Prop({
    type: Boolean,
    default: true
  }) readonly multiple!: boolean;

  loading = false;
  order: TOrder = 'Desc';
  exercises: TExercise[] = [];
  localSelectedExercises: TExercise[] | null = null;
  localIds: string[] | null = null;

  get filtersModel(): TExerciseFilterViewModel {
    return this.filters.exercise;
  }

  @Watch('show')
  initComponent() {
    if (this.dialog) {
      if(this.localIds !== this.idsSelected)
      {
        this.unpackIdsSelected();
      } else {
        this.unpackDataSelected();
      }
      this.filtersChange();
    }
  }

  @Watch('selected')
  updateSelectedComponent() {
    this.unpackDataSelected();
  }

  @Watch('idsSelected')
  updateIdsSelectedComponent() {
    this.unpackIdsSelected();
  }

  unpackDataSelected() {
    this.localSelectedExercises = this.selectedExercise ?? [];
  }

  unpackIdsSelected() {
    this.loading = true;
    try {
      let exercise: TExercise[] = [];
      this.idsSelected?.forEach(async i => {
        const response = await ExerciseController.GetExerciseById(i);
        exercise.push(response);
      });
      this.localIds = this.idsSelected;
      this.localSelectedExercises = exercise;
      this.selectedExercise = this.localSelectedExercises;
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить упражнения');
    } finally {
      this.loading = false;
    }
  }

  packData(): boolean {
    if (!this.localSelectedExercises || this.localSelectedExercises?.length === 0) {
      this.showInfo("Пожалуйста выберите хотя-бы одно упражнение");
      return false;
    }
    this.selectedExercise = this.localSelectedExercises;
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

  mounted() {
    if (this.idsSelected && this.idsSelected?.length > 0) {
      this.unpackIdsSelected();
    } else {
      this.unpackDataSelected();
    }
  }
}
</script>
