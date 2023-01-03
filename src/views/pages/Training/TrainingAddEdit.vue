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
                  <InlineTextField
                    label="Описание"
                    :value.sync="view.description"
                  />
                  <InlineSliderField
                    label="Время тренировки"
                    min="0"
                    max="999"
                    step="1"
                    hint="в минутах"
                    :value.sync="view.time"
                  />
                  <InlineDateField
                    label="Дата тренировки"
                    :value.sync="view.trainingDate"
                  />
                </v-col>
                <v-col>
                  <InlineTextField
                    label="В разработке"
                    :value.sync="view.description"
                  />
                </v-col>
              </v-row>
              <v-sheet
                class="mt-3 py-3"
                color="white"
                elevation="1"
                rounded
              >
                <ApproachAddEdit
                  :approachs.sync="view.approachs"
                />
              </v-sheet>
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
import { TExercise } from '@/controllers/ExerciseController';
import { Mutation, State } from 'vuex-class';
import Loader from '@/components/Loader.vue';
import ApproachAddEdit from './Components/ApproachAddEdit.vue';

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  InlineDateField,
  Loader,
  ApproachAddEdit
  }
  })
export default class TrainingAddEdit extends Global {
  @Ref('form') readonly form!: any;

  isEdit = false;
  editId: string | null = null;
  view: TTraining = new TTraining();

  isLoading = false;

  mounted() {
    if (this.$route.name === 'TrainingEdit' && this.$route.params) {
      this.isEdit = true;
      this.editId = this.$route.params?.id;
      this.InitViewEdit();
    }
  }

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
        const training = await TrainingController.GetTrainingById(this.editId);
        this.view = training;
      }
      else throw new Error('Ошибка, не удалось загрузить тренировку');
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
      if (!this.isEdit) {
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
}

</script>
