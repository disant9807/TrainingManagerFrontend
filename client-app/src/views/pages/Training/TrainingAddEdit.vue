<template>
  <section>
    <v-card>
      <v-card class="pb-5">
        <v-card-title v-if="!isEdit" class="darkblue white--text">
          Добавление тренировки
        </v-card-title>
        <v-card-title v-else class="darkblue white--text">
          Редактирование тренировки
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row>
                <v-col>
                  <InlineTextField
                    label="Название*"
                    :value.sync="view.name"
                    :rules="[rules.required]"
                  />
                  <InlineTextareaField
                    label="Описание"
                    :value.sync="view.description"
                  />
                  <InlineDateField
                    label="Дата тренировки"
                    :value.sync="view.trainingDate"
                  />
                  <div class="d-flex align-center">
                    <InlineSliderField
                      label="Время тренировки"
                      min="5"
                      max="350"
                      step="5"
                      hint="в минутах"
                      :value.sync="view.time"
                    />
                    <div class="d-flex flex-column align-center ml-4">
                      <h2>{{ view.time }}</h2>
                      <h4>Минут</h4>
                    </div>
                  </div>
                </v-col>
                <v-col>
                  <v-autocomplete
                    :key="`program-${key}`"
                    v-model="view.trainingProgramIdFK"
                    :items="trainingProgramList"
                    item-text="text"
                    item-value="value"
                    :readonly="true"
                    :multiply="false"
                    clearable
                    label="Тренировочная программа"
                    filled
                    class="mt-3"
                    @click="onOpenModalAddTrainingProgram"
                  />
                  <template v-if="editTrainingProgram !== null">
                    <v-list-item-group
                      v-model="selectedDays"
                      :multiple="false"
                    >
                      <v-list-item v-for="(day, i) in editTrainingProgram.days">
                        <template v-slot:default="{ active }">
                          <v-list-item-action>
                            <v-checkbox
                              :input-value="selectTrainingProgramDay?.id === day.id"
                              color="primary"
                            />
                          </v-list-item-action>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ day.name}}
                              <v-menu
                                :key="keyMenu"
                                :value="hoverDay === day.id"
                                transition="scale-transition"
                              >
                                <template v-slot:activator="{ props }">
                                  <v-chip
                                    link
                                    v-bind="props"
                                    @mouseover="updateHoverDay(day.id)"
                                    class="ml-3"
                                  >
                                    Упражнения
                                  </v-chip>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-for="(exercise, i) in day.exercises"
                                    :key="`exercise-${i}`"
                                  >
                                    <v-list-item-title>{{ exercise.shortName ?? exercise.name }}</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </v-list-item-title>
                            <v-list-item-subtitle>{{ day.description }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </template>
                  <v-sheet
                    class="mt-3 py-3"
                    color="white"
                    elevation="1"
                    rounded
                  >
                    <ApproachAddEdit
                      :approachs.sync="view.approachs"
                      @update="eventManualUpdate"
                    />
                  </v-sheet>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="primary"
            @click="save"
          >
            Сохранить
          </v-btn>
          <v-btn
            class="error"
            @click="cancel"
          >
            Отмена
          </v-btn>
          <v-btn
            class="primary"
            @click="$router.back()"
          >
            Назад
          </v-btn>
        </v-card-actions>
        <Loader :value="isLoading" />
      </v-card>
    </v-card>
    <ModalAddTrainingProgram
      :show.sync="stateModalAddTrainingProgram"
      :is-edit="isEditTrainingProgram"
      :selected.sync="editTrainingProgram"
      @select="onClickSelectTrainingProgram"
      @cancel="onClickCanelTrainingProgram"
    />
    <modal-dialog
      :modal-data="isUpdateApproachModalView"
      :is-open="isUpdateApproachDialog"
      @close="isUpdateApproachDialog = false"
    >
      <div class="d-flex flex-wrap justify-center">
        <p class="flex-grow-1 text-start">
          {{ `При изменении тренировочного дня на ${selectTrainingProgramDay?.name}
          , перезапишутся упражнения в тренировке. Продолжить?` }}
        </p>
      </div>
    </modal-dialog>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import InlineDateField from '@/components/InlineDateField.vue';
import Global from '@/mixins/GlobalMixin';
import TrainingController, { TTraining, TApproach, ApproachLvl } from '@/controllers/TrainingController';
import TrainingProgramControllel, { TTrainingProgram, TTrainingProgramDay, TTrainingProgramFilterViewModel } from '@/controllers/TrainingProgramController';
import { TExercise } from '@/controllers/ExerciseController';
import { Mutation, State } from 'vuex-class';
import Loader from '@/components/Loader.vue';
import ApproachAddEdit from './Components/ApproachAddEdit.vue';
import { TUser } from '@/controllers/UserController';
import InlineTextareaField from '@/components/InlineTextareaField.vue';
import ModalAddTrainingProgram from './Components/Modals/ModalAddTrainingProgram.vue';
import { TVuetifyOptionsList } from '@/types/globals';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineTextareaField,
  InlineSliderField,
  InlineDateField,
  Loader,
  ApproachAddEdit,
  ModalAddTrainingProgram,
  ModalDialog
  }
  })
