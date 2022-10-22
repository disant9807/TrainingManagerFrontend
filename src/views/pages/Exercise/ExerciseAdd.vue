<template>
  <section>
    <v-card>
      <v-card class="pb-5">
        <v-card-title class="darkblue">
          Добавление упражнения
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
                    :value.sync="view.name"
                    :rules="[rules.required]"
                  />
                  <InlineTextField
                    label="Краткое наименование*"
                    :value.sync="view.name"
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
export default class ExerciseAdd extends Global {
  @Ref('form') readonly form!: any;

  view: TExercise = new TExercise();

  hardSkills = 10;
  hardSkillsHint = 'Легко';
  isLoading = false;

  @Watch('hardSkills')
  selectHardSkills(value: number) {
    if (value === 10) {
      this.hardSkillsHint = 'Легко';
      this.view.HardSkill = HardSkill.easy;
    } else if (value === 20) {
      this.hardSkillsHint = 'Нормально';
      this.view.HardSkill = HardSkill.normal;
    } else if (value === 30) {
      this.hardSkillsHint = 'Сложно';
      this.view.HardSkill = HardSkill.hard;
    }
  }

  get yesNo() {
    return [
      { value: true, text: 'Базовое' },
      { value: false, text: 'Изолирующее' }
    ];
  }

  async save(_event: any) {
    if (!this.form.validate()) {
      this.showInfo('Необходимо заполнить обязательные поля');
      return;
    }

    try {
      this.isLoading = true;
      const exrciseId = await ExerciseController.CreateExercise(this.view);
      this.showSuccess(`Упражнение ${this.view.name} успешно добавлено с идентификатором ${exrciseId}`);
      this.goToExercise();
    } catch (err) {
      this.showError(`Ошибка. Не удалось добавить упражнение ${this.view.name}`);
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
