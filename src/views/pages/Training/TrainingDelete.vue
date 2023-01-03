<template>
  <modal-dialog
    :modal-data="trainingModalView"
    :is-open="state"
    @close="onCancel"
  >
    <Loader :value="isLoadRequest" />
    <div class="d-flex flex-wrap justify-center">
      <p class="flex-grow-1 text-start">
        {{ `Вы действительно хотите удалить тренировку от ${date} ?` }}
      </p>
    </div>
  </modal-dialog>
</template>
<script lang="ts">
import { Component, Prop, PropSync, Watch, } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import Global from '@/mixins/GlobalMixin';
import Helper from '@/mixins/Helper';
import TrainingController, { TTraining } from '@/controllers/TrainingController';
import Loader from '@/components/Loader.vue';
import ModalDialog, { TModalView } from '@/components/ModalDialog.vue';

@Component({
  components: {
  Loader,
  ModalDialog
  }})

export default class TrainingDelete extends mixins(Global, Helper) {
  @PropSync('trainingDeleteState', {
    type: Boolean,
    default: false
  }) state!: boolean | null;

  @Prop({
    type: Object,
    default: null
  }) readonly request!: TTraining | null;

  trainingModalView: TModalView = {
    title: `Внимание!`,
    actions: [
      {
        label: 'Удалить',
        onClick: () => this.onOk()
      },
      {
        label: 'Отмена',
        onClick: () => this.onCancel()
      }
    ]
  };

  isLoadRequest = false;

  get localTraining(): TTraining | null | undefined {
    return this.request;
  }

  get date():string {
    return this.localeDateFormat(this.localTraining?.trainingDate ?? '', false);
  }

  async deleteTraining(): Promise<boolean> {
    try {
      this.isLoadRequest = true;

      if (this.localTraining) await TrainingController.ArchiveTraining(this.localTraining?.id, true);
      else throw new Error('Ошибка, запрос не был выбран.');

      this.showSuccess(`Тренировка с id ${this.localTraining?.id} было успешно удалено!`);
      return true;
    } catch (error) {
      if (error instanceof Error) this.showError(error.message);
      return false;
    } finally {
      this.isLoadRequest = false;
    }
  }

  private goToTraining() {
    this.state = false;
  }

  async onOk() {
    if (await this.deleteTraining()) {
      this.$emit('refresh');
      this.goToTraining();
    }
  }

  onCancel() {
    this.goToTraining();
  }
}
</script>