export default class TrainingAddEdit extends Global {
  @State readonly user!: TUser;
  @Ref('form') readonly form!: any;

  isEdit = false;
  editId: string | null = null;
  view: TTraining = new TTraining();

  isLoading = false;

  stateModalAddTrainingProgram = false;
  isEditTrainingProgram = false;
  editTrainingProgram: TTrainingProgram | null = null;

  hoverDay = '-1';
  keyMenu = 0;

  selectTrainingProgramDay: TTrainingProgramDay | null = null;
  isUpdateApproachDialog = false;
  updateApproachDialogValue = '';
  isUpdateApproachModalView: TModalView = {
    title: `Внимание!`,
    actions: [
      {
        label: 'Продолжить',
        onClick: this.onClickSelectUpdateApproach
      },
      {
        label: 'Отмена',
        onClick: this.onClickCancelUpdateApproach
      }
    ]
  };

  isUnSelectApproachDialog = false;

  key = 0; // ужас ужас, переписать

  mounted() {
    if (this.$route.name === 'TrainingEdit' && this.$route.params) {
      this.isEdit = true;
      this.editId = this.$route.params?.id;
      this.InitViewEdit();
    } else {
      this.view.trainingDate = new Date().toDateString();
      this.view.name = 'Новая тренировка';
      this.view.time = '60';
    }
    this.key += 1;
  }

  @Watch('view.trainingProgramIdFK', { immediate: true })
  checkClearTP() {
    if (this.view.trainingProgramIdFK === null) {
      this.editTrainingProgram = null;
      this.selectTrainingProgramDay = null;
    }
  }

  @Watch('selectTrainingProgramDay')
  checkForUpdateApproach() {
    if (this.selectTrainingProgramDay !== null) {
      this.updateApproachFromSelectTrainingDay();
    }
  }

  onClickSelectUpdateApproach() {
    let day = this.getDayFromEditTPById(this.updateApproachDialogValue);
    if (day) {
      this.selectTrainingProgramDay = day;
    }

    this.updateApproachFromSelectTrainingDay();
    this.isUpdateApproachDialog = false;
    this.updateApproachDialogValue = '';
  }

  onClickCancelUpdateApproach() {
    this.updateApproachDialogValue = '';
    this.isUpdateApproachDialog = false;
  }

  eventManualUpdate() {
    this.selectTrainingProgramDay = null;
  }

  updateHoverDay(day: string) {
    if (this.hoverDay === day) {
      this.hoverDay = '-1';
      this.keyMenu += 1;
    }
    this.hoverDay = day;
  }

  updateApproachFromSelectTrainingDay() {
    if (this.selectTrainingProgramDay) {
      this.view.approachs = [];
      this.selectTrainingProgramDay.exercises?.forEach((e, i) => {
        let approach = new TApproach();
        approach.numberOfTraining = i + 1;
        approach.exercise = e;

        this.view.approachs.push(approach);
      });
    }
  }

