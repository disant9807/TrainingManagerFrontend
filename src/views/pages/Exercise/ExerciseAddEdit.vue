<template>
  <section>
    <v-card>
      <v-card class="pb-5">
        <v-card-title v-if="!isEdit" class="darkblue">
          Добавление упражнения
        </v-card-title>
        <v-card-title v-else class="darkblue">
          Редактирование упражнения
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
                    label="Краткое наименование*"
                    :value.sync="view.shortName"
                    :rules="[rules.required]"
                  />
                  <inline-radio-buttons-field
                    label="Базовое упражнение?"
                    :objects="yesNo"
                    :selected.sync="view.isBased"
                  />
                  <inline-slider-field
                    label="Сложность"
                    min="10"
                    max="30"
                    step="10"
                    :hint="hardSkillsHint"
                    :selected.sync="hardSkills"
                  />
                </v-col>
                <v-col>
                  <InlineTextField
                    label="Описание"
                    :value.sync="view.description"
                  />
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
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Global from '@/mixins/GlobalMixin';
import ExerciseController, { TExercise, HardSkill } from '@/controllers/ExerciseController';
import { Mutation, State } from 'vuex-class';
import Loader from '@/components/Loader.vue';

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  Loader
  }
  })
export default class ExerciseAddEdit extends Global {
  @Ref('form') readonly form!: any;

  isEdit = false;
  editId: string | null = null;
  view: TExercise = new TExercise();

  hardSkills = 10;
  hardSkillsHint = 'Легко';
  isLoading = false;

  mounted() {
    if (this.$route.name === 'ExerciseEdit' && this.$route.params) {
      this.isEdit = true;
      this.editId = this.$route.params?.id;
      this.InitViewEdit();
    }
  }

  async InitViewEdit() {
    try {
      this.isLoading = true;
      if (this.editId) {
        const exercise = await ExerciseController.GetExerciseById(this.editId);
        this.view = exercise;
        this.initHardSkills();
      }
      else throw new Error('Ошибка, не удалось загрузить упражнение');
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  initHardSkills() {
    if (this.view.hardSkill === HardSkill.easy) {
      this.hardSkills = 10;
    }
    else if (this.view.hardSkill === HardSkill.normal) {
      this.hardSkills = 20;
    }
    else if (this.view.hardSkill === HardSkill.hard) {
      this.hardSkills = 30;
    }
  }

  @Watch('hardSkills')
  selectHardSkills() {
    if (this.hardSkills === 10) {
      this.hardSkillsHint = 'Легко';
      this.view.hardSkill = HardSkill.easy;
    } else if (this.hardSkills === 20) {
      this.hardSkillsHint = 'Нормально';
      this.view.hardSkill = HardSkill.normal;
    } else if (this.hardSkills === 30) {
      this.hardSkillsHint = 'Сложно';
      this.view.hardSkill = HardSkill.hard;
    }
  }

  get yesNo() {
    return [
      { value: true, text: 'Базовое' },
      { value: false, text: 'Изолирующее' }
    ];
  }

  async save() {
    if (!this.form.validate()) {
      this.showInfo('Необходимо заполнить обязательные поля');
      return;
    }

    try {
      this.isLoading = true;
      if (!this.isEdit) {
        const exrciseId = await ExerciseController.CreateExercise(this.view);
        this.showSuccess(`Упражнение ${this.view.name} успешно добавлено с идентификатором ${exrciseId}`);
      } else if (this.isEdit && this.editId) {
        const exrciseId = await ExerciseController.UpdateExercise(this.editId, this.view);
        this.showSuccess(`Упражнение ${this.view.name} с идентификатором ${exrciseId} успешно обновлено!`);
      }
      this.goToExercise();
    } catch (err) {
      this.showError(`Ошибка. Не удалось добавить/обновить упражнение ${this.view.name}`);
    } finally {
      this.isLoading = false;
    }
  }

  private goToExercise() {
    this.$router.push({ name: 'Exercise' });
  }

  cancel() {
    this.goToExercise();
  }
}

</script>
