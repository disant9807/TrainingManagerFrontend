<template>
  <v-dialog
    v-model="dialog"
    scrollable
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="pb-3">
      <v-card-title class="darkblue pl-3 py-0">
        <v-subheader class="white--text font-weight-light header-wrap">
          <div v-if="isEdit" class="header">Редактирование цели</div>
          <div v-else class="header">Создание цели</div>
        </v-subheader>
      </v-card-title>
      <v-card-text style="height: 300px;">
        <v-container>
          <v-row>
            <v-col>
              <v-form
                ref="form"
                lazy-validation
              >
                <div class="d-flex">
                  <v-autocomplete
                    v-model="view.bodyCode"
                    :items="categoryOfBodiesList"
                    item-text="text"
                    item-value="value"
                    :readonly="true"
                    :multiply="false"
                    :loading="isLoading"
                    title="Измеряемая часть*"
                    filled
                    @click="onOpenModalFilterCategoryOfBody"
                  />
                  <v-btn
                    color="darkblue"
                    class="ml-3 mt-2"
                    icon
                    @click="onOpenModalFilterCategoryOfBody"
                  >
                    <v-icon dark>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
                <InlineTextField
                  label="Предполагаемое значение*"
                  :value.sync="view.value"
                  :rules="[rules.required]"
                />
                <div class="d-flex">
                  <v-autocomplete
                    v-model="view.codeUnitsOfMeasurement"
                    :items="unitsOfMeasurementList"
                    item-text="text"
                    item-value="value"
                    :readonly="true"
                    :multiply="false"
                    :loading="isLoading"
                    title="Единица измерения*"
                    filled
                    @click="onOpenModalFilterUnitsOfMeasurement"
                  />
                  <v-btn
                    color="darkblue"
                    class="ml-3 mt-2"
                    icon
                    @click="onOpenModalFilterUnitsOfMeasurement"
                  >
                    <v-icon dark>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="ml-3">
        <slot name="controls">
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            @click="apply"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Применить
          </v-btn>
          <v-btn
            class="mr-2"
            color="darkblue"
            text
            @click="cancel"
          >
            <v-icon class="mr-2">mdi-cancel</v-icon>
            Отмена
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
    <ModalFilterCategoryOfBody
      :show="selectCategoryOfBodyState"
      :selected.sync="selectCategoryOfBodies"
      :ids-selected="codeCategoryOfBodies"
      :multiple="false"
      @select="onClickSelectCategoryOfBody"
      @cancel="onClickCancelCategoryOfBody"
    />
    <ModalFilterUnitsOfMeasurement
      :show="selectUnitsOfMeasurementState"
      :selected.sync="selectUnitsOfMeasurement"
      :ids-selected="codeUnitsOfMeasurement"
      :multiple="false"
      @select="onClickSelectUnitsOfMeasurement"
      @cancel="onClickCancelUnitsOfMeasurement"
    />
  </v-dialog>
</template>
<script lang="ts">
import { Component, PropSync, Prop, Watch, Ref } from 'vue-property-decorator';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineCheckField from '@/components/InlineCheckField.vue';
import InlineAutocompleteField from '@/components/InlineAutocompleteField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';
import Global from '@/mixins/GlobalMixin';
import { TSubGoal } from '@/controllers/GoalController';
import ModalFilterCategoryOfBody from '@/views/pages/Components/ModalFilterCategoryOfBody.vue';
import { TCategoryOfBody } from '@/controllers/CategoryOfBodyController';
import ModalFilterUnitsOfMeasurement from '@/views/pages/Components/ModalFilterUnitsOfMeasurement.vue';
import { TUnitsOfMeasurement } from '@/controllers/UnitsOfMeasurementController';
import { TVuetifyOptionsList } from '@/types/globals';

@Component({
  components: {
  InlineTextField,
  InlineAutocompleteField,
  InlineCheckField,
  InlineRadioButtonsField,
  InlineSliderField,
  ModalFilterCategoryOfBody,
  ModalFilterUnitsOfMeasurement
  }
  })
export default class ModalSubGoalAddEdit extends Global {
  @Ref('form') readonly form!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) SubGoal!: TSubGoal | null;
  @Prop({
    type: Boolean,
    default: false
  }) readonly isEdit!: boolean | null;

  isLoading = false;

  view: TSubGoal = new TSubGoal();

  selectCategoryOfBodyState = false;
  selectCategoryOfBodies: TCategoryOfBody[] | null = [];

  get categoryOfBodiesList(): TVuetifyOptionsList[] {
    return this.selectCategoryOfBodies?.map(e => {
      return { value: e.code, text: e.shortName ?? e.name };
    }) ?? [];
  }

  get codeCategoryOfBodies(): string[] {
    return [this.view.bodyCode];
  }

  selectUnitsOfMeasurementState = false;
  selectUnitsOfMeasurement: TUnitsOfMeasurement[] | null = [];

  get unitsOfMeasurementList(): TVuetifyOptionsList[] {
    return this.selectUnitsOfMeasurement?.map(e => {
      return { value: e.code, text: e.value };
    }) ?? [];
  }

  get codeUnitsOfMeasurement(): string[] {
    return [this.view.codeUnitsOfMeasurement];
  }

  @Watch('show')
  initComponent() {
    if (this.dialog) {
      this.unpackData();
    }
  }

  @Watch('selected')
  updateComponent() {
    this.unpackData();
  }

  async unpackData() {
    this.view = this.SubGoal ?? new TSubGoal();
  }

  packData(): boolean {
    if (!this.form.validate()) {
      this.showInfo("Пожалуйста заполните обязательные поля.");
      return false;
    }
    this.SubGoal = this.view;
    return true;
  }

  apply() {
    if (this.packData()) {
      this.$emit('select');
    }
  }

  cancel() {
    this.$emit('cancel');
  }

  onClickSelectCategoryOfBody() {
    this.view.bodyCode = this.selectCategoryOfBodies
      ? this.selectCategoryOfBodies[0].code
      : '';
    this.selectCategoryOfBodyState = false;
  }

  onClickCancelCategoryOfBody() {
    this.selectCategoryOfBodyState = false;
  }

  onOpenModalFilterCategoryOfBody() {
    this.selectCategoryOfBodyState = true;
  }

  onClickSelectUnitsOfMeasurement() {
    this.view.codeUnitsOfMeasurement = this.selectUnitsOfMeasurement
      ? this.selectUnitsOfMeasurement[0].code
      : '';
    this.selectCategoryOfBodyState = false;
  }

  onClickCancelUnitsOfMeasurement() {
    this.selectUnitsOfMeasurementState = false;
  }

  onOpenModalFilterUnitsOfMeasurement() {
    this.selectUnitsOfMeasurementState = true;
  }

  async mounted() {
    this.unpackData();
  }
}

</script>
