<template>
  <v-card
    elevation="1"
    style="max-height:80%"
  >
    <v-form
      ref="form"
      class="pa-4"
      lazy-validation
    >
      <v-tabs v-model="tabs">
        <v-tab>
          Базовые параметры
        </v-tab>
        <v-tab>
          Информация
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card text>
            <InlineTextField
              label="id"
              :value.sync="view.newId"
              :rules="[rules.required]"
            />
            <InlineTextField
              label="Имя"
              :value.sync="view.firstName"
              :rules="[rules.required]"
            />
            <InlineTextField
              label="Фамилия"
              :value.sync="view.middleName"
              :rules="[rules.required]"
            />
            <InlineTextField
              label="Отчество"
              :value.sync="view.surname"
              :rules="[rules.required]"
            />
            <InlineTextField
              label="Почта"
              :value.sync="view.email"
              :rules="[rules.email]"
            />
            <InlineTextField
              label="Номер телефона*"
              :value.sync="view.phoneNumber"
              :rules="[rules.phone]"
            />
            <inline-radio-buttons-field
              label="Архивный"
              :objects="yesNo"
              :selected.sync="view.archive"
            />
            <inline-radio-buttons-field
              label="Заблокирован"
              :objects="yesNo"
              :selected.sync="view.blocked"
            />

            <v-row>
              <template v-if="isEdit || view.fromAD">
                <v-col>
                  <InlineTextField
                    label="Пароль"
                    :value.sync="view.password"
                    :rules="rulesForPassword"
                    :password="!isGeneratedPassword"
                    :readonly="view.fromAD"
                    :disabled="view.fromAD"
                    @input="passwordChangeHandler"
                  />
                </v-col>
              </template>
              <template v-else>
                <v-col cols="9">
                  <InlineTextField
                    label="Пароль"
                    :value.sync="view.password"
                    :rules="rulesForPassword"
                    :password="!isGeneratedPassword"
                    @input="passwordChangeHandler"
                  />
                </v-col>
                <v-col class="mt-5">
                  <v-btn
                    class="primary"
                    @click="generatePasswordHandler"
                  >
                    Сгенерировать
                  </v-btn>
                </v-col>
              </template>
            </v-row>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card text>
            <InlineDateField
              label="Дата создания"
              :value.sync="view.createdDatetime"
              :readonly="true"
            />
            <InlineDateField
              label="Дата последнего обновления"
              :value.sync="view.lastUpdateDatetime"
              :readonly="true"
            />
            <InlineDateField
              label="Дата последнего изменения"
              :value.sync="view.lastPasswordChangeDatetime"
              :readonly="true"
            />
            <InlineDateField
              label="Дата последней авторизации"
              :value.sync="view.lastLoginDatetime"
              :readonly="true"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
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
      <modal-dialog
        :is-open="isCancel"
        :modal-data="modalData"
        @close="isCancel = false"
      >
        <div class="d-flex justify-center">
          <span>Вы действительно хотите отменить внесённые изменения?</span>
        </div>
        <div class="d-flex justify-center mt-4">
          <v-spacer />
          <v-btn
            class="mr-5 primary"
            flat
            @click="isCancel = true; goToUserGuid()"
          >
            Да
          </v-btn>
          <v-btn
            class="error"
            @click="isCancel = false"
          >
            Нет
          </v-btn>
        </div>
      </modal-dialog>

      <modal-dialog
        :is-open="loginExistsDialog"
        :modal-data="modalLoginExistsData"
        @close="closeLoginExistsDialog"
      >
        <div class="d-flex justify-center">
          <span> {{ `Запись с логином ${view.newId} уже существует, обновить существующую запись?` }} </span>
        </div>
      </modal-dialog>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Component, Prop, Ref } from 'vue-property-decorator';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineDateField from '@/components/InlineDateField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import UserController, { TUser, TUserSettings } from '@/controllers/UserController';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import { Mutation, State } from 'vuex-class';
import { TVuetifyOptionsList } from '@/types/globals';
import Loader from '@/components/Loader.vue';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';
import lodash from 'lodash';
import { generatePassword } from '@/utils/helpers';

enum StatusForm {
  Edit = 'edit',
  Created = 'created'
}

@Component({
  components: {
  InlineTextField,
  InlineDateField,
  InlineAutocompleteField,
  InlineCheckField,
  Loader,
  ModalDialog,
  InlineRadioButtonsField
  }
})
export default class EditUserRequest extends Global {
  @Prop({ type: Object, required: false, default: null }) readonly data!: TUser;
  @Ref('form') readonly form!: any;
  @State(state => state.userSettings) userSettings!: TUserSettings;
  @Mutation('setUserSettings') setUserSettings!: (payload: TUserSettings) => void;

