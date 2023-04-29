<template>
  <section>
    <v-card>
      <v-card class="pb-5">
        <v-card-title v-if="!isEdit" class="darkblue white--text">
          Добавление тренировочной программы
        </v-card-title>
        <v-card-title v-else class="darkblue white--text">
          Редактирование тренировочной прграммы
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row>
                <v-col class="col-5">
                  <InlineTextField
                    label="Название*"
                    :value.sync="view.name"
                    :rules="[rules.required]"
                  />
                  <InlineTextField
                    label="Краткое наименование"
                    :value.sync="view.shortName"
                    :rules="[rules.required]"
                  />
                  <InlineTextareaField
                    label="Описание"
                    :value.sync="view.description"
                  />
                </v-col>
                <v-col clas="col-7">
                  <v-sheet
                    class="mt-3 py-3"
                    color="white"
                    elevation="1"
                    rounded
                  >
                    <TrainingProgramDayAddEdit
                      :TrainingProgramDays.sync="view.days"
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
  </section>
</template>
<script lang="ts">
import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
import InlineTextareaField from '@/components/InlineTextareaField.vue';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Global from '@/mixins/GlobalMixin';
import TrainingProgramController, { TTrainingProgram, TTrainingProgramDay } from '@/controllers/TrainingProgramController';
import { TExercise, HardSkill } from '@/controllers/ExerciseController';
import { Mutation, State } from 'vuex-class';
import Loader from '@/components/Loader.vue';
import TrainingProgramDayAddEdit from './Components/TrainingProgramDayAddEdit.vue';
import { TUser } from '@/controllers/UserController';

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  InlineTextareaField,
  Loader,
  TrainingProgramDayAddEdit
  }
  })
export default class TrainingProgramAddEdit extends Global {
  @State readonly user!: TUser;
  @Ref('form') readonly form!: any;

  isEdit = false;
  editId: string | null = null;
  view: TTrainingProgram = new TTrainingProgram();

  isLoading = false;

  mounted() {
    if (this.$route.name === 'TrainingProgramEdit' && this.$route.params) {
      this.isEdit = true;
      this.editId = this.$route.params?.id;
      this.InitViewEdit();
    } else {
      this.view.name = 'Новая тренировочная программа';
      this.view.shortName = 'Программа тренировок';
    }
  }

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
        const trainingProgram = await TrainingProgramController.GetTrainingProgramById(this.editId);
        this.view = trainingProgram;
      }
      else throw new Error('Ошибка, не удалось загрузить тренировочную программу');
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

    if (!this.view?.days || (this.view?.days && this.view?.days?.length < 1)) {
      this.showInfo('Необходимо добавить хотя-бы 1 тренировочный день');
      return;
    }

    try {
      this.isLoading = true;
      if (!this.isEdit) {
        this.view.userId = this.user.id;
        const trainingProgram = await TrainingProgramController.CreateTrainingProgram(this.view);
        this.showSuccess(`Тренировочная программа ${this.view.name} успешно добавлена с идентификатором ${trainingProgram}`);
      } else if (this.isEdit && this.editId) {
        const trainingProgramId = await TrainingProgramController.UpdateTrainingProgram(this.editId, this.view);
        this.showSuccess(`Тренировочная программа ${this.view.name} с идентификатором ${trainingProgramId} успешно обновлена!`);
      }
      this.goToTrainingProgram();
    } catch (err) {
      this.showError(`Ошибка. Не удалось добавить/обновить тренировочную программу ${this.view.name}`);
    } finally {
      this.isLoading = false;
    }
  }

  private goToTrainingProgram() {
    this.$router.push({ name: 'TrainingProgram' });
  }

  cancel() {
    this.goToTrainingProgram();
  }
}

</script>
