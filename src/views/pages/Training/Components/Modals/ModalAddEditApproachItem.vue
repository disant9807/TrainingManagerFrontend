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
          <div v-if="isEdit" class="header">Редактирование тренировочного подхода</div>
          <div v-else class="header">Создание тренировочного подхода</div>
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
                <InlineSliderField
                  label="Время подхода"
                  min="0"
                  max="10000"
                  step="1"
                  hint="в секундах"
                  :value.sync="view.time"
                  thumb-label="always"
                />
                <InlineSliderField
                  label="Вес подхода*"
                  min="0"
                  max="1000"
                  step="1"
                  hint="в кг"
                  :value.sync="view.weight"
                  :rules="[rules.required]"
                  thumb-label="always"
                />
                <InlineSliderField
                  label="Сложность по ощущениям"
                  min="0"
                  max="10"
                  step="1"
                  hint="от 1 до 10"
                  :value.sync="view.hard"
                  thumb-label="always"
                />
                <InlineSliderField
                  label="Техника"
                  min="1"
                  max="3"
                  step="1"
                  hint="Выполняемого упражнения"
                  :value.sync="view.technicality"
                  thumb-label="always"
                />
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
  </v-dialog>
</template>
<script lang="ts">
import Global from '@/mixins/GlobalMixin';
import { Component, PropSync, Prop, Watch, Ref } from 'vue-property-decorator';
import { TApproachItem } from '@/controllers/TrainingController';
import { State } from 'vuex-class';
import InlineTextField from '@/components/InlineTextField.vue';
import InlineRadioButtonsField from '@/components/InlineRadioButtonsField.vue';
import InlineSliderField from '@/components/InlineSliderField.vue';

@Component({
  components: {
  InlineTextField,
  InlineRadioButtonsField,
  InlineSliderField
  }
  })
export default class ModalAddEditApproachItem extends Global {
  @State readonly filters!: any;
  @Ref('form') readonly form!: any;
  @PropSync('show') readonly dialog!: boolean;
  @PropSync('selected', { required: false, default: null }) selectedApproach!: TApproachItem | null;
  @Prop({
    type: Boolean,
    default: false
  }) readonly isEdit!: boolean | null;

  @Prop({
    type: Number,
    default: 0
  }) readonly numberOfApproach!: number;

  view: TApproachItem = new TApproachItem();

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

  unpackData() {
    this.view = this.selectedApproach ?? new TApproachItem();
  }

  packData(): boolean {
    if (!this.form.validate()) {
      this.showInfo("Пожалуйста заполните обязательные поля.");
      return false;
    }
    this.$set(this.view, 'numberOfApproach', this.numberOfApproach);
    this.selectedApproach = this.view;
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

  async mounted() {
    this.unpackData();
  }
}
</script>