  initialRequest: any;
  tabs = null;
  view: TUser = new TUser();
  userId = '';
  roles = null;
  isLoading = false;
  isCancel = false;
  notify = [false, false]
  modalData: TModalView = {
    title: 'Отмена',
    titleIcon: 'question',
    persistent: false,
  };

  isGeneratedPassword = false;

  statusForm: StatusForm = StatusForm.Created;

  departmentId = '';
  selectOrganizationDialog = false;

  loginExistsDialog = false;
  modalLoginExistsData: TModalView = {
    title: 'Логин существует',
    actions: [
      {
        label: 'Продолжить',
        onClick: () => {
          this.save(null, true);
          this.closeLoginExistsDialog();
        }
      },
      {
        label: 'Отмена',
        onClick: () => this.closeLoginExistsDialog()
      }
    ]
  };

  get isEdit(): boolean {
    return this.statusForm === StatusForm.Edit;
  }

  get yesNo() {
    return [
      { value: true, text: "Да"},
      { value: false, text: "Нет" }
    ];
  }

  get params() {
    return this.$route.params;
  }

  onOpenModalOrganization() {
    this.selectOrganizationDialog = true;
  }

  onSelectDepatment() {
    this.selectOrganizationDialog = false;
  }

  onCancelSelectOrganization() {
    this.selectOrganizationDialog = false;
  }

  async created() {
    try {
      this.isLoading = true;
      const { id, mode } = this.params;

      this.userId = id;

      this.roles = await UserController.getRoles();

      if (this.userId) {
        this.view = await UserController.getUserById(this.userId);
        this.view.newId = this.view.id;
        this.unpackNotification();
        this.statusForm = StatusForm.Edit;
      } else {
        this.statusForm = StatusForm.Created;
      }

      // if (mode === ERequestMode.COPY) this.view = { ...this.view, ...this.data };

      this.initialRequest = lodash.cloneDeep(this.view);
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    } finally {
      this.isLoading = false;
    }
  }

  unpackNotification() {
    if (this.notify) {
      const notifications = (this.view.notifications ?? 0);
      for (let i = 0; i < this.notify.length; i++) {
        this.notify[i] = this.toshift(i) ? (notifications & (2 << i)) > 0 : (notifications & i + 1) > 0;
      }
    } else {
      this.view.notifications = 0;
    }
  }

  toshift(i: number): boolean {
    return i / 2 > 1;
  }

  buildView() {
    if (this.view.fromAD) this.view.password = null;
    let notification = 0;
    for (let i = 0; i < this.notify.length; i++) {
      notification |= (this.notify[i] && this.toshift(i)) ? 2 << i : (this.notify[i] && !this.toshift(i)) ? i + 1 : 0;
    }
    this.view.notifications = notification;
  }

  async save(_event: any, skipLoginCheck = false) {
    if (!this.form.validate()) {
      this.showInfo("Пожалуйста заполните обязательные поля");
      return;
    }

    if (this.view.roles.length === 0) {
      this.showInfo("Пожалуйста выберите хотя-бы одну роль");
      return;
    }

    try {
      this.isLoading = true;
      this.buildView();
      if (!skipLoginCheck) {
        const loginExists = await UserController.checkUserLoginExists(this.view.newId);
        if (loginExists) {
          this.loginExistsDialog = true;
          return;
        }
      }
      if (!this.isEdit) this.view.id = this.view.newId;
      var user = await UserController.saveUser(this.view, !this.isEdit);
      console.log('user', user);
      this.showSuccess("Пользователь успешно сохранен");
      this.goToUserGuid();
    } catch (err) {
      this.showError("Ошибка сохранения пользователя");
    } finally {
      this.isLoading = false;
    }
  }

  cancel() {
    if (lodash.isEqual(this.initialRequest, this.view)) {
      this.goToUserGuid();
    } else {
      this.isCancel = true;
    }
  }

  private goToUserGuid() {
    this.$router.push({ name: 'UserGuide' });
  }

  closeLoginExistsDialog() {
    this.loginExistsDialog = false;
  }

  async beforeCreate() {
    const settings = await UserController.getSettings();
    this.setUserSettings(settings);
  }

  get rulesForPassword() {
    if (this.isEdit) {
      return this.view.fromAD ? [] : [this.rules.password];
    } else {
      return this.view.fromAD ? [] : [this.rules.required, this.rules.password];
    }
  }

  generatePasswordHandler() {
    this.view.password = generatePassword(this.userSettings);
    this.isGeneratedPassword = true;
  }

  passwordChangeHandler() {
    this.isGeneratedPassword = false;
  }
}
</script>
