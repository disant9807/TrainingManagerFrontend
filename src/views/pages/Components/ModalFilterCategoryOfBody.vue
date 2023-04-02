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
          <select-category-of-body
            class="py-5"
            :loading="loading"
            :CategoryOfBodies="CategoryOfBodies"
            :selected.sync="localSelectedCategoryOfBodies"
            multiple
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
import CategoryOfBodyController, { TCategoryOfBody, TCategoryOfBodyFilterViewModel } from '@/controllers/CategoryOfBodyController';
import SelectCategoryOfBody from './SelectCategoryOfBody.vue';
import Filters from '@/views/pages/Settings/CategoryOfBody/Filters/Filters.vue';
import Sorter from '@/views/pages/Components/Sorter.vue';
import { State } from 'vuex-class';
import { TOrder } from '@/types/globals';


@Component({
  components: {
  SelectCategoryOfBody,
  Filters,
  Sorter
  }
  })
export default class ModalFilterCategoryOfBody extends Global {
  @State readonly filters!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedCategoryOfBodies!: TCategoryOfBody[] | null;
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
  CategoryOfBodies: TCategoryOfBody[] = [];
  localSelectedCategoryOfBodies: TCategoryOfBody[] | null = null;
  localIds: string[] | null = null;

  get filtersModel(): TCategoryOfBodyFilterViewModel {
    return this.filters.categoryofbody;
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
    this.localSelectedCategoryOfBodies = this.selectedCategoryOfBodies ?? [];
  }

  unpackIdsSelected() {
    this.loading = true;
    try {
      const categoryOfBodies: TCategoryOfBody[] = [];
      this.idsSelected?.forEach(async i => {
        const response = await CategoryOfBodyController.GetCategoryOfBodyById(i);
        categoryOfBodies.push(response);
      });
      this.localIds = this.idsSelected;
      this.localSelectedCategoryOfBodies = categoryOfBodies;
      this.selectedCategoryOfBodies = this.localSelectedCategoryOfBodies;
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список показателей');
    } finally {
      this.loading = false;
    }
  }

  packData(): boolean {
    if (!this.localSelectedCategoryOfBodies || this.localSelectedCategoryOfBodies?.length === 0) {
      this.showInfo("Пожалуйста выберите хотя-бы один показатель");
      return false;
    }
    this.selectedCategoryOfBodies = this.localSelectedCategoryOfBodies;
    return true;
  }

  async filtersChange(): Promise<void> {
    this.loading = true;
    try {
      const response = await CategoryOfBodyController.GetCategoryOfBody(this.filtersModel);
      if (response.success) {
        this.CategoryOfBodies = response?.data ?? [];
      } else {
        throw new Error();
      }
    } catch (error) {
      this.showError('Ошибка. Не удалось загрузить список физологических показателей');
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
