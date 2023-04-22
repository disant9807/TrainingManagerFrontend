<template>
  <v-col>
    <template v-if="!isEdit">
      {{ labelValue }}
      <v-btn
        color="darkblue"
        class="ml-2"
        icon
        @click="openEdit"
      >
        <v-icon dark>
          mdi-pencil
        </v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-row>
        <v-col class="py-0 px-0">
          <v-text-field
            v-model="localNumber"
            v-mask="'######################'"
            class="mt-0 py-0"
            type="text"
          />
        </v-col>
        <v-col class="ml-2 py-0 px-0">
          <v-btn
            icon
            @click="onClickClose"
          >
            <v-icon dark>
              mdi-close
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Validation from '@/mixins/Validation';

@Component
export default class NumberEditor extends mixins(Vue, Validation) {
  @Prop({ type: String, default: false }) label!: string;
  @Prop({ type: String, default: false }) defaultNumber!: string | null;
  @PropSync('selectedNumber') numberValue!: string | null;
  isEdit = false;
  localNumber = '';

  mounted(): void {
    this.updateStart(this.numberValue ?? '');
  }

  @Watch('numberValue')
  updateStart(value:string) {
    this.localNumber = value || '';
  }

  @Watch('localNumber')
  updateOutput(value:string) {
    this.numberValue = value;
  }

  get labelValue(): string {
    return this.label;
  }

  onClickClose() {
    this.closeEdit();
    this.clear();
  }

  openEdit() {
    this.isEdit = true;
  }

  closeEdit() {
    this.isEdit = false;
  }

  clear() {
    this.updateStart(this.defaultNumber || '');
  }
}
</script>
