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
          {{ $localize(`tabs.basic`, 'user') }}
        </v-tab>
        <v-tab>
          {{ $localize(`tabs.access_notify`, 'user') }}
        </v-tab>
        <v-tab>
          {{ $localize(`tabs.system_info`, 'user') }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card text>
            <InlineTextField
              :label="($localize('id', 'user')+' *')"
              :value.sync="view.newId"
              :rules="[rules.required]"
            />
            <InlineTextField
              :label="($localize('firstName', 'user')+' *')"
              :value.sync="view.firstName"
              :rules="[rules.required]"
            />
            <InlineTextField
              :label="($localize('middleName', 'user')+' *')"
              :value.sync="view.middleName"
              :rules="[rules.required]"
            />
            <InlineTextField
              :label="($localize('surname', 'user')+' *')"
              :value.sync="view.surname"
              :rules="[rules.required]"
            />
            <InlineTextField
              :label="($localize('email', 'user')+' *')"
              :value.sync="view.email"
              :rules="[rules.email]"
            />
            <InlineTextField
              :label="($localize('phoneNumber', 'user')+' *')"
              :value.sync="view.phoneNumber"
              :rules="[rules.phone]"
            />
            <InlineDateField
              :label="$localize('certificateFrom', 'user')"
              :value.sync="view.certificateFrom"
            />
            <InlineDateField
              :label="$localize('certificateTo', 'user')"
              :value.sync="view.certificateTo"
            />
            <!--
            <InlineAutocompleteField
              :label="$localize('department', 'user')"
              :items="departmentsList"
              :value.sync="view.department"
              :rules="[rules.required]"
            />
            -->
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="view.departmentId"
                  :items="departmentsList"
                  prepend-icon="mdi-text"
                  :label="$localize('department', 'user')"
                  item-text="text"
                  item-value="value"
                  :readonly="true"
                  filled
                  @click="onOpenModalOrganization"
                />
              </v-col>
            </v-row>
            <inline-radio-buttons-field
              :label="`${$localize('archive', 'user')}`"
              :objects="yesNo"
              :selected.sync="view.archive"
            />
            <inline-radio-buttons-field
              :label="`${$localize('blocked', 'user')}`"
              :objects="yesNo"
              :selected.sync="view.blocked"
            />
            <inline-radio-buttons-field
              :label="`${$localize('fromAD', 'user')}`"
              :objects="yesNo"
              :selected.sync="view.fromAD"
            />

            <v-row>
              <template v-if="isEdit || view.fromAD">
                <v-col>
                  <InlineTextField
                    :label="($localize('password', 'user'))"
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
                    :label="($localize('password', 'user')+' *')"
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
            <RolesTable
              :user-roles.sync="view.roles"
              :loading="false"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <InlineCheckField
              :label="$localize('notify.request', 'user')"
              :value.sync="notify[1]"
            />
            <InlineCheckField
              :label="$localize('notify.certificate', 'user')"
              :value.sync="notify[0]"
            />
            <inline-radio-buttons-field
              :label="`${$localize('notify.ownRequests', 'user')}`"
              :objects="yesNo"
              :selected.sync="view.ownRequests"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card text>
            <InlineDateField
              :label="$localize('system_info.created_datetime', 'user')"
              :value.sync="view.createdDatetime"
              :readonly="true"
            />
            <InlineDateField
              :label="$localize('system_info.last_update_datetime', 'user')"
              :value.sync="view.lastUpdateDatetime"
              :readonly="true"
            />
            <InlineDateField
              :label="$localize('system_info.last_password_change_datetime', 'user')"
              :value.sync="view.lastPasswordChangeDatetime"
              :readonly="true"
            />
            <InlineDateField
              :label="$localize('system_info.last_login_datetime', 'user')"
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
      <ModalSelectOrganization
        :department-id="departmentId"
        :show.sync="selectOrganizationDialog"
        :selected.sync="nodeDep"
        @select="onSelectDepatment"
        @cancel="onCancelSelectOrganization"
      />
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
import RolesTable from '@/components/Forms/User/RolesTable.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import { Mutation, State } from 'vuex-class';
import { TVuetifyOptionsList } from '@/types/globals';
import Loader from '@/components/Loader.vue';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';
import lodash from 'lodash';
import { TDepartment, TTreeNodeOrganization, TTreeNodeType } from '@/api/models/Organizations';
import OrganizationsController from '@/controllers/OrganizationsController';
import { ERequestMode } from '@/api/models/enums';
import ModalSelectOrganization from './Modals/ModalSelectDepartment.vue';
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
    RolesTable,
    Loader,
    ModalDialog,
    InlineRadioButtonsField,
    ModalSelectOrganization
  }
})
export default class EditUserRequest extends Global {
  @Prop({ type: Object, required: false, default: null }) readonly data!: TUser;
  @Ref('form') readonly form!: any;
  @State(state => state.departmentsList) departments!: TDepartment[];
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
  nodeDep: TTreeNodeOrganization | any | null = {};

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
      { value: true, text: this.$localize('usersSettings.yes', 'settings') },
      { value: false, text: this.$localize('usersSettings.no', 'settings') }
    ];
  }

  get departmentsList(): Array<TVuetifyOptionsList> {
    return this.nodeDep
      ? [
        {
          value: this.nodeDep.id,
          text: this.nodeDep.title
        }
      ]
      : [];
  }

  get params() {
    return this.$route.params;
  }

  onOpenModalOrganization() {
    this.selectOrganizationDialog = true;
  }

  onSelectDepatment() {
    this.view.departmentId = this.nodeDep?.id;
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

      if (this.view?.departmentId) { this.nodeDep = await OrganizationsController.getOrganizationTreeViewById(this.view.departmentId, TTreeNodeType.Department); }

      if (mode === ERequestMode.COPY) this.view = { ...this.view, ...this.data };

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
      this.showInfo(this.$localize('userEditErrorMessage', 'messages'));
      return;
    }

    if (this.view.roles.length === 0) {
      this.showInfo(this.$localize('userEmptyRolesMessage', 'messages'));
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
      this.showSuccess(this.$localize('userEditSuccessMessage', 'messages'));
      this.goToUserGuid();
    } catch (err) {
      this.showError(this.$localize('userEditErrorSaveMessage', 'messages'));
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
