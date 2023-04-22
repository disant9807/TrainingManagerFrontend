<template>
  <v-dialog
    v-model="dialog"
    scrollable
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-3">
      <v-card-title class="darkblue pl-3 py-0">
        <v-subheader class="white--text font-weight-light header-wrap">
          <div class="header">Выбор единиц измерений</div>
        </v-subheader>
      </v-card-title>
      <v-card-text style="height: 400px;">
        <v-container>
          <filters
            @change="filtersChange"
          />
          <select-units-of-measurements
            class="py-5"
            :loading="loading"
            :unitsOfMeasurement="unitsOfMeasurement"
            :selected.sync="localSelectedUnitsOfMeasurement"
            :multiple="multiple"
          />
        </v-container>
      </v-card-text>
      <v-card-actions class="ml-3">
        <slot name="controls">
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            :disabled="loading"
            @click="apply"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Готово
          </v-btn>
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            :disabled="loading"
            @click="cancel"
          >
            <v-icon class="mr-2">mdi-cancel</v-icon>
            Отмена
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Component, PropSync, Prop, Watch, Ref } from 'vue-property-decorator';
import UnitsOfMeasurementController, { TUnitsOfMeasurement, TUnitsOfMeasurementFilterViewModel } from '@/controllers/UnitsOfMeasurementController';
import SelectUnitsOfMeasurements from './SelectUnitsOfMeasurements.vue';
import Filters from '@/views/pages/Settings/UnitsOfMeasurement/Filters/Filters.vue';
import Sorter from '@/views/pages/Components/Sorter.vue';
import { State } from 'vuex-class';
import { TOrder } from '@/types/globals';


@Component({
  components: {
  SelectUnitsOfMeasurements,
  Filters,
  Sorter
  }
  })
export default class ModalFilterUnitsOfMeasurement extends Global {
  @State readonly filters!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedUnitsOfMeasurement!: TUnitsOfMeasurement[] | null;
  @Prop({
    type: Array,
    default: null
  }) readonly idsSelected!: string[] | null;

  @Prop({
    type: Boolean,
    default: true
  }) readonly multiple!: boolean;

  loading = false;
  order: TOrder = 'Desc';
  unitsOfMeasurement: TUnitsOfMeasurement[] = [];
  localSelectedUnitsOfMeasurement: TUnitsOfMeasurement[] | null = null;
  localIds: string[] | null = null;

  get filtersModel(): TUnitsOfMeasurementFilterViewModel {
    return this.filters.unitsofmeasurement;
  }

  @Watch('show')
  initComponent() {
    if (this.dialog) {
      if(this.localIds !== this.idsSelected)
      {
        this.unpackIdsSelected();
      } else {
        this.unpackDataSelected();
      }
      this.filtersChange();
    }
  }

  @Watch('selected')
  updateSelectedComponent() {
    this.unpackDataSelected();
  }

  @Watch('idsSelected')
  updateIdsSelectedComponent() {
    this.unpackIdsSelected();
  }

  unpackDataSelected() {
    this.localSelectedUnitsOfMeasurement = this.selectedUnitsOfMeasurement ?? [];
  }

  unpackIdsSelected() {
    this.loading = true;
    try {
      const unitsOfMeasurement: TUnitsOfMeasurement[] = [];
      this.idsSelected?.forEach(async i => {
        const response = await UnitsOfMeasurementController.GetUnitsOfMeasurementById(i);
        unitsOfMeasurement.push(response);
      });
      this.localIds = this.idsSelected;
      this.localSelectedUnitsOfMeasurement = unitsOfMeasurement;
      this.selectedUnitsOfMeasurement = this.localSelectedUnitsOfMeasurement;
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список измерений');
    } finally {
      this.loading = false;
    }
  }

  packData(): boolean {
    if (!this.localSelectedUnitsOfMeasurement || this.localSelectedUnitsOfMeasurement?.length === 0) {
      this.showInfo("Пожалуйста выберите хотя-бы одну единицу измерения");
      return false;
    }
    this.selectedUnitsOfMeasurement = this.localSelectedUnitsOfMeasurement;
    return true;
  }

  async filtersChange(): Promise<void> {
    this.loading = true;
    try {
      const response = await UnitsOfMeasurementController.GetUnitsOfMeasurement(this.filtersModel);
      if (response.success) {
        this.unitsOfMeasurement = response?.data ?? [];
      } else {
        throw new Error();
      }
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список единиц измерений');
    } finally {
      this.loading = false;
    }
  }

  apply() {
    if (this.packData()) {
      this.$emit('select');
    }
  }

  cancel() {
    this.$emit('cancel');
  }

  mounted() {
    if (this.idsSelected && this.idsSelected?.length > 0) {
      this.unpackIdsSelected();
    } else {
      this.unpackDataSelected();
    }
  }
}
</script>
