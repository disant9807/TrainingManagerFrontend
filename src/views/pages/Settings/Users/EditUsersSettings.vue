<template>
  <section>
    <v-card class="pb-5">
      <v-card-title class="darkblue">
        Настройки справочника «Пользователи»
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            lazy-validation
          >
            <v-subheader>
              <span class="text-h6">Настройки сложности пароля</span>
            </v-subheader>
            <inline-text-field
              :label="`Минимальная длина пароля *`"
              :value.sync="fields.passwordMinimumLength"
              :rules="[rules.required, rules.number]"
              hint="Целое положительное число"
            />
            <inline-radio-buttons-field
              :label="`Обязательное использование строчных букв *`"
              :objects="yesNo"
              :selected.sync="fields.passwordIsLowercases"
            />
            <inline-radio-buttons-field
              :label="`Обязательное использование прописных букв *`"
              :objects="yesNo"
              :selected.sync="fields.passwordIsUpperCases"
            />
            <inline-radio-buttons-field
              :label="`Обязательное использование цифр *`"
              :objects="yesNo"
              :selected.sync="fields.passwordIsNumbers"
            />
            <inline-radio-buttons-field
              :label="`Обязательное использование символов *`"
              :objects="yesNo"
              :selected.sync="fields.passwordIsSymbols"
            />
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions class="ml-3">
        <control-button
          text="Сохранить"
          icon="content-save"
          @onClick="save"
        />
        <control-button
          text="Отмена"
          icon="cancel"
          @onClick="cancel"
        />
      </v-card-actions>
      <Loader :value="isLoading" />
    </v-card>
  </section>
</template>

<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Component, Ref } from 'vue-property-decorator';
import UserController, { TUserSettings, TUserSettingsFields } from '@/controllers/UserController';
import Loader from '@/components/Loader.vue';
import { ControlButton } from '@/components/Buttons';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import { toInteger } from 'lodash';

@Component({
  components: {
  ControlButton,
  InlineTextField,
  InlineRadioButtonsField,
  Loader
  }
})
export default class EditUsersSettings extends Global {
  @Ref('form') readonly form!: { validate: () => boolean };

  isLoading = false;
  fields: TUserSettingsFields = {
    passwordActivityDay: null,
    passwordCountError: null,
    passwordMinimumLength: null,
    passwordIsLowercases: null,
    passwordIsUpperCases: null,
    passwordIsNumbers: null,
    passwordIsSymbols: null,
    lackOfActivityDay: null
  };

  async created() {
    try {
      this.isLoading = true;
      var settings = await UserController.getSettings() as TUserSettings;
      if (settings !== null) {
        this.fields.lackOfActivityDay = settings.lackOfActivityDay.toString();
        this.fields.passwordActivityDay = settings.passwordActivityDay.toString();
        this.fields.passwordCountError = settings.passwordCountError.toString();
        this.fields.passwordMinimumLength = settings.passwordMinimumLength.toString();
        this.fields.passwordIsLowercases = settings.passwordIsLowercases;
        this.fields.passwordIsUpperCases = settings.passwordIsUpperCases;
        this.fields.passwordIsNumbers = settings.passwordIsNumbers;
        this.fields.passwordIsSymbols = settings.passwordIsSymbols;
        this.form.validate();
      }
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  get yesNo() {
    return [
      { value: true, text: "Сохранить настройки пользователя ?" },
      { value: false, text: "Отменить сохранение настроек" }
    ];
  }

  checkForm() {
    if (!this.form.validate()) {
      this.showError(this.$localize('failed', 'validation'));
      return false;
    }
    return true;
  }

  async save() {
    try {
      this.isLoading = true;
      const model = {
        lackOfActivityDay: toInteger(this.fields.lackOfActivityDay),
        passwordActivityDay: toInteger(this.fields.passwordActivityDay),
        passwordCountError: toInteger(this.fields.passwordCountError),
        passwordMinimumLength: toInteger(this.fields.passwordMinimumLength),
        passwordIsLowercases: this.fields.passwordIsLowercases,
        passwordIsUpperCases: this.fields.passwordIsUpperCases,
        passwordIsNumbers: this.fields.passwordIsNumbers,
        passwordIsSymbols: this.fields.passwordIsSymbols
      } as TUserSettings;

      // TODO: add save functionality
      await UserController.setSettings(model);
      this.$router.go(-1);
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    this.$router.go(-1);
  }
}
</script>