  get selectedDays() {
    if (this.editTrainingProgram !== null &&
      this.editTrainingProgram.days !== null &&
      this.selectTrainingProgramDay !== null) {
      return this.editTrainingProgram.days
        .findIndex(e => e.id === this.selectTrainingProgramDay?.id);
    }
    return -1;
  }

  set selectedDays(value: number) {
    if (this.editTrainingProgram !== null && this.editTrainingProgram.days !== null) {
      const trainingDay = this.selectTrainingProgramDay;
      const countViewApproachs = this.view.approachs.length;
      const selectDay = this.editTrainingProgram.days[value];

      if (trainingDay === null && countViewApproachs < 1) {
        if (selectDay) {
          this.selectTrainingProgramDay = selectDay;
        }
      } else if (this.view.approachs.length > 1) {
        this.updateApproachDialogValue = selectDay.id;
        this.isUpdateApproachDialog = true;
      }
    }
  }

  getDayFromEditTPById(dayId: string) {
    return this.editTrainingProgram?.days?.find(e => e.id === dayId);
  }

  get trainingProgramList(): TVuetifyOptionsList[] {
    return this.$route.name === 'TrainingEdit' && this.view.trainingProgramIdFK !== null
      ? [{
          value: this.view.trainingProgramIdFK,
          text: `Тренировочная программа с id ${this.view.trainingProgramIdFK}`
        }]
      : [{
          value: this.editTrainingProgram?.id ?? '',
          text: this.editTrainingProgram?.shortName ??
            this.editTrainingProgram?.name ??
            'Тренировка без программы'
        }];
  }

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
        const training = await TrainingController.GetTrainingById(this.editId);
        this.view = training;
        if (this.view.trainingProgramIdFK !== null &&
          this.view.trainingProgramIdFK !== undefined) {
          const trainingProgram = await TrainingProgramControllel
            .GetTrainingProgramById(this.view.trainingProgramIdFK);

          this.editTrainingProgram = trainingProgram;
          if (this.view.trainingProgramDayFK !== null) {
            const day = this.editTrainingProgram
              .days?.find(e => e.id === this.view.trainingProgramDayFK);

            if (day !== null && day !== undefined) {
              this.selectTrainingProgramDay = day;
            }
          }
        }
      } else throw new Error('Ошибка, не удалось загрузить тренировку');
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  async save() {
    if (!this.form.validate()) {
      this.showInfo('Необходимо заполнить обязательные поля');
      return;
    }

    try {
      this.isLoading = true;
      if (this.selectTrainingProgramDay !== null) {
        this.view.trainingProgramDayFK = this.selectTrainingProgramDay.id;
      }

      if (!this.isEdit) {
        this.view.userId = this.user.id;
        const trainingProgram = await TrainingController.CreateTraining(this.view);
        this.showSuccess(`Тренировка ${this.view.name} успешно добавлена с идентификатором ${trainingProgram}`);
      } else if (this.isEdit && this.editId) {
        const trainingProgramId = await TrainingController.UpdateTraining(this.editId, this.view);
        this.showSuccess(`Тренировка ${this.view.name} с идентификатором ${trainingProgramId} успешно обновлена!`);
      }
      this.goToTraining();
    } catch (err) {
      this.showError(`Ошибка. Не удалось добавить/обновить тренировку ${this.view.name}`);
    } finally {
      this.isLoading = false;
    }
  }

  private goToTraining() {
    this.$router.push({ name: 'Training' });
  }

  cancel() {
    this.goToTraining();
  }

  updateItems(item: TTrainingProgram) {
    this.view.trainingProgramIdFK = item.id;
    this.key += 1;
  }

  onOpenModalAddTrainingProgram() {
    this.stateModalAddTrainingProgram = true;
  }

  onClickSelectTrainingProgram() {
    if (this.editTrainingProgram) {
      this.updateItems(this.editTrainingProgram);
      this.stateModalAddTrainingProgram = false;
    }
  }

  onClickCanelTrainingProgram() {
    this.stateModalAddTrainingProgram = false;
  }
}

</script>
