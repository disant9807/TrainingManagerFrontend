<template>
  <div>
    <modal-dialog
      :is-open="removeDialog"
      :modal-data="modalDeleteData"
      @close="closeDeleteDialog"
    >
      <div class="d-flex justify-center">
        <span> Вы действительно желаете удалить пользователя ?</span>
      </div>
    </modal-dialog>

    <modal-dialog
      :is-open="restoreDialog"
      :modal-data="modalRestoreData"
      @close="closeRestoreDialog"
    >
      <div class="d-flex justify-center">
        <span> Вы действительно желаете восстановить пользователя ? </span>
      </div>
    </modal-dialog>

    <modal-dialog
      :is-open="blockDialog"
      :modal-data="modalBlockData"
      @close="closeBlockDialog"
    >
      <div class="d-flex justify-center">
        <span> "Блокировка пользователя" </span>
      </div>
    </modal-dialog>

    <modal-dialog
      :is-open="unblockDialog"
      :modal-data="modalUnblockData"
      @close="closeUnblockDialog"
    >
      <div class="d-flex justify-center">
        <span> Разблокировка пользователя </span>
      </div>
    </modal-dialog>

    <v-card>
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-account-group
        </v-icon>
        <v-subheader class="white--text font-weight-light header-wrap">
          <div class="header">Список пользователей</div>
        </v-subheader>
      </v-card-title>
      <v-row>
        <v-col class="col-1">
          <v-btn
            color="primary"
            class="ml-3 mt-3"
            @click="$router.push({ name: 'EditUserForm' })"
          >
            Добавить / Редактировать пользователя
          </v-btn>
        </v-col>
        <v-col class="col-1">
          <v-btn
            color="primary"
            class="mt-3 mx-3"
            @click="$router.push({ name: 'EditUsersSettings' })"
          >
            Настройка авторизации
          </v-btn>
        </v-col>
        <v-col class="col-1">
          <v-btn
            color="primary"
            class="mt-3 ml-6"
            @click="$router.back()"
          >
            Назад
          </v-btn>
        </v-col>
        <v-col class="col-9">
          <filters @change="loadData" />
        </v-col>
      </v-row>
      <users-table
        :users="users"
        :loading="loading"
        @edit="(user) => $router.push({ name: 'EditUserForm', params: { id: user.id } })"
        @delete="(user) => { editedItem = user; removeDialog = true; }"
        @restore="user => { editedItem = user; restoreDialog = true; }"
        @block="user => { editedItem = user; blockDialog = true; }"
        @unblock="user => { editedItem = user; unblockDialog = true; }"
      />
    </v-card>
  </div>
</template>
<script lang="ts">
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';
import { Component } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import { mixins } from 'vue-class-component';
import UsersTable from './UsersTable.vue';
import UserController, { TUserGuideFilterModel, filterName, TUser } from '@/controllers/UserController';
import Filters from './Filters/Filters.vue';
import { State } from 'vuex-class';

@Component({
  components: {
  ModalDialog,
  UsersTable,
  Filters
}
})

export default class UserGuide extends mixins(Global) {
  @State readonly filters!: any;

  users: TUser[] = [];
  loading = false;

  removeDialog = false;
  editDialog = false;
  restoreDialog = false;
  blockDialog = false;
  unblockDialog = false;

  editedItem: TUser = {} as TUser;

  get filterModel(): TUserGuideFilterModel {
    return this.filters[filterName];
  }

  get modalDeleteData(): TModalView {
    return {
      title: "Удаление пользователя",
      titleIcon: '',
      maxWidth: 420,
      actions: [
        {
          label: 'Продолжить',
          onClick: () => {
            this.delete(this.editedItem);
            this.closeDeleteDialog();
          }
        },
        {
          label: 'Отмена',
          onClick: () => this.closeDeleteDialog()
        }
      ]
    };
  }

  get modalRestoreData() : TModalView {
    return {
      title: "Восстановление пользователя",
      actions: [
        {
          label: "Восстановить",
          onClick: () => {
            this.restore(this.editedItem);
            this.closeRestoreDialog();
          }
        },
        {
          label: "Отмена",
          onClick: () => this.closeRestoreDialog()
        }
      ]
    };
  }

  get modalBlockData() : TModalView {
    return {
      title: "Заблокировать пользователя",
      actions: [
        {
          label: "Заблокировать",
          onClick: () => {
            this.blockToggle(this.editedItem, true);
            this.closeBlockDialog();
          }
        },
        {
          label: "Отмена",
          onClick: () => this.closeBlockDialog()
        }
      ]
    };
  }

  get modalUnblockData() : TModalView {
    return {
      title: "Разблокировать пользователя",
      actions: [
        {
          label: "Разблокировать",
          onClick: () => {
            this.blockToggle(this.editedItem, false);
            this.closeUnblockDialog();
          }
        },
        {
          label: "Отмена",
          onClick: () => this.closeUnblockDialog()
        }
      ]
    };
  }

  async loadData() {
    try {
      this.loading = true;
      const response = await UserController.getUsers(this.filterModel);
      this.users = response.sort((a, b) => a.surname.toLowerCase() > b.surname.toLowerCase() ? 1 : -1);
    } catch (error: any) {
      this.showError(error);
    } finally {
      this.loading = false;
    }
  }

  edit(user: TUser) {
    this.editedItem = { ...user };
    this.editDialog = true;
  }

  async delete(item: TUser) {
    try {
      await UserController.removeUser(item.id);
      this.showSuccess("Пользователь успешно удален");
      await this.loadData();
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    }
  }

  async restore(item: TUser) {
    try {
      await UserController.removeUser(item.id, false);
      this.showSuccess("Пользователь успешно восстановлен");
      await this.loadData();
    } catch (error: any) {
      this.showError(error);
    }
  }

  async blockToggle(item: TUser, block: boolean) {
    try {
      await UserController.userBlockToggle(item.id, block);
      this.showSuccess("Пользователь заблокирован");
      await this.loadData();
    } catch (error: any) {
      this.showError(error);
    }
  }

  closeDeleteDialog() {
    this.editedItem = {} as TUser;
    this.removeDialog = false;
  }

  closeRestoreDialog() {
    this.editedItem = {} as TUser;
    this.restoreDialog = false;
  }

  closeBlockDialog() {
    this.editedItem = {} as TUser;
    this.blockDialog = false;
  }

  closeUnblockDialog() {
    this.editedItem = {} as TUser;
    this.unblockDialog = false;
  }

  async mounted() {
    try {
      await this.loadData();
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    }
  }
}
</script>
