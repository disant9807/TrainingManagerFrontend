<template>
  <div>
    <modal-dialog
      :is-open="removeDialog"
      :modal-data="modalDeleteData"
      @close="closeDeleteDialog"
    >
      <div class="d-flex justify-center">
        <span> Вы действительно желаете удалить показатель ? </span>
      </div>
    </modal-dialog>

    <modal-dialog
      :is-open="editDialog"
      :modal-data="modalEditData"
      @close="closeEditDialog"
    >
      <v-form
        ref="formEdit"
        lazy-validation
      >
        <v-row>
          <v-col>
            <InlineTextField
              label="Код показателя"
              :value.sync="viewEdit.code"
              :rules="[rules.required]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <InlineTextField
              label="Значение показателя"
              :value.sync="viewEdit.value"
              :rules="[rules.required]"
            />
          </v-col>
        </v-row>
      </v-form>
    </modal-dialog>

    <modal-dialog
      :is-open="addDialog"
      :modal-data="modalAddData"
      @close="closeAddDialog"
    >
      <div class="container">
        <v-form
          ref="formAdd"
          lazy-validation
        >
          <v-row>
            <v-col>
              <InlineTextField
                label="Код показателя"
                :value.sync="viewAdd.code"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <InlineTextField
                label="Значение показателя"
                :value.sync="viewAdd.value"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </v-form>
      </div>
    </modal-dialog>

    <v-card>
      <v-card-title class="darkblue pl-5 py-0">
        <v-icon
          dark
          size="32"
          class="mr-4"
        >
          mdi-warehouse
        </v-icon>
        <v-subheader class="white--text font-weight-light header-wrap">
          <div class="header">Справочник показателей</div>
        </v-subheader>
      </v-card-title>
      <v-row>
        <v-col class="col-1 mr-1">
          <v-btn
            color="primary"
            class="ml-3 mt-3"
            @click="initAdd()"
          >
            Добавить
          </v-btn>
        </v-col>
        <v-col class="col-1 mr-1">
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
      <units-of-measurement-table
        :units-of-measurement="unitsOfMeasurements"
        :loading="loading"
        @edit="(unitsOfMeasurement) => initEdit(unitsOfMeasurement)"
        @delete="(unitsOfMeasurement) => { deletedItem = unitsOfMeasurement; removeDialog = true; }"
      />
    </v-card>
  </div>
</template>
<script lang="ts">
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';
import { Component, Ref } from 'vue-property-decorator';
import Global from '@/mixins/GlobalMixin';
import { mixins } from 'vue-class-component';
import UnitsOfMeasurementTable from './UnitsOfMeasurementTable.vue';
import UnitsOfMeasurementController, { TUnitsOfMeasurement, TUnitsOfMeasurementFilterModel } from '@/controllers/UnitsOfMeasurementController';
import Filters from './Filters/Filters.vue';
import { State } from 'vuex-class';
import InlineTextField from '@/components/InlineTextField.vue';

@Component({
  components: {
  ModalDialog,
  UnitsOfMeasurementTable,
  Filters,
  InlineTextField
  }
})

export default class UnitsOfMeasurementGuide extends mixins(Global) {
  @Ref('formEdit') readonly formEdit!: any;
  @Ref('formAdd') readonly formAdd!: any;
  @State readonly filters!: any;

  unitsOfMeasurements: TUnitsOfMeasurement[] = [];
  loading = false;

  removeDialog = false;
  editDialog = false;
  addDialog = false;

  deletedItem: TUnitsOfMeasurement = {} as TUnitsOfMeasurement;

  viewEdit: TUnitsOfMeasurement = new TUnitsOfMeasurement();
  editCode: string | null = null;

  viewAdd: TUnitsOfMeasurement = new TUnitsOfMeasurement();

  get filterModel(): TUnitsOfMeasurementFilterModel {
    return this.filters.unitsofmeasurement;
  }

  get modalDeleteData(): TModalView {
    return {
      title: 'Вы действительно желаете удалить показатель ?',
      titleIcon: '',
      maxWidth: 420,
      actions: [
        {
          label: 'Продолжить',
          onClick: () => {
            this.delete(this.deletedItem);
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

  get modalEditData(): TModalView {
    return {
      title: 'Редактирование показателя',
      titleIcon: '',
      maxWidth: 420,
      actions: [
        {
          label: 'Сохранить',
          onClick: () => {
            this.update();
            this.closeEditDialog();
          }
        },
        {
          label: 'Отмена',
          onClick: () => this.closeEditDialog()
        }
      ]
    };
  }

  get modalAddData(): TModalView {
    return {
      title: 'Добавление показателя',
      titleIcon: '',
      maxWidth: 420,
      actions: [
        {
          label: 'Сохранить',
          onClick: () => {
            this.add();
            this.closeAddDialog();
          }
        },
        {
          label: 'Отмена',
          onClick: () => this.closeAddDialog()
        }
      ]
    };
  }

  async loadData() {
    try {
      this.loading = true;
      const response = await UnitsOfMeasurementController.GetUnitsOfMeasurement(this.filterModel);
      this.unitsOfMeasurements = response?.data.sort((a, b) => a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
    } catch (error: any) {
      this.showError(error);
    } finally {
      this.loading = false;
    }
  }

  initEdit(unit: TUnitsOfMeasurement) {
    this.editCode = unit.code;
    this.viewEdit = { ...unit };
    this.editDialog = true;
  }

  initAdd() {
    this.viewAdd = {} as TUnitsOfMeasurement;
    this.addDialog = true;
  }

  async delete(item: TUnitsOfMeasurement) {
    try {
      await UnitsOfMeasurementController.ArchiveUnitsOfMeasurement(item.code, true);
      this.showSuccess('Показатель успешно удален');
      await this.loadData();
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    }
  }

  async update() {
    if (!this.formEdit.validate()) {
      this.showInfo('Необходимо заполнить обязательные поля!');
      return;
    }

    try {
      await UnitsOfMeasurementController.UpdateUnitsOfMeasurement(this.editCode as string, this.viewEdit);
      this.showSuccess('Показатель успешно обновлен');
      await this.loadData();
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    }
  }

  async add() {
    if (!this.formAdd.validate()) {
      this.showInfo('Необходимо заполнить обязательные поля!');
      return;
    }

    try {
      await UnitsOfMeasurementController.CreateUnitsOfMeasurement(this.viewAdd);
      this.showSuccess('Показатель успешно создан');
      await this.loadData();
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
    }
  }

  closeDeleteDialog() {
    this.deletedItem = {} as TUnitsOfMeasurement;
    this.removeDialog = false;
  }

  closeEditDialog() {
    this.editCode = null;
    this.viewEdit = {} as TUnitsOfMeasurement;
    this.editDialog = false;
  }

  closeAddDialog() {
    this.viewAdd = {} as TUnitsOfMeasurement;
    this.addDialog = false;
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
